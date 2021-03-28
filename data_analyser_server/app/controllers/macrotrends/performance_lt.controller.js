const db = require('../../models');
const PerformanceLt = db.performance_lt;

//create new long term performance record
exports.create = (req, res) => {

    //validate inputs
    if(!req.body.overview_id){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });
        return;
    }

    const performance = new PerformanceLt(req.body);

    performance
        .save(performance)
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not create new record."
                });
            }else{
                res.send({
                    success:1,
                    message:"Successuly added record.",
                    data : data
                });
            }
        })
        .catch(err =>{
            res.status(500).send({
                success: 0,
                message: err.message || "Server error while creating new record."
            });
        });
};

//retrieve performance records
exports.getPerformance = (req, res) => {

    //validate inputs
    //check overview id
    const id = req.params.id;

    if(!id){
        res.status(400).send({
            success: 0,
            message: "Required fields missings."
        });
        
        return;
    }

    PerformanceLt
        .find({'overview_id': id})
        .populate("overview", "-__v -create_at -updated_at")
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not find records for selected overview item."
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
    //check performance id 
    const id = req.params.id;

    if(!id){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });
        
        return;
    }

    //check body data
    if(!req.body){
        res.status(400).send({
            success: 0,
            message: "Cannot update with empth parameters."
        });
        return;
    }

    //update record
    PerformanceLt
        .findByIdAndUpdate(id, req.body, {useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not update record in database."
                });
            }else{
                res.send({
                    success: 0, 
                    message: "Success.",
                    data: data
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 0,
                message: err.message || "Server error while updating performance record."
            });
        });
};

//delete performance
exports.deletePerformance = (req, res) => {
    //validate inputs
    //check performance id
    const id = req.params.id;

    if(!id){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });

        return;
    }

    PerformanceLt
        .findByIdAndRemove(id,{useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not delete selected performance record."
                });
            }else{
                res.send({
                    success: 1,
                    message: "Successfully deleted."
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 0,
                message: err.message || "Server error while deleting record."
            });
        });
};