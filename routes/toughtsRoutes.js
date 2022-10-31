// importando express para cricao de rotas
const express = require("express")
const router = express.Router()
// chamando o controller
const ToughtsController = require("../controllers/ToughtsController")

router.get('/', ToughtsController.showToughts)

module.exports = router