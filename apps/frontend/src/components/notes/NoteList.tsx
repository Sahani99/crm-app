import { Note } from '@/types';
import { formatDistanceToNow } from 'date-fns';

export function NoteList({ notes }: { notes: Note[] }) {
  if (notes.length === 0) {
    return <p className="text-sm text-gray-500">No notes yet.</p>;
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <div key={note.id} className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-800">{note.content}</p>
          <p className="text-xs text-gray-400 mt-1">
            {note.createdBy.name} ·{' '}
            {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
          </p>
        </div>
      ))}
    </div>
  );
}