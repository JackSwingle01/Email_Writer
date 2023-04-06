const SECRET_KEY = require('./API_KEY.js').SECRET_KEY;

const express = require('express')
const app = express()
const port = 3100

app.get('/', (req, res) => {

  // query is /?prompt=""&maxTok=""&temp=""
  console.log("Prompt: " + req.query.prompt)
  console.log("Max Tokens: " + req.query.max_tokens)
  console.log("Temperature: " + req.query.temperature)
  getCompletion(req.query.prompt, req.query.max_tokens, req.query.temperature).then(response => {
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
  console.log(temp)
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ "role": "system", "content": "You only write emails." },
    { "role": "user", "content": prompt }],
    max_tokens: parseInt(maxTok),
    temperature: parseInt(temp)
  })
  return response;

}

