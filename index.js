const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.port || 5000
require('dotenv').config()


//middleware
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mfnurby.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();


        //DoCollection=>>>>>>>>>
        const doCollection = client.db('HotelDB').collection('do')

        //send "do" data to the server
        app.post('/do', async (req, res) => {
            const newItem = req.body
            const result = await doCollection.insertOne(newItem)
            res.send(result)
        })
        app.get('/do', async (req, res) => {
            const data = doCollection.find()
            const result = await data.toArray()
            res.send(result)
        })

        //room Collection
        const roomsCollection = client.db('HotelDB').collection('rooms')

        app.post('/rooms', async (req, res) => {
            const newRoom = req.body
            const result = await roomsCollection.insertOne(newRoom)
            res.send(result)

        })
        app.get('/rooms', async (req, res) => {
            const data = roomsCollection.find()
            const result = await data.toArray()
            res.send(result)

        })

        app.get('/rooms/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }

            const options = {
                projection: { customerName: 1, price: 1, images: 1, room_description: 1 },
            };
            const result = await roomsCollection.findOne(query, options)
            res.send(result)
        })
        //bookings collection
        const bookingsCollection = client.db('HotelDB').collection('bookings')
       
       
        app.post('/bookings', async (req, res) => {
            const bookings = req.body
            const result = await bookingsCollection.insertOne(bookings)
            res.send(result)
            
        })
       
       
        app.get('/bookings', async (req, res) => {
            console.log(req.query.email);
            let query = {}
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await bookingsCollection.find(query).toArray()
            res.send(result)
        })


        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result=await bookingsCollection.deleteOne(query)
            res.send(result)
        })

        app.patch('/bookings/:id',async(req,res)=>{
            const updatedBooking=req.body
            console.log(updatedBooking);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



//
app.get('/', (req, res) => {
    res.send('fashion is running in website')
})
app.listen(port, () => {
    console.log(`fashion server ${port}`);
})