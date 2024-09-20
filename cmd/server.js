const express = require("express")
const path = require("path")
const redis = require('redis');
const { MongoClient} = require('mongodb');

var messages = require('../api/grpc/nodejs/api-grpc_pb');
var services = require('../api/grpc/nodejs/api-grpc_grpc_pb');

require('dotenv').config();

var grpc = require('@grpc/grpc-js');

const PORT = process.env.JS_PORT || 3000
const mongoHost = process.env.MONGO_HOST
const mongoPort = process.env.MONGO_PORT
const mongoUserName = process.env.MONGO_USERNAME
const mongoPassword = process.env.MONGO_PASSWORD
const mongoURI = `mongodb://${mongoUserName}:${mongoPassword}@${mongoHost}:${mongoPort}`

const grpcURL = `${process.env.GRPC_HOST}:${process.env.GRPC_PORT}`

const app = express()

app.use(express.json())
app.use(express.static(path.join(__dirname,"../")))
app.use(express.urlencoded({extended: false}))

const redisClient = redis.createClient({
    url: process.env.REDIS_URL,
   password: process.env.REDIS_PASS
})

const mongoClient = new MongoClient(mongoURI)

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

app.get("/tickets", async (req, res) => {
    try {
        const request = req.query.clientName

        await redisClient.connect()

        const redisData = await redisClient.json.get('cart')
        
        if (redisData != null) {
            const filteredTicket = redisData.filter(ticket => ticket.clientName == request)
            await redisClient.quit()

            return res.status(200).send({
                "statusCode": 200,
                "message": filteredTicket
            })
        } else { 
            const data = await getDB(request)

            if (data == "clientName not found !") {
                await redisClient.quit()

                return res.status(404).send({
                    "statusCode": 404,
                    "message": "Not Found !"
                })
            } else if (data == "err") {
                await redisClient.quit()

                return res.status(500).send({
                    "statusCode": 500,
                    "message": "Server Error!"
                })
            } else { 
                await redisClient.quit()

                return res.status(200).send({
                    "statusCode": 200,
                    "message": data
                })
            }
        }


    } catch (e) {
        await redisClient.quit()

        console.log(e)
        res.status(500).send({
            "statusCode": 500,
            "message": "Server Error!"
        })
    }
})

app.post("/ticket/add", async (req, res) => {
    try {
        const requestData = req.body
        var key = requestData[0].clientName
        var secondExpired = 60

        await redisClient.connect()

        await redisClient.json.set(key, "$", requestData)

        await redisClient.expire(key, secondExpired) // Set expired time for Key 

        await addDB(requestData)

        await redisClient.quit()

        res.status(200).send("Successful add Redis")
    } catch (e) {
        await redisClient.quit()
        console.log(e);
        return res.status(500);
    }
})

app.post("/booking", async (req, res) => {
    try {
        const query = req.query.clientName;
        await redisClient.connect();

        // Get the cart value from Redis
        const value = await redisClient.json.get(query);

        if (value == null) { 
            redisClient.quit()
            return res.status(404).send({
                "statusCode": 404,
                "message" : "Not found cart on redis !"
            })
        }

        // Construct the gRPC request
        const request = new messages.TicketRequest();
        
        const tickets = value.map(ticket => {
            const ticketMessage = new messages.Ticket();
            ticketMessage.setTicketid(ticket.ticketId);
            ticketMessage.setTicketname(ticket.ticketName);
            ticketMessage.setTicketquantity(ticket.ticketQuantity);
            ticketMessage.setTicketseatList(ticket.ticketSeat);
            ticketMessage.setTicketprice(ticket.ticketPrice);
            ticketMessage.setCheckin(ticket.checkIn);
            ticketMessage.setCheckout(ticket.checkOut);
            ticketMessage.setClientname(ticket.clientName);
            return ticketMessage;
        });

        request.setTicketList(tickets);

        // Create gRPC client
        const grpcClient = new services.PaymentServiceClient(grpcURL, grpc.credentials.createInsecure());

        // Call the gRPC service
        await grpcClient.paymentProduct(request, async (err, response) => {
            if (err) {
                console.error('Error:', err);
                return res.status(500).send("gRPC Error: " + err.message);
            }
            if (response.getMessage() == "Payment Successful !") {
                await redisClient.del(query)
            }
            await redisClient.quit()

            return res.status(200).send("Booking status: " + response.getMessage());
        });
    } catch (e) {
        console.error(e);
        await redisClient.quit()
        res.status(500).send("Server Error!");
    } 
});


app.listen(PORT, () => { 
    console.log(`Listening on PORT ${PORT}... `)
})

async function addDB(data) {
    
    try {
        await mongoClient.connect()

        const mongoRun = mongoClient.db("testDB").collection("api-grpc")
        
        for (const ticket of data) { 
            const existingData = await mongoRun.findOne({ticketId : ticket.ticketId})

            if (existingData == null) {
                await mongoRun.insertOne(ticket)
                console.log(`A ticket ${ticket.ticketId} was inserted`);
            }
        }

       await mongoClient.close() 
    } catch (e) {
        console.log(e)
    }
}

async function getDB(clientName) {
    try {
        if (clientName == null) { 
            return "clientName not found !"
        }
        
        var resultArr = []
        await mongoClient.connect()

        var findResult = mongoClient.db("testDB").collection("api-grpc").find({clientName : clientName})

        for await (const doc of findResult) { 
            resultArr.push(doc)
        }

        await mongoClient.close()
        
        return resultArr
    } catch (e) {
        console.log(e)
        mongoClient.close()
        return "err"
    }
}