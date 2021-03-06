const isLinux = process.platform == 'linux'

if (isLinux) {
	var Wifi = require('rpi-wifi-connection');
	var wifi = new Wifi();
} else {
	var wifi = require('node-wifi');
	wifi.init({
		iface: null
	});
}

var avalWifi = [];

const init = async app => {
	scanWifi();
	app.get('/wifi/networks', function (req, res) {
		console.log(avalWifi);
		res.send(avalWifi);
	});

	app.post('/wifi/connect', function (req, res) {
		const {ssid, password} = req.body;
		// Connect to wifi here
		return connWifi(ssid, password);
		
	});

	app.get('/wifi/status', function (req, res) {
		isConnected().then(connected => {
			res.send({
				connected
			});
		})
	});
}

const isConnected = async () => {
	var connected;
	if (isLinux) {
		connected = await wifi.getState();
	} else {
		connections = await wifi.getCurrentConnections();
		connected = connections.length > 0 && connections[0].ssid != '';
	}
	return connected;
}

// Scans wifi and saves all to array for later
const signalLevelToStrength = level => {
	if (level >= -30) {
		return 3; // Three bars
	} else if (level >= -70) {
		return 2; // Two bars
	} else if (level <= -71) {
		return 1; // One bars
	}
}

const scanWifi = () => {
		if (isLinux) {
			wifi.scan().then((networks) => {
					// Saves only ssid and signal level of network found
					avalWifi = networks.map(network => [network.ssid, signalLevelToStrength(network.signalLevel)])
					console.log(avalWifi);
			})
			.catch((error) => {
					// If any errors pop up, logged to console
					console.log(error);
			});
		} else {
			wifi.scan((error, networks) => {
				if (error) {
					console.error(error)
				} else {
					avalWifi = networks.map(network => [network.ssid, signalLevelToStrength(network.signal_level)])
				}
			})
		}
};


if (isLinux) {
	var ws281x = require('rpi-ws281x');
}

class LED {

    constructor() {
        this.config = {};

        // Number of leds in my strip
        this.config.leds = 60;

        // Use DMA 10 (default 10)
        this.config.dma = 10;

        // Set full brightness, a value from 0 to 255 (default 255)
        this.config.brightness = 255;

        // Set the GPIO number to communicate with the Neopixel strip (default 18)
        this.config.gpio = 18;

        // The RGB sequence may vary on some strips. Valid values
        // are "rgb", "rbg", "grb", "gbr", "bgr", "brg".
        // Default is "rgb".
        // RGBW strips are not currently supported.
        this.config.stripType = 'grb';

        // Configure ws281x
        ws281x.configure(this.config);
    }

    run(red, green, blue) {
        // Create a pixel array matching the number of leds.
        // This must be an instance of Uint32Array.
        var pixels = new Uint32Array(this.config.leds);

        // Create a fill color with red/green/blue.
        var color = (red << 16) | (green << 8)| blue;

        for (var i = 0; i < this.config.leds; i++)
            pixels[i] = color;

        // Render to strip
        ws281x.render(pixels);
    }
    
};

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

// returns void
let color = new LED();
const setColor = (hexVal) => {
	let val = hexToRgb(hexVal);
	color.run(val.r, val.g, val.b); // Sets all leds to specified colour // Renders the colour to the leds

};       

const getWifi = () => avalWifi; // Sends wifi array that was created earlier

const connWifi = (ssid, psk) => {
    // 60 Second timeout (can be reduced)
    wifi.connect({ssid: ssid, psk: psk}).then(() => {
        const success = true;
		console.log('Connected to network.');
		return success;
    })
    .catch((error) => {
		const success = false;
        console.log(error);
		return success;
    });
};

module.exports = {
    setColor,
    getWifi,
    scanWifi,
		init,
    connWifi
}