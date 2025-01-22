<script lang="ts">
  import ArrowUp from 'lucide-svelte/icons/arrow-up';
  import ArrowDown from 'lucide-svelte/icons/arrow-down';
  let { children, pageTitle }: { children: any; pageTitle?: string } = $props();
  let scroll = $state(0);

  $effect(() => {
    window.addEventListener('scroll', (ev) => {
      const nav = document.getElementById('nav')!;
      const scrolled = window.scrollY;
      scroll = scrolled;
      const height = window.innerHeight;
      if (scrolled < height) {
        nav.style.height = (height - scrolled * 0.5).toFixed(1) + 'px';
      }
    });
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

<nav class="nav" id="nav">
  <div class="nav-background"></div>
  <img
    class="nav-img"
    src="/images/mohammad-rahmani-8qEB0fTe9Vw-unsplash.jpg"
    alt="computer code"
  />
  <div class="nav-content">
    <div class="nav-top">
      <div class="nav-left">
        <h1>Tanner Arnold</h1>
      </div>
      <div class="nav-right">
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
      {#if pageTitle}
        <h2>{pageTitle}</h2>
      {/if}
      <button class="round-button" onclick={() => scrollToContent()}>
        <ArrowDown />
      </button>
    </div>
  </div>
</nav>
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
  <link href="" rel="stylesheet" />
  <link
    href="https://fonts.googleapis.com/css2?family=Petrona:ital,wght@0,100..900;1,100..900&display=swap"
    rel="stylesheet"
  />
</svelte:head>
