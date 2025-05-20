const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post("/contacto", (req, res) => {
  const { nombre, correo, mensaje } = req.body;
  console.log("Mensaje recibido:", nombre, correo, mensaje);
  res.json({ status: "ok", message: "Mensaje recibido" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
