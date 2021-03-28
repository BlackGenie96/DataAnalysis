module.exports = app => {
    const funds = require('../../controllers/investing/funds.controller');
    let router = require("express").Router();

    //create new instance
    router.post('/create', funds.create);

    //get records
    router.post('/get', funds.getFundsData);

    //update records
    router.post('/update', funds.update);

    //get recent date
    router.post('/get/recent', funds.getRecentEntryDate);

    app.use('/investing/funds', router);
}