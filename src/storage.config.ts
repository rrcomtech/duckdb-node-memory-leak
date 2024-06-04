const FILENAME = process.cwd() + '/data/duck.db';
// Drop tables when starting the application.
const DROP_TABLES = true;
const DROP_QUERIES = `
  DROP TABLE IF EXISTS data;
  DROP SEQUENCE IF EXISTS data_id_seq;
`;

const SETUP_QUERIES = `
  CREATE SEQUENCE data_id_seq START 1;

  CREATE TABLE IF NOT EXISTS data (
    id INTEGER PRIMARY KEY DEFAULT nextval('data_id_seq'),
    first VARCHAR,
    second UINTEGER,
    third UINTEGER,
    fourth UINTEGER,
    fifth VARCHAR
  );
`;

export {
  FILENAME,
  SETUP_QUERIES,
  DROP_TABLES,
  DROP_QUERIES
};
