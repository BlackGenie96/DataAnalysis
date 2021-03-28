const db = require('../../models');
const IncomeRatios = db.income_ratios;

//create new income ratios record
exports.create = (req, res) => {

    //validate input
    if(!req.body.overview_id){
        res.status(400).send({
            success: 0, 
            message: "Required fields missing."
        });
        return;
    }

    const income_ratios = new IncomeRatios(req.body);

    income_ratios
        .save(income_ratios)
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not create record."
                });
            }else{
                res.send({
                    success: 1,
                    message: "Success",
                    data : data
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 0,
                message: err.message || 'Server error while creating income ratio record.'
            });
        });
};

//retrieve income ratio records
exports.getIncomerRatios = (req, res) => {
    //get overview id
    const id = req.params.id;

    //validate overview id
    if(!id){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });

        return;
    }

    IncomeRatios
        .find({'overview_id': id})
        .populate('overview_id', '-__v -created_at -updated_at')
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not find income ratio records for selected overview item."
                });
            }else{
                res.send({
                    success: 1,
                    message: "Successfully retrived income ratio data.",
                    data: data
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 0,
                message: err.message || "Server error while retrieving income ratio data."
            });
        });
};

//update income ratio record
exports.updateIncomeRatio = (req, res) => {
    //validate income ratio id
    const id = req.params.id;

    if(!id && !req.body){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });
        return;
    }

    //validate body to be updated
    if(!req.body){
        res.status(400).send({
            success: 0,
            message: "Cannot update with empty body."
        });
        return;
    }

    //update income ratio record
    IncomeRatios
        .findByIdAndUpdate(id, req.body, {useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: 'Could not update income ratios data.'
                });
            }else{
                res.send({
                    success: 1,
                    message: "Successfully updated income ratios data."
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success : 0,
                message : err.message || "Server error while updating income ratio record."
            });
        });
};

//delete income ratio record.
exports.deleteIncomeRatio = (req, res) => {
    //check income ratio id
    const id = req.params.id;
    
    if(!id){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });
        return;
    }

    //delete record
    IncomeRatios
        .findByIdAndRemove(id,{useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not delete income ratio record from database."
                });
            }else{
                res.send({
                    success: 1,
                    message: "Successfully deleted income ratio record."
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 0,
                message: err.message || "Server error while deleting income ratios records."
            });
        });
};