module.exports = mongoose => {
    const CurrencyCrosses = mongoose.model(
        'investing_currency_crosses',
        mongoose.Schema({
            name: {
                type: String, 
                unique : true
            },
            data: [
                {
                    date: {
                        type: Date,
                        unique: true
                    },
                    open: Number,
                    high: Number,
                    low:  Number,
                    close: Number,
                    currency: String
                }
            ]
        },{
            timestamps: true
        })
    );

    return CurrencyCrosses;
}