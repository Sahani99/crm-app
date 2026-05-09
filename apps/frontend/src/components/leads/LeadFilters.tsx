'use client';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface Props {
  filters: Record<string, string>;
  onChange: (filters: Record<string, string>) => void;
}

export function LeadFilters({ filters, onChange }: Props) {
  const update = (key: string, value: string) => {
    onChange({ ...filters, [key]: value === 'ALL' ? '' : value, page: '1' });
  };

  const reset = () => onChange({ page: '1' });

  return (
    <div className="flex flex-wrap gap-3 bg-white p-4 rounded-lg border">
      <Input
        placeholder="Search name, company, email..."
        value={filters.search || ''}
        onChange={(e) => update('search', e.target.value)}
        className="w-64"
      />
      <Select value={filters.status || 'ALL'} onValueChange={(v) => update('status', v)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Statuses</SelectItem>
          {['NEW','CONTACTED','QUALIFIED','PROPOSAL_SENT','WON','LOST'].map((s) => (
            <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={filters.source || 'ALL'} onValueChange={(v) => update('source', v)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Source" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Sources</SelectItem>
          {['WEBSITE','LINKEDIN','REFERRAL','COLD_EMAIL','EVENT','OTHER'].map((s) => (
            <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={filters.priority || 'ALL'} onValueChange={(v) => update('priority', v)}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Priorities</SelectItem>
          {['HIGH','MEDIUM','LOW'].map((p) => (
            <SelectItem key={p} value={p}>{p}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="outline" onClick={reset}>Reset</Button>
    </div>
  );
}