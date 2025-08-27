import db from "../db/db.js";

export const getAllCommunitys = async (req, res) => {
  const { name } = req.query;
  try {
    let query = "SELECT * FROM communities";
    let values = [];

    if (name) {
      query += " WHERE name LIKE ?";
      values.push(`${name}%`);
    } else {
      query += " ORDER BY RAND()";
    }

    const [rows] = await db.query(query, values);

    if (!rows.length) {
      return res.status(200).json({
        message: name
          ? "No se encontro comunidad con ese nombre..."
          : "No encontraron comunidades...",
      });
    }

    return res.status(200).json({ communities: rows });
  } catch (e) {
    console.log(e.message);

    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const createCommunity = async (req, res) => {
  try {
    const { name } = req.body;
    await db.query("INSERT INTO communities (name) VALUES (?)", [name]);

    return res.status(201).json({ message: "Comunidad creada con exito" });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
