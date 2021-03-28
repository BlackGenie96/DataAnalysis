const db = require('../../models');
const Descriptive = db.descriptive;

//create new descriptive record
exports.create = (req, res) => {

    //validate input
    if(!req.body.overview_id && !req.body){
        res.status(400).send({
            success: 0, 
            message: "Required fields missing."
        });
        return;
    }

    const descriptive = new Descriptive(req.body);

    descriptive
        .save(descriptive)
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
               success: 0,
               message: err.message || "Server error while creating descriptive record." 
            });
        });
};

//get descriptive data
exports.getDescriptive = (req, res) => {

    const id = req.params.overview_id;

    Descriptive
        .find({'overview_id': id})
        .populate("overview_id", "-__v -created_at -updated_at")
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not get selected record."
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
                message: err.message || "Server error while retrieving descriptive record."
            });
        });
};

//update descriptive record
exports.updateDescriptive = (req, res) => {
    //validate inputs
    if(!req.body){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });

        return;
    }

    const id = req.params.id;

    Descriptive
        .findByIdAndUpdate(id,req.body, {useFindAndModify:false})
        .then(data => {
            if(!data){
                res.status(404).send({
                    success : 0,
                    message : "Could not update selected Descriptive record."
                });
            }else{
                res.send({
                    success : 1, 
                    message : "Successfully updated Descriptive record data."
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                success : 0,
                message : err.message || "Server error while updating descriptive record relation."
            });
        });
};

//delete descriptive record
exports.deleteDescriptive = (req, res) => {

    const id = req.params.id;

    Descriptive
        .findByIdAndRemove(id,{useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not delete descriptive record."
                });
            }else{
                res.send({
                    success : 1,
                    message : "Successfully deleted descriptive record."
                });
            }
        })
        .catch(err =>{
            res.status(500).send({
                success: 0,
                message: err.message || "Server error while deleting descriptive record."
            });
        });
};