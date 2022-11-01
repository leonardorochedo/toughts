// models
const Tought = require("../models/Tought")
const User = require("../models/User")

module.exports = class ToughtsController {
    static async showToughts(req, res) {
        res.render('toughts/home')
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

        res.render('toughts/dashboard', { toughts })
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
}