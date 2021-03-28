const db = require('../../models')
const Dividends = db.dividends;

//create new dividends record
exports.create = (req, res) => {

    //validate request data
    if(!req.body.overview_id){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });
        return;
    }

    const dividends = new Dividends(req.body);

    dividends
        .save(dividends)
        .then(data => {
            if(!data){
                res.status(404).send({
                    success:0,
                    message:"Could not create record."
                });
            }else{
                res.send({
                    data: data,
                    success: 1,
                    message: "Success"
                });
            }
            
        })
        .catch(err => {
            res.status(500).send({
                success: 0,
                message: err.message || "Server error while creating dividends record."
            });
        });
};

//get dividends data
exports.getDividends = (req, res) => {

    //check for overview id
    const id = req.params.id;

    Dividends
        .find({'overview_id':id})
        .populate("overview_id", "-__v -created_at -updated_at")
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not retrieve selected records."
                });
            }else{
                res.send({
                    data: data,
                    success: 1,
                    message: "Success"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 0,
                message: err.message || "Server error while retrieving dividends records."
            });
        });
};

//update dividends records
exports.updateDividends = (req, res) => {

    //validate request body
    if(!req.body){
        res.status(400).send({
            success: 0,
            message: "Required fields missing."
        });
        return;
    }

    //get dividend id
    const id = req.params.id;

    Dividends
        .findByIdAndUpdate(id,req.body,{useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not update dividends record."
                });
            }else{
                res.send({
                    success: 1,
                    message: "Successfully updated dividends record."
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 0,
                message: err.message || "Server error while updating dividends data."
            });
        });
};

//delete dividends record
exports.deleteDividend = (req, res) => {
    //get dividend id 
    const id = req.params.id;

    if(!id){
        res.status(400).send({
            message: "Required fields missing.",
            success: 0
        });
        return;
    }

    Dividends
        .findByIdAndRemove(id, {useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({
                    success: 0,
                    message: "Could not delete dividend record."
                });
            }else{
                res.send({
                    success : 1,
                    message : "Successfully deleted dividend record."
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                success: 0,
                message: err.message || "Server error while deleting dividend record."
            });
        });
};