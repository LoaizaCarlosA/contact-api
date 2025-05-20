require('dotenv').config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'https://loaizacarlosa.github.io/Portafolio'
}));

app.use(express.json());

app.post("/contacto", async (req, res) => {
  const { nombre, correo, mensaje } = req.body;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  let mailOptions = {
    from: correo,
    to: process.env.EMAIL_USER,
    subject: `Nuevo mensaje de contacto de ${nombre}`,
    text: mensaje
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo enviado");
    res.json({ status: "ok", message: "Correo enviado" });
  } catch (error) {
    console.error("Error enviando correo:", error);
    res.status(500).json({ status: "error", message: "No se pudo enviar el correo" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
