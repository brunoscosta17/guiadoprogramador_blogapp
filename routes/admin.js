const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Category');
const Category = mongoose.model('category');
require('../models/Post');
const Post = mongoose.model('post');

router.get('/', (req, res) => {
    res.render('admin/index');
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

router.get('/category/add', (req, res) => {
    res.render('admin/addcategory');
});

router.post('/category/new', (req, res) => {

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

    if (req.body.slug.length < 3) {
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

    if (req.body.slug.length < 3) {
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

router.post('/categories/delete', (req, res) => {
    Category.deleteOne({ _id: req.body.id })
        .then(() => {
            req.flash("success_msg", `Categoria deletada com sucesso!`);
            res.redirect("/admin/categories");
        }).catch((error) => {
            req.flash("error_msg", "Erro ao deletar a categoria!");
            res.redirect("/admin/categories");
        });
});

router.get('/posts', (req, res) => {
    Post.find().populate('category').sort({data: 'desc'})
        .then((post) => {
            res.render('admin/posts', {post: post});
        }).catch((error) => {
            req.flash("error_msg", "Erro ao listar os posts!");
            res.redirect("/admin");
        })
});

router.get('/post/add', (req, res) => {
    Category.find()
        .then((categories) => {
            res.render('admin/addpost', {categories: categories});
        }).catch((error) => {
            req.flash("error_msg", "Erro ao carregar formulario!");
            res.redirect('/admin');
        });
});

router.post('/post/new', (req, res) => {
    
    let errors = [];

    if (req.body.category == "0") {
        errors.push("Selecione ao menos uma categoria!");
    }

    if (!req.body.title || typeof req.body.title == undefined || req.body.title == null) {
        errors.push({ error: "Title invalido!" })
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        errors.push({ error: "Slug invalido!" })
    }

    if (!req.body.description || typeof req.body.description == undefined || req.body.description == null) {
        errors.push({ error: "Description invalido!" })
    }

    if (!req.body.content || typeof req.body.content == undefined || req.body.content == null) {
        errors.push({ error: "Content invalido!" })
    }

    if (req.body.title.length < 3) {
        errors.push({ error: "O title deve ter ao menos 3 caracteres!" })
    }

    if (req.body.slug.length < 3) {
        errors.push({ error: "O slug deve ter ao menos 3 caracteres!" })
    }

    if (req.body.slug.description < 3) {
        errors.push({ error: "A description deve ter ao menos 3 caracteres!" })
    }

    if (req.body.slug.content < 3) {
        errors.push({ error: "O content deve ter ao menos 3 caracteres!" })
    }

    if (errors.length > 0) {
        res.render("admin/addpost", { error: errors });
    } else {
        const newPost = {
            title: req.body.title,
            slug: req.body.slug,
            description: req.body.description,
            content: req.body.content,
            category: req.body.category
        }

        new Post(newPost).save()
            .then(() => {
                req.flash("success_msg", "Post criado com sucesso!");
                res.redirect("/admin/posts");
            })
            .catch((error) => {
                req.flash("error_msg", "Erro ao salvar o post!");
                res.redirect("/admin/posts");
            });
    }
});

module.exports = router;