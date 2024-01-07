import { Server } from 'socket.io';
import { MongoClient, ServerApiVersion } from 'mongodb';
import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
dotenv.config();

//express used require globals, this replaces them for es6
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//require('dotenv').config()
console.log(process.env.MONGODB_CONNECTION_STRING)

//const express = require('express');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

//express serves a webpage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

/* MongoDB settings */
const uri = process.env.MONGODB_CONNECTION_STRING;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
let mongoClient = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

/* MongoDB events */
  
let database, messages, changeStream
async function run() {
  try {
    console.log('connecting');
    await mongoClient.connect(); 
    await mongoClient.db("admin").command({ ping: 1 }); // Send a ping to confirm a successful connection
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    database = mongoClient.db('chat2'); //if the db does not exist it is created
    messages = database.collection('messages'); //if the collection does not exist it is created
    // open a Change Stream on the "messages" collection
    changeStream = messages.watch();
    
    // set up a listener when change events are emitted
    changeStream.on("change", next => {
      // process any change event
      switch (next.operationType) {
        case 'insert':
            io.emit('chat message update', next.fullDocument.message);
            console.log(next.fullDocument.message);
            break;

        case 'update':
            io.emit('chat message update', next.updateDescription.updatedFields.message);
            console.log(next.updateDescription.updatedFields.message);
      }
    });

  } catch {
    console.log('error connecting to mongoDB or connection closed');
    // Ensures that the client will close when you finish/error
    await mongoClient.close();
  }
}

/* socketio events */

io.on('connection', (socket) => {
  //console.log(socket)

  /**
  console.log('new connection');
  console.log('--------------------------------------',
    '\n--------------------------------------',
    '\n--------------------------------------',
    '\nSocket From Here:');
  */
  //console.log(socket)
  console.log('-----------\nNew connection socketID: ' + socket.id + '\n' +
  'handshake address: ' + socket.handshake.address + '\n' +
  '-----------');
  //io.emit('new connection', ); //emits to clients about new connection (not necessary)
  socket.on('chat message submit', (msg) => {
    console.log(mongoClient)
    if (messages) {
      messages.insertOne({ message: msg });
      console.log('inserting message: ' + msg);
    }
  });
  socket.on('new client', (uniqueID) => {
    if (uniqueID) console.log(socket.id, 'connected with unique ID: ', uniqueID);
  });

  socket.on('newBunny', (count) => {
    console.log('new bunny!', count, socket.handshake.address);
  });
});

run().catch(console.dir);