const express = require('express')
const app = express()
const port = 7000
const shortid = require('shortid')


// mongodb connection 
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});
const dbConnection = mongoose.connection
dbConnection.on('open', () => {
    console.log('Connected to DB!')
})

// URL table to save in the database
const URL = mongoose.model("url", {
    hash: String,
    url: String,
    hits: { type: Number, default: 0 }
});

//  logging how many request made
const loggerMiddleware = (req, res, next) => {
    console.log(`${req.method} ${req.url}`)
    next()
}


app.use(loggerMiddleware)
app.use(express.json())

// app.get('/', (req, res) => {
//     return res.send('Hello World')
// })

app.post('/shorten', (req, res) => {
    console.log(req.body)
    URL.findOne({url: req.body.url}).exec()
        .then(existingUrl => {
            // check if url has been already created
            if (existingUrl) {
                    return existingUrl;
            // create if no shorten url exist
            } else {
                    const hash = shortid.generate();
                    return URL.create({ hash: hash, url: req.body.url });
            }
        })
        .then(doc => {
            return res.status(201).send(doc)
        })
})

app.get('/:hash', (req, res) => {
    console.log(req.params);
    URL.findOne({hash: req.params.hash}).exec()
        .then(existingUrl => {
            if (existingUrl) {
                console.log("Redirecting...")
                // update the URL HITS here
                // how to update any row in a table in mongodb  
                return URL.update({hash: req.params.hash},{$set:{hits: existingUrl.hits+1}}).exec()
                        .then(() => {
                            console.log(existingUrl)
                            return res.redirect(existingUrl.url);
                        })
            } else {
                return res.status(404)
            }
        })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))