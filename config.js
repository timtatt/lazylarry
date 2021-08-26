const uuid = require('uuid').v4;
const fs = require('fs');

class DowntimeItem {
    constructor(frequency, startTime, endTime, days=[]) {
        this.id = uuid();
        this.frequency = frequency;
        this.startTime = startTime;
        this.endTime = endTime;
        this.days = days;
    }

    isDowntime() {
        switch (frequency) {
            case 'daily':
                break;
            case 'weekly':

                break;
            case 'monthly':
                break;
        }
    }

    static load(data) {
        return Object.assign(new Downtime(), data);
    }
}

class Color {
    constructor(hexCode, threshold) {
        this.id = uuid();
        this.hexCode = hexCode;
        this.threshold = threshold;
    }

    static load(data) {
        return Object.assign(new Color(), data);
    }
}

class Config {
    static filename = __dirname + '/config.json';

    downtime = {};
    colors = {};

    save() {
        fs.writeFileSync(Config.filename, JSON.stringify(this, null, 2));
    }

    addColor(hexCode, threshold) {
        const color = new Color(hexCode, threshold);
        this.colors[color.id] = color;
        this.save();
        console.log(color);
        return color;
    }

    deleteColor(colorId) {
        delete this.colors[colorId];
        this.save();
    }

    static load() {
        try {
            const rawData = fs.readFileSync(Config.filename);
            const data = JSON.parse(rawData);
            const config = new Config();

            for (var color of Object.values(data.colors)) {
                const colorObj = Color.load(color);
                config.colors[colorObj.id] = colorObj;
            }

            for (var downtime of Object.values(data.downtime)) {
                const downtimeObj = DowntimeItem.load(downtime)
                config.downtime[downtimeObj.id] = downtimeObj;
            }

            return config;

        } catch (exc) {
            return new Config();
        }
    }
}

module.exports = {
    load: Config.load,
    Color,
    DowntimeItem
}
