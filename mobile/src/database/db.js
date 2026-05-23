import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

export const getDBConnection = async () => {
  return SQLite.openDatabase({
    name: 'tecair.db',
    location: 'default',
  });
};

export const createTables = async (db) => {
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS usuario (
      id_user INTEGER PRIMARY KEY,
      correo TEXT NOT NULL,
      contrasena TEXT NOT NULL,
      nombre TEXT NOT NULL,
      ap1 TEXT NOT NULL,
      ap2 TEXT,
      telefono TEXT NOT NULL,
      es_estudiante INTEGER DEFAULT 0,
      carnet TEXT,
      universidad TEXT
    );
  `);
};

export const guardarUsuarioLocal = async (db, usuario) => {
  await db.executeSql(
    `INSERT OR REPLACE INTO usuario 
     (id_user, correo, contrasena, nombre, ap1, ap2, telefono, es_estudiante, carnet, universidad)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      usuario.idUser, usuario.correo, usuario.contrasena,
      usuario.nombre, usuario.ap1, usuario.ap2 ?? null,
      usuario.telefono, usuario.esEstudiante ? 1 : 0,
      usuario.carnet ?? null, usuario.universidad ?? null
    ]
  );
}

export const loginLocal = async (db, correo, contrasena) => {
  const results = await db.executeSql(
    'SELECT * FROM usuario WHERE correo = ? AND contrasena = ?',
    [correo, contrasena]
  );
  if (results[0].rows.length > 0) {
    return results[0].rows.item(0);
  }
  return null;
};

export const insertVuelo = async (db, origen, destino, fecha, precio) => {
  const query = `
    INSERT INTO vuelos (origen, destino, fecha, precio)
    VALUES (?, ?, ?, ?);
  `;

  await db.executeSql(query, [origen, destino, fecha, precio]);
};

export const getVuelos = async (db) => {
  const vuelos = [];
  const results = await db.executeSql('SELECT * FROM vuelos ORDER BY id DESC;');

  results.forEach(result => {
    for (let i = 0; i < result.rows.length; i++) {
      vuelos.push(result.rows.item(i));
    }
  });

  return vuelos;
};

export const deleteVuelo = async (db, id) => {
  await db.executeSql('DELETE FROM vuelos WHERE id = ?;', [id]);
};