const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectID
const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



//mongo db
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8acpe.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;




app.get("/",(req,res)=>{
    res.send("yay our app is running")
})





const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
client.connect(err => {
  const activityCollection = client.db(process.env.DB_NAME).collection("volunteering-activity");
  const eventCollection = client.db(process.env.DB_NAME).collection("event");
  const userCollection = client.db(process.env.DB_NAME).collection("user");
  
    app.post("/AddActivity",(req,res)=>{
        
        const activity = req.body;
        activityCollection.insertOne(activity)
        .then(result =>{
            res.send(result.insertedCount > 0)
        })
    })


    app.get("/activity",(req,res)=>{

        activityCollection.find({})
        .toArray((err,documents)=>{
            res.send(documents)
        })

    })

    app.post("/eventRegistration",(req,res)=>{
        const data = req.body
        eventCollection.insertOne(data)
        .then(result =>{
            res.send(result.insertedCount>0)
        })
    })

    app.post("/user",(req,res)=>{
        user = req.body;
        userCollection.insertOne(user)
        .then(result => {
            res.send(result.insertedCount>0)
        })

    })
    
    app.get("/getuser",(req,res)=>{
        userCollection.find({})
        .toArray((err,documents)=>{
            res.send(documents)
        })
    })

    app.get("/event",(req,res)=>{
        const email = req.query.email
        eventCollection.find({email: email})
        .toArray((err,documents) => {
            res.send(documents)
        })
    })

    app.get("/allevent",(req,res)=>{
        eventCollection.find({})
        .toArray((err,documents) => {
            res.send(documents)
        })
    })

    app.delete("/delete/:id",(req,res)=>{
        eventCollection.deleteOne({_id : ObjectId(req.params.id)})
        .then(result => {
            res.send(result.deletedCount >0)
        })
      })

});




app.listen(process.env.PORT || port)