<script lang="ts">
  import Layout from '@lib/components/Layout.svelte';
  import renderMarkdown from '@lib/utils/markdown';
  import { dateFormatOptions } from '@lib/utils/date';

  type PostProps = {
    post: {
      id: string;
      title: string;
      slug: string;
      content: string;
      date_posted: Date;
      user: string;
    };
  };
  let { post }: PostProps = $props();
</script>

<Layout pageTitle="Blog">
  <div class="body">
    <h1>{post.title}</h1>
    <div style="width: 75%; display: flex; justify-content: space-between">
      <p style="font-family: Petrona, serif">
        {post.date_posted.toLocaleDateString('en-US', dateFormatOptions)}
      </p>
      <p style="font-family: Petrona, serif">by {post.user}</p>
    </div>
    <div class="blog-body">
      {@html renderMarkdown(post.content)}
    </div>
  </div>
</Layout>
