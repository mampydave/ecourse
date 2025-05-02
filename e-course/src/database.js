import * as SQLite from 'expo-sqlite/next';

let db;

export const initDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync('shop.db');
    console.log('Database initialized successfully');
    
    await db.runAsync('PRAGMA foreign_keys = ON;');

    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS course (
        idCourse INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL
      );
    `);

    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS shopping_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        unit TEXT,
        quantity INTEGER,
        date TEXT,
        bought INTEGER DEFAULT 0,
        idCourse INTEGER,
        status TEXT DEFAULT 'en cours',
        FOREIGN KEY (idCourse) REFERENCES course(idCourse) ON DELETE SET NULL
      );
    `);

    return db;
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

const checkDbInitialized = () => {
  if (!db) throw new Error("Database not initialized. Call initDatabase() first.");
};

export const createCourse = async (description) => {
  checkDbInitialized();
  
  if (!description || description.trim() === '') {
    throw new Error("Course description cannot be empty");
  }

  try {
    const result = await db.runAsync(
      'INSERT INTO course (description) VALUES (?);',
      [description.trim()]
    );
    
    console.log("Course created with ID:", result.lastInsertRowId);
    return result.lastInsertRowId;
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
};

export const getLastCourseId = async () => {
  checkDbInitialized();
  const result = await db.getFirstAsync('SELECT MAX(idCourse) as id FROM course;');
  return result?.id;
};

export const getInProgressItemsByCourse = async (idCourse) => {
  checkDbInitialized();
  return await db.getAllAsync(
    'SELECT * FROM shopping_items WHERE idCourse = ? AND status = ?;',
    [idCourse, 'en cours']
  );
};

export const addItem = async (name, unit, quantity, date, idCourse) => {
  checkDbInitialized();
  
  if (!name || name.trim() === '') {
    throw new Error("Item name cannot be empty");
  }

  try {
    const result = await db.runAsync(
      'INSERT INTO shopping_items (name, unit, quantity, date, bought, idCourse) VALUES (?, ?, ?, ?, 0, ?);',
      [name.trim(), unit, quantity, date, idCourse]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error("Error adding item:", error);
    throw error;
  }
};

export const updateItem = async (id, name, unit, quantity) => {
  checkDbInitialized();
  await db.runAsync(
    'UPDATE shopping_items SET name = ?, unit = ?, quantity = ? WHERE id = ?;',
    [name, unit, quantity, id]
  );
};

export const fetchItems = async () => {
  checkDbInitialized();
  return await db.getAllAsync('SELECT * FROM shopping_items;');
};

export const getShopping_itemByIdCourse = async (idCourse) => {
  checkDbInitialized();
  return await db.getAllAsync(
    'SELECT * FROM shopping_items WHERE idCourse = ?;',
    [idCourse]
  );
};

export const updateStatusToFinish = async (id) => {
  checkDbInitialized();
  console.log("id de course",id);
  await db.runAsync(
    'UPDATE shopping_items SET status = ? WHERE id = ?;',
    ['finished', id]
  );
  console.log("finished");
};

export const updateStatusToSkip = async () => {
  checkDbInitialized();
  await db.runAsync(
    'UPDATE shopping_items SET status = ? WHERE status LIKE ?;',
    ['skipped', '%en cours%']
  );
};

export const getMostPurchasedItems = async () => {
  checkDbInitialized();
  return await db.getAllAsync(`
    SELECT name, unit, SUM(quantity) as total_quantity 
    FROM shopping_items 
    GROUP BY name 
    ORDER BY total_quantity DESC;
  `);
};

export const getMonthlyPurchases = async () => {
  checkDbInitialized();
  const result = await db.getFirstAsync(`
    SELECT SUM(quantity) as month_total 
    FROM shopping_items 
    WHERE strftime('%Y-%m', date) = strftime('%Y-%m', 'now');
  `);
  return result?.month_total || 0;
};

export const getCompletionPercentage = async () => {
  checkDbInitialized();
  const result = await db.getFirstAsync(`
    SELECT 
      SUM(CASE WHEN status = 'finished' THEN 1 ELSE 0 END) as finished,
      COUNT(*) as total 
    FROM shopping_items;
  `);
  return result?.total > 0 ? ((result.finished / result.total) * 100).toFixed(1) : 0;
};

export const resetAllData = async () => {
  checkDbInitialized();
  await db.runAsync('DELETE FROM shopping_items;');
  await db.runAsync('DELETE FROM course;');
  await db.runAsync("DELETE FROM sqlite_sequence WHERE name = 'shopping_items';");
  await db.runAsync("DELETE FROM sqlite_sequence WHERE name = 'course';");
  return true;
};

export const getCoursesWithItems = async () => {
  checkDbInitialized();
  try {
    const courses = await db.getAllAsync('SELECT * FROM course ORDER BY idCourse DESC;');
    
    const coursesWithItems = await Promise.all(
      courses.map(async (course) => {
        try {
          const items = await db.getAllAsync(
            'SELECT id, name, unit, quantity, date, status FROM shopping_items WHERE idCourse = ?;',
            [course.idCourse]
          );
          return { 
            ...course, 
            items: items || [] 
          };
        } catch (error) {
          console.error(`Error fetching items for course ${course.idCourse}:`, error);
          return { ...course, items: [] };
        }
      })
    );

    return coursesWithItems;
  } catch (error) {
    console.error("Error in getCoursesWithItems:", error);
    throw error;
  }
};