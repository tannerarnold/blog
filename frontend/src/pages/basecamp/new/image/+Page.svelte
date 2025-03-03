<script lang="ts">
  import Layout from '@lib/components/Layout.svelte';

  let uploadedImage = $state('');

  function handleImageUpload(event: Event) {
    const image = (event.target as HTMLInputElement)?.files?.[0];
    if (!image) return;
    uploadedImage = URL.createObjectURL(image);
  }
</script>

<Layout pageTitle="Image Upload">
  <form method="POST" action="/api/images" enctype="multipart/form-data">
    <input
      type="file"
      name="image"
      accept="image/*"
      onchange={handleImageUpload}
    />
    <img src={uploadedImage} alt="New Upload" />
    <button type="submit" disabled={!uploadedImage}>Upload Image</button>
  </form>
</Layout>
