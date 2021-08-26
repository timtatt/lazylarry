<template>
    <md-list-item>
        <div class="md-color-preview md-elevation-1" v-bind:style="{backgroundColor:color.hexCode}"></div>
        <span class="md-list-item-text">{{color.threshold[0]}} {{color.threshold[1]}}</span>
        <md-button class="md-icon-button md-primary" v-on:click="deleteColor">
            <md-icon>delete_outline</md-icon>
        </md-button>
    </md-list-item>
</template>

<script>
export default {
    name: 'Color',
    props: ['color'],
    methods: {
        deleteColor: function() {
            this.$emit('delete-color', this.color.id);
        }
    }
}
</script>

<style scoped>
.md-color-preview {
    border-radius: 50%;
    height: 40px;
    width: 40px;
    margin-right: 25px;
}
</style>