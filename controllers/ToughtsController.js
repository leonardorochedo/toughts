// models
const Tought = require("../models/Tought")
const User = require("../models/User")

// bcrypt
const bcrypt = require("bcryptjs")

// like sql
const { Op } = require("sequelize")

module.exports = class ToughtsController {
    static async showToughts(req, res) {

        let search = ''

        // se tiver alguma search colocar na variavel
        if(req.query.search) {
            search = req.query.search
        }

        // definindo a ordem como decrescente
        let order = 'DESC'

        if(req.query.order == 'old') {
            order = 'ASC'
        } else {
            order = 'DESC'
        }

        const toughtsData = await Tought.findAll({
            include: User,
            where: {
                title: {[Op.like]: `%${search}%`} // like sql
            },
            order: [['createdAt', order]],
        }) // pegando todos os pensamentos incluindo o user

        const toughts = toughtsData.map((result) => result.get({ plain: true })) // dando um map e juntando todos em um array com o plain

        let toughtsQty = toughts.length

        if(toughtsQty === 0) {
            toughtsQty = false
        }

        res.render('toughts/home', { toughts, search, toughtsQty })
    }

    static async dashboard(req, res) {

        const userId = req.session.userid

        // pegando usuario do banco, incluindo o pensamento junto com a busca
        const user = await User.findOne({
            where: { id: userId },
            include: Tought,
            plain: true,
        })

        // check if user exists
        if(!user) {
            res.redirect('/login')
        }

        // limpando o array com map e selecionando apenas o dataValues
        const toughts = user.Toughts.map((result) => result.dataValues)

        let emptyToughts = false

        // verificando se tem alguma tarefa
        if(toughts.length === 0) {
            emptyToughts = true
        }

        res.render('toughts/dashboard', { toughts, emptyToughts })
    }

    static async profile(req, res) {

        const userId = req.session.userid

        const user = await User.findOne({ raw: true ,where: { id: userId } })

        res.render('toughts/profile', { user })
    }

    static async profileSave(req, res) {

        const userId = req.session.userid

        const user = await User.findOne({ where: { id: userId } })

        const {name, email, password} = req.body

        // se os dados foram iguais
        if(name === user.name && email === user.email) {
            req.flash('message', 'Dados permanecem iguais!')
            req.session.save(() => {
                res.redirect('/toughts/profile')
            })

            return // para o codigo parar aqui
        }

        const checkIfPasswordMatch = bcrypt.compareSync(password, user.password)

        // se as senhas não forem iguais
        if(!checkIfPasswordMatch) {
            req.flash('message', 'Senha incorreta!')
            req.session.save(() => {
                res.redirect('/toughts/profile')
            })

            return // para o codigo parar aqui
        }



        // usuario editado
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt) // encrypting password

        const userEdited = {
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        }

        try {
            await User.update(userEdited , { where: { id: userId } })

            req.flash('message', 'Perfil atualizado com sucesso!')
            req.session.save(() => {
                res.redirect('/')
            })
        } catch(err) {
            console.log(err)
        }

    }

    static createTought(req, res) {
        res.render('toughts/create')
    }

    static async createToughtSave(req, res) {

        // criando o objeto que iremos inserir no banco
        const tought = {
            title: req.body.title,
            UserId: req.session.userid // pegando o id do user na session
        }

        try {
            await Tought.create(tought) // criando pensamento

            req.flash('message', 'Pensamento criado com sucesso!')

            // salvando a sessao e redirecionando
            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })
        } catch(err) {
            console.log(err)
        }
        
    }

    static async removeTought(req, res) {

        const toughtId = req.body.id
        const UserId = req.session.userid

        try {
            // remover com o id do tought e do user junto
            await Tought.destroy({ where: { id: toughtId, UserId: UserId } })
            
            req.flash('message', 'Pensamento removido com sucesso!')

            // salvando a sessao e redirecionando
            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })
        } catch(err) {
            console.log(err)
        }

    }

    static async editTought(req, res) {

        const toughtId = req.params.id
        
        const tought = await Tought.findOne({ where: { id: toughtId }, raw: true })

        res.render('toughts/edit', { tought })
    }

    static async editToughtSave(req, res) {

        const id = req.body.id

        const tought = {
            title: req.body.title
        }
        
        try {
            await Tought.update(tought, { where: { id: id } }) // update no banco

            req.flash('message', 'Pensamento atualizado com sucesso!')
            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })
        } catch(err) {
            console.log(err)
        }

        
    }
}