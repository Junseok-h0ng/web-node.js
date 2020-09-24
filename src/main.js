const express = require('express')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const Filestore = require('session-file-store')(session);
const flash = require('connect-flash');
const app = express();

const auth = require('./lib/auth');


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
app.use(flash());

require('./lib/passport')(app);

app.get('/', (req, res) => { // (3)
    res.render("index.ejs", {
        userStatus: auth.status(req)
    });
});

app.use('/user', require('./router/user'));
app.use('/topic', require('./router/topic'));


const port = 80;
app.listen(port, () => {
    console.log('server is running localhost:80');
});


//sessions으로 user값 넘기기 완료
//로그인 상태창 변경 완료
//로그인 암호화 완료
//회원가입 프로세스 완료
//------------------------------------------ 2020/09/20
//회원가입 중복 처리(modal) 완료
//로그인 상태창 displayname 표시 완료
//------------------------------------------ 2020/09/21
//로그인 실패 처리 완료
//user 페이지 구현 완료
//------------------------------------------ 2020/09/22
//토픽 생성 완료
//create 폼 완료
//user 페이지 create  완료
//programming, topic  완료
//------------------------------------------ 2020/09/23
//topic,create 접근 에러 처리 완료
//sanitize-html 위험요소 제거 완료
//topic 내용 컨테이너 초과 방지 완료
//topic user db 연동(displayname) 완료
//------------------------------------------ 2020/09/24
//user page 메뉴(user의 글목록,계정 패스워드 변경, 계정 삭제)
//programming 페이지 3개의 테이블 씩 출력 및 다음페이지 이동
