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
              <md-button
                v-on:click="$refs.addColor.show()"
                class="md-dense md-icon-button md-primary"
              >
                <md-icon>add</md-icon>
              </md-button>
            </md-subheader>
            <color
              :key="id"
              v-for="(color, id) in config.colors"
              v-bind:color="color"
              v-on:delete-color="deleteColor"
            ></color>
          </md-list>
        </div>
        <div class="md-layout-item">
          <downtime @add-downtime="addDowntime" @delete-downtime="deleteDowntime" :config="config" />
        </div>
      </div>
      <add-color
				ref="addColor"
        :config="config"
				@add-color="addColor"
      ></add-color>
      <pre>{{ config }}</pre>
    </div>
    <add-color v-bind:config="config" v-bind:show-dialog="showAddColor"></add-color>
		<wifi-dialog ref="wifiDialog" />
  </div>
</template>

<script>
import Downtime from "./components/Downtime.vue";
import Color from "./components/Color.vue";
import AddColor from "./components/AddColor.vue";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default.css";
import WifiDialog from './components/WifiDialog.vue';

export default {
  name: "App",
  components: {
    Color,
    AddColor,
    Downtime,
    WifiDialog,
  },
  data: () => {
    return {
      showAddColor: false,
      config: {
        colors: {},
        downtime: {},
      }
    };
  },
  mounted() {
    this.$axios
      .get(this.global.apiUri + "/config")
      .then((response) => (this.config = response.data));

		setInterval(() => {
			this.$axios.get(this.global.apiUri + "/wifi/status")
				.then(response => {
					if (!response.data.connected) {
						this.$refs.wifiDialog.open();
					} else {
						this.$refs.wifiDialog.close();
					}
				});
		}, 1000);
  },
  methods: {
    addColor: function (color) {
			this.$axios.post(this.global.apiUri + '/config/color', color)
				.then(response => {
					this.$set(this.config.colors, response.data.color.id, response.data.color)
				});
    },
		deleteColor: function(colorId) {
			this.$axios.delete(this.global.apiUri + '/config/color/' + colorId)
				.then(() => {
						this.$delete(this.config.colors, colorId)
				});
		},
		addDowntime: function(downtime) {
      this.$axios.post(this.global.apiUri + '/config/downtime', downtime)
        .then(response => {
          this.$set(this.config.downtime, response.data.downtime.id, response.data.downtime)
        });
		},
		deleteDowntime: function(downtimeId) {
			this.$axios.delete(this.global.apiUri + '/config/downtime/' + downtimeId)
        .then(() => {
          this.$delete(this.config.downtime, downtimeId)
        });
		}
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
