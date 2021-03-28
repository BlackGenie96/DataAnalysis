module.exports = mongoose => {
    const Overview = mongoose.model(
        'macrotrends_overview',
        mongoose.Schema({
            stock_name: String, 
            ticker: String, 
            industry: String, 
            market_cap: String
        },{
            timestamps: true
        })
    );

    return Overview;
}