<script lang="ts">
  import Layout from "@lib/components/Layout.svelte";
  import Card from "@lib/components/Card.svelte";
  type BlogListingProps = {
    posts: {
      id: string;
      title: string;
      datePosted: Date;
      href: string;
    }[];
  };
  let { posts }: BlogListingProps = $props();
</script>

<Layout pageTitle="Blog">
  <h1>Blog</h1>
  <div class="cards">
    {#each posts as post (post.id)}
      <Card
        styled
        cardTitle={post.title}
        href={post.href}
        imgSrc="/images/samsung-memory-fCRQNzRlEP0-unsplash.jpg"
      >
        <p>{post.datePosted.toISOString()}</p>
      </Card>
    {/each}
  </div>
</Layout>
