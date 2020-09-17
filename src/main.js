const express = require('express')
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const Filestore = require('session-file-store')(session);
const app = express()
const auth = require('./lib/auth');
const port = 80;
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new Filestore({ path: require('path').join(require('os').tmpdir(), 'sessions') })
}));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', './views')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('../public'));
require('./lib/passport')(app);

app.get('/', (req, res) => { // (3)
    console.log(auth.isOwner(req));
    res.render("index.ejs");
});
app.use('/user', require('./router/user'));
app.use('/topic', require('./router/topic'));

app.listen(port, () => { // (2)
    console.log('server is running localhost:80');
});