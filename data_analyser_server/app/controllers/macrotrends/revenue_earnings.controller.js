const db = require('../../models');
const RevenueEarnings = db.revenue_earnings;

//create new revenue earnings record
exports.create = (req, res) => {
    //validate inputs
    if(!req.body.overview_id){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });
        return;
    }

    const revenue = new RevenueEarnings(req.body);

    revenue
        .save(revenue)
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not create new record."
                });
            }else{
                res.send({
                    success: 1,
                    message: "Success creating record.",
                    data: data
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 0,
                message: err.message || "Server error while creating new record."
            });
        });
};

//retrieve revenue earnings record
exports.getEarnings = (req, res) => {
    //validate inputs
    //check overview_id
    const id = req.params.id;

    if(!id){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });
        return;
    }

    RevenueEarnings
        .find({"overview_id" : id})
        .populate("overview_id", "-__v -created_at -updated_at")
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not find revenue earning for overview selected."
                });
            }else{
                res.send({
                    success: 1,
                    message: "Successfully retrieved.",
                    data: data
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 0,
                message: err.message || "Server error while retrieving records."
            });
        });
};

//update revenue earnings data
exports.updateEarnings = (req, res) => {
    //validate inputs
    //check earnings id
    const id = req.params.id;

    if(!id){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });
        return;
    }

    //check body
    if(!req.body){
        res.status(400).send({
            success: 0,
            message: "Cannot update with empty parameters."
        });
        return;
    }

    RevenueEarnings
        .findByIdAndUpdate(id, req.body, {useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not update selected record."
                });
            }else{
                res.send({
                    success: 1,
                    message: "Success.",
                    data: data
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 0,
                message: err.message || "Server error while updating records."
            });
        });
};

//delete revenue earnings.
exports.deleteEarnings = (req, res) => {
    //validate inputs
    const id = req.params.id;
    
    if(!id){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });
        return;
    }

    RevenueEarnings
        .findByIdAndRemove(id, {useFindAndModity: false})
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not delete selected record."
                });
            }else{
                res.send({
                    success: 1, 
                    message: "Successful.",
                    data: data
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 0,
                message: err.message || "Server error while deleting selected record."
            });
        });
};