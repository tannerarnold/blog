<script lang="ts">
  import Card from "@lib/components/Card.svelte";
  import Layout from "@lib/components/Layout.svelte";
  import Checkmark from "lucide-svelte/icons/check";
  import Brackets from "lucide-svelte/icons/brackets";
  import User from "lucide-svelte/icons/user";
</script>

<Layout>
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
