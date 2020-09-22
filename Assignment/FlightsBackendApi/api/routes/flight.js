const express= require('express');
const router=express.Router();
const mongoose= require('mongoose');
const Flight= require('../models/flight');
const checkAuth= require('../middleware/check-auth');

router.get('/',(req,res,next)=>{
    Flight.find().exec().then(result =>{
        console.log(result);
        if (result.length>0) {
            var response ={
               Flight:result.map(resulst =>{
                    return {
                        airLine:resulst.airLine,
                        plane:resulst.plane,
                        id:resulst._id,
                        origin:resulst.origin,
                        destinaiton:resulst.destinaiton,
                        flightHOurs:resulst.flightHOurs,
                        
                    }
            })
        }
            res.status(200).json(response);
        } else {
            res.status(404).json({
                Message:'no data found'
            });
        }
        
    }).catch(err=>{
        res.status(500).json(err)
    })
    
});

router.post('/Add',checkAuth,(req,res,next)=>{

    console.log(req.file);
    const flight = new Flight({
         _id:new mongoose.Types.ObjectId(),
         airLine:req.body.airLine,
         plane:req.body.plane,
         origin:req.body.origin,
         destinaiton:req.body.destinaiton, 
         flightHOurs:req.body.flightHOurs
     });

     flight.save().then(result=>{
         console.log(result);
        res.status(201).json({
            Message:'Flight created successfully',
            Flight:{
                airLine:result.airLine,
                plane:result.plane,
                id:result._id,
                origin:result.origin,
                destinaiton:result.destinaiton,
                origin:result.flightHOurs,
                
            }
        });
        console.log(result);
    }).catch(err =>{
        console.log(err);
        res.status(500).json({
            Message:err.message,
            code:500
        });
    });

});

router.get('/(:flightID)',checkAuth,(req,res,next)=>{
    const id =req.params.flightID;
      
        Flight.findById(id).exec().then(result=>{
            if (result) {
                console.log(result);
              res.status(200).json({
                    Flight:{
                        airLine:result.airLine,
                        plane:result.plane,
                        id:result._id,
                        origin:result.origin,
                        destinaiton:result.destinaiton,
                        flightHOurs:result.flightHOurs,
                        
                    }
                });
            } else {
                res.status(404).json({
                    Message:'no value found',
                    code:404
                });
            }
         
        }).catch(error=>{
            res.status(500).json(
                {
                    Message:error.message
                });
        });

});

router.delete('/(:flightID)',checkAuth, (req,res,next)=>{
    const id =req.params.flightID;
   
    Flight.deleteOne({_id:id}).then(result=>{
        console.log(result);
        res.status(200).json({
            Message:'Flight deleted successfully'
                  });
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            message:err.message
        });
    })

    
});

router.patch('/(:flightID)',checkAuth, (req,res,next)=>{
    const id =req.params.flightID;

    const updateOps={};
    for (const ops of req.body){
        updateOps[ops.propName]=ops.value;
    }
       console.log(updateOps);
    Flight.update({_id:id},{$set:updateOps}).exec().then(result=>{
        console.log(result);
        res.status(200).json({
            Message:'Flight updated'
          });
    }).catch(error=>{
        console.log(error);
        res.status(500).json({
            Message:error.message
        })
    })
    // res.status(200).json({
    //     message:'Updated Product with patch'
    // });
});

module.exports=router;
