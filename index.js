const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

var corsOptions = {
    origin: 'http://localhost:8081'
};

app.use(cors(corsOptions));

//parse request of content-type : application/json
app.use(bodyParser.json());

const db = require("./data_analyser_server/app/models");

db.mongoose
    .connect(db.url, {
        useNewUrlParser:true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log('Connected to database.');
    }).catch(err => {
        console.log('Cannot connect to database!', err );
        process.exit();
    })

//simple route 
app.get('/', (req, res)=>{
    res.json({message: 'Something simple.'})
});

//require macrotrends data
require("./data_analyser_server/app/routes/macrotrends/overview.routes")(app);
require("./data_analyser_server/app/routes/macrotrends/overview_dynamic.routes")(app);
require("./data_analyser_server/app/routes/macrotrends/debt_ratios.routes")(app);
require("./data_analyser_server/app/routes/macrotrends/descriptive.routes")(app);
require("./data_analyser_server/app/routes/macrotrends/dividends.routes")(app);
require("./data_analyser_server/app/routes/macrotrends/income_ratios.routes")(app);
require("./data_analyser_server/app/routes/macrotrends/performance_lt.routes")(app);
require("./data_analyser_server/app/routes/macrotrends/performance_st.routes")(app);
require("./data_analyser_server/app/routes/macrotrends/revenue_earnings.routes")(app);

//require investing data
require("./data_analyser_server/app/routes/investing/etfs.routes")(app);
require("./data_analyser_server/app/routes/investing/funds.routes")(app);
require("./data_analyser_server/app/routes/investing/indices.routes")(app);
require("./data_analyser_server/app/routes/investing/stocks.routes")(app);
require("./data_analyser_server/app/routes/investing/currency_crosses.routes")(app);
require("./data_analyser_server/app/routes/investing/bonds.routes")(app);
require("./data_analyser_server/app/routes/investing/commodities.routes")(app);
require("./data_analyser_server/app/routes/investing/crypto.routes")(app);

//set port and listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT,() =>{
    console.log(`Server is running on port ${PORT}`);
})