const db = require('../../models');
const DebitRatios = db.debt_ratios;

//create new debit ratio record
exports.create = (req, res) => {

    //validate request
    if(!req.body){
        res.status(400).send({
            success: 0, 
            message: "Required fields missing."
        });

        return;
    }

    const debt_ratio = new DebitRatios(req.body);

    debt_ratio
        .save(debt_ratio)
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not create new debt ratio record."
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
                message: err.message || "Server error while creating debt ratio data."
            });
        });
};

//get debt_ratio data
exports.getDebtRatio = (req, res) => {

    overview_id = req.params.overview_id;

    DebtRatio
        .find({'overview_id': overview_id})
        .populate("overview_id","-__v -updated_at")
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not create new record."
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
                success : 0,
                message : err.message || "Server error while retrieving debt ratio data"
            });
        });
};

//update debt_ratio data
exports.updateDebtRatio = (req, res) => {

    //validate inputs
    if(!req.body){
        res.status(400).send({
            message : "Required fields missing.",
            success : 0
        });

        return;
    }

    const id = req.params.db_ratio_id;

    DebtRatio
        .findByIdAndUpdate(id, req.body, {useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({
                    success : 0,
                    message : 'Cannot update debit ratio record.'
                });
            }else{
                res.send({
                    success: 1,
                    message: "Successfully updated debit ratio record."
                });
            }
        })
        .catch(err => {
            res.status(505).send({
                success : 0,
                message : err.message || "Server error while updating debit record"
            });
        }); 
};

//delete debit ratio record
exports.deleteDebitRatio = (req, res) => {
    const id = req.params.id;
    
    DebtRatio
        .findByIdAndRemove(id, {useFindAndModify:false})
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not delete selected debit ratio recored."
                });
            }else{
                res.send({
                    success: 1,
                    message: "Successfully deleted debit ratio record."
                });
            }      
        })
        .catch(err => {
            res.status(500).send({
                success: 0,
                message: err.message || "Server error while deleting debit ratio."
            });
        });
};