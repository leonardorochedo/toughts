// import dele para manipular o banco
const User = require("../models/User")

// encriptar senha
const bcrypt = require("bcryptjs")

module.exports = class AuthController {
    static login(req, res) {
        res.render('auth/login')
    }

    static async loginPost(req, res) {

        // recebendo argumentos do body e colocando nas variaveis
        const {email, password} = req.body

        // verificando se o email existe
        const user = await User.findOne({ where: { email: email } })

        // se o email nao existir
        if(!user) {
            req.flash('message', 'Usuário não encontrado!')
            res.render('auth/login')

            return // para o codigo parar aqui
        } 

        // verificando se as senhas batem
        const checkIfPasswordMatch = bcrypt.compareSync(password, user.password)

        // se a senha nao bater
        if(!checkIfPasswordMatch) {
            req.flash('message', 'Senha incorreta!')
            res.render('auth/login')

            return // para o codigo parar aqui
        }

        // se bater tudo ok
        req.session.userid = user.id // iniciando sessão com o user autenticado
        req.flash('message', 'Logado com sucesso!')
        req.session.save(() => {
            res.redirect('/')
        })
    }

    static register(req, res) {
        res.render('auth/register')
    }

    static async registerPost(req, res) {
        
        const {name, email, password, confirmpassword} = req.body

        // password match validation
        if(password != confirmpassword) {
            // mensagem de erro
            req.flash('message', 'As senhas não conferem, tente novamente!')
            res.render('auth/register')

            return
        }

        // check if user exists
        const checkIfUserExists = await User.findOne({ where: { email: email } })
        
        if(checkIfUserExists) {
            // mensagem de erro
            req.flash('message', 'E-mail já existente, tente novamente!')
            res.render('auth/register')

            return
        }

        // create password with bcrypt
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt) // encrypting password
        
        const user = { // redefinindo usuario com senha encriptada
            name,
            email,
            password: hashedPassword
        }

        try {
            const createdUser = await User.create(user) // criando o user no banco

            // initialize session
            req.session.userid = createdUser.id

            req.flash('message', 'Cadastro realizado com sucesso!')

            // redirecionando usuario para /
            req.session.save(() => {
                res.redirect('/')
            })
        } catch(err) {
            console.log(err)
        }

    }
    
    static logout(req, res) {
        req.session.destroy() // removendo a sessão atual do sistema
        res.redirect('/login')
    }
}