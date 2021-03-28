module.exports = mongoose => {
    const Stocks = mongoose.model(
        'investing_stocks',
        mongoose.Schema({
            name: {     ///the name will be stockname_countryname
                type: String,
                unique: true
            },
            data: [
                {
                    date: {
                        type: Date,
                        unique: true
                    },
                    open : Number,
                    high : Number,
                    low  : Number,
                    close: Number,
                    volumne: Number,
                    currency: String
                }
            ]
        },{
            timestamps: true
        })
    );

    return Stocks;
}