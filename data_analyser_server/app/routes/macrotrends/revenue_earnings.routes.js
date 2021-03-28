module.exports = app =>{
    const earnings = require("../../controllers/macrotrends/revenue_earnings.controller");
    let router = require("express").Router();

    //create new record
    router.post("/create", earnings.create);

    //get records
    router.post("/get/:id", earnings.getEarnings);

    //update record
    router.post("/update/:id", earnings.updateEarnings);

    //delete record
    router.post("/delete/:id", earnings.deleteEarnings);

    app.use("/revenue_earnings", router);
}