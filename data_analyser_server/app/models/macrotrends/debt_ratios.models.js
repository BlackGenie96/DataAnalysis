module.exports = mongoose =>{
    const DebtRatios = mongoose.model(
        'macrotrends_debt_ratios',
        mongoose.Schema({
            overview_id : {type: mongoose.Schema.Types.ObjectId,ref:'macrotrends_overview'},
            price_book_ratio: String,
            price_cash_ratio: String,
            return_on_equity: String, 
            return_on_assets: String, 
            inventory_turnover: String,
            current_ratio: String,
            quick_ratio: String,
            debt_equity_ratio: String
        },{
            timestamps: true
        })
    );

    return DebtRatios;
}