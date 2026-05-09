'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { LeadStatus } from '@/types';

interface Props {
  byStatus: { status: LeadStatus; _count: number }[];
}

export function PipelineChart({ byStatus }: Props) {
  const data = byStatus.map((item) => ({
    name: item.status.replace('_', ' '),
    count: item._count,
  }));

  return (
    <div className="bg-white rounded-lg border p-6">
      <h2 className="text-lg font-semibold mb-4">Pipeline by Status</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#111827" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}