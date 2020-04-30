var mongoose = require('mongoose')
var schema = mongoose.Schema

var UserSchema = schema ({
    nombre: String,
    email: String,
    password: String,
    telefono: String,
    imagen: String,
    bio: String,
    facebook: String,
    estado: Boolean
})

module.exports = mongoose.model('user',UserSchema)