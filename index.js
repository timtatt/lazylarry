const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors())
app.use(express.json())

const hardware = require('./hardware.js');
const cloudDeakin = require('./clouddeakin.js');
const controlPanel = require('./controlpanel.js');
const configLoader = require('./config.js');

controlPanel.init(app);
cloudDeakin.initMock(app);

hardware.scanWifi(); // Scans network for all aval wifis and saves to array
wifi = hardware.getWifi(); // Array which can then be printed or displayed in any way (ONLY SSIDS ARE SAVED)


app.listen(9000, () => {
    console.log('running server on port 9000')
})
