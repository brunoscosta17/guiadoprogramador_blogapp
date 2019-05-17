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
    Category.find().sort({ createdAt: 'desc' })
        .then((categories) => {
            res.render('admin/categories', { categories: categories });
        }).catch((err) => {
            req.flash("error_msg", "Erro ao listar as categorias!");
            res.redirect('/admin');
        })
});

router.get('/categories/add', (req, res) => {
    res.render('admin/addcategory');
});

router.post('/categories/new', (req, res) => {

    let errors = [];

    if (!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
        errors.push({ error: "Nome invalido!" })
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        errors.push({ error: "Slug invalido!" })
    }

    if (req.body.name.length < 3) {
        errors.push({ error: "O nome deve ter ao menos 3 caracteres!" })
    }

    if (req.body.name.length < 3) {
        errors.push({ error: "O slug deve ter ao menos 3 caracteres!" })
    }

    if (errors.length > 0) {
        res.render("admin/addcategory", { errors: errors });
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

router.get('/categories/edit/:id', (req, res) => {
    Category.findOne({ _id: req.params.id })
        .then((category) => {
            res.render('admin/editcategory', { category: category });
        }).catch((error) => {
            req.flash("error_msg", "Categoria não encontrada!");
            res.redirect("/admin/categories")
        });
});

router.post('/categories/edit', (req, res) => {

    let errors = [];

    if (!req.body.name || typeof req.body.name === undefined || req.body.name == null) {
        errors.push({ error: "Nome invalido!" })
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        errors.push({ error: "Slug invalido!" })
    }

    if (req.body.name.length < 3) {
        errors.push({ error: "O nome deve ter ao menos 3 caracteres!" })
    }

    if (req.body.name.length < 3) {
        errors.push({ error: "O slug deve ter ao menos 3 caracteres!" })
    } if (errors.length > 0) {
        res.render("admin/addcategory", { errors: errors });
    } else {
        Category.findOne({ _id: req.body.id })
            .then((category) => {
                category.name = req.body.name
                category.slug = req.body.slug

                    category.save()
                        .then(() => {
                            req.flash("success_msg", "Categoria editada com sucesso!");
                            res.redirect("/admin/categories");
                        }).catch((error) => {
                            req.flash("error_msg", "Errro ao salvar a edicao da categoria!");
                            res.redirect("/admin/categories");
                        });
            }).catch((error) => {
                console.log(error);
                req.flash("error_msg", "Erro ao editar a categoria!");
                res.redirect("/admin/categories");
            });
    }

});

module.exports = router;