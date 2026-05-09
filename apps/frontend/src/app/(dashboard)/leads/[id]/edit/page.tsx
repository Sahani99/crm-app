'use client';

import { useParams, useRouter } from 'next/navigation';
import { useLead, useUpdateLead } from '@/hooks/useLeads';
import { LeadForm } from '@/components/leads/LeadForm';

export default function EditLeadPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: lead, isLoading } = useLead(id);
  const updateLead = useUpdateLead();

  if (isLoading) return <div className="text-center py-10 text-gray-500">Loading...</div>;
  if (!lead) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Edit Lead</h1>
      <div className="bg-white rounded-lg border p-6">
        <LeadForm
          defaultValues={lead}
          onSubmit={(data) =>
            updateLead.mutate({ id, ...data }, { onSuccess: () => router.push(`/dashboard/leads/${id}`) })
          }
          isLoading={updateLead.isPending}
        />
      </div>
    </div>
  );
}