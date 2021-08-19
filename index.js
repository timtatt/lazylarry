const app = require('express')();

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
    hardware.setColor(255, 0, 0);
    hardware.setDisplay('Oh shit, theres something due soon');
}
setTimeout(() => {
    run() //needed to make this function async so i just set a timeout here if we need to debug.
}, 10000);



app.listen(9000, () => {
    console.log('running server on port 9000')
})