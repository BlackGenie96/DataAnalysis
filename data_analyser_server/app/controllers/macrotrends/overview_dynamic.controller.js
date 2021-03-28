const e = require('cors');
const db = require('../../models');
const Dynamic = db.overview_dynamic;

//create new overview dynamic
exports.create = (req, res) => {

    //validate inputs
    if(!req.body.overview_id){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });

        return;
    }

    //create new dynamic record
    const dynamic = new Dynamic(req.body);

    //save to database
    dynamic
        .save(dynamic)
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not save overview dynamic data to database."
                });
            }else{
                res.send({
                    success: 1,
                    message: "Successfully saved into database.",
                    data: data
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 0,
                message: err.message || "Server error while creating new overview dynamic data record."
            });
        });
};

//retrieve dynamic data
exports.getDynamic = (req, res) => {

    //validate overview id
    const id = req.params.id;

    if(!id){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });
        return;
    }

    //retriev data
    Dynamic
        .find({'overview_id': id})
        .populate('overview_id', '-__v -created_at -updated_at')
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not find overview dynamic data record."
                });
            }else{
                res.send({
                    success: 1,
                    message: "Successfully retrieved data.",
                    data: data
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 0,
                message: err.message || "Server error while retrieving dynamic data."
            });
        });
};

//update dynamic data
exports.updateDynamic = (req, res) => {

    //validate dynamic id
    const id = req.params.id;

    if(!id){
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
            message: "Cannot update with empty request body."
        });
        return;
    }

    //update record
    Dynamic
        .findByIdAndUpdate(id, req.body,{useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not update records in table."
                });
            }else{
                res.send({
                    success: 1,
                    message: "Successfully update record.",
                    data: data
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 0,
                message: err.message || "Server error while update records in table."
            });
        });
};

//delete dynamic record
exports.deleteDynamic = (req, res) => {

    //validate dynamic record id
    const id = req.params.id;

    if(!id){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });

        return;
    }

    //delete record
    Dynamic
        .findByIdAndRemove(id,{useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not delete record in table."
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
                succees: 0,
                message: err.message || "Server error while deleting record from table."
            });
        });
};