const dbConfig = require('../config/db.config');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;

//macrotrends
db.overview = require('./macrotrends/overview.models')(mongoose);
db.overview_dynamic = require('./macrotrends/overview_dynamic.models')(mongoose);
db.descriptive = require('./macrotrends/descriptive.models')(mongoose);
db.dividends = require('./macrotrends/dividends.models')(mongoose);
db.debt_ratios = require('./macrotrends/debt_ratios.models')(mongoose);
db.income_ratios = require('./macrotrends/income_ratios.models')(mongoose);
db.performance_st = require('./macrotrends/performance_st.models')(mongoose);
db.performance_lt = require('./macrotrends/performance_lt.models')(mongoose);
db.revenue_earnings = require('./macrotrends/revenue_earnings.models')(mongoose);

//investing
db.investing_stocks = require('./investing/stocks.models')(mongoose);
db.investing_funds = require('./investing/funds.models')(mongoose);
db.investing_etfs = require('./investing/etfs.models')(mongoose);
db.investing_indices = require('./investing/indices.models')(mongoose);
db.investing_currency = require('./investing/currency_crosses.models')(mongoose);
db.investing_bonds = require('./investing/bonds.models')(mongoose);
db.investing_commodities = require('./investing/commodities.models')(mongoose);
db.investing_crypto = require('./investing/crypto.models')(mongoose);

module.exports = db;