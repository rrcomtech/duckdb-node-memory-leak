# DuckDB Node Client Memory Leak Illustration

This repository contains a simple illustration of a memory leak in the DuckDB Node.js client.

## Running

```bash
npm install && npm run start
```

## Observations

The database is getting happily filled, while the memory usage is dramatically increasing. However, that should not be the case as the connection to the database is getting closed after each query.
