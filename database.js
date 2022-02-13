import { openDatabase } from "expo-sqlite";

export const getDbConnection = async () => {
  return openDatabase("restrooms.db");
};

export const createTable = async (db) => {
  const query =
    "CREATE TABLE IF NOT EXISTS bathrooms (id INTEGER PRIMARY KEY NOT NULL, latitude TEXT, longitude TEXT);";
  await db.executeSql(query);
};

export const putItems = async (db, jsonFile) => {
  
  try {
    const items = [];
    const results = await db.executeSql("")
  }
}