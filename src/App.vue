<template>
  <myComponent msg="My test message"/>
</template>

<script>
import myComponent from './components/MyComponent.vue';
export default {
  name: 'App',
  components: {
    myComponent
  },
  mount() {
    console.log('mount App');
  }
}
</script>