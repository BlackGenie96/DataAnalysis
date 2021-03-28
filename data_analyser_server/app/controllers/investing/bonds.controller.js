const db = require('../../models');
const Bonds = db.investing_bonds;

//create new instance
exports.create = (req, res) => {
    //validate inputs
    if(!req.body.bond_name && !req.body.data instanceof Array){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });
        return;
    }

    const bonds = new Bonds({name: req.body.bond_name, data: req.body.data});

    bonds
        .save(bonds)
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not create new bonds records"
                });
            }else{
                res.send({
                    success: 1,
                    message: "Successfully created bonds records."
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 0,
                message: err.message || "Server error while creating bonds records."
            });
        });
};

///get bonds data
exports.getBondsData = (req, res) => {
    //validate inputs.
    if(!req.body.bond_name && !req.body.start_date && !req.body.end_date){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });

        return;
    }

    Bonds
        .find({
            "name" : req.body.bond_name,
            "data.date":{
                $gte : req.body.start_date,
                $lte : req.body.end_date
            }
        })
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not retrieve bonds records."
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
                message: err.message || "Server error while retrieving bonds records."
            });
        });
};

///update bonds records
exports.update = (req, res) => {
    //validate inputs
    if(!req.body.bond_name && !req.body.data instanceof Array){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });

        return;
    }

    Bonds
        .updateOne(
            {name: req.body.bond_name},
            {$addToSet: {data: req.body.data}}
        )
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not update bonds records."
                });
            }else{
                res.send({
                    success: 1,
                    message: "Successfully updated bonds records."
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 0,
                message: err.message || "Server error while updating bonds records."
            });
        });
};

//get recent entry date
exports.getRecentEntryDate = (req, res) => {

    //validate inputs
    if(!req.body.bond_name){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });

        return;
    }

    let name = req.body.bond_name;

    Bonds
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