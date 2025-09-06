import nodemailer from "nodemailer";

export const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "conectablog2@gmail.com",
    pass: "aoiftxicrfphphvd",
  },
});

export const htmlContent = `
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
              <p>Hola <strong>USUARIO</strong>,</p>
              <p>Gracias por registrarte en <strong>Conecta</strong>. Estamos felices de tenerte a bordo.</p>
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
`;
