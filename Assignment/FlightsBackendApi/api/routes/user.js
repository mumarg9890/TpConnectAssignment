const express= require('express');
const router=express.Router();
const mongoose= require('mongoose');
const User= require('../models/user');
const bcrypt= require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/signUp',(req,res,next)=>{

    User.find({email:req.body.email}).exec()
    .then((result) => {
        if (result.length >0) {
            return res.status(409).json({
                Message:'Email already registered'
            });
        }
    })
    .catch((error)=>{
        return res.status(500).json({
            Message:error.Message
        });
    });

    bcrypt.hash(req.body.password,10,(err,hash)=>{
     
        if (err) {
            return res.status(500).json({
                Message:err.Message
            });
        }
        else{
            const user = new User({
                _id:mongoose.Types.ObjectId(),
                email:req.body.email,
                password:hash,
                type:req.body.type
            });
            user.save()
            .then((result)=>{
            //
            const token=  jwt.sign({
                email:result.email,
                userId:result._id
            },
            process.env.jwt_key,
            {
                expiresIn:"1h"

            }
            );
           return res.status(201).json({
                    Message:'User created',
                    token:token,
                    type:result.type
                });
            })
            .catch((error)=>{
                return res.status(500).json({
                    Message:error.Message
                });
            })
        }
    })
});

router.post('/login',(req,res,next)=>{

    let email = req.body.email;
    let password= req.body.password;

    User.findOne({email:email}).exec()
    .then((findUser)=>{
        if (!findUser) {
            return res.status(401).json({
                Message :'Auth failed'
            });
        }
        else{
            bcrypt.compare(password,findUser.password,(err,result)=>{
                if (err) {
                    return res.status(401).json({
                        Message :'Auth failed'
                    });
                }
                if(result){
                    const token=  jwt.sign({
                          email:findUser.email,
                          userId:findUser._id
                      },
                      process.env.jwt_key,
                      {
                          expiresIn:"1h"
  
                      }
                      );
                      return res.status(200).json({
                          Message :'Auth successful',
                          token:token,
                          type:findUser.type
                      });
                  }
                  return res.status(401).json({
                      Message :'Auth failed'
                  });
            });
        }
    })
    .catch(findUserError =>{
        console.log(findUserError);
        return res.status(500).json({
            Message :findUserError.Message
        });
    })

});


module.exports=router;