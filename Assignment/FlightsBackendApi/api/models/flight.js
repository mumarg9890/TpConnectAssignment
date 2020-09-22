const mongoose =require('mongoose');

const flightSchema =mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    airLine:{type:String, required:true}, 
    plane:{type:String, required:true},
    origin:{type:String, required:true},
    destinaiton:{type:String, required:true},
    flightHOurs:{type:String, required:true}
});

module.exports=mongoose.model('Flight',flightSchema);