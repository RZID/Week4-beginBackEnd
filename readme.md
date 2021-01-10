# POS (Backend) Application

Postman Documentation: 
1. Online version : https://www.getpostman.com/collections/84af7e59cbdc58479dc1
2. Offline version : import from : `docs/[Postman]RZIDPOS_API.json`
---
## Modules included :
 - Body Parser
 - CORS
 - DotEnv
 - ExpressJS
 - MySQL2

 ## Dev Modules :
- ESLint
- Nodemon

---
# How to use?
1. Import database (In docs folder, import db_pos.sql to your SQL DBMS)
2. Set ".env" file in root :
    - `PORT`      : fill for set the API running port
    - `DB_HOST`   : fill with HOSTNAME in your  database configuration
    - `DB_USER`   : fill with USERNAME in your database configuration
    - `DB_PASS`   : fill with PASSWORD in your database configuration (Or leave it null if your database haven't password)
    - `DB_NAME`   : fill with the NAME OF DATABASE (Or leave it filled with `db_pos` if you isn't rename the database)
3. Run with : 
    - `npm start-cli` if you want to run it in client mode (use node) without auto restart on every changing code
    - `npm start-dev` if you want to run it in developer mode (use `nodemon`)  every change and save it will auto restart.
