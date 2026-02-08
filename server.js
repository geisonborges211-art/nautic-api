import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "API funcionando 🚀" });
});

app.post("/gerar", (req, res) => {
  res.json({
    titulo: "Campanha Náutica Premium",
    subtitulo: "Performance e confiança no mar",
    cta: "Compre agora"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
