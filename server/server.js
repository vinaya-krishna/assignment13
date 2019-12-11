var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();

app.use(bodyParser.json());

var dbPath = 'mongodb+srv://vinay:user@catalog-lywdw.mongodb.net/test?retryWrites=true&w=majority';

var Product = mongoose.model('product', {
    product: {
        productid: Number,
        category: String,
        price: String,
        name: String,
        instock: Boolean
    },
    id : Number
});

mongoose.connect(dbPath, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}, (err) => {
    console.log("Mongodb connection", err);
});

/**
 * Get All products from the database
 */
app.get('/product/get/', async (req, res) => {
    var products = {};
    var data = await Product.find({});
    data.forEach((value) => {
        products[value.id] = value.product;
    });
    res.send(products);
});

/**
 * Create and Insert a product to database
 */
app.post('/product/create/', async (req, res) => {
    try{
        var product = new Product(req.body);
        await product.save();
        console.log("Saved");
        res.sendStatus(200);

    }catch (error) {
        res.sendStatus(500);
    }
});

/**
 * Update given product
 */
app.put('/product/update/:id', async (req, res) => {
    try{
        var reqestId = req.params.id;
        console.log(req.body)
        await Product.findOneAndUpdate({id: reqestId}, req.body);
        res.sendStatus(200);   
    }catch (error) {
        console.log(error);
        res.sendStatus(500);
    }


});

/**
 * Delete the given product
 */
app.delete('/product/delete/:id', async (req, res) => {
    var reqestId = req.params.id;
    await Product.findOneAndDelete({id: reqestId});
    res.sendStatus(200);
});


app.listen(4000, () => {
    console.log('server is listening in 4000');
});