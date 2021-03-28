module.exports = mongoose => {
    const RevenueEarnings = mongoose.model(
        'macrotrends_revenue_earnings',
        mongoose.Schema({
            overview_id: {type:mongoose.Schema.Types.ObjectId,ref:'macrotrends_overview'},
            twelve_month_sales_growth: String, 
            five_year_sales_growth: String, 
            twelve_month_eps_growth: String,
            five_year_eps_growth: String, 
            last_quarter_eps_suprise: String,
            estimated_eps_next_year: String
        },{
            timestamps: true
        })
    );

    return RevenueEarnings;
}