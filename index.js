const app = require('express')();

const hardware = require('./hardware.js');
const cloudDeakin = require('./clouddeakin.js');
const controlPanel = require('./controlpanel.js');

controlPanel.init(app);
cloudDeakin.initMock(app);

setInterval(() => {
    console.log('Checking for changes to assigment deadlines');

    assignmentDeadlines = cloudDeakin.getAssignmentDeadlines();
    
    config = controlPanel.getConfig();

    // some logic here

    hardware.setColor(255, 0, 0);
    hardware.setDisplay('Oh shit, theres something due soon');

}, 10000);


app.listen(9000, () => {
    console.log('running server on port 9000')
})