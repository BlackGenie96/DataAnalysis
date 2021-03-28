const db = require('../../models');
const Overview = db.overview;

//create new overview
exports.create = (req, res) =>{

    //validate request
    if(!req.body.stock_name && !req.body.ticker && !req.body.industry && !req.body.market_cap){
        res.status(400).send({
            message: "Required fields missing.",
            success: 0 
        });

        return;
    }

    //create new overview
    const overview = new Overview(req.body);

    overview
        .save(overview)
        .then(data =>{
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not create new record."
                });
            }else{
                res.send({
                    data: data,
                    success: 1,
                    message: "Success."
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 0,
                message: err.message || "Error creating overview data."
            });
        });
};

//get overview data
exports.getOverview = (req, res) => {

    const id = req.params.id;
    
    Overview
        .find({"overview_id": id})
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not retrieve records."
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
                success : 0,
                message : err.message || "Error retrieving overview data."
            });
        });
};

//update overview data
exports.updateOverview = (req, res) => {

    //validate input
    if(!req.body){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });
        return;
    }

    const id = req.params.id;

    Overview
        .findByIdAndUpdate(id, req.body, {useFindAndModify:false})
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Cannot update overview data."
                });
            }else{
                res.send({
                    success: 1,
                    message: "Successfully update overview data."
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 0,
                message: err.message || "Error updating overview data."
            });
        });
};

//delete overivew data
exports.deleteOverview = (req, res) => {

    const id = req.params.id;

    Overview
        .findByIdAndRemove(id,{useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Cannot delete overview data"
                });
            }else{
                res.send({
                    success: 1,
                    message: "Successfully deleted overview data"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success : 0,
                message : err.message || "Error deleting overview data"
            });
        });
};

//delete all overview data
exports.deleteAll = (req, res) => {

    Overview.deleteMany({},{useFindAndModify:false})
        .then(data => {
            res.send({
                success : 1,
                message : `${data.deletedCount} Overview records deleted.`
            });
        })
        .catch(err => {
            res.status(500).send({
                success: 0,
                message: err.message || "Server error occured while deleting Overview data."
            });
        });
};

//save table data into external file for later referencing