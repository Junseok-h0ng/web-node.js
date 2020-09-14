const express = require('express')
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express()

const port = 80

app.set('view engine', 'ejs');
app.set('views', './views')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/'));

app.use(express.static('../public'));


app.get('/', (req, res) => { // (3)
    res.render("index.ejs");
});

app.listen(port, () => { // (2)
    console.log('server is running localhost:8080');
});