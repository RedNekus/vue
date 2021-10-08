<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <img src="@/assets/logo.png" />
  </div>
</template>

<script>
export default {
  name: 'myComponent',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
