const http = require('http');
const hbs = require('hbs')
const express = require('express');
const session = require('express-session');
const app = express();
const path = require("path");


app.set('view engine', 'hbs')

//directory connection
app.set('views', path.join(__dirname, './views'));
app.use(express.static(path.join(__dirname, 'public')));

//  req.body convertion with this module otherwise undefined
app.use(express.json());
app.use(express.urlencoded({ extended: true}))

//session code
app.set('trust proxy',1)//trust first proxy
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {secure:false}
}))

app.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

    next();
  }) 


const email =  'trial@123'
const password = '123'

app.get('/', checkLogin,(req,res)=> {
    res.render("index",{name: req.session.user_id})
})

// app.use('/',function(err,req,res,next){
//     console.log(err)
//     res.render("login")
// })

app.get('/login', (req,res)=>{
    if(req.session.user){
        res.redirect("/")
    }else{
        res.render("login")
    }

    
})

app.post('/login',(req,res)=>{
   
    console.log(req.body)
    console.log(req.body.password)
    console.log(req.body.email)
    
    

    if(!req.body.email || !req.body.password){

        var message = "Please fill the form."
    
       
        res.render('login',{message:"Please fill both email and password."})
        console.log("ifffffffffffffffffffff")
    
    }else{
        
    
        if(user = req.body.email === email && req.body.password === password){
            console.log("keriiii")
            req.session.user = user
            console.log(req.session.user);
            res.redirect('/')
        }else{
            msg = true
            res.render('login',{msg})
            console.log('Wronge cred')
        }

    }})


    

    function checkAuthenticated(req,res,next){
        if(req.isAuthenticated()){
            next();
        }res.redirect('login')
    }

    function checkNAuthenticated(req, res,next){
        if(req.isAuthenticated()){
            return res.redirect('/')
        }
        next()
    }



app.get('/logout', (req,res)=>{
    req.session.destroy( () => {
        console.log("user logged out.")
    })
    res.redirect('/login');
})

function checkLogin(req,res,next){
    console.log("Check");
    console.log(req.session.body)
    if(req.session.user){
        console.log("session user")
        console.log(req.session.user)
        next()
    }
    else{
        let err = new Error("User not logged in.")
        next(err)
    }
}




app.get('/',(req,res)=>{
    res.render('home.hbs');
}) 


app.listen(5001 , () => console.log("server is running")); 