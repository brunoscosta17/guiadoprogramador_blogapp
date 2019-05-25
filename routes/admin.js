const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Category');
const Category = mongoose.model('category');
require('../models/Post');
const Post = mongoose.model('post');
const {isAdmin} = require("../helpers/isAdmin");

router.get('/', isAdmin, (req, res) => {
    res.render('admin/index');
});

router.get('/categories', isAdmin, (req, res) => {
    Category.find().sort({ createdAt: 'desc' })
        .then((categories) => {
            res.render('admin/categories', { categories: categories });
        }).catch((error) => {
            console.log(error);
            req.flash("error_msg", "Erro ao listar as categorias!");
            res.redirect('/admin');
        })
});

router.get('/category/add', isAdmin, (req, res) => {
    res.render('admin/addcategory');
});

router.post('/category/new', isAdmin, (req, res) => {

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
                console.log(error);
                req.flash("error_msg", 'Erro ao salvar categoria!');
                res.redirect('/admin');
            });
    }
});

router.get('/categories/edit/:id', isAdmin, (req, res) => {
    Category.findOne({ _id: req.params.id })
        .then((category) => {
            res.render('admin/editcategory', { category: category });
        }).catch((error) => {
            console.log(error);
            req.flash("error_msg", "Categoria não encontrada!");
            res.redirect("/admin/categories")
        });
});

router.post('/categories/save', isAdmin, (req, res) => {

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

router.post('/categories/delete', isAdmin, (req, res) => {
    Category.deleteOne({ _id: req.body.id })
        .then(() => {
            req.flash("success_msg", `Categoria deletada com sucesso!`);
            res.redirect("/admin/categories");
        }).catch((error) => {
            console.log(error);
            req.flash("error_msg", "Erro ao deletar a categoria!");
            res.redirect("/admin/categories");
        });
});

router.get('/posts', isAdmin, (req, res) => {
    Post.find().populate('category').sort({ data: 'desc' })
        .then((post) => {
            res.render('admin/posts', { post: post });
        }).catch((error) => {
            console.log(error);
            req.flash("error_msg", "Erro ao listar os posts!");
            res.redirect("/admin");
        })
});

router.get('/post/add', isAdmin, (req, res) => {
    Category.find()
        .then((categories) => {
            res.render('admin/addpost', { categories: categories });
        }).catch((error) => {
            console.log(error);
            req.flash("error_msg", "Erro ao carregar formulario!");
            res.redirect('/admin');
        });
});

router.post('/post/new', isAdmin, (req, res) => {

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
            }).catch((error) => {
                console.log(error);
                req.flash("error_msg", "Erro ao salvar o post!");
                res.redirect("/admin/posts");
            });
    }
});

router.get('/posts/edit/:id', isAdmin, (req, res) => {

    Post.findOne({ _id: req.params.id })
        .then((post) => {
            Category.find()
                .then((categories) => {
                    res.render('admin/editpost', { post: post, categories: categories });
                }).catch((error) => {
                    console.log(error);
                    req.flash("error_msg", "Erro ao carregar as categorias!");
                    res.redirect("/admin/posts");
                });
        }).catch((error) => {
            console.log(error);
            req.flash("error_msg", "Erro ao carregar os dados do formulario!");
            res.redirect("/admin/posts");
        });
});

router.post('/post/save', isAdmin, (req, res) => {

    let errors = [];

    if (!req.body.title || typeof req.body.title === undefined || req.body.title == null) {
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

    if (req.body.description.length < 3) {
        errors.push({ error: "A description deve ter ao menos 3 caracteres!" })
    }

    if (req.body.content.length < 3) {
        errors.push({ error: "O content deve ter ao menos 3 caracteres!" })
    }

    if (errors.length > 0) {
        res.render("admin/addpost", { error: errors });
    } else {

        Post.findOne({ _id: req.body.id })
            .then((post) => {

                post.title = req.body.title,
                    post.slug = req.body.slug,
                    post.description = req.body.description,
                    post.content = req.body.content,
                    post.category = req.body.category

                post.save()
                    .then(() => {
                        req.flash("success_msg", "Postagem salva com sucesso!");
                        res.redirect("/admin/posts");
                    }).catch((error) => {
                        console.log(error);
                        req.flash("msg_error", "Erro ao salvar este post!");
                        res.redirect("/admin/posts");
                    });

            }).catch((error) => {
                console.log(error);
                req.flash("msg_error", "Erro ao buscar este post!");
                res.redirect("/admin/posts");
            });
    }
});

// router.get('/posts/delete/:id', (req, res) => {
//     Post.remove({_id: req.params.id})
//         .then(() => {
//             req.flash("success_msg", `Post deletado com sucesso!`);
//             res.redirect('/admin/posts');
//         })
//         .catch((error) => {
//             console.log(error);
//             req.flash("msg_error", "Erro ao excluir este post!");
//             res.redirect("/admin/posts");
//         });
// });

router.post('/posts/delete', isAdmin, (req, res) => {
    Post.deleteOne({ _id: req.body.id })
        .then(() => {
            req.flash("success_msg", `Post deletado com sucesso!`);
            res.redirect('/admin/posts');
        })
        .catch((error) => {
            console.log(error);
            req.flash("msg_error", "Erro ao excluir este post!");
            res.redirect("/admin/posts");
        });
});

module.exports = router;