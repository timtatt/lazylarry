<template>
  <md-field>
    <md-select
    v-bind:value="value"
    v-bind:placeholder="placeholder"
    v-on:input="$emit('input', $event)">
      <md-option 
      v-for="option in options"   
      :key="option"
      :value="option">
      {{option}}
      </md-option>
    </md-select>
  </md-field>
</template>

<script>
import moment from 'moment';

export default {
  name: "Timepicker",
  props: [
    'value',
    'placeholder'
  ],
  data: () => {
    return {
      options: [],
    };
  },
  mounted: function() {
    const endTime = moment("2021-08-24T23:59:59");
    const currentTime = moment("2021-08-24T00:00:00");

    this.options = [];
    while (currentTime.diff(endTime) < 0) {
      this.options.push(currentTime.format('hh:mm a'))
      currentTime.add(30, 'minutes');
    }
  },
};
</script>