var User = require('../models/user')
var Bcrypt = require('bcrypt-nodejs')
var jwt = require('../helpers/jwt')
var path = require('path')


function registrar (req,res){
    
    var params = req.body

    var user = new User()

    user.nombre = params.nombre
    user.email = params.email
    user.password = params.password
    user.telefono = ''
    user.imagen = null
    user.bio = params.bio
    user.facebook= params.facebook
    user.estado = false

    
    if (params.password){        
        Bcrypt.hash(params.password,null,null, function(err,hash){
            user.password = hash            
            User.findOne({email: params.email},(err,user_data)=>{
                if(!user_data){
                    user.save((err,user)=>{
                        if (user){
                            res.status(200).send({user: user})
                        }else{
                            res.status(404).send({message: err})
                        }
                    })
                }else{
                    res.status(404).send({message: 'El correo ya existe'})
                }
            })
            })        
    }else{
        res.status(500).send({message: 'Ingrese la contraseña'})
    }
}

function login (req, res){
    var data = req.body

    User.findOne({email: data.email},(err,user_data)=> {
        if (err) {
            res.status(500).send({message: 'Error en el Servidor.'})
        }else{
            if (!user_data){
                res.status(404).send({message: 'No se encontro el usuario.'})
            }
            else{
                Bcrypt.compare(data.password,user_data.password,function(err,check){
                    if(check){
                        if (data.gettoken){
                            res.status(200).send({
                                jwt: jwt.createToken(user_data),
                                user: user_data,
                                message: 'With token'})
                        }else{
                            res.status(200).send({
                                jwt: jwt.createToken(user_data),
                                user: user_data,
                                message: 'No token'})
                        }
                    }else{
                        res.status(404).send({
                            message:'Usuario y contraseña no coinciden'
                        })
                    }
                })
            }
        }
    })

    
}

function get_user(req,res){
    let id = req.params['id']

    User.findById(id,(err,user)=>{
        if(err)
        {
            res.status(500).send({message: 'Error en el Servidor.'})
        }else{
            if (user)
            {
                res.status(200).send({user: user})
            }else
            {
                res.status(500).send({message: 'No existe un usuario con ese id'})
            }
        }
    })
}

function get_users(req,res){
    let id = req.params['id']

    User.find((err,users)=>{
        if(err)
        {
            res.status(500).send({message: 'Error en el Servidor.'})
        }else{
            if (users)
            {
                res.status(200).send({users: users})
            }else
            {
                res.status(500).send({message: 'No existen ningun usuario.'})
            }
        }
    })
}

function update_foto(req,res){
    let id = req.params['id']
    console.log(req)

    if (req.files.imagen)
    {
        let imagen_path = req.files.imagen.path
        let name = imagen_path.split('\\')
        let imagen_name = name[2]

        User.findByIdAndUpdate(id,{imagen: imagen_name},function(err,user_update){
            if(err){
                res.status(500).send({
                    message: 'Error en el servidor'
                })
            }else{
                if (user_update)
                {
                    res.status(200).send({
                        user: user_update
                    })
                }else{
                    res.status(500).send({
                        message: 'No se encontro el usuario'
                    })
                }
            }
        })
    }else{
        res.status(404).send({
            message: 'NO subiste imagen'
        })
    }
}

function get_img(req,res){
    var img = req.params['img']
    
    if (img != "null"){
        var img_path = './uploads/perfiles/'+img
        res.status(200).sendFile(path.resolve(img_path))
    }else{
        var img_path = './uploads/perfiles/default.jpg'
        res.status(200).sendFile(path.resolve(img_path)) 
    }

}

function editar_config(req,res){
    let id = req.params['id']
    var data = req.body

    if (req.files){
        //SI IMAGEN, SI CONTRASEÑA
        if(data.password){
                console.log(1)
                Bcrypt.hash(data.password,null,null,function(err,hash){
                let imagen_path = req.files.imagen.path
                let name = imagen_path.split('\\')
                let imagen_name = name[2]
                if(err){
                    res.status(500).send({
                        message: 'Error en el servidor.'
                    })
                }else{
                    User.findByIdAndUpdate(id,{
                        nombre: data.nombre,
                        password: hash,
                        imagen: imagen_name,
                        telefono: data.telefono,
                        bio: data.bio,
                        facebook: data.facebook,
                        estado: data.estado
                    },(err,user_data)=>{
                        if(user_data){
                            res.status(200).send({user:user_data})
                        }
                    })
                }
            })
        }else{
            //SI IMAGEN, NO CONTRASEÑA
            console.log(2)
                let imagen_path = req.files.imagen.path
                let name = imagen_path.split('\\')
                let imagen_name = name[2]
                    User.findByIdAndUpdate(id,{
                        nombre: data.nombre,
                        imagen: imagen_name,
                        telefono: data.telefono,
                        bio: data.bio,
                        facebook: data.facebook,
                        estado: data.estado
                    },(err,user_data)=>{
                        if(user_data){
                            res.status(200).send({user:user_data})
                        }
                    })
        }
    }else{
        //SI CONTRASEÑA, NO IMAGEN
        if(data.password){
            console.log(3)
            Bcrypt.hash(data.password,null,null,function(err,hash){
                if(err){
                    res.status(500).send({
                        message: 'Error en el servidor.'
                    })
                }else{
                    User.findByIdAndUpdate(id,{
                        nombre: data.nombre,
                        password: hash,
                        telefono: data.telefono,
                        bio: data.bio,
                        facebook: data.facebook,
                        estado: data.estado
                    },(err,user_data)=>{
                        if(user_data){
                            res.status(200).send({user:user_data})
                        }
                    })
                }
            })
        }else{
            //NO CONTRASEÑA, NO IMAGEN
            console.log(4)
                    User.findByIdAndUpdate(id,{
                        nombre: data.nombre,
                        telefono: data.telefono,
                        bio: data.bio,
                        facebook: data.facebook,
                        estado: data.estado
                    },(err,user_data)=>{
                        if(user_data){
                            res.status(200).send({user:user_data})
                        }
                    })
        }
    }
}

module.exports = {
    registrar,
    login,
    get_user,
    get_users,
    update_foto,
    get_img,
    editar_config
}