module.exports = mongoose => {
    const Crypto = mongoose.model(
        'investing_crypto',
        mongoose.Schema({
            name: {
                type: String,
                unique: true
            },
            data : [
                {
                    date: {
                        type: Date,
                        unique: true
                    },
                    open: Number, 
                    high: Number, 
                    low : Number,
                    close: Number, 
                    volume: Number,
                    currency: String
                }
            ]
        },{
            timestamps: true
        })
    );

    return Crypto;
}