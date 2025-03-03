<script lang="ts">
  import renderMarkdown from '@lib/utils/markdown';

  let title = $state('');
  let slug = $state('');
  let summary = $state('');
  let content = $state('');
  let markup = $state('');
  let error = $state('');

  $effect(() => {
    markup = renderMarkdown(content);
  });

  async function submitForm(
    event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement },
  ): Promise<void> {
    event.preventDefault();
    console.log(event.currentTarget);
    const data = new FormData(event.currentTarget);
    console.log(data);
    const json: Record<string, any> = {};
    data.forEach((value, key) => (json[key] = value.valueOf()));
    console.log(json);
    const response = await fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify(json),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (!response.ok) {
      error = ((await response.json()) as Error).message;
      return;
    }
    const location: string = await response.text();
    window.document.location = location;
  }
</script>

<span>{error}</span>
<form method="POST" onsubmit={submitForm}>
  <input
    type="text"
    name="title"
    bind:value={title}
    placeholder="Post Title"
    required
  />
  <input
    type="text"
    name="slug"
    bind:value={slug}
    placeholder="Post Slug"
    required
  />
  <textarea
    name="summary"
    bind:value={summary}
    placeholder="Post Summary"
    required
  ></textarea>
  <textarea
    name="content"
    bind:value={content}
    placeholder="Post Content"
    required
  ></textarea>
  <button type="submit">Create Post</button>
</form>

<div class="blog-body">
  {@html markup}
</div>
