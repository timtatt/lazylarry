const path = require('path');

const init = (app) => {
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, './controlpanel/index.html'));
    });
}

const getConfig = () => {
    /*
    returns an object of config
    */
}

module.exports = {
    init,
    getConfig
}