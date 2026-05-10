<script lang="ts">
  import { addComment } from '$lib/services/api';
  import type { Comment } from '$lib/services/api';

  let { ticketId, comments: _comments }: { ticketId: string; comments: Comment[] } = $props();

  let content = $state('');
  let submitting = $state(false);
  let localComments = $state<Comment[]>([]);

  $effect(() => {
    localComments = _comments ?? [];
  });

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!content.trim()) return;
    submitting = true;
    try {
      const comment = await addComment(ticketId, { content });
      localComments = [...localComments, comment];
      content = '';
    } catch (err) {
      console.error(err);
    } finally {
      submitting = false;
    }
  }
</script>

<div class="space-y-4">
  <h3 class="font-semibold">Comments</h3>

  {#if localComments.length === 0}
    <p class="text-sm text-gray-400">No comments yet.</p>
  {/if}

  <div class="space-y-2">
    {#each localComments as comment}
      <div class="rounded bg-gray-50 p-3 text-sm">
        <p>{comment.content}</p>
        <p class="mt-1 text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString()}</p>
      </div>
    {/each}
  </div>

  <form onsubmit={handleSubmit} class="flex gap-2">
    <input
      type="text"
      bind:value={content}
      placeholder="Add a comment..."
      class="min-w-0 flex-1 rounded border px-3 py-2 text-sm"
    />
    <button
      type="submit"
      disabled={submitting || !content.trim()}
      class="shrink-0 rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
    >
      Send
    </button>
  </form>
</div>
