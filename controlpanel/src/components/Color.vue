<template>
    <div class="color">
        {{color.hexCode}}
        {{color.threshold[0]}}
        {{color.threshold[1]}}
        <button v-on:click="deleteColor">Delete</button>
    </div>
</template>

<script>
export default {
    name: 'Color',
    props: ['color'],
    methods: {
        deleteColor: function() {
            axios.delete(this.apiUri + '/config/color/' + this.color.id).then(() => {
                this.$emit('delete-color');
            });
        }
    }
}
</script>