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
    res.render("index.ejs", {
        userStatus: auth.status(req)
    });
});
// app.post('/register',function(req,res){
//     const user = req.body;
//     // const id = shortid.generate();
//     // bcrypt.hash(user.password,10,(err,pwd)=>{
//         // db.insertUser(id,user,pwd)
//     // });
//     res.redirect('/'); 
// })
app.use('/user', require('./router/user'));
app.use('/topic', require('./router/topic'));

app.listen(port, () => { // (2)
    console.log('server is running localhost:80');
});


//sessions으로 user값 넘기기 완료
//로그인 상태창 변경 예정
//로그인 암호화 예정
//회원가입 프로세스 예정