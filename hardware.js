var Wifi = require('rpi-wifi-connection');
var wifi = new Wifi();
var express = require('express');
var app = express();
var avalWifi = [];

// Scans wifi and saves all to array for later
const scanWifi = () => {
    wifi.scan().then((ssids) => {
        // Creates array with ssids to pass
        for(i=0;i<ssids.length-1;i++){
            // Saves only ssid and signal level of network found
            avalWifi[i] = [ssids[i].ssid, ssids[i].signalLevel]; 
        }
        console.log(avalWifi); // Logs network ssids
        for(i=0;i<avalWifi.length;i++){
            console.log(avalWifi[i][1]);
            console.log(avalWifi[i][1] <= -30);
            if(avalWifi[i][1] >= -30){
            avalWifi[i][1] = 3; // Three bars
            }
            else if(avalWifi[i][1] <= -31 && avalWifi[i][1] >= -70){
                avalWifi[i][1] = 2; // Two bars
            }
            else if(avalWifi[i][1] <= -71){
                avalWifi[i][1] = 1; // One bars
            }
        }
        console.log(avalWifi);
    })
    .catch((error) => {
         // If any errors pop up, logged to console
        console.log(error);
    });
};


var ws281x = require('rpi-ws281x');
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
        this.config.stripType = 'rgb';

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
const setColor = (hexVal) => {
    var setColor = new LED();
    setColor.run(hexToRgb(hexVal)); // Sets all leds to specified colour // Renders the colour to the leds
};      

const getWifi = () => avalWifi; // Sends wifi array that was created earlier

app.get('/settings', function (req, res) {
    res.send(avalWifi);
});

const connWifi = (ssid, psk) => {
    // 60 Second timeout (can be reduced)
    wifi.connect({ssid: ssid, psk: psk}).then(() => {
        console.log('Connected to network.');
    })
    .catch((error) => {
        console.log(error);
    });
};




module.exports = {
    setColor,
    getWifi,
    scanWifi,
    connWifi
}