const db = require('../../models');
const Indices = db.investing_indices;

//create new instance
exports.create = (req, res) => {
    //validate inputs
    if(!req.body.index_name && !req.body.country_name && !req.body.data instanceof Array){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });
        return;
    }

    let name = req.body.index_name+"_"+req.body.country_name;

    const indices = new Indices({name: name, data: req.body.data});

    indices
        .save(indices)
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not create index records"
                });
            }else{
                res.send({
                    success: 1,
                    message: "Successfully created."
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 0,
                message: err.message || "Server error while create new index record."
            });
        });
};

//get index data
exports.getIndicesData = (req, res) => {
    //validate inputs
    if(!req.body.index_name && !req.body.country_name && !req.body.start_date && !req.body.end_date){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });
        return;
    }

    let name = req.body.index_name+"_"+req.body.country_name;

    Indices
        .find({
            "data.date" : {
                $gte : req.body.start_date,
                $lt  : req.body.end_date
            },
            "name" : name
        })
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not get indices data."
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
                message: err.message || "Server error while retrieving indices records."
            });
        });
};

//update indices data
exports.update = (req, res) => {

    //validate inputs
    if(!req.body.index_name && !req.body.country_name &&!req.body.data instanceof Array){
        res.status(400).send({
            success: 0, 
            message: 'Required fields missing.'
        });

        return;
    }

    let name = req.body.index_name+"_"+req.body.country_name;

    Indices
        .updateOne(
            {name:name},
            {$addToSet : {data: req.body.data}}
        )
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: 'Could not update index record.'
                });
            }else{
                res.send({
                    success: 1,
                    message: "Successfully updated data."
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 0,
                message: err.message || "Server error while updating indices data."
            });
        });
};

//get recent entry date
exports.getRecentEntryDate = (req, res) => {

    //validate inputs
    if(!req.body.index_name && !req.body.country_name){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });

        return;
    }

    let name = req.body.index_name+"_"+req.body.country_name;

    Indices
        .findOne({"name": name},{},{'updated_at': -1})
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not find recent entry date."
                });
            }else{
                res.send({
                    success: 1, 
                    message: "Success.",
                    data : data
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 0,
                message: err.message || "Server error while getting recent entry date for index."
            });
        });
};