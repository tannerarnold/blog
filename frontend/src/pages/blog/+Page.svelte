<script lang="ts">
  import Layout from '@lib/components/Layout.svelte';
  import Card from '@lib/components/Card.svelte';
  import { dateFormatOptions } from '@lib/utils/date';

  type BlogListingProps = {
    posts: {
      id: string;
      title: string;
      summary: string;
      date_posted: Date;
      href: string;
    }[];
  };
  let { posts }: BlogListingProps = $props();
</script>

<Layout pageTitle="Blog">
  <div class="body">
    <h1>Blog</h1>
    <div class="cards">
      {#each posts as post (post.id)}
        <Card cardTitle={post.title} href={post.href}>
          <p class="body-text">
            {post.date_posted.toLocaleDateString('en-US', dateFormatOptions)}
          </p>
          <br />
          <p class="body-text" style="width: 100%">{post.summary}</p>
        </Card>
      {/each}
    </div>
  </div>
</Layout>
