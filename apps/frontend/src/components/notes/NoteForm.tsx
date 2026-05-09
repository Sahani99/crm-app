'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export function NoteForm({ leadId }: { leadId: string }) {
  const [content, setContent] = useState('');
  const queryClient = useQueryClient();

  const addNote = useMutation({
    mutationFn: async () => {
      const { data } = await api.post(`/leads/${leadId}/notes`, { content });
      return data;
    },
    onSuccess: () => {
      setContent('');
      queryClient.invalidateQueries({ queryKey: ['leads', leadId] });
    },
  });

  return (
    <div className="space-y-2">
      <Textarea
        placeholder="Add a note..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
      />
      <Button
        onClick={() => addNote.mutate()}
        disabled={!content.trim() || addNote.isPending}
        size="sm"
      >
        {addNote.isPending ? 'Adding...' : 'Add Note'}
      </Button>
    </div>
  );
}