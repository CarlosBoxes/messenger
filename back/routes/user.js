var express = require('express')
var userController = require('../controllers/UserController')
var multiParty = require('connect-multiparty')
var path = multiParty({uploadDir: './uploads/perfiles'})

var app = express.Router()

app.post('/registrar',userController.registrar)
app.post('/login',userController.login)
app.get('/usuario/:id',userController.get_user)
app.get('/usuarios/',userController.get_users)
app.put('/usuario/editar/imagen/:id',path,userController.update_foto)
app.get('/usuario/img/:img',userController.get_img)
app.put('/usuario/editar/:id',path,userController.editar_config)
module.exports = app
