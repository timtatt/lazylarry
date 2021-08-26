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
            avalWifi[i] = ssids[i].ssid; // Saves only ssid of network found
        }
        console.log(ssids.ssid); // Logs network ssids
    })
    .catch((error) => {
         // If any errors pop up, logged to console
        console.log(error);
    });
};  
const ws281x = require('rpi-ws281x-native');
const options = {
    dma: 10, // Drivers data-transport for led
    freq: 800000, // Frequency for signal to led (800kHz for ws2812/sk6812 LEDs)
    gpio: 18, // Which pin led is connected on the raspberry pi
    invert: false, // Invertion of output ( needed when level-shifting) (NOT USED)
    brightness: 255, // Brightness of individual leds
    stripType: ws281x.stripType.WS2812
  };
// (num of leds, number of settings (above))
const channel = ws281x(100, options);
const colors = channel.array;
// returns void
const setColor = (hexVal) => {
    colors[99] = hexVal; // Sets all leds to specified colour
    ws281x.render(); // Renders the colour to the leds
};      

const getWifi = () => avalWifi; // Sends wifi array that was created earlier


module.exports = {
    setColor,
    getWifi,
    scanWifi
}