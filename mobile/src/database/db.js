import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

export const getDBConnection = async () => {
  return SQLite.openDatabase({
    name: 'tecair.db',
    location: 'default',
  });
};

export const createTables = async (db) => {
  const query = `
    CREATE TABLE IF NOT EXISTS vuelos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      origen TEXT NOT NULL,
      destino TEXT NOT NULL,
      fecha TEXT NOT NULL,
      precio REAL NOT NULL
    );
  `;

  await db.executeSql(query);
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