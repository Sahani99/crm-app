import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { FilterLeadsDto } from './dto/filter-leads.dto';
import { LeadStatus, Role } from '@prisma/client';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateLeadDto, userId: string) {
    return this.prisma.lead.create({
      data: { ...dto, createdById: userId },
      include: { assignedTo: { select: { id: true, name: true, email: true } } },
    });
  }

  async findAll(filters: FilterLeadsDto, user: { id: string; role: Role }) {
    const { status, source, priority, assignedToId, search, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null,
      ...(status && { status }),
      ...(source && { source }),
      ...(priority && { priority }),
      ...(assignedToId && { assignedToId }),
      // SALES_REP can only see their own leads
      ...(user.role === Role.SALES_REP && { assignedToId: user.id }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { company: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.lead.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          assignedTo: { select: { id: true, name: true, email: true } },
          createdBy: { select: { id: true, name: true } },
          _count: { select: { notes: true, attachments: true } },
        },
      }),
      this.prisma.lead.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, user: { id: string; role: Role }) {
    const lead = await this.prisma.lead.findUnique({
      where: { id, deletedAt: null },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        createdBy: { select: { id: true, name: true } },
        notes: {
          include: { createdBy: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
        },
        attachments: {
          include: { uploadedBy: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!lead) throw new NotFoundException('Lead not found');

    if (user.role === Role.SALES_REP && lead.assignedToId !== user.id) {
      throw new ForbiddenException('Access denied');
    }

    return lead;
  }

  async update(id: string, dto: UpdateLeadDto, user: { id: string; role: Role }) {
    await this.findOne(id, user);
    return this.prisma.lead.update({
      where: { id },
      data: dto,
      include: { assignedTo: { select: { id: true, name: true, email: true } } },
    });
  }

  async updateStatus(id: string, status: LeadStatus, user: { id: string; role: Role }) {
    await this.findOne(id, user);
    return this.prisma.lead.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: string, user: { id: string; role: Role }) {
    await this.findOne(id, user);
    return this.prisma.lead.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}