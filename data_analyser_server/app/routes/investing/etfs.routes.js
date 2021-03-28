module.exports = app => {
    const etfs = require('../../controllers/investing/etfs.controller');
    let router = require('express').Router();

    //create new instance
    router.post('/create',etfs.create);

    //get data
    router.post('/get', etfs.getEtfsData);

    //update data
    router.post('/update', etfs.update);

    //get recent date
    router.post('/get/recent', etfs.getRecentEntryDate);

    app.use('/investing/etfs', router);
}