<script>
  let { variant, children, ...rest } = $props();
</script>

<button class={['button', variant]} {...rest}>{@render children()}</button>
