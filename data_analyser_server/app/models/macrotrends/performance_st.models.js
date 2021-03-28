module.exports = mongoose => {
    const PerformanceSt = mongoose.model(
        'macrotrends_performance_st',
        mongoose.Schema({
            overview_id : {type:mongoose.Schema.Types.ObjectId,ref:'macrotrends_overview'}, 
            weekly_change: String,
            monthly_change: String,
            quarterly_change: String,
            six_month_change: String,
            ytd_change: String, 
            yearly_change: String,
            price_vs_50d_sma: String,
            price_vs_200d_sma: String,
        },{
            timestamps: true
        })
    );

    return PerformanceSt;
}