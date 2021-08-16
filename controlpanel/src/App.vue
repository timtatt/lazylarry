<template>
  <div>
    {{config}}
    <h1>this is the cont`rol panel</h1>
    <div class="colors">
        <color v-for="(color, id) in config.colors" :key="id" v-bind:color="color" v-on:delete-color="Vue.delete(config.colors, id)"></color>
    </div>

    <add-color v-bind:config="config"></add-color>
  </div>
</template>

<script>
import Color from './components/Color.vue'
import AddColor from './components/AddColor.vue'

export default {
  name: 'App',
  components: {
    Color,
    AddColor,
  },
  data: () => {
    return {
      config: {
          colors: {},
          downtime: {},
      }
    }
  },
  mounted() {
      axios.get(this.apiUri + '/config')
          .then(response => this.config = response.data);
  },
  methods: {
      addColor: function(color) {
          console.log(color); 
          this.config.colors[color.id] = color;
      }
  }
}

</script>

<style>

</style>
