import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async create(leadId: string, content: string, userId: string) {
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId, deletedAt: null } });
    if (!lead) throw new NotFoundException('Lead not found');

    return this.prisma.note.create({
      data: { content, leadId, createdById: userId },
      include: { createdBy: { select: { id: true, name: true } } },
    });
  }

  async findAll(leadId: string) {
    return this.prisma.note.findMany({
      where: { leadId },
      include: { createdBy: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: string) {
    const note = await this.prisma.note.findUnique({ where: { id } });
    if (!note) throw new NotFoundException('Note not found');
    return this.prisma.note.delete({ where: { id } });
  }
}