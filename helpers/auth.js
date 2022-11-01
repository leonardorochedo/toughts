// middleware que checa se o user esta logado
module.exports.checkAuth = function(req, res, next) {
    const userId = req.session.userid

    // caso ele não esteja com uma sessão ativa / logado
    if(!userId) {
        res.redirect('/login')
    }

    // caso sim pode prosseguir
    next()
}