const db = require('../../models');
const Crypto = db.investing_crypto;

//create new instance
exports.create = (req, res) => {
    //validate inputs
    if(!req.body.crypto_name && !req.body.data instanceof Array){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });

        return;
    }

    const crypto = new Crypto({name: req.body.crypto_name, data: req.body.data});

    crypto
        .save(crypto)
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not create new Crypto record."
                });
            }else{
                res.send({
                    success: 1,
                    message: "Success creating crypto record."
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 0,
                message: err.message || "Server error while creating crypto record."
            });
        });
};

//get crypto data
exports.getCryptoData = (req, res) =>{
    //validate inputs
    if(!req.body.crypto_name && !req.body.start_date && !req.body.end_date){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });
        
        return;
    }

    Crypto
        .find({
            "name" : req.body.crypto_name,
            "data.date": {
                $gte : req.body.start_date,
                $lte : req.body.end_date
            }
        })
        .then(data => {
            if(!data || data.length <= 0){
                res.status(404).send({
                    success: 0,
                    message: "Could not retrieve crypto data."
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
                message: err.message || "Server error while retrieving crytpo data"
            });
        });
};

//update data
exports.update = (req, res) => {
    //validate input
    if(!req.body.crypto_name && !req.body.data instanceof Array){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });
        return;
    }

    Crypto
        .updateOne(
            {name: req.body.crypto_name},
            {$addToSet : {data: req.body.data}}
        )
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not update crypto records."
                });
            }else{
                res.send({
                    success: 1,
                    message: "Successfully updated crypto records."
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 0,
                message: err.message || "Server error while updating crypto controller."
            });
        });
};

//get recent entry date
exports.getRecentEntryDate = (req, res) => {

    //validate inputs
    if(!req.body.crypto_name){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });

        return;
    }

    let name = req.body.crypto_name;

    Crypto
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
                message: err.message || "Server error while getting recent entry date for crypto currencies."
            });
        });
};