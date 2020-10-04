const express = require('express')
var cors = require('cors')
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express()
app.use(cors());
const port = 8000;
app.use('/api', createProxyMiddleware({ 
    target: 'http://localhost:8080/', //original url
    changeOrigin: true, 
    //secure: false,
    onProxyRes: function (proxyRes, req, res) {
       proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    }
}));

const testMovie = require("./data/test-movie-list.json");
const testCollab = require("./data/test-collaborators-list.json");
const abaMovie = require("./data/abaddon-movie-list.json");
const abaCollab = require("./data/abaddon-collaborators-list.json");

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/name/test/movie', (req, res) => {
    res.send(testMovie);
})
app.get('/name/test/collab', (req, res) => {
    res.send(testCollab);
})
app.get('/name/abaddon/movie', (req, res) => {
    res.send(abaMovie);
})
app.get('/name/abaddon/collab', (req, res) => {
    res.send(abaCollab);
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})