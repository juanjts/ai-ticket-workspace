<script lang="ts">
  import { onMount } from 'svelte';
  import { getTicket, updateTicket } from '$lib/services/api';
  import type { Ticket } from '$lib/services/api';
  import CommentSection from '$lib/components/CommentSection.svelte';

  let { params } = $props();
  let ticket = $state<Ticket | null>(null);
  let loading = $state(true);
  let error = $state('');

  let newStatus = $state('');
  let newOwner = $state('');
  let updating = $state(false);

  async function load() {
    loading = true;
    error = '';
    try {
      ticket = await getTicket(params.id as string);
      if (ticket) {
        newStatus = ticket.status;
        newOwner = ticket.owner ?? '';
      }
    } catch (err: any) {
      error = err.message ?? 'Failed to load ticket';
    } finally {
      loading = false;
    }
  }

  async function handleUpdate() {
    if (!ticket) return;
    updating = true;
    try {
      ticket = await updateTicket(ticket.id, {
        status: newStatus,
        owner: newOwner || undefined,
      });
    } catch (err: any) {
      error = err.message ?? 'Failed to update ticket';
    } finally {
      updating = false;
    }
  }

  onMount(load);
</script>

<div class="mx-auto max-w-3xl space-y-6 p-6">
  <a href="/" class="text-sm text-blue-600 hover:underline">&larr; Back to Dashboard</a>

  {#if loading}
    <p class="text-gray-400">Loading ticket...</p>
  {:else if error}
    <div class="rounded bg-red-50 p-4 text-sm text-red-700">{error}</div>
  {:else if ticket}
    <div class="rounded-lg border p-6">
      <div class="mb-4 flex items-start justify-between gap-2">
        <div>
          <h1 class="text-2xl font-bold">{ticket.customerName}</h1>
          <p class="mt-1 text-sm text-gray-500">Created {new Date(ticket.createdAt).toLocaleString()}</p>
        </div>
        <span class="shrink-0 text-xs">AI: {ticket.aiStatus}</span>
      </div>

      <div class="mb-4 space-y-2">
        <p class="text-gray-700">{ticket.requestText}</p>
        {#if ticket.attachmentUrl}
          <a
            href={ticket.attachmentUrl}
            target="_blank"
            class="text-sm text-blue-600 hover:underline"
          >View Attachment</a>
        {/if}
      </div>

      {#if ticket.summary}
        <div class="mb-4 rounded bg-gray-50 p-3">
          <p class="text-xs font-medium text-gray-500">AI Summary</p>
          <p class="text-sm text-gray-700">{ticket.summary}</p>
        </div>
      {/if}

      <div class="mb-6 grid grid-cols-3 gap-4 text-sm">
        <div>
          <p class="text-xs text-gray-500">Category</p>
          <p class="font-medium">{ticket.category ?? '—'}</p>
        </div>
        <div>
          <p class="text-xs text-gray-500">Priority</p>
          <p class="font-medium">{ticket.priority ?? '—'}</p>
        </div>
        <div>
          <p class="text-xs text-gray-500">Status</p>
          <p class="font-medium">{ticket.status}</p>
        </div>
      </div>

      <div class="space-y-3 rounded-lg border p-4">
        <h3 class="font-semibold">Update Ticket</h3>
        <div class="flex flex-wrap gap-3">
          <select
            bind:value={newStatus}
            class="rounded border px-3 py-2 text-sm"
          >
            <option value="OPEN">OPEN</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>
          <input
            type="text"
            bind:value={newOwner}
            placeholder="Owner name"
            class="rounded border px-3 py-2 text-sm"
          />
          <button
            onClick={handleUpdate}
            disabled={updating}
            class="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {updating ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>

    <div class="rounded-lg border p-6">
      <CommentSection ticketId={ticket.id} comments={ticket.comments} />
    </div>
  {/if}
</div>
