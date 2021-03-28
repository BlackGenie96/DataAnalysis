module.exports = app => {
    const descriptive = require("../../controllers/macrotrends/descriptive.controller");

    let router = require("express").Router();

    //create new descriptive record
    router.post("/create", descriptive.create);

    //get descriptive record
    router.post("/get/:overview_id", descriptive.getDescriptive);

    //update descriptive record
    router.post("/update/:id", descriptive.updateDescriptive);

    //delete descriptive record
    router.post("/delete/:id", descriptive.deleteDescriptive);

    app.use("/descriptive", router);
}