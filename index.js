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

setInterval(() => {
    const config = configLoader.load();

    console.log('Checking for changes to assigment deadlines');

    assignmentDeadlines = cloudDeakin.getAssignmentDeadlines();
    
    // some logic here

    hardware.setColor(255, 0, 0);
    hardware.setDisplay('Oh shit, theres something due soon');

}, 10000);


app.listen(9000, () => {
    console.log('running server on port 9000')
})