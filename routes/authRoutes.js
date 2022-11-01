// importando express para cricao de rotas
const express = require("express")
const router = express.Router()
// chamando o controller
const AuthController = require("../controllers/AuthCountroller")

// login get e post
router.get('/login', AuthController.login)
router.post('/login', AuthController.loginPost)

// register get e post
router.get('/register', AuthController.register)
router.post('/register', AuthController.registerPost)

// logout
router.get('/logout', AuthController.logout)

module.exports = router