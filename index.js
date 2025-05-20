require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "https://loaizacarlosa.github.io",
  })
);

app.use(express.json());

app.post("/contacto", async (req, res) => {
  const { nombre, correo, mensaje } = req.body;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // let mailOptions = {
  //   from: correo,
  //   to: process.env.EMAIL_USER,
  //   subject: `Nuevo mensaje de contacto de ${nombre} con correo ${correo}`,
  //   text: mensaje,
  // };

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    replyTo: correo, // útil para que puedas responder directamente al remitente
    subject: `Nuevo mensaje de contacto de ${nombre}`,
    text: `Has recibido un nuevo mensaje de contacto:\n\nNombre: ${nombre}\nCorreo: ${correo}\n\nMensaje:\n${mensaje}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #0077cc;">Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Correo:</strong> <a href="mailto:${correo}">${correo}</a></p>
        <p><strong>Mensaje:</strong></p>
        <div style="padding: 10px; background-color: #f5f5f5; border-left: 4px solid #0077cc; margin-top: 5px; border-radius: 5px;">
          ${mensaje.replace(/\n/g, "<br>")}
        </div>
        <hr style="margin-top: 20px; border: none; border-top: 1px solid #ccc;" />
        <small style="color: #888;">Este mensaje fue enviado desde el formulario de contacto de tu portafolio.</small>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo enviado");
    res.json({ status: "ok", message: "Correo enviado" });
  } catch (error) {
    console.error("Error enviando correo:", error);
    res
      .status(500)
      .json({ status: "error", message: "No se pudo enviar el correo" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
