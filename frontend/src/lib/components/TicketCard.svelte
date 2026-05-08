<script lang="ts">
  import type { Ticket } from '$lib/services/api';

  let { ticket }: { ticket: Ticket } = $props();

  const statusColors: Record<string, string> = {
    OPEN: 'bg-blue-100 text-blue-800',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
    RESOLVED: 'bg-green-100 text-green-800',
  };

  const priorityColors: Record<string, string> = {
    LOW: 'bg-gray-100 text-gray-600',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HIGH: 'bg-red-100 text-red-800',
  };

  const aiStatusIcons: Record<string, string> = {
    PENDING: '⏳',
    PROCESSING: '🔄',
    COMPLETED: '✅',
    FAILED: '❌',
  };
</script>

<a
  href={`/ticket/${ticket.id}`}
  class="block rounded-lg border p-4 transition hover:shadow-md"
>
  <div class="mb-2 flex items-start justify-between gap-2">
    <h3 class="font-medium">{ticket.customerName}</h3>
    <span class="shrink-0 text-xs">{aiStatusIcons[ticket.aiStatus] ?? '⏳'} {ticket.aiStatus}</span>
  </div>

  <p class="mb-3 line-clamp-2 text-sm text-gray-600">{ticket.requestText}</p>

  {#if ticket.summary}
    <p class="mb-3 text-xs italic text-gray-500">{ticket.summary}</p>
  {/if}

  <div class="flex flex-wrap gap-2 text-xs">
    {#if ticket.category}
      <span class="rounded bg-purple-100 px-2 py-0.5 text-purple-700">{ticket.category}</span>
    {/if}
    {#if ticket.priority}
      <span class="rounded px-2 py-0.5 {priorityColors[ticket.priority] ?? ''}">{ticket.priority}</span>
    {/if}
    <span class="rounded px-2 py-0.5 {statusColors[ticket.status] ?? ''}">{ticket.status}</span>
  </div>

  <p class="mt-2 text-xs text-gray-400">
    {new Date(ticket.createdAt).toLocaleString()}
    {#if ticket.owner}
      &middot; {ticket.owner}
    {/if}
  </p>
</a>
