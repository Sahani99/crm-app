'use client';

import { useLeads, useUpdateLeadStatus } from '@/hooks/useLeads';
import { KanbanBoard } from '@/components/leads/KanbanBoard';
import { useAuthStore } from '@/store/authStore';
import { usePermission } from '@/hooks/usePermission';

export default function KanbanPage() {
  const { data, isLoading } = useLeads({ limit: 100 });
  const updateStatus = useUpdateLeadStatus();
  const { user } = useAuthStore();
  const { canViewAllLeads, canUpdateLeadStatus, role } = usePermission();

  if (isLoading) return <div className="text-center py-10 text-gray-500">Loading...</div>;

  // Filter leads based on permissions
  const visibleLeads = canViewAllLeads()
    ? data?.data || []
    : (data?.data || []).filter(
        (lead) =>
          lead.assignedToId === user?.id || lead.createdBy?.id === user?.id,
      );

  const handleStatusChange = (id: string, status: string) => {
    const lead = visibleLeads.find((l) => l.id === id);
    const isOwner = lead?.assignedToId === user?.id || lead?.createdBy?.id === user?.id;
    
    if (canUpdateLeadStatus(isOwner)) {
      updateStatus.mutate({ id, status });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Kanban Board</h1>
        {role && (
          <p className="text-sm text-gray-600">
            {canViewAllLeads() ? 'Viewing all leads' : 'Viewing own leads'}
          </p>
        )}
      </div>
      <div className="overflow-x-auto">
        <KanbanBoard
          leads={visibleLeads}
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
}