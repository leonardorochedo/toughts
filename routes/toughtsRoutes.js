// importando express para cricao de rotas
const express = require("express")
const router = express.Router()
// chamando o controller
const ToughtsController = require("../controllers/ToughtsController")

// helper / middleware de checkauth
const checkAuth = require("../helpers/auth").checkAuth

router.get('/add', checkAuth, ToughtsController.createTought) // 2 arguymento de validacao de rota
router.post('/add', checkAuth, ToughtsController.createToughtSave) // 2 arguymento de validacao de rota

router.get('/dashboard', checkAuth, ToughtsController.dashboard) // 2 arguymento de validacao de rota

router.get('/profile', checkAuth, ToughtsController.profile)
router.post('/profile', checkAuth, ToughtsController.profileSave)


// remove / edit tought
router.post('/remove', checkAuth, ToughtsController.removeTought)
router.get('/edit/:id', checkAuth, ToughtsController.editTought)
router.post('/edit', checkAuth, ToughtsController.editToughtSave)

router.get('/', ToughtsController.showToughts)

module.exports = router