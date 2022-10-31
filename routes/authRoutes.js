// importando express para cricao de rotas
const express = require("express")
const router = express.Router()
// chamando o controller
const AuthController = require("../controllers/AuthCountroller")

router.get('/login', AuthController.login)
router.get('/register', AuthController.register)
router.post('/register', AuthController.registerPost)

module.exports = router