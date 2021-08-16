<template>
    <form id="add-color" v-on:submit.prevent="addColor">
        <div class="form-errors" v-if="errors.length">
            <div v-for="error in errors" :key="error">{{error}}</div>
        </div>
        {{color}}
        <div class="preview" style="width:20px;height:20px;" v-bind:style="{backgroundColor:color}"></div>
        <input type="text"  name="hexCode" v-model="color" />
        <input type="number" min="0" name="thresholdQuantity" />
        <select name="thresholdGroup">
            <option value="hour">Hours</option>
            <option value="day">Days</option>
            <option value="week">Weeks</option>
        </select>
        <button type="submit">Add Color</button>
    </form>
</template>

<script>
export default {
    name: 'AddColor',
    props: ['config'],
    data: () => {
        return {
            errors: [],
            color: '#F8F8F8',
        }
    },
    methods: {
        addColor: function(event) {
            const formData = event.target.elements;
            this.errors = [];

            if (!/^#[0-9A-F]{6}$/i.test(formData.hexCode.value)) {
                this.errors.push('Not a valid color hexcode');
            }

            if (this.errors.length == 0) {
                axios.post(apiUri + '/config/color', {
                    hexCode: formData.hexCode.value,
                    threshold: [
                        formData.thresholdQuantity.value,
                        formData.thresholdGroup.value
                    ],
                }).then(response => {
                    this.$set(this.config.colors, response.data.color.id, response.data.color)
                });
                event.target.reset();
            }
        }
    }
}
</script>

<style scoped>

</style>
