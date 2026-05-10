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

  const categoryColors: Record<string, string> = {
    FINANCE: 'bg-green-100 text-green-800',
    LEGAL: 'bg-purple-100 text-purple-800',
    PROCUREMENT: 'bg-blue-100 text-blue-800',
    OPERATIONS: 'bg-orange-100 text-orange-800',
  };

  function aiLabel(status: string): string {
    if (status === 'FAILED') return 'Partial';
    return status;
  }
</script>

<a
  href={`/ticket/${ticket.id}`}
  class="block rounded-lg border p-4 transition hover:shadow-md"
>
  <div class="mb-2 flex items-start justify-between gap-2">
    <h3 class="font-medium">{ticket.customerName}</h3>
    <span class="shrink-0 rounded px-2 py-0.5 text-xs font-medium {statusColors[ticket.status] ?? ''}">{ticket.status}</span>
  </div>

  <p class="mb-2 line-clamp-2 text-sm text-gray-600">{ticket.requestText}</p>

  {#if ticket.summary}
    <p class="mb-2 text-xs italic text-gray-500">{ticket.summary}</p>
  {/if}

  <div class="flex items-center justify-between text-xs">
    <span>
      category:
      <span class="ml-1 rounded px-2 py-0.5 {categoryColors[ticket.category] ?? ''}">{ticket.category}</span>
    </span>
    <span>
      priority:
      <span class="ml-1 rounded px-2 py-0.5 {priorityColors[ticket.priority] ?? ''}">{ticket.priority}</span>
    </span>
  </div>

  <p class="mt-2 text-xs text-gray-400">
    {new Date(ticket.createdAt).toLocaleString()}
    {#if ticket.owner}
      &middot; {ticket.owner}
    {/if}
    &middot; AI: {aiLabel(ticket.aiStatus)}
  </p>
</a>
