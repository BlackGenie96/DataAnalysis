module.exports = mongoose =>{
    const Descriptive = mongoose.model(
        'macrotrends_descriptive',
        mongoose.Schema({
            overview_id: {type:mongoose.Schema.Types.ObjectId,ref:'macrotrends_overview'},
            exchange: String, 
            country: String, 
            sector: String,
            industry: String
        },{
            timestamps: true
        })
    );

    return Descriptive;
}