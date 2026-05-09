'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useRouter } from 'next/navigation';
import { Lead } from '@/types';
import { PriorityBadge } from './PriorityBadge';

export function LeadCard({ lead }: { lead: Lead }) {
  const router = useRouter();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: lead.id, data: { type: 'lead', status: lead.status } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-lg border p-3 cursor-grab shadow-sm hover:shadow-md transition-shadow"
      onClick={() => router.push(`/leads/${lead.id}`)}
    >
      <p className="font-medium text-sm text-gray-900 truncate">{lead.name}</p>
      <p className="text-xs text-gray-500 truncate">{lead.company}</p>
      <div className="flex items-center justify-between mt-2">
        <PriorityBadge priority={lead.priority} />
        <span className="text-xs text-gray-600">${lead.dealValue.toLocaleString()}</span>
      </div>
    </div>
  );
}