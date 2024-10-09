const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());
const users = [];
const JWT_SECRET = "ILOVEKIARA"

function auth(req,res,next){
    console.log(req);
    const token = req.body.token;
    console.log(token);
    const user = users.find(u=>{
        if(u.token == token) return u;
    });
    if(user.username){
        req.username = user.username;
        next();
        return;
    }
    res.json({
        msg:"Login invalid"
    })
    return;
    
}

app.get('/',(req,res)=>{
   res.sendFile(__dirname + '/public/index.html');
})

app.post('/todo',auth,(req,res)=>{
    res.header('username',req.username);
    res.sendFile(__dirname+'/public/todo.html');
})


app.post('/signup',(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;


    if(users.find(u => u.username === username)){
        res.json({
            msg:"User Already exist"
        })
        return;
    }

    const obj = {
        username:username,
        password:password
    };
    users.push(obj);
    console.log(users);
    res.json({
        msg:"You have signed up"
    })
})

app.post('/signin',(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    let foundUser = null;

    foundUser = users.find( u=>{
        if(u.username === username && u.password === password) return u;
    })
    console.log(foundUser);

    if(foundUser){
        const token = jwt.sign({
            "username":username
        },JWT_SECRET);
        foundUser.token = token;
        console.log(token);
        res.status(200);
        res.json({
            msg:"You have logged in ",
            token:token
        })
        return;

    }
    res.status(404);
    res.json({
        msg:"Login invalid"
    })

})

app.post('/Todo-add',auth,(req,res)=>{
    const user = users.find(u=>{
        if(u.username == req.username) return u;
    });
    if(user.username){
        console.log(req.body.Todo);
        if(user.data){
            user.data.push(req.body.Todo);
        }
        else{
            user.data=[req.body.Todo];
        }
        console.log(users);
        res.send("Ok");

    }
})

app.post('/Todo-get',auth,(req,res)=>{
    const user = users.find(u=>{
        if(u.username == req.username) return u;
    });
    if(user.username){
        res.json({
            "Todo":user.data
        })

    }

})

app.post('/Todo-del',(req,res)=>{
    const user = users.find(u=>{
        if(u.username == req.username) return u;
    });
    const id = req.body.id;
    const data=[];
    console.log(user);
    if(user.username){
        for(let i =0;i<user.data.length;i++){
            if(user.data[i].id != id) data.push(user.data[i]); 
        }

    }
    user.data=data;
    console.log(users);
    res.send("Done");

})


app.listen(3000);