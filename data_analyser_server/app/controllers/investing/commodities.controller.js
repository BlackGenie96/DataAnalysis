const db = require('../../models');
const Commodities = db.investing_commodities;

//create new instance
exports.create = (req, res) => {
    ///validate inputs
    if(!req.body.commodity_name && !req.body.data instanceof Array){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });
        return;
    }

    const commodities = new Commodities({name: req.body.commodity_name, data : req.body.data});

    commodities
        .save(commodities)
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not create new commodities records."
                });
            }else{
                res.send({
                    success: 1,
                    message: "Successfully created commodities data"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
               success: 0,
               message: err.message || "Server error while creating commodities record." 
            });
        });
};

//retrieve commodities data
exports.getCommoditiesData = (req, res) => {    
    //validate inputs
    if(!req.body.commodity_name && !req.body.start_date && !req.body.end_date){
        res.status(400).send({
            success: 0, 
            message: "Required fields missing."
        });

        return;
    }

    Commodities
        .find({
            "name" : req.body.commodity_name,
            "data.date" : {
                $gte: req.body.start_date,
                $lte: req.body.end_date
            }
        })
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0, 
                    message: "Could not retrieve commodities date"
                });
            }else{
                res.send({
                    success: 1,
                    message: "Success",
                    data: data
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 0,
                message: err.message || "Server error while retrieving commodities records."
            });
        });
};

//update data
exports.update = (req, res) => {
    //validate inputs
    if(!req.body.commodity_name && !req.body.data instanceof Array){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });
        return;
    }

    Commodities
        .updateOne(
            {name: req.body.commodity_name},
            {$addToSet: {data: req.body.data}}
        )
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not update commodities records."
                });
            }else{
                res.send({
                    success: 1,
                    message: "Successfully updated commodities records."
                });
            }
        })
        .catch(err =>{
            res.status(500).send({
                success: 0,
                message: err.message || "Server error while updating commodities records."
            });
        });
};

//get recent entry date
exports.getRecentEntryDate = (req, res) => {

    //validate inputs
    if(!req.body.commodity_name){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });

        return;
    }

    let name = req.body.commodity_name;

    Commodities
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
                message: err.message || "Server error while getting recent entry date for bonds."
            });
        });
};