const mongoose = require('mongoose');

mongoose
    .connect('mongodb://localhost/xinebox', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        require('./bot');
    });
