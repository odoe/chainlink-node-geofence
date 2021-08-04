import {createRequest} from './index.mjs';

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
const app = express()
const port = process.env.EA_PORT || 3030

app.use(bodyParser.json())
app.use(cors())

app.post('/', (req, res) => {
  console.log('POST Data: ', req.body)
  createRequest(req.body, (status, result) => {
    console.log('Result: ', result)
    res.status(status).json(result)
  })
})

app.listen(port, () => console.log(`Listening on port ${port}!`))
