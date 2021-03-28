module.exports = mongoose => {
    const PerformanceLt = mongoose.model(
        'macrotrens_performance_lt',
        mongoose.Schema({
            overview_id : {type:mongoose.Schema.Types.ObjectId,ref:'macrotrends_overview'},
            three_year_cagr: String,
            five_year_cagr: String, 
            ten_year_cagr: String,
            twenty_year_cagr: String, 
            thirty_year_cagr: String
        },{
            timestamps: true
        })
    );

    return PerformanceLt;
}