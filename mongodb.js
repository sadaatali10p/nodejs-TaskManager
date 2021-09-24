const { MongoClient, ObjectId } = require('mongodb')

const connStr = 'mongodb://127.0.0.1:27017' // in tutorial, instructor suggest to write ip instead of localhost as using localhost leads to create latency issues
const dbName = 'task-manager'

MongoClient.connect(connStr, { useNewUrlParser: true}, (error, client) => {
    if (error){
        return console.log('unable to connect to database server')
    }

    const db = client.db(dbName)

    db.collection('users').insertOne({
        name: 'Muhammad Umar',
        age: 10
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })

    // db.collection('tasks').insertMany([{
    //             description: 'Learn Node',
    //             completed: false
    //         },{
    //             description: 'Complete Section 10',
    //             completed: true
    //         },{
    //             description: 'Return Bulb',
    //             completed: true
    //         }
    //     ], (error, result) => {
    //         if (error){
    //         return console.log(error)
    //     }

    //     console.log(result)
    // })

    db.collection('users').find({
        name: 'Muhammad Umar'
    }).toArray((error, user) =>{
        if (error){
            return console.log(error)
        }
        console.log(user)
    })

    db.collection('tasks').updateMany({
        completed: true
    },
    {
        $set:{
            completed: false
        }
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })

    db.collection('users').deleteMany({
        age: 7
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })
})