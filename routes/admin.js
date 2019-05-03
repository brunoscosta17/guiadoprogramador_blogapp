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
    const newCategory = {
        name: req.body.name,
        slug: req.body.slug
    }

    new Category(newCategory).save()
        .then(() => {
            console.log('Categoria salva com sucesso!')
        }).catch((error) => {
            console.log('Erro ao salvar categoria!')
        });
});

module.exports = router;