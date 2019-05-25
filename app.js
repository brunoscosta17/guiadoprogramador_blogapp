// Loading modules
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const admin = require('./routes/admin');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
require('./models/Post');
const Post = mongoose.model('post');
require('./models/Category');
const Category = mongoose.model('category');
const moment = require('moment');
const user = require("./routes/user");
const passport = require("passport");
require("./config/auth")(passport);
const db = require("./config/db");

// Configurations
// Session
app.use(session({
    secret: "blogapp",
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
});
// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Handlebars
app.engine('handlebars', handlebars({ 
    defaultLayout: 'main' 
}));
app.set('view engine', 'handlebars');
app.engine('handlebars', handlebars({
    defaultLayout: 'main',
    helpers: {
        formatDate: (date) => {
            return moment(date).format('DD/MM/YYYY')
        }
    }
}));

// Mongoose
mongoose.Promise = global.Promise;
mongoose.connect(db.mongoURI)
    .then(() => {
        console.log("Conected to Mongodb!");
    }).catch((error) => {
        console.log("Error connecting to Mongodb", error);
    });

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    Post.find().populate('category').sort({ date: 'desc' })
        .then((posts) => {
            res.render('index', { posts: posts });
        }).catch((error) => {
            req.flash('error_msg', "There was an internal error!");
            res.redirect('/404');
        });
});

app.get('/404', (req, res) => {
    res.render('Erro 404!')
});

app.get('/post/:slug', (req, res) => {
    Post.findOne({ slug: req.params.slug })
        .then((post) => {
            if (post) {
                res.render('post/index', { post: post });
            } else {
                req.flash('error_msg', "This post doesn't exist!");
                res.redirect('/');
            }
        }).catch((error) => {
            console.log(error);
            req.flash("error_msg", "Error fetching post!");
            res.redirect('/');
        })
});

app.get('/categories', (req, res) => {
    Category.find()
        .then((categories) => {
            res.render('categories/index', { categories: categories });
        }).catch((error) => {
            console.log(error);
            req.flash("error_msg", "Error listing categories!");
        })
});


app.get('/categories/:slug', (req, res) => {
    Category.findOne({ slug: req.params.slug })
        .then((category) => {
            if (category) {
                Post.find({ category: category._id })
                    .then((posts) => {
                        res.render('categories/posts', { posts: posts, category: category })
                    }).catch((error) => {
                        console.log(error);
                        req.flash("error_msg", "Error listing this post!");
                        res.redirect('/');
                    });
            } else {
                req.flash("error_msg", "Category doesn't exist!");
                res.redirect('/');
            }
        }).catch((error) => {
            console.log(error);
            req.flash("error_msg", "Error loading this category!");
        });
});


app.use('/admin', admin);
app.use("/users", user);
app.use('admin/categories', admin);

// Others
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log('Server running on port',PORT);
});