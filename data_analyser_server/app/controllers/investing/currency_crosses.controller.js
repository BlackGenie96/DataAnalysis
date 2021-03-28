const db = require('../../models');
const Currency = db.investing_currency;

//create new instance
exports.create = (req, res) => {
    //validate inputs
    if(!req.body.name && !req.body.data instanceof Array){
        res.status(400).send({
            success: 0,
            message: 'Required fields missing.'
        });

        return;
    }

    const currency = new Currency(req.body);

    currency
        .save(currency)
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: 'Could not create new currency cross record'
                });
            }else{
                res.send({
                    success: 1,
                    message: "Successfully create currency cross record."
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 0,
                message: err.message || "Server error while create new currency cross record."
            });
        });
};

//get currency cross data
exports.getCurrencyData = (req, res) => {
    //validate inputs
    if(!req.body.currency_name && !req.body.start_date && !req.body.end_date){
        res.status(400).send({
            success: 0,
            message: 'Required fields missing.'
        });
        return;
    }

    Currency
        .find({
            "name": req.body.currency_name,
            "data.date" : {
                $gte : req.body.start_date,
                $lte : req.body.end_date
            }
        })
        .then(data => {
            if(!data){
                res.status(404).send({
                    succes: 0,
                    message: "Could not retrieve currency crosses data."
                });
            }else{
                res.send({
                    success: 1,
                    message: "Success",
                    data   : data
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 0,
                message: err.message || "Server error while retrieving currency crosses."
            });
        });
};

//update existing currency crosses
exports.update = (req, res) => {
    //validate input 
    if(!req.body.currency_name && !req.body.data instanceof Array){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });

        return;
    }

    Currency
        .updateOne(
            {name: req.body.currency_name},
            {$addToSet: {data: req.body.data}}
        )
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not update currency crosses records."
                });
            }else{
                res.send({
                    success: 1,
                    message: "Successfully updated currency crosses records."
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 0,
                message: err.message || "Server error while updating currency crosses records."
            });
        });
};

//get recent entry date
exports.getRecentEntryDate = (req, res) => {

    //validate inputs
    if(!req.body.currency_name){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });

        return;
    }

    let name = req.body.currency_name;

    Currency
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
                message: err.message || "Server error while getting recent entry date for currency crosses."
            });
        });
};