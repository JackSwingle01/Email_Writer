const SECRET_KEY = require('./API_KEY.js').SECRET_KEY;

// const bodyParser = require('body-parser')

const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()
const port = 3100

app.use(express.json())

class user {
  username;
  password;

  constructor(username, password) {
    this.username = username;
    this.password = password;
  }
}

const JWT_KEY = '1594523192513033200229'
let users = [];
users.push(new user('admin', 'admin'));

//authentication
const authenticate = (req, res, next) => {

  const authHeader = req.headers ['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  })
}
function isAuthenticated(req) { return req.user ? true : false }
function hasUsernameAndPassword(req) { return req.body.username && req.body.password ? true : false }
function isValidUser(req) {
  let username = req.body.username;
  let password = req.body.password;
  let user = users.find(user => user.username === username && user.password === password);
  return user ? true : false;
}

app.get('/', (req, res) => {
  res.send('Nothing here.').status(200)
})

app.post('/login', (req, res) => {

  if (hasUsernameAndPassword(req)) {
    if (isValidUser(req)) {
      const token = jwt.sign({ username: req.body.username }, JWT_KEY, { expiresIn: '1h' });
      res.json({ token }).status(200);
      // res.send('Login successful').status(200);
    } else {
      res.send('Invalid username/password').status(401);
    }
  } else {
    res.send('Please provide username/password').status(401);
  }
})

app.get('/email-completion', authenticate, (req, res) => {

  let prompt = req.query.prompt
  let maxTok = req.query.maxTokens
  let temp = req.query.temperature

  getCompletion(prompt, maxTok, temp).then(response => {
    console.log(response.data.choices[0].message);
    res.send(response.data.choices[0].message.content).status(200)
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

async function getCompletion(prompt, maxTok = '5', temp = '.5') {

  const { Configuration, OpenAIApi } = require("openai");
  const configuration = new Configuration({
    apiKey: SECRET_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ "role": "system", "content": "You only write emails." },
    { "role": "user", "content": prompt }],
    max_tokens: parseInt(maxTok),
    temperature: parseFloat(temp),
  })
  return response;

}

