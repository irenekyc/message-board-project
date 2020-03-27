const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017'
const dbName = 'Message0325';


MongoClient.connect(url, {useNewUrlParser:true}, (err, client)=>{
  if (err){
   return console.log('Error')
  }
  console.log('Connected!')
  const db = client.db(dbName)

  db.collection('message').insertOne({
    username: 'Irene',
    categories: 'question',
    message: 'Q'
  })


})