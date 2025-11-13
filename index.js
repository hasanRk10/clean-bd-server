const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT||5000;



const uri = "mongodb+srv://userDB:BOZ61BVJrFMmKIST@cluster0.rgnqjyx.mongodb.net/?appName=Cluster0";
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

    app.get('/info', async (req, res)=>{

        const result = await infoCollection.find().toArray() 

        res.send(result)
        
    })
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.use(cors())
app.use(express.json())

app.get('/', (req, res)=>{
    res.send('Cleaning BD Server is Running')
})

app.listen(port, ()=>{
    console.log(`Cleaning BD Server is Running on Port ${port}`);
})