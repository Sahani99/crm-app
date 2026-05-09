import { Badge } from '@/components/ui/badge';
import { LeadStatus } from '@/types';

const config: Record<LeadStatus, { label: string; className: string }> = {
  NEW: { label: 'New', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  CONTACTED: { label: 'Contacted', className: 'bg-purple-100 text-purple-800 border-purple-200' },
  QUALIFIED: { label: 'Qualified', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  PROPOSAL_SENT: { label: 'Proposal Sent', className: 'bg-orange-100 text-orange-800 border-orange-200' },
  WON: { label: 'Won', className: 'bg-green-100 text-green-800 border-green-200' },
  LOST: { label: 'Lost', className: 'bg-red-100 text-red-800 border-red-200' },
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  const { label, className } = config[status];
  return <Badge className={className}>{label}</Badge>;
}