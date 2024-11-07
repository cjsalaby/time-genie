const express = require('express');
const cors = require('cors')

const routes = require("./src/routes/routes");
process.env.TZ = 'UTC'
require('dotenv/config');
const errorHandlerMiddleware = require("./src/middlewares/error-handler.middleware");
const cronIndex = require("./src/cron-jobs/index");
const {schedule} = require("node-cron");

const app = express();
const PORT = process.env.PORT;

app.use(cors())
app.use(express.json());
app.use('/api', routes);
app.use(errorHandlerMiddleware);

// Start server
app.listen(PORT, (error) => {
    if(!error) {
        console.log('Server successfully started on port ' + PORT);
        cronIndex.startCronJobs().then(r => {});
    } else {
        console.log("Error occurred during server startup", error)
    }
})
