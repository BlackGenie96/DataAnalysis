module.exports = mongoose => {
    const Bonds = mongoose.model(
        'investing_bonds',
        mongoose.Schema({
            name : {
                type:String,
                unique: true
            },
            data: [
                {
                    date: {
                        type: Date,
                        unique: true,
                    },
                    open: Number,
                    high: Number,
                    low : Number,
                    close: Number
                }
            ]
        },{
            timestamps: true
        })
    );

    return Bonds;
}