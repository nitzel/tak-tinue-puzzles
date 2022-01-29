import fs from "fs";
import path from "path";
import Sqlite3, { Database } from "better-sqlite3";

export const getLatestDatabase = (directory = ".") => {
  const dirContent = fs.readdirSync(path.resolve(directory));
  const dbFilesStats = dirContent
    .filter((file) => file.endsWith(".db"))
    .map((name) => ({ name, stats: fs.statSync(name) }))
    .filter((file) => file && file.stats.isFile());

  if (dbFilesStats.length === 0) {
    return null;
  }

  const latestFile = dbFilesStats.reduce((a, b) => (a.stats.mtimeMs > b.stats.mtimeMs ? a : b));
  return latestFile.name;
}

export const loadLatestDatabase = (databasePath: string, oldDb?: Database, readonly = true): Database | string => {
  if (!databasePath) return ("No .db file found in current directory");
  if (oldDb) {
    oldDb.close();
  }
  console.log(`Switching to DB at '${databasePath}'`);
  try {
    return new Sqlite3(databasePath, { readonly, fileMustExist: true });
  } catch (err: any) {
    console.error(err);
    return err.toString();
  }
}
