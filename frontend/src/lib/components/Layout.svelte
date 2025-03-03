<script lang="ts">
  import ArrowUp from 'lucide-svelte/icons/arrow-up';
  import ArrowDown from 'lucide-svelte/icons/arrow-down';
  let { children, pageTitle }: { children: any; pageTitle?: string } = $props();
  let scroll = $state(0);

  $effect(() => {
    window.addEventListener('scroll', (ev) => (scroll = window.scrollY));
  });

  function scrollToTop() {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }

  function scrollToContent() {
    window.scrollTo({ top: window.innerHeight, left: 0, behavior: 'smooth' });
  }

  const pages = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'About',
      href: '/about',
    },
    {
      title: 'Blog',
      href: '/blog',
    },
    {
      title: 'Contact',
      href: '/contact',
    },
  ];
</script>

{#if !pageTitle}
  <nav class="nav nav-tall" id="nav">
    <div class="nav-content">
      <div class="nav-top">
        <div class="nav-top-left">
          <h1>Tanner Arnold</h1>
        </div>
        <div class="nav-top-right">
          {#each pages as page (page.title)}
            <a class="nav-link" href={page.href}>
              <p>{page.title}</p>
            </a>
          {/each}
        </div>
      </div>
      <div class="nav-middle">
        <h1>Full Stack Developer</h1>
        <h3>Typescript, C#, SQL</h3>
      </div>
      <div class="nav-bottom">
        <button class="round-button" onclick={() => scrollToContent()}>
          <ArrowDown />
        </button>
      </div>
    </div>
  </nav>
{:else}
  <nav class="nav nav-short" id="nav">
    <div class="nav-top-left">
      <h1>Tanner Arnold</h1>
    </div>
    <div class="nav-top-right">
      {#each pages as page (page.title)}
        <a class="nav-link" href={page.href}>
          <p>{page.title}</p>
        </a>
      {/each}
    </div>
  </nav>
{/if}
{#if scroll > 0}
  <button class="round-button navigate-button" onclick={() => scrollToTop()}>
    <ArrowUp />
  </button>
{/if}
<main class="content">
  {@render children()}
</main>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" />
</svelte:head>
