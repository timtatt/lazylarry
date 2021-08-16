const apiUri = 'http://localhost:9000';
Vue.component('color', {
    props: ['color'],
    template: `
        <div class="color">
            {{color.hexCode}}
            {{color.threshold[0]}}
            {{color.threshold[1]}}
            <button v-on:click="deleteColor">Delete</button>
        </div>
    `,
    methods: {
        deleteColor: function() {
            axios.delete(apiUri + '/config/color/' + this.color.id).then(response => {
                this.$emit('delete-color');
            });
        }
    }
});

Vue.component('add-color', {
    props: ['config'],
    data: () => {
        return {
            errors: [],
            color: '#F8F8F8',
        }
    },
    template: `
        <form id="add-color" v-on:submit.prevent="addColor">
            <div class="form-errors" v-if="errors.length">
                <div v-for="error in errors">{{error}}</div>
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
    `,
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
})

var app = new Vue({
    el: '#app',
    data: () => {
        return {
            config: {
                colors: {},
                downtime: {},
            }
        }
    },
    mounted() {
        axios.get(apiUri + '/config')
            .then(response => this.config = response.data);
    },
    methods: {
        addColor: function(color) {
            console.log(color); 
            this.config.colors[color.id] = color;
        }
    }
})