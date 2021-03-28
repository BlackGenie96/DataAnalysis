module.exports = app => {
    const debt = require("../../controllers/macrotrends/debt_ratios.controller");

    let router = require('express').Router();

    //create new debt ratio
    router.post("/create", debt.create);

    //get debt ratio
    router.post("/get/:overview_id",debt.getDebtRatio);

    //update debt ratio
    router.post("/update/:db_ratio_id", debt.updateDebtRatio);

    //delete debt ratio
    router.post("/delete/:id", debt.deleteDebitRatio);

    app.use("/debt_ratio",router);
}