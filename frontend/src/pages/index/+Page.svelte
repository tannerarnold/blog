<script lang="ts">
  import Card from '@lib/components/Card.svelte';
  import Layout from '@lib/components/Layout.svelte';
  import Checkmark from 'lucide-svelte/icons/check';
  import Brackets from 'lucide-svelte/icons/brackets';
  import User from 'lucide-svelte/icons/user';
</script>

<Layout>
  <div class="nav-parallax">
    <div class="nav-parallax-overlay-one">
      <!-- https://www.svgrepo.com/svg/308140/use-computer-work-designer-computer-programmer -->
      <svg
        fill="#ffffff"
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="16rem"
        height="16rem"
        viewBox="0 0 256 203"
        xml:space="preserve"
      >
        <path
          d="M84.2,2.4c18.7,0,33.8,15.1,33.8,33.8S102.9,70,84.2,70S50.4,54.9,50.4,36.2S65.5,2.4,84.2,2.4z M156.3,122.2l-21.8,63H88.6
  v-3.9c0-6.5-5.3-11.8-11.8-11.8H33.5v-43.3c0-2.2,1.8-3.9,3.9-3.9s3.9,1.8,3.9,3.9v35.4h35.4c9.5,0,17.5,6.8,19.3,15.8h32.8
  l17.7-51.4c-4.4-9.1-8.9-18.3-12.3-24.4c-6.7-14.4-21.4-24.4-38.3-24.4H44.2C20.9,77.1,2,96.1,2,119.3v63.6
  c0,9.8,7.9,17.7,17.7,17.7H227l3.6-10.3l23.4-68.1H156.3z M197.6,168.1c-4.3,0-7.8-2.2-7.8-5c0-2.8,3.5-5,7.8-5c4.3,0,7.8,2.2,7.8,5
  C205.4,165.8,201.9,168.1,197.6,168.1z"
        />
      </svg>
    </div>
  </div>
  <div class="cards">
    <Card cardTitle="Experience" cardIcon={Checkmark}>
      <p class="body-text">
        With several years of experience in both frontend and backend
        development, you can rest assured that Tanner will provide a full
        software experience for your client. He knows the architecture needed
        for a scalable application.
      </p>
    </Card>
    <Card cardTitle="Quality" cardIcon={Brackets}>
      <p class="body-text">
        Tanner has spent his time honing his skills and produces quality code on
        the regular. He'll get the job done right the first time.
      </p>
    </Card>
    <Card cardTitle="Perspective" cardIcon={User}>
      <p class="body-text">
        Tanner brings a unique perspective to software development. With vision
        and passion, you'll find that his product stands out amongst the rest.
      </p>
    </Card>
  </div>
</Layout>

<style>
</style>
