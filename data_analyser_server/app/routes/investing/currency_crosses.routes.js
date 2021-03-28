module.exports = app => {
    const currency = require('../../controllers/investing/currency_crosses.controller');
    let router = require('express').Router();

    //create a new instance
    router.post('/create', currency.create);

    //retrieve currency cross data
    router.post('/get', currency.getCurrencyData);

    //update records
    router.post('/update', currency.update);

    //get recent entry date
    router.post('/get/recent', currency.getRecentEntryDate);

    app.use('/investing/currency_crosses',router);
}