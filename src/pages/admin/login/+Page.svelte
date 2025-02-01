<script lang="ts">
  let usernameOrEmail = $state('');
  let password = $state('');
</script>

<form action="/api/auth" method="POST">
  <input
    type="text"
    name="usernameOrEmail"
    bind:value={usernameOrEmail}
    placeholder="Username or Email"
  />
  <input
    type="password"
    name="password"
    bind:value={password}
    placeholder="Password"
  />
  <button type="submit">Log In</button>
</form>
