require('dotenv').config();
const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Configuración de OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta para completar texto utilizando OpenAI
app.post('/completar', async (req, res) => {
  const prompt = req.body.prompt;

  console.log("Received prompt:", prompt);

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 50,
    });

    console.log("OpenAI response:", response.data);

    res.json({ text: response.data.choices[0].message.content.trim() });
  } catch (error) {
    console.error("Error during OpenAI API call:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
