module.exports = app => {
    const commodities = require('../../controllers/investing/commodities.controller');
    let router = require('express').Router();

    //create new instance
    router.post('/create', commodities.create);

    //get data
    router.post('/get', commodities.getCommoditiesData);

    //update data
    router.post('/update', commodities.update);

    //get recent entry date
    router.post('/get/recent', commodities.getRecentEntryDate);

    app.use('/investing/commodities', router);
}