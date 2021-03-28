module.exports = app => {

    const dynamic = require("../../controllers/macrotrends/overview_dynamic.controller");
    let router = require('express').Router();

    //create new record.
    router.post("/create", dynamic.create);

    //get records
    router.post("/get/:id", dynamic.getDynamic);

    //update record
    router.post("/update/:id", dynamic.updateDynamic);

    //delete record
    router.post("/delete/:id", dynamic.deleteDynamic);

    app.use("/overview_dynamic", router);
}