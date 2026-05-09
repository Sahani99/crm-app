'use client';

import { useParams, useRouter } from 'next/navigation';
import { useLead } from '@/hooks/useLeads';
import { StatusBadge } from '@/components/leads/StatusBadge';
import { PriorityBadge } from '@/components/leads/PriorityBadge';
import { NoteList } from '@/components/notes/NoteList';
import { NoteForm } from '@/components/notes/NoteForm';
import { FileUpload } from '@/components/files/FileUpload';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: lead, isLoading } = useLead(id);

  if (isLoading) return <div className="text-center py-10 text-gray-500">Loading...</div>;
  if (!lead) return <div className="text-center py-10 text-gray-500">Lead not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
        <Button onClick={() => router.push(`/dashboard/leads/${id}/edit`)}>
          <Pencil size={16} className="mr-2" /> Edit
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Lead Details</h2>
          {[
            ['Company', lead.company],
            ['Email', lead.email],
            ['Phone', lead.phone || '—'],
            ['Source', lead.source],
            ['Deal Value', `$${lead.dealValue.toLocaleString()}`],
            ['Assigned To', lead.assignedTo?.name || '—'],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-gray-500">{label}</span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Status</span>
            <StatusBadge status={lead.status} />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Priority</span>
            <PriorityBadge priority={lead.priority} />
          </div>
        </div>
        <div className="space-y-4">
          <FileUpload leadId={id} attachments={lead.attachments || []} />
        </div>
      </div>
      <div className="bg-white rounded-lg border p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Notes</h2>
        <NoteForm leadId={id} />
        <NoteList notes={lead.notes || []} />
      </div>
    </div>
  );
}