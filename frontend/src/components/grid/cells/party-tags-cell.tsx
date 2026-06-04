'use client';

import { useEffect, useRef, useState } from 'react';
import type { ICellRendererParams } from 'ag-grid-community';
import type { CustomCellEditorProps } from 'ag-grid-react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

function parseTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === 'string' && v.trim() !== '');
  }
  if (typeof value === 'string' && value.trim()) {
    return value.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

export function PartyTagsCellRenderer(params: ICellRendererParams) {
  const tags = parseTags(params.value);
  if (tags.length === 0) {
    return <span className="text-muted-foreground">—</span>;
  }
  return (
    <div className="flex h-full flex-wrap items-center gap-1 py-1">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

export function PartyTagsCellEditor(
  props: CustomCellEditorProps<unknown, string[] | null | undefined>,
) {
  const [tags, setTags] = useState<string[]>(() =>
    parseTags(props.value ?? props.initialValue),
  );
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { onValueChange } = props;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addTag = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    setTags((prev) => {
      const lower = trimmed.toLowerCase();
      if (prev.some((t) => t.toLowerCase() === lower)) return prev;
      const next = [...prev, trimmed];
      onValueChange(next);
      return next;
    });
    setInput('');
  };

  const removeTag = (index: number) => {
    setTags((prev) => {
      const next = prev.filter((_, i) => i !== index);
      onValueChange(next);
      return next;
    });
  };

  return (
    <div
      className={cn(
        'flex min-h-[36px] w-full flex-wrap items-center gap-1 border border-primary bg-background px-2 py-1',
      )}
      onKeyDown={(e) => e.stopPropagation()}
    >
      {tags.map((tag, i) => (
        <span
          key={`${tag}-${i}`}
          className="inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs"
        >
          {tag}
          <button
            type="button"
            className="rounded-full p-0.5 hover:bg-primary/20"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => removeTag(i)}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        className="min-w-[80px] flex-1 bg-transparent text-sm outline-none"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(input);
          } else if (e.key === 'Backspace' && !input && tags.length > 0) {
            removeTag(tags.length - 1);
          }
        }}
        onBlur={() => {
          if (input.trim()) addTag(input);
        }}
        placeholder="Add..."
      />
    </div>
  );
}
