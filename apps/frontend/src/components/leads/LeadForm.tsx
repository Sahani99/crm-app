'use client';

import { useForm, type SubmitHandler, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lead } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { usePermission } from '@/hooks/usePermission';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const schema = z.object({
  name: z.string().min(1, 'Required'),
  company: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  source: z.enum(['WEBSITE','LINKEDIN','REFERRAL','COLD_EMAIL','EVENT','OTHER']),
  status: z.enum(['NEW','CONTACTED','QUALIFIED','PROPOSAL_SENT','WON','LOST']).optional(),
  priority: z.enum(['LOW','MEDIUM','HIGH']).optional(),
  dealValue: z.coerce.number().min(0).default(0),
  assignedToId: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  defaultValues?: Partial<Lead>;
  onSubmit: SubmitHandler<FormData>;
  isLoading?: boolean;
}

export function LeadForm({ defaultValues, onSubmit, isLoading }: Props) {
  const { user } = useAuthStore();
  const { isAdmin } = usePermission();

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get<{ id: string; name: string }[]>('/users');
      return data;
    },
    enabled: isAdmin,
  });

  const assigneeDefault =
    defaultValues?.assignedToId || defaultValues?.assignedTo?.id || user?.id || '';
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: {
      name: defaultValues?.name || '',
      company: defaultValues?.company || '',
      email: defaultValues?.email || '',
      phone: defaultValues?.phone || '',
      source: defaultValues?.source || 'WEBSITE',
      status: defaultValues?.status || 'NEW',
      priority: defaultValues?.priority || 'MEDIUM',
      dealValue: defaultValues?.dealValue || 0,
      assignedToId: assigneeDefault,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Name</Label>
          <Input {...register('name')} />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>
        <div className="space-y-1">
          <Label>Company</Label>
          <Input {...register('company')} />
          {errors.company && <p className="text-xs text-red-500">{errors.company.message}</p>}
        </div>
        <div className="space-y-1">
          <Label>Email</Label>
          <Input type="email" {...register('email')} />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>
        <div className="space-y-1">
          <Label>Phone</Label>
          <Input {...register('phone')} />
        </div>
        <div className="space-y-1">
          <Label>Deal Value ($)</Label>
          <Input type="number" {...register('dealValue')} />
        </div>
        <div className="space-y-1">
          <Label>Source</Label>
          <Select value={watch('source')} onValueChange={(v: any) => setValue('source', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {['WEBSITE','LINKEDIN','REFERRAL','COLD_EMAIL','EVENT','OTHER'].map((s) => (
                <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Status</Label>
          <Select value={watch('status')} onValueChange={(v: any) => setValue('status', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {['NEW','CONTACTED','QUALIFIED','PROPOSAL_SENT','WON','LOST'].map((s) => (
                <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Priority</Label>
          <Select value={watch('priority')} onValueChange={(v: any) => setValue('priority', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {['HIGH','MEDIUM','LOW'].map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Assigned To</Label>
          {isAdmin ? (
            <Select
              value={watch('assignedToId') || ''}
              onValueChange={(v: any) => setValue('assignedToId', v)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {users.map((userItem) => (
                  <SelectItem key={userItem.id} value={userItem.id}>
                    {userItem.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <input type="hidden" {...register('assignedToId')} />
          )}
        </div>
      </div>
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Saving...' : 'Save Lead'}
      </Button>
    </form>
  );
}