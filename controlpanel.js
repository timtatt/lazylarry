const path = require('path');
const express = require('express');
const configLoader = require('./config.js');

const init = (app) => {
	app.use('/controlpanel', express.static('controlpanel/dist'));

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

	app.post('/config/downtime', (req, res) => {
		const data = req.body;
		const config = configLoader.load();
		res.send({
			downtime: config.addDowntime(data.days, data.startTime, data.endTime),
			status: 'success'
		})
	});


	app.delete('/config/downtime/:downtimeId', (req, res) => {
		const config = configLoader.load();
		config.deleteDowntime(req.params.downtimeId)
		res.send({
			status: 'success'
		})
	});
}


module.exports = {
	init,
}