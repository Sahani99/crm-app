'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { DashboardStats } from '@/types';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { PipelineChart } from '@/components/dashboard/PipelineChart';

export default function DashboardPage() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      try {
        const { data } = await api.get<DashboardStats>('/dashboard/stats');
        return data;
      } catch (err) {
        console.error('Dashboard stats error:', err);
        throw err;
      }
    },
  });

  if (isLoading) {
    return <div className="text-center py-10 text-gray-500">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error loading dashboard stats</p>
        <p className="text-sm text-gray-500 mt-2">{(error as Error).message}</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No dashboard data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Leads" value={stats.totalLeads} />
        <MetricCard label="New Leads" value={stats.newLeads} />
        <MetricCard label="Qualified" value={stats.qualifiedLeads} />
        <MetricCard label="Won" value={stats.wonLeads} color="green" />
        <MetricCard label="Lost" value={stats.lostLeads} color="red" />
        <MetricCard
          label="Total Pipeline"
          value={`$${stats.totalDealValue.toLocaleString()}`}
        />
        <MetricCard
          label="Won Value"
          value={`$${stats.wonDealValue.toLocaleString()}`}
          color="green"
        />
      </div>
      <div className="overflow-x-auto">
        <PipelineChart byStatus={stats.byStatus} />
      </div>
    </div>
  );
}