const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT||5000;
require('dotenv').config();

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nmzdq7c.mongodb.net/?appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    await client.connect();

    const db = client.db('cleanbdD')
    const infoCollection = db.collection('info')
    const issueCollection = db.collection('bids')
    const usersCollection = db.collection('users');

    app.post('/users', async(req, res)=>{
      const newUser = req.body

      const email = req.body.email;
      const query = {email: email}
      const existingUser = await usersCollection.findOne(query);
      if(existingUser){
        res.send('user alredy exist.')
      }
      
        const result = await usersCollection.insertOne(newUser);
        res.send(result);
      
      
    })

    app.get('/bids', async (req, res)=>{
        const email = req.query.email;
        const query = {};
        if(email){
            query.email = email;
        }
        const cursor = issueCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })

    app.get('/my-issues', async (req, res) =>{
      const email = req.query.email;
      if(!email){
        return res.status(400).send({message: "Email is required"})
      }
      const query = {email: email};
      const result = await infoCollection.find(query).toArray();
      res.send(result);
    })

    app.delete('/my-issues/:id', async (req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await  infoCollection.deleteOne(query);
      res.send(result)
    })

    app.get('/info', async (req, res)=>{

        const result = await infoCollection.find().toArray() 

        res.send(result)
        
    })
    
    app.get('/latest-issues', async (req, res)=>{
      const cursor = infoCollection.find().sort({ammount: -1}).limit(6);
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/info/:id', async (req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await infoCollection.findOne(query);
      res.send(result);
    })

    app.get('/info', async (req, res) =>{
      const cursor = infoCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post('/info', async (req, res) =>{
      const newIssue = req.body;
      const result = await infoCollection.insertOne(newIssue);
      res.send(result);
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res)=>{
    res.send('Cleaning BD Server is Running')
})

app.listen(port, ()=>{
    console.log(`Cleaning BD Server is Running on Port ${port}`);
})
