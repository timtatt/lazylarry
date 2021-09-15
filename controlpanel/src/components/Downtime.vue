<template>
  <md-table>
    <md-table-row>
      <md-table-head>Frequency</md-table-head>
      <md-table-head>Start Time</md-table-head>
      <md-table-head>End Time</md-table-head>
      <md-table-head>Actions</md-table-head>
    </md-table-row>
    <md-table-row
      v-for="(downtime, downtimeId) in config.downtime"
      :key="downtimeId"
    >
      <md-table-cell>{{ downtime.days.join(", ") }}</md-table-cell>
      <md-table-cell>{{ downtime.startTime }}</md-table-cell>
      <md-table-cell>{{ downtime.endTime }}</md-table-cell>
      <md-table-cell>
				<md-button class="md-icon-button md-primary" @click="deleteDowntime(downtimeId)">
            <md-icon>delete_outline</md-icon>
        </md-button>
			</md-table-cell>
    </md-table-row>
    <md-table-row>
      <md-table-cell>
        <md-field>
          <md-select
            v-model="frequencyForm.days"
            placeholder="Frequency"
            multiple
          >
            <md-option
              v-for="day in [
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
              ]"
              :key="day"
              :value="day"
              >{{day}}</md-option
            >
          </md-select>
        </md-field>
      </md-table-cell>
      <md-table-cell>
        <timepicker
          placeholder="Start Time"
					name="startTime"
          v-model="frequencyForm.startTime"
        />
      </md-table-cell>
      <md-table-cell>
        <timepicker 
					placeholder="End Time" 
					name="endTime"
					v-model="frequencyForm.endTime" />
      </md-table-cell>
      <md-table-cell>
        <md-button 
				class="md-raised md-primary" 
				@click="addDowntime"
				:disabled="!isFormValid()"
          >Add</md-button>
      </md-table-cell>
    </md-table-row>
  </md-table>
</template>

<script>
import Timepicker from "./Timepicker.vue";

export default {
  name: "Downtime",
	props: ['config'],
  components: {
    Timepicker
  },
  data: () => {
    return {
      frequencyForm: {
        days: [],
        startTime: "",
        endTime: "",
      },
    };
  },
	methods: {
		deleteDowntime: function(downtimeId) {
			this.$emit('delete-downtime', downtimeId);
		},
		isFormValid: function() {
			return this.frequencyForm.days.length > 0 && this.frequencyForm.startTime != '' && this.frequencyForm.endTime != '';
		},
		addDowntime: function() {
			if (this.isFormValid()) {
				this.$emit('add-downtime', this.frequencyForm);
				this.frequencyForm = {
					days: [],
					startTime: '',
					endTime: '',
				}
			}
    }
	}
};
</script>