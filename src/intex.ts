// @ts-nocheck
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const redis = require('redis');
const redisClient = redis.createClient({url: process.env.REDIS_HOST}); 
redisClient.connect();
redisClient.set("123", "123")

// Create Express app
const app = express();
app.use(bodyParser.json());

// Endpoint to store HTTP request headers
app.get('/store/:key', (req, res) => {
    const key = req.params.key;
    const headers = req.headers;
    console.log(headers)
    console.log(redisClient)
    redisClient.set(key, JSON.stringify(headers), 'EX', '3600')
    res.send(`Headers stored with key ${key}`);
});

// Endpoint to retrieve data by key
app.get('/get/:key', async (req, res) => {
    const key = req.params.key;
    let reply = await redisClient.get(key)
    res.json(JSON.parse(reply));
});

// Start the server
app.listen(process.env.APP_PORT, () => {
    console.log(`Server running on port ${process.env.APP_PORT}`);
});