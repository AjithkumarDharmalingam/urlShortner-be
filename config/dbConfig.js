const mongodb = require('mongodb')
const dbName = `urlShortner`
const dbUrl = `mongodb+srv://Ajith:ajith143@cluster0.xjma2lx.mongodb.net/${dbName}`
const MongoClient = mongodb.MongoClient
module.exports = {mongodb,dbName,dbUrl,MongoClient}