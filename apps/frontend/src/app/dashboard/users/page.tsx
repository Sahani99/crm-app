'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import { usePermission } from '@/hooks/usePermission';

export default function UsersPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { canViewUsersList, canCreateUsers, canDeleteUsers, role } = usePermission();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'SALES_REP' });

  // Check permission
  useEffect(() => {
    if (!canViewUsersList()) {
      router.push('/dashboard');
    }
  }, [canViewUsersList, router]);

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get<User[]>('/users');
      return data;
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      if (!canCreateUsers()) throw new Error('Permission denied');
      const { data } = await api.post('/users', form);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setForm({ name: '', email: '', password: '', role: 'SALES_REP' });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      if (!canDeleteUsers()) throw new Error('Permission denied');
      return api.delete(`/users/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  if (!canViewUsersList()) {
    return <div className="text-center py-10 text-red-500">Access Denied</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        {role && (
          <Badge variant="outline" className="w-fit">
            {role.replace('_', ' ')}
          </Badge>
        )}
      </div>

      {canCreateUsers() && (
        <div className="bg-white rounded-lg border p-4 sm:p-6 space-y-4">
          <h2 className="font-semibold">Add User</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name"
                value={form.name} 
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} 
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email"
                value={form.email} 
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} 
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password"
                type="password" 
                value={form.password} 
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} 
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="role">Role</Label>
              <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v }))}>
                <SelectTrigger id="role"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="SALES_REP">Sales Rep</SelectItem>
                  <SelectItem value="SALES_MANAGER">Sales Manager</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button 
            onClick={() => create.mutate()} 
            disabled={create.isPending || !form.name || !form.email || !form.password}
            className="w-full sm:w-auto"
          >
            {create.isPending ? 'Creating...' : 'Create User'}
          </Button>
          {create.error && (
            <p className="text-sm text-red-500">{(create.error as Error).message}</p>
          )}
        </div>
      )}

      <div className="bg-white rounded-lg border overflow-x-auto">
        <table className="w-full text-xs sm:text-sm">
          <thead className="bg-gray-50 border-b sticky top-0">
            <tr>
              {['Name', 'Email', 'Role', ...(canDeleteUsers() ? ['Actions'] : [])].map((h) => (
                <th key={h} className="text-left px-2 sm:px-4 py-3 font-medium text-gray-600 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {users?.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-2 sm:px-4 py-3 font-medium truncate">{user.name}</td>
                <td className="px-2 sm:px-4 py-3 text-gray-600 truncate hidden sm:table-cell">{user.email}</td>
                <td className="px-2 sm:px-4 py-3">
                  <Badge variant="outline" className="text-xs">{user.role.replace('_', ' ')}</Badge>
                </td>
                {canDeleteUsers() && (
                  <td className="px-2 sm:px-4 py-3">
                    <Button
                      size="sm" variant="ghost"
                      className="text-red-500 h-8 w-8 p-0"
                      onClick={() => confirm('Delete user?') && remove.mutate(user.id)}
                      disabled={remove.isPending}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </td>
                )}
              </tr>
            ))}
            {users?.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-gray-500">No users found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}