<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { getTickets } from '$lib/services/api';
  import type { Ticket } from '$lib/services/api';
  import TicketCard from '$lib/components/TicketCard.svelte';
  import CreateTicketForm from '$lib/components/CreateTicketForm.svelte';

  let tickets = $state<Ticket[]>([]);
  let loading = $state(true);
  let error = $state('');
  let showForm = $state(false);
  let intervalId: ReturnType<typeof setInterval> | null = null;

  async function load() {
    loading = true;
    error = '';
    try {
      tickets = await getTickets();
    } catch (err: any) {
      error = err.message ?? 'Failed to load tickets';
    } finally {
      loading = false;
    }
  }

  function hasPendingAi(): boolean {
    return tickets.some((t) => t.aiStatus === 'PENDING' || t.aiStatus === 'PROCESSING');
  }

  function startPollingIfNeeded() {
    if (hasPendingAi()) {
      if (!intervalId) {
        intervalId = setInterval(async () => {
          try {
            tickets = await getTickets();
            if (!hasPendingAi() && intervalId) {
              clearInterval(intervalId);
              intervalId = null;
            }
          } catch {
            // silent retry
          }
        }, 3000);
      }
    } else {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }
  }

  function handleCreated() {
    showForm = false;
    load();
  }

  onMount(() => {
    load();
  });

  $effect(() => {
    if (tickets.length > 0) {
      startPollingIfNeeded();
    }
  });

  onDestroy(() => {
    if (intervalId) clearInterval(intervalId);
  });
</script>

<div class="mx-auto max-w-4xl space-y-6 p-6">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold">Tickets</h1>
    <button
      onclick={() => (showForm = !showForm)}
      class="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
    >
      {showForm ? 'Close' : '+ New Ticket'}
    </button>
  </div>

  {#if showForm}
    <CreateTicketForm oncreated={handleCreated} />
  {/if}

  {#if loading}
    <p class="text-gray-400">Loading tickets...</p>
  {:else if error}
    <div class="rounded bg-red-50 p-4 text-sm text-red-700">{error}</div>
  {:else if tickets.length === 0}
    <p class="text-gray-400">No tickets yet. Create one!</p>
  {:else}
    <div class="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
      {#each tickets as ticket (ticket.id)}
        <TicketCard {ticket} />
      {/each}
    </div>
  {/if}
</div>
