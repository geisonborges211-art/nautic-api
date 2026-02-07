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

Responda em JSON:
{
  "headline": "",
  "subheadline": "",
  "cta": ""
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({
      resultado: completion.choices[0].message.content
    });

  } catch (error) {
    res.status(500).json({ error: "Erro ao gerar campanha" });
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
