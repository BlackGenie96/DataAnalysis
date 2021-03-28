module.exports = app => {
    const income = require('../../controllers/macrotrends/income_ratios.controller');
    let router = require("express").Router();

    //create new record
    router.post("/create",income.create);

    //get records
    router.post("/get/:id", income.getIncomerRatios);

    //update record
    router.post("/update/:id", income.updateIncomeRatio);

    //delete record
    router.post("/delete/:id", income.deleteIncomeRatio);

    app.use("/income_ratios", router);

}