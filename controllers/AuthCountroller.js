// import dele para manipular o banco
const User = require("../models/User")

// encriptar senha
const bcrypt = require("bcryptjs")

module.exports = class AuthController {
    static login(req, res) {
        res.render('auth/login')
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
}