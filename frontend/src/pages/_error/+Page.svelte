<script lang="ts">
  type Props = {
    abortStatusCode: number | undefined;
    abortReason: string | undefined;
  };
  let { abortStatusCode, abortReason }: Props = $props();
</script>

<div class="center">
  {#if abortStatusCode}
    {#if abortStatusCode === 404}
      <h1>No page exists here :(</h1>
    {:else if abortStatusCode === 401}
      <h1>Unauthenticated :(</h1>
    {:else if abortStatusCode === 403}
      <h1>Forbidden :(</h1>
    {/if}
  {:else}
    <h1>Oopsies, a server error has occurred. :(</h1>
  {/if}
  <p>{abortReason}</p>
</div>
