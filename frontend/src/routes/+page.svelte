<script lang="ts">
  import { onMount } from 'svelte';
  import { getTickets } from '$lib/services/api';
  import type { Ticket } from '$lib/services/api';
  import TicketCard from '$lib/components/TicketCard.svelte';
  import CreateTicketForm from '$lib/components/CreateTicketForm.svelte';

  let tickets = $state<Ticket[]>([]);
  let loading = $state(true);
  let error = $state('');
  let showForm = $state(false);

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

  function handleCreated() {
    showForm = false;
    load();
  }

  onMount(load);
</script>

<div class="mx-auto max-w-4xl space-y-6 p-6">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold">Tickets</h1>
    <button
      onClick={() => (showForm = !showForm)}
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
    <div class="grid gap-4 sm:grid-cols-2">
      {#each tickets as ticket (ticket.id)}
        <TicketCard {ticket} />
      {/each}
    </div>
  {/if}
</div>
