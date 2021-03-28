const db = require('../../models');
const etfs = db.investing_etfs;

//create new instance
exports.create = (req, res) => {

    //valid inputs
    if(!req.body.etfs_name && !req.body.country_name && !req.body.data instanceof Array){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });

        return;
    }

    let name = req.body.etfs_name+"_"+req.body.country_name;

    const Etfs = new etfs({name: name, data: data});
    
    Etfs
        .save(Etfs)
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0, 
                    message: "Could not create etfs record"
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
                message: err.message || "Server error while creating new etfs records"
            });
        });
};

//get etfs data
exports.getEtfsData = (req, res) => {

    //validate inputs
    if(!req.body.etfs_name && !req.body.country_name && !req.body.start_date && !req.body.end_date){
        res.status(400).send({
            success : 0,
            message : "Reqiured fields missing"
        });

        return;
    }

    let name = req.body.etfs_name+"_"+req.body.country_name;

    etfs
        .find({
            "data.date": {
                $gte : req.body.start_date,
                $lt  : req.body.end_date
            },
            "name" : name
        })
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not retrieve etfs records"
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
                message: err.message || "Server error while retrieving etfs data."
            });
        });
};

//update existing records.
exports.update = (req, res) => {
    //validate inputs
    if(!req.body.etfs_name && !req.body.country_name &&!req.body.data instanceof Array){
        res.status(400).send({
            success: 0, 
            message: 'Required fields missing.'
        });

        return;
    }

    let name = req.body.etfs_name+"_"+req.body.country_name;

    etfs
        .updateOne(
            {name: name},
            {$addToSet: {data: req.body.data}}
        )
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not update etfs records."
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
                message: err.message || "Server error while updating etfs records."
            });
        });
};

//get most recent data entry in array
exports.getRecentEntryDate = (req, res) => {
    //validate inputs
    if(!req.body.etfs_name && !req.body.country_name){
        res.status(400).status({
            success: 0,
            message: "Required fields missing."
        });

        return;
    }

    let name = req.body.etfs_name+"_"+req.body.country_name;
    
    Etfs
        .findOne({"name": name},{},{"updated_at": -1})
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not retrieve recent entry date."
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
                message: err.message || "Server error while retrieving recent entry date."
            });
        });
};