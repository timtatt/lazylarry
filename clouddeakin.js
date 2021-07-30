// To initialise endpoints which mock brightspace API
const initMock = (app) => {
    app.get('/d2l/api/1.33/1031159/dropbox/folders/', (req, res) => {
        res.send({
            mockEndpoint: true
        });
    });
}

const getAssignmentDeadlines = () => {
    /*
    returns

    [
        {
            unitCode: string,
            unitName: string,
            assignmentName: string,
            dueDate: Date,
            submitted: boolean,
        }
    ]
    */
}



module.exports = {
    initMock,
    getAssignmentDeadlines,
}