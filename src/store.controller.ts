import { Database as DuckDB } from "duckdb";
import { DROP_QUERIES, DROP_TABLES, FILENAME, SETUP_QUERIES } from "./storage.config";
import { existsSync, mkdir } from "fs";
import { dirname } from "path";

export class StoreController {
  private db: DuckDB;

  constructor() {
    const dname = dirname(FILENAME);
    console.log("Database file: " + dname);
    if (!existsSync(dname)) {
      mkdir(dname, { recursive: true }, (err) => {
        if (err) {
          console.error(err);
          console.error("Failed to create the database file. Terminating ...");
          process.exit(1);
        }
      });
    }

    // This should get an additional Database configuration object as an argument, which sadly does not work.
    this.db = new DuckDB(
      FILENAME,
      (err) => {
        if (err) {
          console.error(err);
          console.error("Failed to connect to the database. Terminating ...");
          process.exit(1);
        }
      }
    );

    process.on('exit', () => {
      this.db.close();
    });

    this.prepareDatabase();
  }

  // Stores list of data poitns in the database.
  storeData(el_list: any): void {
    const conn = this.db.connect();

    for (const body of el_list) {
      const query = `
        INSERT INTO data (
          first,
          second,
          third,
          fourth,
          fifth
        )
        VALUES (
          '${body.first}',
          ${body.second},
          ${body.third},
          ${body.fourth},
          '${body.fifth}'
        );
      `;

      conn.all(query, (err, _) => {
        if (err) {
          console.error("Could not insert into database due to error: " + err);
        }
      });
    }

    conn.close();
  }

  // Drops all tables and recreates them in order to have a clear debuggable setup.
  prepareDatabase(): void {
    console.log("Preparing the database ...");

    if (DROP_TABLES) {
      console.log("INFO: Storage Engine is configured to drop all tables before preparing the DB.");
      this.db.all(DROP_QUERIES, (err, _) => {
        if (err) {
          console.error(err);
          console.error("Failed to drop tables. Terminating ...");
          process.exit(1);
        }
      });
    }

    this.db.all(SETUP_QUERIES, (err, _) => {
      if (err) {
        console.error(err);
        console.error("Failed to prepare the database. Terminating ...");
        process.exit(1);
      }
    });

    console.log("Database prepared.");
  }

}
