const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { ObjectId } = require('mongodb');
require('dotenv').config();
app.use(cors());
app.use((express.json()));



const uri = `mongodb+srv://${process.env.user}:${process.env.user_pass}@cluster0.8cinysu.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
const BooksphareDB = client.db("BooksphareDB");
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req , res)=>{
    res.send('server running')
})
app.get('/allbooks', async(req, res)=>{
    const allbooks = BooksphareDB.collection("allbooks");
    const result = await allbooks.find().toArray();
    res.send(result);
})


app.post('/allbooks', async(req, res)=>{
    const allbooks = BooksphareDB.collection("allbooks");
    const result = await allbooks.insertOne(req.body);
    res.send(result);

})
app.delete('/book/:id', async(req, res)=>{
    const id = req.params.id;
    const allbooks = BooksphareDB.collection("allbooks");
   
    const query = {_id: new ObjectId(id)}
    const result = await allbooks.deleteOne(query);
    res.send(result);
})

app.get('/book/:id', async (req, res) => {
    const allbooks = BooksphareDB.collection("allbooks");
    const id = req.params.id;
  
    try {
      const result = await allbooks.findOne({ _id: new ObjectId(id) });
  
      if (!result) {
        res.status(404).json({ error: 'Book not found' });
      } else {
        res.json(result);
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

app.listen(port, ()=>{
    console.log(`App is running in the port ${port}`)
})