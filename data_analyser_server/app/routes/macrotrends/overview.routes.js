module.exports = app => {
    const overview = require('../../controllers/macrotrends/overview.controller');
    let router = require('express').Router();

    //create new record
    router.post("/create", overview.create);

    //get records
    router.post("/get/:id", overview.getOverview);

    //update record
    router.post("/update/:id", overview.updateOverview);

    //delete record
    router.post("/delete/:id", overview.deleteOverview);

    //delete all
    router.post("/delete_all/:id", overview.deleteAll);

    app.use("/overview",router);
}