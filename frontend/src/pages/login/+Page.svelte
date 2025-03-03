<script lang="ts">
  import Layout from '@lib/components/Layout.svelte';

  let email = $state('');
  let password = $state('');
</script>

<Layout pageTitle="Admin Login">
  <div class="body">
    <h1>Login</h1>
    <form action="/api/auth" method="POST">
      <input type="text" name="email" bind:value={email} placeholder="Email" />
      <input
        type="password"
        name="password"
        bind:value={password}
        placeholder="Password"
      />
      <button type="submit">Log In</button>
    </form>
  </div>
</Layout>
