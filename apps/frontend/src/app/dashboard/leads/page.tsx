'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLeads, useDeleteLead } from '@/hooks/useLeads';
import { LeadFilters } from '@/components/leads/LeadFilters';
import { StatusBadge } from '@/components/leads/StatusBadge';
import { PriorityBadge } from '@/components/leads/PriorityBadge';
import { Button } from '@/components/ui/button';
import { usePermission } from '@/hooks/usePermission';
import { Lead } from '@/types';
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react';

export default function LeadsPage() {
  const router = useRouter();
  const { canCreateLead, canDeleteLead } = usePermission();
  const [filters, setFilters] = useState<Record<string, string>>({ page: '1' });
  const { data, isLoading } = useLeads({
    ...filters,
    page: Number(filters.page) || 1,
  });
  const deleteLead = useDeleteLead();

  const handleDelete = (id: string) => {
    if (!canDeleteLead()) {
      alert('You do not have permission to delete leads');
      return;
    }
    if (confirm('Delete this lead?')) deleteLead.mutate(id);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        {canCreateLead() && (
          <Button onClick={() => router.push('/dashboard/leads/new')} size="sm" className="sm:size-auto">
            <Plus size={16} className="mr-2" /> New Lead
          </Button>
        )}
      </div>
      <LeadFilters filters={filters} onChange={setFilters} />
      {isLoading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b sticky top-0">
              <tr>
                {['Name','Company','Status','Priority','Deal Value','Assigned To','Actions'].map((h) => (
                  <th key={h} className="text-left px-2 sm:px-4 py-3 font-medium text-gray-600 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {data?.data.map((lead: Lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 text-xs sm:text-sm">
                  <td className="px-2 sm:px-4 py-3 font-medium truncate max-w-xs">{lead.name}</td>
                  <td className="px-2 sm:px-4 py-3 text-gray-600 hidden md:table-cell truncate">{lead.company}</td>
                  <td className="px-2 sm:px-4 py-3"><StatusBadge status={lead.status} /></td>
                  <td className="px-2 sm:px-4 py-3 hidden sm:table-cell"><PriorityBadge priority={lead.priority} /></td>
                  <td className="px-2 sm:px-4 py-3 hidden lg:table-cell">${lead.dealValue.toLocaleString()}</td>
                  <td className="px-2 sm:px-4 py-3 hidden xl:table-cell text-gray-600">{lead.assignedTo?.name || '—'}</td>
                  <td className="px-2 sm:px-4 py-3">
                    <div className="flex gap-1 sm:gap-2">
                      <Button size="sm" variant="ghost" onClick={() => router.push(`/dashboard/leads/${lead.id}`)} className="h-8 w-8 p-0">
                        <Eye size={14} />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => router.push(`/dashboard/leads/${lead.id}/edit`)} className="h-8 w-8 p-0">
                        <Pencil size={14} />
                      </Button>
                      {canDeleteLead() && (
                        <Button size="sm" variant="ghost" className="text-red-500 h-8 w-8 p-0" onClick={() => handleDelete(lead.id)}>
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {data?.data.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-500">No leads found</td></tr>
              )}
            </tbody>
          </table>
          {data && data.meta.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-2 sm:px-4 py-3 border-t">
              <p className="text-xs sm:text-sm text-gray-600">
                Page {data.meta.page} of {data.meta.totalPages} ({data.meta.total} total)
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm" variant="outline"
                  disabled={data.meta.page <= 1}
                  onClick={() => setFilters((f) => ({ ...f, page: String(data.meta.page - 1) }))}
                  className="text-xs"
                >Previous</Button>
                <Button
                  size="sm" variant="outline"
                  disabled={data.meta.page >= data.meta.totalPages}
                  onClick={() => setFilters((f) => ({ ...f, page: String(data.meta.page + 1) }))}
                  className="text-xs"
                >Next</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}