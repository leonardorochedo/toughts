// imports
const express = require("express")
const exphbs = require("express-handlebars")
const session = require("express-session")
const FileStore = require("session-file-store")(session)
const flash = require("express-flash")

// iniciando o express
const app = express()

// chamando o banco
const conn = require("./db/conn")

// definindo a template engine sendo hbs
app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

// receber resposta do body em json
app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json())

// session middleware / configuração de sessão do usuario
app.use(
    session({
        name: "session",
        secret: "nosso_secret",
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function() {},
            path: require('path').join(require('os').tmpdir(), 'sessions')
        }),
        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000),
            httpOnly: true // em prod tem que ser https
        }
    })
)

// flash messages
app.use(flash())

// public path / liberando os assets
app.use(express.static('public'))

// set session to res
app.use((req, res, next) => {

    // passando a sessao da req para a res
    if(req.session.userid) {
        res.locals.session = req.session
    }

    next() // seguindo
})

// iniciando o banco juntamente com o express
conn
.sync()
.then(() => {
    app.listen(3000)
})
.catch((err) => console.log(err))