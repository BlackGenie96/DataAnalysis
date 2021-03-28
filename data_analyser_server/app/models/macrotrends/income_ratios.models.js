module.exports = mongoose => {
    const IncomeRatios = mongoose.model(
        'macrotrends_income_ratios',
        mongoose.Schema({
            overview_id : {type:mongoose.Schema.Types.ObjectId,ref:'macrotrends_overview'},
            price_earning_ratio: String, 
            peg_ratio: String,
            price_sales_ratio: String,
            operating_margin: String, 
            pre_tax_margin: String,
            net_margin: String
        },{
            timestamps: true
        })
    );

    return IncomeRatios;
}