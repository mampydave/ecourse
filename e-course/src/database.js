import * as SQLite from 'expo-sqlite';

let db;

// Initialisation asynchrone de la base de données
export const initDatabase = async () => {
  try {
    // Utilisation de openDatabaseAsync
    db = await SQLite.openDatabaseAsync('shopping.db');
    await db.transaction(async tx => {
      await tx.executeSql(
        `CREATE TABLE IF NOT EXISTS shopping_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          unit TEXT,  // Changement de category en unit
          quantity INTEGER,
          date TEXT,
          bought INTEGER DEFAULT 0
        );`
      );
      console.log("Table created successfully");
    });
    console.log("Database initialized");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

// Fonction pour ajouter un article de manière asynchrone
export const addItem = async (name, unit, quantity, date) => {
  try {
    await db.transaction(async tx => {
      await tx.executeSql(
        'INSERT INTO shopping_items (name, unit, quantity, date, bought) VALUES (?, ?, ?, ?, 0);',  // Utilisation de unit
        [name, unit, quantity, date]
      );
      console.log("Item added successfully");
    });
  } catch (error) {
    console.error("Error adding item:", error);
  }
};

// Fonction pour mettre à jour un article de manière asynchrone
export const updateItem = async (id, name, unit, quantity) => {
  try {
    await db.transaction(async tx => {
      await tx.executeSql(
        'UPDATE shopping_items SET name = ?, unit = ?, quantity = ? WHERE id = ?;',  // Utilisation de unit
        [name, unit, quantity, id]
      );
      console.log("Item updated successfully");
    });
  } catch (error) {
    console.error("Error updating item:", error);
  }
};

// Fonction pour récupérer tous les articles de manière asynchrone
export const fetchItems = async () => {
  try {
    const result = await new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM shopping_items;',  // Aucune modification ici, la colonne "unit" sera récupérée
          [],
          (_, { rows }) => resolve(rows._array),
          (_, error) => reject(error)
        );
      });
    });
    console.log("Items fetched successfully", result);
    return result;
  } catch (error) {
    console.error("Error fetching items:", error);
  }
};
