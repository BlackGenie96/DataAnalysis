module.exports = app => {
    const indices = require('../../controllers/investing/indices.controller');
    let router = require('express').Router();

    //create new instance
    router.post('/create', indices.create);

    //get data
    router.post('/get', indices.getIndicesData);

    //update data
    router.post('/update', indices.update);

    //get recent date
    router.post('/get/recent', indices.getRecentEntryDate);

    app.use('/investing/indices', router);
}