'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Lead, LeadStatus } from '@/types';
import { KanbanColumn } from './KanbanColumn';
import { LeadCard } from './LeadCard';

const STATUSES: LeadStatus[] = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL_SENT', 'WON', 'LOST'];

interface Props {
  leads: Lead[];
  onStatusChange: (id: string, status: LeadStatus) => void;
}

export function KanbanBoard({ leads, onStatusChange }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,
    },
  })
);

  const activeLead = leads.find((l) => l.id === activeId);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const leadId = active.id as string;
    const overData = over.data.current as { type?: string; status?: LeadStatus } | undefined;
    let newStatus: LeadStatus | undefined;

    if (overData?.type === 'status') {
      newStatus = overData.status;
    } else if (overData?.type === 'lead') {
      newStatus = overData.status;
    } else if (typeof over.id === 'string' && STATUSES.includes(over.id as LeadStatus)) {
      newStatus = over.id as LeadStatus;
    }

    if (!newStatus) return;
    const lead = leads.find((l) => l.id === leadId);
    
    if (lead && lead.status !== newStatus) {
      onStatusChange(leadId, newStatus);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={(e) => setActiveId(e.active.id as string)}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6">
        {STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            leads={leads.filter((l) => l.status === status)}
          />
        ))}
      </div>
      <DragOverlay>
        {activeLead && <LeadCard lead={activeLead} />}
      </DragOverlay>
    </DndContext>
  );
}