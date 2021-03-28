module.exports = app => {
    const st = require('../../controllers/macrotrends/performance_st.controller');
    let router = require('express').Router();

    //create new record
    router.post("/create", st.create);

    //get records
    router.post("/get/:id", st.getPerformance);

    //update record
    router.post("/update/:id", st.updatePerformance);

    //delete record
    router.post("/delete:id", st.deletePerformance);

    app.use("/performance_st", router);
}