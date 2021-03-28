const { models } = require("mongoose");

module.exports = mongoose => {
    const Dividends = mongoose.model(
        'macrotrends_dividends',
        mongoose.Schema({
            overview_id : {type:mongoose.Schema.Types.ObjectId,ref:'macrotrends_overview'},
            dividend_yield: String,
            twelve_month_dividend: String,
            twelve_month_eps: String, 
            dividend_payout_ratio: String
        },{
            timestamps: true
        })
    );

    return Dividends;
}