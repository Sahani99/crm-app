'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Lead, LeadStatus } from '@/types';
import { LeadCard } from './LeadCard';
import { StatusBadge } from './StatusBadge';

interface Props {
  status: LeadStatus;
  leads: Lead[];
}

export function KanbanColumn({ status, leads }: Props) {
  const { setNodeRef, isOver, active } = useDroppable({ id: status, data: { type: 'status', status } });

  return (
    <div className="flex-shrink-0 w-80">
      <div className="flex items-center justify-between mb-3">
        <StatusBadge status={status} />
        <span className="text-sm text-gray-500 bg-gray-200 rounded-full px-2 py-1">
          {leads.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className={`min-h-[400px] rounded-lg p-3 space-y-3 transition-all ${
          isOver 
            ? 'bg-blue-100 border-2 border-blue-400 shadow-lg' 
            : 'bg-gray-100 border-2 border-transparent'
        }`}
      >
        <SortableContext 
          items={leads.map((l) => l.id)} 
          strategy={verticalListSortingStrategy}
        >
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </SortableContext>
        {leads.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">
            {active ? '✓ Drop here' : 'Drop leads here'}
          </p>
        )}
      </div>
    </div>
  );
}