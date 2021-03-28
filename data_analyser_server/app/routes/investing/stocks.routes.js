module.exports = app => {
    const stocks = require("../../controllers/investing/stocks.controller");
    let router = require('express').Router();

    //create new instance of stock 
    router.post('/create', stocks.create);

    //retrieve specified data
    router.post('/get', stocks.getStockData);

    //update existing instances of stocks
    router.post('/update', stocks.update);

    //get recent date
    router.get('/get/recent',stocks.getRecentEntryDate);

    app.use('/investing/stocks', router);
}