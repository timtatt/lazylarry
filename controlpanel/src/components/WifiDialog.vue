<template>
	<div>
		<md-dialog :md-active.sync="dialogOpen" :md-close-on-esc="false" :md-click-outside-to-close="false">
				<md-dialog-title>Connect to a Wifi Network</md-dialog-title>
				<md-list :md-expand-single="true" style="width:400px;">
					<md-subheader>Available Networks</md-subheader>
					<md-list-item md-expand v-for="(network, index) in networks" :key="index">
						<md-icon :class="iconClass(network)"></md-icon>
						<span class="md-list-item-text">{{network[0]}}</span>
						<md-list slot="md-expand" style="padding:0px 12px;">
							<md-field>
								<label>Password</label>
								<md-input :ref="'wifi-password-' + index" placeholder="Enter password..." type="password"></md-input>
							</md-field>
							<md-button @click="connect(network[0], $refs['wifi-password-' + index][0].$el.value)">Connect</md-button>
						</md-list>
					</md-list-item>
				</md-list>
			</md-dialog>
			<md-snackbar md-position="left" :md-duration="4000" :md-active.sync="connectionStatusSnackbar" md-persistent>
				<span>{{connectionStatusMessage}}</span>
			</md-snackbar>
		</div>
</template>

<script>
export default {
	name: 'WifiDialog',
	data: () => {
    return {
			dialogOpen: false,
			connectionStatusSnackbar: false,
			connectionStatusMessage: '',
			networks: []
		}
	},
	methods: {
		iconClass: function(network) {
			const classes = {
				fas: true,
			};

			const strength = network[1] + 1;
			if (strength == 3) {
				classes['fa-wifi'] = true;
			} else {
				classes['fa-wifi-' + strength] = true;
			}
			return classes;
		},
		connect: function(ssid, password) {
			this.$axios.post(this.global.apiUri + '/wifi/connect', {
				ssid,
				password
			}).then(response => {
				this.connectionStatusSnackbar = true;
				if (response.data.success) {
					this.dialogOpen = false;
					this.connectionStatusMessage = 'Successfully connected to ' + ssid;
				} else {
					this.connectionStatusMessage = 'Failed to connect to ' + ssid;
				}
			}).catch(() =>  {
				this.connectionStatusSnackbar = true;
				this.connectionStatusMessage = 'Failed to connect to ' + ssid;
			});
		},
		open: function() {
			this.dialogOpen = true;
			this.$axios.get(this.global.apiUri + '/wifi/networks').then(response => {
				this.networks = response.data;
				this.networks.sort((a, b) => b[1] - a[1]);
			});
		},
		close: function() {
			this.dialogOpen = false;
		}
	}
}
</script>
