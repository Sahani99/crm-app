'use client';

import { useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Attachment } from '@/types';
import { Button } from '@/components/ui/button';
import { Paperclip, Trash2, ExternalLink } from 'lucide-react';

interface Props {
  leadId: string;
  attachments: Attachment[];
}

export function FileUpload({ leadId, attachments }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const upload = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post(`/leads/${leadId}/attachments`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leads', leadId] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/leads/${leadId}/attachments/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leads', leadId] }),
  });

  return (
    <div className="bg-white rounded-lg border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Attachments</h3>
        <Button size="sm" variant="outline" onClick={() => inputRef.current?.click()}>
          <Paperclip size={14} className="mr-2" />
          {upload.isPending ? 'Uploading...' : 'Attach File'}
        </Button>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && upload.mutate(e.target.files[0])}
        />
      </div>
      {attachments.length === 0 ? (
        <p className="text-sm text-gray-500">No attachments yet.</p>
      ) : (
        <div className="space-y-2">
          {attachments.map((a) => (
            <div key={a.id} className="flex items-center justify-between text-sm bg-gray-50 rounded p-2">
              <span className="truncate text-gray-700">{a.filename}</span>
              <div className="flex gap-1 ml-2">
                <Button size="sm" variant="ghost" asChild>
                  <a href={a.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={12} />
                  </a>
                </Button>
                <Button
                  size="sm" variant="ghost"
                  className="text-red-500"
                  onClick={() => remove.mutate(a.id)}
                >
                  <Trash2 size={12} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}