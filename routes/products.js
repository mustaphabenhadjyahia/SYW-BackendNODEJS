var express = require('express');
var router = express.Router();
var Product = require('../models/Product');


/* GET products  */
router.get('/all', (req,res) => {

    Product.find((err, prods) => {
        if (err) res.json(err)
        else
            for (var p in prods)
                console.log(prods[p].userId)
        res.json(prods);
    })
});


/* GET products by categorie */
router.get('/:categorie', (req,res) => {

    Product.find((err, prods) => {
        if (err) res.json(err)
        else
            var products = [];
        for (var p in prods) {
            if (prods[p].categories[0].name.toLowerCase() === req.params.categorie.toLowerCase())
                products.push(prods[p])
        }
        res.json(products);
        console.log(products)
        })
});

/* GET products by userId  */
router.get('/user/:id', (req,res) => {

    Product.find({userId:req.params.id},(err, prods) => {
        if (err) res.json(err)
        else res.json(prods)
        console.log(prods);
    })
});

/* GET categories by User */
router.get('/categories/:id', (req,res) => {

    Product.find({userId:req.params.id},(err, prods) => {
        if (err) res.json(err)
        else {
            var categories = [];
            for (var p in prods) {

                    categories.push(prods[p].categories[0].name)
            }
            var cat = removeDuplicates(categories);
            res.json(cat);
            console.log(cat);
        }
    })
});



function removeDuplicates(tab) {
    let unique = {};
    tab.forEach(function(i) {
        if(!unique[i]) {
            unique[i] = true;
        }
    });
    return Object.keys(unique);
}




module.exports = router;

