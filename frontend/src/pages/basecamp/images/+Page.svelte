<script lang="ts">
  import type { ImageLocation } from '@type/images';

  type Props = {
    imageLocations: ImageLocation[];
  };

  let { imageLocations }: Props = $props();
</script>

<div class="image-grid">
  {#each imageLocations as imageLocation}
    <div class="image-holder">
      <img src={imageLocation.location} alt={imageLocation.file_name} />
      <p>{imageLocation.location}</p>
    </div>
  {/each}
</div>
