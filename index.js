const express = require('express')
const cors=require('cors')
var jwt = require('jsonwebtoken');
const app = express()
const port =process.env.PORT|| 5000
require('dotenv').config()
// middleware
app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ozp7u.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
       await client.connect()
      console.log('db connected')
      const productCollection=client.db("products").collection('data');
      app.post('/login',(req,res)=>{
        const email=req.body
        // console.log(email)
        const token = jwt.sign(email, process.env.ACCES_TOKEN);
        res.send({token})
      })
      app.post('/upladepd',async(req,res)=>{
         const product=req.body;
         const tokenInfo=req.headers.authorization;
        //  console.log(tokenInfo)
         const[email,accesToken]=tokenInfo.split(' ')
         const decoded = jwt.verify(accesToken, process.env.ACCES_TOKEN);
        //  console.log(decoded.email)
        //  console.log(email,"ttt",accesToken)
        if(email===decoded.email){
            const result=await productCollection.insertOne(product)
            res.send(result)
        }
        
      })
    } finally {
      
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})