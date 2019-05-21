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

// Configurations
// Session
app.use(session({
    secret: "blogapp",
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
// Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});
// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Handlebars
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Mongoose
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/blogapp")
    .then(() => {
        console.log("Conectado ao mongodb!");
    }).catch((error) => {
        console.log("Erro ao se conectar ao mongo", error);
    });

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    Post.find().populate('category').sort({ date: 'desc' })
        .then((posts) => {
            res.render('index', { posts: posts });
        }).catch((error) => {
            req.flash('error_msg', "Houve um erro interno!");
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
                req.flash('error_msg', "Esta postagem não existe!");
                res.redirect('/');
            }
        }).catch((error) => {
            console.log(error);
            req.flash("error_msg", "Erro ao buscar a postagem!");
            res.redirect('/');
        })
});

app.use('/admin', admin);

app.use('admin/categories', admin);

// Others
const PORT = 8081;
app.listen(PORT, () => {
    console.log('Server running on port ', PORT);
});