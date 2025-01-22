<script lang="ts">
  type PostProps = {
    post: {
      id: string;
      title: string;
      slug: string;
      content: string;
      date_posted: Date;
    };
  };
  let { post }: PostProps = $props();
</script>

<h1>{post.title}</h1>
<p>{post.content}</p>
<p>{post.date_posted.toISOString()}</p>
