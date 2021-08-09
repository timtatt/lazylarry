const path = require('path');
const express = require('express');

const init = (app) => {
    app.use('/controlpanel', express.static('controlpanel/resources'))

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, './controlpanel/index.html'));
    });
}


module.exports = {
    init,
}