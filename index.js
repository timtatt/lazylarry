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
hardware.init(app);

app.listen(9000, () => {
    console.log('running server on port 9000')
})
