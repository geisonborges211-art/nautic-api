import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/gerar", async (req, res) => {
  try {
    const { produto, campanha } = req.body;

    const prompt = `
Você é um diretor criativo especialista em marketing náutico.
Crie uma campanha estratégica profissional para:

Produto: ${produto}
Campanha: ${campanha}

Responda em JSON no formato:

{
  "titulo": "",
  "subtitulo": "",
  "cta": ""
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Você é especialista em marketing." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    const texto = response.choices[0].message.content;

    res.json(JSON.parse(texto));
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao gerar campanha" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
