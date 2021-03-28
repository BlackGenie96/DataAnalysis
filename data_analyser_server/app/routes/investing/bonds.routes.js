module.exports = app => {
    const bonds = require('../../controllers/investing/bonds.controller');
    let router = require('express').Router();

    //create new instance
    router.post('/create', bonds.create);

    //get data
    router.post('/get', bonds.getBondsData);

    //update data
    router.post('/update', bonds.update);

    //get recent entry date
    router.post('/get/recent')

    app.use('/investing/bonds',router);
}