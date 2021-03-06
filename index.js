const bodyParser = require('body-parser');
const express = require('express');
const Blockchain = require('./blockchain');
const PubSub = require('./pubsub');
const DEFAULT_PORT = 3000;
const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({ blockchain });


setTimeout(() => pubsub.broadcastChain(), 1000);


app.use(bodyParser.json());

app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
    const { data } = req.body;

    blockchain.addBlock({ data });
    res.redirect('/api/blocks');
});

let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => console.log(`listening at localhost: ${PORT}`));


