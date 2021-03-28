module.exports = mongoose => {
    const Funds = mongoose.model(
        'investing_funds',
        mongoose.Schema({
            name: {
                type: String,
                unique: true
            },
            data: [
                {
                    date: {
                        type: Date,
                        unique: true
                    },
                    open: Number, 
                    high: Number,
                    low : Number,
                    close: Number, 
                    currency: String
                }
            ]
        },{
            timestamps: true
        })
    );

    return Funds;
}