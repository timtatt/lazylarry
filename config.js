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

    downtime = [];
    colors = [];

    save() {
        fs.writeFileSync(Config.filename, JSON.stringify(this, null, 2));
    }

    static load() {
        try {
            const rawData = fs.readFileSync(Config.filename);
            const data = JSON.parse(rawData);
            const config = new Config();
            
            for (var color of data.colors) {
                config.colors.push(Color.load(color));
            }

            for (var downtime of data.downtime) {
                config.downtime.push(Downtime.load(downtime));
            }

            console.log(config);
            return config;

        } catch (exc) {
            return new Config();
        }
    }
}

var config = Config.load();
config.save();
