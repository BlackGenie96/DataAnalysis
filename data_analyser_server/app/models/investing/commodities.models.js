module.exports = mongoose => {
    const Commodities = mongoose.model(
        'investing_commodities',
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
                    low:  Number, 
                    close: Number, 
                    volume: Number,
                    currency: String
                }
            ]
        },{
            timestamps: true
        })
    );

    return Commodities;
}