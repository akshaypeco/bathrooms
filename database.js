import { openDatabase } from "expo-sqlite";
import { getDocs } from "firebase/firestore";
import { Alert } from "react-native";
import { bathroomsRef } from "./firebase";

const jsonData = require("./data_file.json");
const db = openDatabase("bathrooms_ids-lats-longs");

export function createTable() {
  db.transaction((txn) => {
    txn.executeSql(
      "CREATE TABLE IF NOT EXISTS bathrooms (id INTEGER PRIMARY KEY NOT NULL, latitude TEXT, longitude TEXT)",
      [],
      (tx, res) => {
        console.log("table created success");
      },
      (error) => {
        console.log("error in creating table: ", error);
      }
    );
    var currRows = 0;
    txn.executeSql(
      "SELECT count(*) FROM bathrooms",
      [],
      (tx, res) => {
        console.log("table count success");
        currRows = res.rows._array[0]["count(*)"];
        console.log(currRows);
      },
      (error) => {
        console.log("error in finding table count: ", error);
      }
    );
    if (currRows == 0) {
      console.log("table empty. adding initial data");
      console.log(jsonData.length);
      console.log("getting snapshot");
      for (let i = 0; i < jsonData.length; i++) {
        txn.executeSql(
          "INSERT INTO bathrooms (id, latitude, longitude) VALUES (?, ?, ?)",
          [jsonData[i].id, jsonData[i].latitude, jsonData[i].longitude],
          (tx, res) => {
            if (res.rowsAffected > 0) {
              console.log("Data Inserted Successfully");
            } else {
              console.log("Failed...");
            }
          }
        );
      }
    }
    // if (currRows == 0) {
    //   console.log("table empty. adding initial data");
    //   console.log(jsonData.length);
    //   console.log("getting snapshot");
    //   const snapshot = await getDocs(bathroomsRef);
    //   snapshot.forEach((doc) => {
    //     console.log(doc.data().id);
    //     txn.executeSql(
    //       "INSERT INTO bathrooms (id, latitude, longitude) VALUES (?, ?, ?)",
    //       [doc.data().id, doc.data().latitude, doc.data().longitude],
    //       (tx, res) => {
    //         console.log("Results", res.rowsAffected);
    //         if (res.rowsAffected > 0) {
    //           console.log("Data Inserted Successfully");
    //         } else {
    //           console.log("Failed...");
    //         }
    //       }
    //     );
    //   });
    // }
  });
}

export function dropTable() {
  db.transaction((txn) => {
    txn.executeSql(
      "DROP TABLE IF EXISTS bathrooms",
      [],
      (tx, res) => {
        console.log("table deleted success");
      },
      (error) => {
        console.log("error in deleting table: ", error);
      }
    );
  });
}

export async function addInitialData() {
  console.log("getting snapshot");
  const snapshot = await getDocs(bathroomsRef);
  snapshot.forEach((doc) => {
    console.log(doc.data().id);
    db.transaction((txn) => {
      txn.executeSql(
        "INSERT INTO bathrooms (id, latitude, longitude) VALUES (?, ?, ?)",
        [doc.data().id, doc.data().latitude, doc.data().longitude],
        (tx, res) => {
          console.log("Results", res.rowsAffected);
          if (res.rowsAffected > 0) {
            console.log("Data Inserted Successfully");
          } else {
            console.log("Failed...");
          }
        }
      );
    });
  });
}

export function addData() {
  db.transaction((txn) => {
    txn.executeSql("INSERT INTO bathrooms ()");
  });
}
