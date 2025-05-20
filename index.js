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

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    replyTo: correo,
    subject: `Nuevo mensaje de contacto de ${nombre}`,
    text: `Tienes un mensaje de "${nombre}" del correo "${correo}": "${mensaje}"`, // texto plano para clientes que no soportan HTML
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #005f99;">Nuevo mensaje de contacto</h2>
        <p><strong>De:</strong> ${nombre} &lt;${correo}&gt;</p>
        <p><strong>Mensaje:</strong></p>
        <p style="background: #f4f4f4; padding: 10px; border-radius: 5px; border: 1px solid #ddd;">
          ${mensaje.replace(/\n/g, "<br>")}
        </p>
        <hr style="border:none; border-top:1px solid #eee; margin-top: 20px;">
        <p style="font-size: 0.9em; color: #777;">Este mensaje fue enviado desde tu formulario de contacto.</p>
      </div>
    `,
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
