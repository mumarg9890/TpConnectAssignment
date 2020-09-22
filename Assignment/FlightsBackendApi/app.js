const express=require ('express');
const app= express();
const bodyParser=require('body-parser');
const mongoose= require('mongoose');
const cors = require('cors');
const userRoutes = require('./api/routes/user');
const flightRoutes = require('./api/routes/flight');

mongoose.Promise=global.Promise;
//monodb db on local system
mongoose.connect('mongodb://localhost:27017/react-App',
{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(result =>{
    console.log('connected successfully')
}).catch(err =>{
    console.log('error in conneciton');
});

app.use(bodyParser.urlencoded({extended:false}));  // encode url data
app.use(bodyParser.json());  // encode json data
app.use(cors());

// app.use('/products',productRoutes);
 app.use('/flights',flightRoutes);
 app.use('/users',userRoutes);

// create error for not matching routes
app.use((req,res,next)=>{
    const error= new Error(' Not found');
    error.status=404;
    next(error);
    
});


app.use((err,req,res,next)=>{
    res.status(err.status || 500);
    res.json({
        error:{message:err.message}
    });
});


module.exports=app;