<script lang="ts">
  import type { Icon } from 'lucide-svelte';

  type CardProps = {
    href?: string;
    cardIcon?: typeof Icon;
    children: any;
    imgSrc?: string;
    cardTitle: string;
    styled?: boolean;
  };
  let props: CardProps = $props();
</script>

{#snippet card()}
  {@const { imgSrc, styled, cardTitle, children } = props}
  {#if imgSrc}
    <div class="card-header">
      <img src={imgSrc} alt="card-art" />
    </div>
  {/if}
  <div class="card-content">
    <h2>{cardTitle}</h2>
    {#if props.cardIcon}
      <props.cardIcon />
    {/if}
    {@render children()}
  </div>
{/snippet}

{#if !props.href}
  <div class="card">
    {@render card()}
  </div>
{:else}
  <a href={props.href} class="card">
    {@render card()}
  </a>
{/if}
