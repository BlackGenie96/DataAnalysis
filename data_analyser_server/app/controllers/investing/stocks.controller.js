const db = require('../../models');
const Stock = db.investing_stocks;

//create new stock entry
exports.create = (req, res) => {

    //validate inputs
    if(!req.body.stock_name && !req.body.country_name && !req.body.data){
        res.status(400).send({
            success: 0, 
            message: "Required fields missing."
        });

        return;
    }

    //clean input data
    let name = req.body.stock_name+"_"+req.body.country_name;

    //create new stock data
    const stock = new Stock({name: name, data: req.body.data});

    stock
        .save(stock)
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0, 
                    message: "Could not enter new stock record."
                });
            }else{
                res.send({
                    success: 1,
                    message: "Success."
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 0,
                message: err.message || "Server error while creating new stock record."
            });
        });
};

//get records
//inputs : stock name, country name, start date and end date
exports.getStockData = (req, res) => {

    //validate inputs
    if(!req.body.stock_name && !req.body.country_name && !req.body.start_date && !req.body.end_date){
        res.status(400).send({
            success: 0,
            message: "Required fields missings. Get stock"
        });
        return;
    }

    //clean inputs
    name = req.body.stock_name+"_"+req.body.country_name;
    Stock
        .find({
            "data.date": {
                $gte: req.body.start_date,
                $lt: req.body.end_date
            },
            "name": name
        })
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not find any records."
                });
            }else if(data.length < 0){
                res.status(404).send({
                    success: 0,
                    message: 'No values retrieved'
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
                message: err.message || "Server error while retrieving data"     
            });
        });
};

//update the existing records and add new records
exports.update = (req, res) => {

    //validate inputs
    if(!req.body.data instanceof Array){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });
        return;
    }

    //check for the stock and country names
    if(!req.body.stock_name && !req.body.country_name){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });

        return;
    }

    let name = req.body.stock_name+"_"+req.body.country_name;

    Stock
        .updateOne(
            {name: name},
            {$addToSet : {data: req.body.data}}
        )
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not update stock data."
                });
            }else{
                res.send({
                    success: 1,
                    message: "Succesffuly updated."
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 0,
                message: err.message || 'Server error while updating stock data.'
            });
        });
};

//get most recent entry in data Array
exports.getRecentEntryDate = (req, res) =>{

    //validate inputs
    if(!req.body.stock_name && !req.body.country_name){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });
        return;
    }

    let name = req.body.stock_name+"_"+req.body.country_name;

    Stock
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