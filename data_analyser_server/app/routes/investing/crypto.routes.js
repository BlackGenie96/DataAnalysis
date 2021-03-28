module.exports = app => {
    const crypto = require('../../controllers/investing/crypto.controller');
    let router = require('express').Router();

    //create new instance 
    router.post('/create', crypto.create);
    
    //get data
    router.post('/get', crypto.getCryptoData);

    //update data
    router.post('/update', crypto.update);

    //get recent entry date
    router.post('/get/recent', crypto.getRecentEntryDate);

    app.use('/investing/crypto', router);
}