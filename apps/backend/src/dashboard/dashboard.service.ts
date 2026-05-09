import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats(user: { id: string; role: Role }) {
    const baseWhere = {
      deletedAt: null,
      ...(user.role === Role.SALES_REP && { assignedToId: user.id }),
    };

    const [
      totalLeads,
      newLeads,
      qualifiedLeads,
      wonLeads,
      lostLeads,
      dealValueAgg,
      wonValueAgg,
      byStatus,
      bySource,
    ] = await Promise.all([
      this.prisma.lead.count({ where: baseWhere }),
      this.prisma.lead.count({ where: { ...baseWhere, status: 'NEW' } }),
      this.prisma.lead.count({ where: { ...baseWhere, status: 'QUALIFIED' } }),
      this.prisma.lead.count({ where: { ...baseWhere, status: 'WON' } }),
      this.prisma.lead.count({ where: { ...baseWhere, status: 'LOST' } }),
      this.prisma.lead.aggregate({ where: baseWhere, _sum: { dealValue: true } }),
      this.prisma.lead.aggregate({ where: { ...baseWhere, status: 'WON' }, _sum: { dealValue: true } }),
      this.prisma.lead.groupBy({ by: ['status'], where: baseWhere, _count: true }),
      this.prisma.lead.groupBy({ by: ['source'], where: baseWhere, _count: true }),
    ]);

    return {
      totalLeads,
      newLeads,
      qualifiedLeads,
      wonLeads,
      lostLeads,
      totalDealValue: dealValueAgg._sum.dealValue ?? 0,
      wonDealValue: wonValueAgg._sum.dealValue ?? 0,
      byStatus,
      bySource,
    };
  }
}