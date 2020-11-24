// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectID
//applying destructuring
const {MongoClient, ObjectID} = require('mongodb')

const connectionURL = 'mongodb+srv://mostafa:hIeJG6rXzsRoY69h@cluster0.kor3k.mongodb.net'
const databaseName = 'task-manager'

// const id = new ObjectID()
// console.log(id)
// console.log(id.id)
// console.log(id.id.length)
// console.log(id.toHexString())
// console.log(id.toHexString().length)
// console.log(id.getTimestamp())

MongoClient.connect(connectionURL, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
    if(error){
        return console.log('Unable to connect to database!')
    }

    //console.log('connected to database successfully.')

    const db = client.db(databaseName)
    // db.collection('users').insertOne({
    //     _id: id,//you can provide your own generated id
    //     name: 'John',
    //     age: 35
    // }, (error, result) => {
    //     if(error){
    //         return console.log('Unable to insert user!')
    //     }
    //     console.log(result.ops)
    // })

    // db.collection('users').insertMany([
    //     {
    //         name: 'Ahmed',
    //         age: 38
    //     },
    //     {
    //         name: 'Hassan',
    //         age: 22
    //     }
    // ], (error, result) => {
    //     if(error){
    //         return console.log('Unable to insert users!')
    //     }
    //     console.log(result.ops)
    // })

    // db.collection('tasks').insertMany([
    //     {description: 'task 1', completed: true},
    //     {description: 'task 2', completed: false},
    //     {description: 'task 3', completed: true}
    // ], (error, result) => {
    //     if(error){
    //         return console.log('Unable to insert tasks!')
    //     }
    //     console.log(result.ops)
    // })
    
    // db.collection('users').findOne({/*name: 'John'*/ _id: new ObjectID("5fa2b42e0b828e2b34430351")}, (error, user) => {
    //     if(error){
    //         return console.log('Unable to get user!')
    //     }
    //     console.log(user)
    // })

    //find() returns a cursor to documents not documents 
    // db.collection('users').find({name: 'Mostafa'}).toArray((error, users) => {
    //     if(error){
    //         return console.log('Unable to get users!')
    //     }
    //     console.log(users)
    // })

    // db.collection('tasks').findOne({_id: new ObjectID("5fa2b52df19b592a7c875786")}, (error, task) => {
    //     if(error){
    //         return console.log('Unable to get task!')
    //     }
    //     console.log(task)
    // })

    // db.collection('tasks').find({completed: false}).toArray((error, tasks) => {
    //     if(error){
    //         return console.log('Unable to get tasks!')
    //     }
    //     console.log(tasks)
    // })

    // db.collection('users').updateOne(
    //     {
    //         _id: new ObjectID("5fa2b00ae474361f3032d0dd")
    //     },{
    //         // $set: {//using set operator to define which fields to update
    //         //     name: 'Mostafa Sayed'
    //         // }
    //         $inc:{//increment specified field
    //             age: 1
    //         }
    //     }
    // ).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // db.collection('tasks').updateMany(
    //     {
    //         completed: true
    //     },
    //     {
    //         $set: {
    //             completed: false
    //         }
    //     }
    // ).then((result) => {
    //     console.log(result.modifiedCount)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // db.collection('tasks').deleteOne(
    //     {
    //         description: 'task 1'
    //     }
    // ).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // db.collection('users').deleteMany({
    //     age: 26
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })
})