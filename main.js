const mongoose = require('mongoose');
const { db_name } = require('./settings.json');

mongoose
    .connect(`mongodb://localhost/${db_name}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        require('./bot');
    });
