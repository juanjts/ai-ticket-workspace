<script lang="ts">
  import { createTicket } from '$lib/services/api';

  let customerName = $state('');
  let requestText = $state('');
  let attachmentUrl = $state('');
  let submitting = $state(false);
  let error = $state('');

  let { oncreated }: { oncreated: () => void } = $props();

  async function handleSubmit(e: Event) {
    e.preventDefault();
    submitting = true;
    error = '';

    try {
      await createTicket({
        customerName,
        requestText,
        attachmentUrl: attachmentUrl || undefined,
      });
      customerName = '';
      requestText = '';
      attachmentUrl = '';
      oncreated();
    } catch (err: any) {
      error = err.message ?? 'Failed to create ticket';
    } finally {
      submitting = false;
    }
  }
</script>

<form onSubmit={handleSubmit} class="space-y-4 rounded-lg border p-6">
  <h2 class="text-lg font-semibold">New Ticket</h2>

  {#if error}
    <div class="rounded bg-red-50 p-3 text-sm text-red-700">{error}</div>
  {/if}

  <div>
    <label for="customerName" class="mb-1 block text-sm font-medium">Customer Name</label>
    <input
      id="customerName"
      type="text"
      bind:value={customerName}
      required
      class="w-full rounded border px-3 py-2 text-sm"
      placeholder="Acme Inc"
    />
  </div>

  <div>
    <label for="requestText" class="mb-1 block text-sm font-medium">Request Text</label>
    <textarea
      id="requestText"
      bind:value={requestText}
      required
      rows={3}
      class="w-full rounded border px-3 py-2 text-sm"
      placeholder="Describe the request..."
    ></textarea>
  </div>

  <div>
    <label for="attachmentUrl" class="mb-1 block text-sm font-medium">Attachment URL (optional)</label>
    <input
      id="attachmentUrl"
      type="url"
      bind:value={attachmentUrl}
      class="w-full rounded border px-3 py-2 text-sm"
      placeholder="https://..."
    />
  </div>

  <button
    type="submit"
    disabled={submitting}
    class="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
  >
    {submitting ? 'Creating...' : 'Create Ticket'}
  </button>
</form>
