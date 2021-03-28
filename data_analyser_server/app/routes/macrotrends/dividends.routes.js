module.exports = app => {
    const dividends = require("../../controllers/macrotrends/dividends.controller");
    let router = require("express").Router();

    //create new record
    router.post("/create", dividends.create);

    //get dividends records
    router.post("/get/:id",dividends.getDividends);

    //update dividends records
    router.post("/update/:id", dividends.updateDividends);

    //delete dividends record
    router.post("/delete/:id", dividends.deleteDividend);

    app.use("/dividends",router);
}