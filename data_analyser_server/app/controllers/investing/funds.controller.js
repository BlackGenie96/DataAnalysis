const db = require('../../models');
const Funds = db.investing_funds;

//create new instance
exports.create = (req, res) => {

    //validate inputs
    if(!req.body.fund_name && !req.body.country_name && !req.body.data instanceof Array){
        res.status(400).send({
            success: 0, 
            message: "Required fields missing."
        });

        return;
    }

    //clean inputs
    let name = req.body.fund_name+"_"+req.body.country_name;

    const funds = new Funds({name: name, data: req.body.data});

    funds
        .save(funds)
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not create new funds record."
                });
            }else{
                res.send({
                    success: 1,
                    message: 'Success.'
                });
            }
        })
        .save(err => {
            res.status(500).send({
                success: 0,
                message: err.message || "Server error while creating funds record."
            });
        });
};

//get require data
exports.getFundsData = (req, res) => {

    //validate inputs
    if(!req.body.fund_name && !req.body.country_name && !req.body.start_date && !req.body.end_date){
        res.status(400).send({
            success: 0,
            message: "Required fields missings."
        });
        return;
    }

    //clean inputs
    let name = req.body.fund_name+"_"+req.body.country_name;

    Funds
        find({
            "data.date": {
                $gte: req.body.start_date,
                $lt : req.body.end_date
            },
            "name" : name
        })
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0, 
                    message: "Could not retrieve records."
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
                message: err.message || "Server error while retrieving funds records."
            });
        });
};

//update existing funds instances
exports.update = (req, res) => {

    //validate inputs
    if(!req.body.data instanceof Array){
        res.status(400).send({
            success: 0,
            message: "Required fields missig."
        });

        return;
    }

    //check for funds and country name
    if(!req.body.fund_name && !req.body.country_name){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });

        return;
    }

    let name = req.body.fund_name+"_"+req.body.country_name;

    Funds
        .updateOne(
            {name: name},
            {$addToSet: {data : req.body.data}}
        )
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not update funds records."
                });
            }else{
                res.send({
                    success: 1,
                    message: "Successfully updated."
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 0,
                message: err.message || "Server error while updating funds records."
            });
        });
};

//get most recent entry in data Array
exports.getRecentEntryDate = (req, res) =>{

    //validate inputs
    if(!req.body.fund_name && !req.body.country_name){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });
        return;
    }

    let name = req.body.fund_name+"_"+req.body.country_name;

    Funds
        .findOne({"name":name},{},{sort: {'updated_at': -1}})
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not find any records."
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
                message: err.message || "Server error while retrieving recent data."
            });
        });
};