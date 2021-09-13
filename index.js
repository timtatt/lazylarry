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

let run = async () => {

    const config = configLoader.load();

    console.log('Checking for changes to assigment deadlines');

    let assignmentDeadlines = await cloudDeakin.getAssignmentDeadlines();
    if (assignmentDeadlines) {
        console.log(assignmentDeadlines)
    }
    // some logic here
    hardware.setColor("52EA02"); // Works off hex val
    hardware.scanWifi(); // Scans network for all aval wifis and saves to array
    wifi = hardware.getWifi(); // Array which can then be printed or displayed in any way (ONLY SSIDS and SIGNAL LEVEL ARE SAVED)
}
setTimeout(() => {
    run() //needed to make this function async so i just set a timeout here if we need to debug.
}, 10000);



app.listen(9000, () => {
    console.log('running server on port 9000')
})
