const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Category');
const Category = mongoose.model('category');

router.get('/', (req, res) => {
    res.render('admin/index');
});

router.get('/posts', (req, res) => {
    res.redirect();
});

router.get('/categories', (req, res) => {
    res.render('admin/categories');
});

router.get('/categories/add', (req, res) => {
    res.render('admin/addcategory');
});

router.post('/categories/new', (req, res) => {

    let errors = [];

    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
        errors.push({error: "Nome invalido!"})        
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        errors.push({error: "Slug invalido!"})
    }

    if(req.body.name.length < 3) {
        errors.push({error: "O nome deve ter ao menos 3 caracteres!"})
    }

    if(req.body.name.length < 3) {
        errors.push({error: "O slug deve ter ao menos 3 caracteres!"})
    }

    if(errors.length > 0) {
        res.render("admin/addcategory", {errors: errors});
    } else {
        const newCategory = {
            name: req.body.name,
            slug: req.body.slug
        }

        new Category(newCategory).save()
        .then(() => {
            req.flash("success_msg", "Categoria criada com suceso");
            res.redirect('/admin/categories');
        }).catch((error) => {
            req.flash("error_msg", 'Erro ao salvar categoria!');
            res.redirect('/admin');
        });
    }
});

module.exports = router;