const { Sequelize } = require("sequelize")

const sequelize = new Sequelize('toughts', 'root', '123321', {
    host: 'localhost',
    dialect: 'mysql'
})

try {
    sequelize.authenticate()
    console.log("MySQL conectado com sucesso!")
} catch (err) {
    console.log(`Não foi possível conectar: ${err}`)
}

module.exports = sequelize