import sqlite3 from "sqlite3";
import dotenv from "dotenv";
dotenv.config();

const sql3 = sqlite3.verbose();
const db = new sql3.Database('./database/swating.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the products database.');
});

function connected(err){
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the products database.");
};

export {db, connected};
