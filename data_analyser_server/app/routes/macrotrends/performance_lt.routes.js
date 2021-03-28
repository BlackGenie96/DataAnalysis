module.exports = app => {
    const lt = require("../../controllers/macrotrends/performance_lt.controller");
    let router = require('express').Router();

    //create new record
    router.post("/create", lt.create);

    //get record
    router.post("/get/:id", lt.getPerformance);

    //update record
    router.post("/update/:id", lt.updatePerformance);

    //delete record
    router.post("/delete/:id", lt.deletePerformance);

    app.use("/performance_lt", router);
}