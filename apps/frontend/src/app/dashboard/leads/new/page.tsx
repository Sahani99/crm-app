'use client';

import { useRouter } from 'next/navigation';
import { useCreateLead } from '@/hooks/useLeads';
import { LeadForm } from '@/components/leads/LeadForm';

export default function NewLeadPage() {
  const router = useRouter();
  const createLead = useCreateLead();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">New Lead</h1>
      <div className="bg-white rounded-lg border p-6">
        <LeadForm
          onSubmit={(data) =>
            createLead.mutate(data, { onSuccess: () => router.push('/leads') })
          }
          isLoading={createLead.isPending}
        />
      </div>
    </div>
  );
}