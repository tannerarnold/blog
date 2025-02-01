<script lang="ts">
  let title = $state('');
  let slug = $state('');
  let content = $state('');
</script>

<form method="POST" action="/api/blogs">
  <input type="text" name="title" bind:value={title} placeholder="Post Title" />
  <input type="text" name="slug" bind:value={slug} placeholder="Post Slug" />
  <textarea name="content" bind:value={content} placeholder="Post Content"
  ></textarea>
  <button type="submit">Create Post</button>
</form>
