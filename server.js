import "dotenv/config";
import express from "express";
import OpenAI from "openai";

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
});

console.log("Booting API...");
console.log("OPENAI_API_KEY present:", Boolean(process.env.OPENAI_API_KEY));

const app = express();

app.use(express.json({ limit: "2mb" }));

// CORS simples (ajuste o origin quando tiver o dominio final do frontend)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.get("/", (req, res) => {
  res.send("API ONLINE");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const getOpenAI = () =>
  new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

app.post("/gerar", async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ message: "OPENAI_API_KEY nao configurada" });
    }

    const {
      productName,
      description,
      category,
      campaign,
      objective,
      intensity,
      creativeDirections,
      strategicPrompt,
    } = req.body || {};

    if (!productName || !description || !category || !campaign || !objective || !intensity) {
      return res.status(400).json({
        message:
          "Campos obrigatorios: productName, description, category, campaign, objective, intensity",
      });
    }

    const prompt = strategicPrompt || `
[CONTEXTO NAUTICO]
Produto: ${productName} (${category})
Descricao: ${description}
Campanha: ${campaign}
Objetivo: ${objective}
Intensidade: ${intensity}
Direcao criativa: ${creativeDirections ? JSON.stringify(creativeDirections) : "n/a"}
`;

    const openai = getOpenAI();
    const imageResponse = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
      response_format: "b64_json",
    });

    const b64 = imageResponse?.data?.[0]?.b64_json;
    if (!b64) {
      return res.status(502).json({ message: "Resposta da OpenAI sem imagem" });
    }

    const imageUrl = `data:image/png;base64,${b64}`;
    return res.json({ imageUrl });
  } catch (error) {
    console.error("Erro ao gerar imagem:", error);
    return res.status(500).json({ message: "Erro ao gerar imagem" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
