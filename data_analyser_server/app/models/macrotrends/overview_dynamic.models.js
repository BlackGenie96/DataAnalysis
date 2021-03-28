module.exports = mongoose => {
    const OverviewDynamic = mongoose.model(
        'overview_dynamic',
        mongoose.Schema({
            overview_id : {type:mongoose.Schema.Types.ObjectId,ref: 'macrotrends_overview'},
            closing_price: String,
            one_yr_perc_change: String, 
            p_e_ratio: String, 
            dividend_yield: String
        },{
            timestamps: true
        })
    );

    return OverviewDynamic;
}