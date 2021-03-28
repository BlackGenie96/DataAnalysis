module.exports = mongoose => {
    const Indices = mongoose.model(
        'investing_indices',
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

    return Indices;
}