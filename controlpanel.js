const path = require('path');
const express = require('express');
const configLoader = require('./config.js');

const init = (app) => {
    app.use('/', express.static('controlpanel/dist'));

    app.get('/config', (req, res) => {
        res.send(configLoader.load())
    });

    app.post('/config/color', (req, res) => {
        const data = req.body;
        const config = configLoader.load();
        res.send({
            color: config.addColor(data.hexCode, data.threshold),
            status: 'success'
        })
    });

    app.delete('/config/color/:colorId', (req, res) => {
        const config = configLoader.load();
        config.deleteColor(req.params.colorId)
        res.send({
            status: 'success'
        })
    });
}


module.exports = {
    init,
}