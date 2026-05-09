import { Badge } from '@/components/ui/badge';
import { Priority } from '@/types';

const config = {
  HIGH: { label: 'High', className: 'bg-red-100 text-red-800 border-red-200' },
  MEDIUM: { label: 'Medium', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  LOW: { label: 'Low', className: 'bg-green-100 text-green-800 border-green-200' },
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  const { label, className } = config[priority];
  return <Badge className={className}>{label}</Badge>;
}