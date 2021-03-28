module.exports = mongoose => {

    const etfs = mongoose.model(
        'investing_etfs',
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
                    open : Number, 
                    high : Number, 
                    low  : Number, 
                    close: Number,
                    volumne: Number, 
                    currency: String,
                    exchange: String
                }
            ]
        },{
            timestamps: true
        })
    );

    return etfs;
}