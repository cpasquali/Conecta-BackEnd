import db from "../db/db.js";
import bcrypt from "bcrypt";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";
import { transport } from "../utils/nodemailer.js";

export const login = async (req, res) => {
  try {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/;

    const { emailOrUsername, password } = req.body;

    let query;

    if (regex.test(emailOrUsername)) {
      query = `SELECT * FROM users WHERE email = ?`;
    } else {
      query = `SELECT * FROM users WHERE username = ?`;
    }

    const [row] = await db.query(query, [emailOrUsername]);

    const user = row[0];

    if (!user) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    return res.status(200).json({
      message: "Sesion iniciada con exito",
      user: user,
    });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ message: `${e.message}` });
  }
};

export const register = async (req, res) => {
  try {
    const { first_name, last_name, username, email, password } = req.body;

    let image_url =
      "https://www.researchgate.net/profile/Maria-Monreal/publication/315108532/figure/fig1/AS:472492935520261@1489662502634/Figura-2-Avatar-que-aparece-por-defecto-en-Facebook.png";

    if (req.file) {
      const imageResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "profileImage",
      });

      image_url = imageResult.secure_url;

      fs.unlink(req.file.path, (err) => {
        if (err) console.log("Error en eliminar el archivo temporal");
      });
    }

    const [rowEmail] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rowEmail.length > 0) {
      return res.status(400).json({ message: "Email ya registrado" });
    }

    const [rowUsername] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (rowUsername.length > 0) {
      return res
        .status(400)
        .json({ message: "Nombre de usuario ya registrado" });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const query =
      "INSERT INTO users (first_name, last_name,username,email,password, image_url) VALUES (? ,? ,? ,? ,?,?)";

    const values = [
      first_name,
      last_name,
      username,
      email,
      hashedPassword,
      image_url,
    ];

    await db.query(query, values);

    const [row] = await db.query(
      "SELECT * FROM users WHERE email = ? AND username = ?",
      [email, username]
    );

    const newUser = row[0];

    transport.sendMail({
      from: '"Conecta" <conectablog2@gmail.com>',
      to: newUser.email,
      subject: "Bienvenido a Conecta 🚀",
      html: `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenido a Conecta</title>
  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
    }
    table {
      border-collapse: collapse;
    }
    .container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    .header {
      background-color: #2563eb;
      color: #ffffff;
      padding: 20px;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
    }
    .content {
      padding: 30px;
      color: #333333;
      font-size: 16px;
      line-height: 1.5;
    }
    .btn {
      display: inline-block;
      padding: 12px 25px;
      background-color: #2563eb;
      color: #ffffff !important;
      text-decoration: none;
      font-weight: bold;
      border-radius: 8px;
      margin-top: 20px;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #999999;
      padding: 15px;
      border-top: 1px solid #eee;
    }
    @media (max-width: 480px) {
      .content {
        padding: 20px;
        font-size: 14px;
      }
      .btn {
        padding: 10px 20px;
        font-size: 14px;
      }
    }
  </style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center">
        <table class="container" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td class="header">¡Bienvenido a Conecta!</td>
          </tr>
          <tr>
            <td class="content">
              <p>Hola <strong>${newUser.username}</strong>,</p>
              <p>Gracias por registrarte en <strong>Conecta</strong>. Estamos felices de tenerte a bordo.</p>
              <p>Si no creaste esta cuenta, ignora este correo.</p>
              <p>¡Nos vemos adentro! 🚀</p>
              <a class="btn" href="https://conecta-front-end.vercel.app/welcome">Ir a la página</a>
            </td>
          </tr>
          <tr>
            <td class="footer">&copy; 2025 Conecta. Todos los derechos reservados.</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,
    });

    return res
      .status(201)
      .json({ message: "Usuario creado con exito", newUser: newUser });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
