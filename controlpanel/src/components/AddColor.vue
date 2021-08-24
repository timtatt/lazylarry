<template>
	<div>
		<md-dialog :md-active.sync="showDialog">
			<md-dialog-title>Add Colour</md-dialog-title>
			<form id="add-color" v-on:submit.prevent="addColor">
				<div class="form-padding md-layout">
					<div class="md-layout-item md-size-100">
						<div class="form-errors" v-if="errors.length">
							<div v-for="error in errors" :key="error">{{error}}</div>
						</div>
					</div>
					<div class="md-layout-item md-size-100">
						<div class="md-subheading">
							<span class="color-label">Select Colour</span>
							<v-swatches :value="color" @input="color = $event" popover-x="right"></v-swatches>
						</div>
					</div>
					<div class="md-layout-item md-size-100">
						<md-field>
							<label>Threshold Quantity</label>
							<md-input v-model="thresholdQuantity" type="number" min="0" name="thresholdQuantity" />
						</md-field>
					</div>
					<div class="md-layout-item md-size-100">
						<md-field>
							<label>Threshold Group</label>
							<md-select v-model="thresholdGroup">
								<md-option value="hour">Hours</md-option>
								<md-option value="day">Days</md-option>
								<md-option value="week">Weeks</md-option>
							</md-select>
						</md-field>
					</div>
				</div>
				<md-dialog-actions>
					<md-button type="submit" class="md-primary">Add Color</md-button>
					<md-button v-on:click="showDialog = false">Cancel</md-button>
				</md-dialog-actions>
			</form>
		</md-dialog>
	</div>
</template>

<script>
import VSwatches from 'vue-swatches'
import 'vue-swatches/dist/vue-swatches.css'

export default {
	name: 'AddColor',
	props: ['config'],
	components: {
		VSwatches
	},
	data: () => {
		return {
			showDialog: false,
			errors: [],
			color: '#E84B3D',
			thresholdGroup: 'day',
			thresholdQuantity: 7
		}
	},
	methods: {
		show: function() {
			this.showDialog = true;
		},
		changeColor: function(color) {
			this.color = color.hex;
		},
		addColor: function() {
			this.errors = [];

			if (this.errors.length == 0) {
				this.$emit('add-color', {
					hexCode: this.color,
					threshold: [
						this.thresholdQuantity,
						this.thresholdGroup
					],
				});
				
				this.showDialog = false;
				this.thresholdGroup = 7;
				this.thresholdGroup = 'day';
			}
		}
	}
}
</script>

<style scoped>
.form-padding {
	padding: 10px 30px 30px;
}

.color-label {
	vertical-align: top;
	margin-right: 30px;
	line-height: 42px;
}
</style>
