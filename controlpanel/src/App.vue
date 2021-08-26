<template>
<div>
  <md-toolbar class="md-primary">
    <h3 class="md-title">LazyLarry Control Panel</h3>
    <div class="md-toolbar-section-end">
      <span class="md-body-2">Logged in as <b>John Smith</b></span>
      <md-button>Logout</md-button>
    </div>
  </md-toolbar>
  <div class="page-container">
    <div class="md-layout md-gutter">
      <div class="md-layout-item md-size-30">
        <md-list class="md-elevation-1">
          <md-subheader>
            <span style="flex: 1 1 auto">Colours</span>
            <md-button v-on:click="showAddColor = true" class="md-dense md-icon-button md-primary">
              <md-icon>add</md-icon>
            </md-button>
          </md-subheader>
          <color
            :key="id"
            v-for="(color, id) in config.colors"
            v-bind:color="color"
            v-on:delete-color="$delete(config.colors, id)"
          ></color>
        </md-list>
      </div>
      <div class="md-layout-item">
        <md-table>
          <md-table-row>
            <md-table-head>Frequency</md-table-head>
            <md-table-head>Start Time</md-table-head>
            <md-table-head>End Time</md-table-head>
            <md-table-head>Actions</md-table-head>
          </md-table-row>
        </md-table>
      </div>
    </div>
    <add-color v-bind:config="config" v-bind:show-dialog="showAddColor"></add-color>
    {{ config }}
  </div>
</div>
</template>

<script>
import Color from "./components/Color.vue";
import AddColor from "./components/AddColor.vue";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default.css";

export default {
  name: "App",
  components: {
    Color,
    AddColor,
  },
  data: () => {
    return {
      showAddColor: false,
      config: {
        colors: {},
        downtime: {},
      },
    };
  },
  mounted() {
    this.$axios
      .get(this.global.apiUri + "/config")
      .then((response) => (this.config = response.data));
  },
  methods: {
    addColor: function (color) {
      console.log(color);
      this.config.colors[color.id] = color;
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Material+Icons");

.page-container {
  padding: 20px;
}

.md-align-right {
  text-align: right;
}

.md-user button {
  vertical-align: middle;
}

</style>
