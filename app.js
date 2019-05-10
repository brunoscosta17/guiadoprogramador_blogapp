// Loading modules
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
//const mongoose = require('mongoose');
const admin = require('./routes/admin');
const path = require('path');

// Configurations
    // Body Parser
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());

    // Handlebars
        app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
        app.set('view engine', 'handlebars');

    // Mongoose

    // Public
    app.use(express.static(path.join(__dirname,'public')));

// Routes
app.use('/admin', admin);
app.use('admin/categories', admin);

// Others
const PORT = 8081;
app.listen(PORT, () => {
    console.log('Server running on port ', PORT);
});