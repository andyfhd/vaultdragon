var MongoClient = require('mongodb').MongoClient
var db

var express = require('express'),
    bodyParser = require('body-parser')

var app = express()
app.use(bodyParser.json())

MongoClient.connect('mongodb://vaultdragon:vaultdragon@ds155811.mlab.com:55811/vault-dragon', (err, database) => {
    if (err) return console.log(err)
    db = database
    app.listen(3000, () => {
        console.log('listening on port 3000')
    })
})

app.get('/object/:key', function (req, res) {
    var key = req.params.key
    var timestampQueryString = req.query.timestamp

    // query operation is done at DB level to reduce memory footprint
    // however this can be done in memory if the data needs to be accessed multiple times and performance is a priority
    var dbQuery

    // there is probably a better way to conditionally add the timestamp filter to the search query, 
    // however I'm not very familiar with MongoDB API and for now I'm just duplicating the same search criteria
    if (timestampQueryString === undefined) {
        dbQuery = db.collection('datastore').find({ key: key }, { sort: { timestamp: -1 }, limit: 1 })
    } else {
        dbQuery = db.collection('datastore').find({ key: key, timestamp: { $lt: parseInt(timestampQueryString) } }, { sort: { timestamp: -1 }, limit: 1 })
    }

    dbQuery.toArray(function (err, documents) {
        if (documents.length === 0) {
            res.statusCode = 404

            if (timestampQueryString === undefined)
                return res.send("Key not found!")
            else
                return res.send("Key with specified timestamp not found!")

        }

        return res.send(documents[0].value)
    })
})

app.post('/object', function (req, res) {   // area for improvement: improper JSON format is handled by body-parser, should intercept and provide custom error message
    var keys = Object.keys(req.body)
    if (keys.length !== 1) {
        res.statusCode = 400
        return res.send('wrong input format')   // area for improvement: should provide more feedback on why format is wrong
    }

    var key = keys[0]
    var value = req.body[key]
    var timestamp = new Date().getTime()
    db.collection('datastore').save({ 'key': key, 'value': value, 'timestamp': timestamp }, (err, result) => {
        if (err) {
            console.log(err)    // area for improvement: should use production level logging
            res.statusCode = 500
            return res.send(err)    // area for improvement: should consider using custom error message
        } else {
            return res.send('New record successfully saved to database\n\nkey: ' + key + '\nvalue: ' + value + '\ntimestamp: ' + timestamp)
        }
    })
})
