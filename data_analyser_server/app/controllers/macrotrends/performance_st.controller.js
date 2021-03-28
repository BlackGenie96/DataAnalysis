const db = require('../../models');
const PerformanceSt = db.performance_st;

//create new short term performance record
exports.create = (req, res) => {

    //validate inputs
    if(!req.body.overview_id){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });

        return;
    }

    //create performance record.
    const performance = new PerformanceSt(req.body);

    performance
        .save(performance)
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not create record."
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
                message: err.message || "Server error while creating new performance record."
            });
        });
};

//retrieve performance record based on overview id selection.
exports.getPerformance = (req, res) => {

    //validate overview id
    const id = req.params.id;

    if(!id){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });
        return; 
    }

    //get performance record
    PerformanceSt
        .find({'overview_id': id})
        .populate("overview_id", "-__v -created_at -updated_at")
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not find performance record for selected overview id."
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
                message: err.message || "Server error while retrieving performance data."
            });
        });
};

//update performance record
exports.updatePerformance = (req, res) => {
    //validate inputs
    //check performance st id
    const id = req.params.id;

    if(!id){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });
        return;
    }

    if(!req.body){
        res.status(400).send({
            success: 0, 
            message: "Cannot update with empty parameters."
        });

        return;
    }

    //update record
    PerformanceSt
        .findByIdAndUpdate(id, req.body, {useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not update record for selected id."
                });
            }else{
                res.send({
                    success: 1,
                    message: "Successful.",
                    data: data
                });
            }
        })
        .catch(err =>{
            res.status(500).send({
                success: 0,
                message: err.message || "Server error while updating performance data."
            });
        });
};

//delete performance record
exports.deletePerformance = (req, res) => {
    //validate inputs
    //check performance id
    const id = req.params.id

    if(!id){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });
        return;
    }

    PerformanceSt
        .findByIdAndRemove(id,{useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not delete performace record from table."
                });
            }else{
                res.send({
                    success: 1,
                    message: "Successfully deleted record."
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 0,
                message: err.message || "Server error while deleting record."
            });
        });
}