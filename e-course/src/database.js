import * as SQLite from 'expo-sqlite';

let db;


export const initDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync('shopping.db');
    await db.transaction(async tx => {
      
      await tx.executeSql(
        `CREATE TABLE IF NOT EXISTS course (
          idCourse INTEGER PRIMARY KEY AUTOINCREMENT,
          description TEXT
        );`
      );

      await tx.executeSql(
        `CREATE TABLE IF NOT EXISTS shopping_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          unit TEXT,
          quantity INTEGER,
          date TEXT,
          bought INTEGER DEFAULT 0,
          idCourse INTEGER,
          status TEXT DEFAULT 'en cours',
          FOREIGN KEY (idCourse) REFERENCES course(idCourse) ON DELETE SET NULL
        );`
      );

      console.log("Tables created successfully");
    });
    console.log("Database initialized");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

export const getMaxIdCourse = async () => {
  try {
    const result = await db.getAllAsync(
      'SELECT MAX(idCourse) as maxId FROM course;'
    );
    
    if (result.length > 0 && result[0].maxId !== null) {
      return result[0].maxId;
    } else {
      return 0;
    }
  } catch (error) {
    console.error("Error fetching max idCourse:", error);
    return null;
  }
};



export const addItem = async (name, unit, quantity, date, idCourse) => {
  try {
    await db.transaction(async tx => {
      await tx.executeSql(
        'INSERT INTO shopping_items (name, unit, quantity, date, bought, idCourse) VALUES (?, ?, ?, ?, 0,?);',
        [name, unit, quantity, date, idCourse]
      );
      console.log("Item added successfully");
    });
  } catch (error) {
    console.error("Error adding item:", error);
  }
};

export const updateItem = async (id, name, unit, quantity) => {
  try {
    await db.transaction(async tx => {
      await tx.executeSql(
        'UPDATE shopping_items SET name = ?, unit = ?, quantity = ? WHERE id = ?;', 
        [name, unit, quantity, id]
      );
      console.log("Item updated successfully");
    });
  } catch (error) {
    console.error("Error updating item:", error);
  }
};

export const updateStatusToFinish = async (id) => {
  try {
    await db.transaction(async tx => {
      await tx.executeSql(
        'UPDATE shopping_items SET status = ? WHERE id = ?;',
        ['finished', id]
      );
      console.log("Updated successfully");
    });
  } catch (error) {
    console.error("Error updating status:", error);
  }
};

export const updateStatusToSkip = async () => {
  try {
    await db.transaction(async tx => {
      await tx.executeSql(
        'UPDATE shopping_items SET status = ? WHERE status LIKE ?;',
        ['skipped', '%en cours%']
      );
      console.log("Updated successfully");
    });
  } catch (error) {
    console.error("Error updating status:", error);
  }
};

export const fetchItems = async () => {
  try {
    const result = await new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM shopping_items;',  
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


export const getShopping_itemByIdCourse = async (idCourse) => {
  try {
    const result = await db.getAllAsync(
      'SELECT * FROM shopping_items WHERE course_id = ?;',
      [idCourse]
    );
    return result;
  } catch (error) {
    console.error("Erreur lors de la récupération des produits par course :", error);
    return [];
  }
};
