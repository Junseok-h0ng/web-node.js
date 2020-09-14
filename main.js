const express = require('express');

const app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(80, () => {
    console.log('server is running localhost:8080');
});