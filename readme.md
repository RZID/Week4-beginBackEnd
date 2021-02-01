# POS (Backend) Application

## Modules included :
|           |        |             |        |
| --------- | ------ | ----------- | ------ |
| ExpressJS | MySQL2 | Moment      | Lodash |
| JWT       | bcrypt | Body Parser | CORS   |
| DotENV    | Multer | Redis       |

 ## Dev Modules :
- ESLint
- Nodemon

---
# How to use?
1. Run `npm install` to install library / modules required
2. Import database (In docs folder, import db_pos.sql to your SQL DBMS)
3. Set ".env" file in root :
    - `PORT`      : fill for set the API running port
    - `DB_HOST`   : fill with HOSTNAME in your  database configuration
    - `DB_USER`   : fill with USERNAME in your database configuration
    - `DB_PASS`   : fill with PASSWORD in your database configuration (Or leave it null if your database haven't password)
    - `DB_NAME`   : fill with the NAME OF DATABASE (Or leave it filled with `db_pos` if you isn't rename the database)
    - `JWT_SECRET`   : fill with the unique value due to signature verifier on JWT
    - `TZ` : fill in your current time zone in your area. If you don't know, https://en.wikipedia.org/wiki/List_of_tz_database_time_zones <- you can get from this list on column `TZ database name`
4. Run with : 
    - `npm run start-cli` if you want to run it in client mode (use node) without auto restart on every changing code
    - `npm run start-dev` if you want to run it in developer mode (use `nodemon`)  every change and save it will auto restart.

---
- Presentation : 
  https://docs.google.com/presentation/d/1auvDwaUJ-HIYhTpZHlU2kuStVt-r8BJCZYfJ91YRJuE/edit?usp=sharing

- Postman Documentation: 
  import from : `docs/[Postman]RZIDPOS_API.postman_environment.json`. then make an environtment that save variable in Postman. 

  1. `URL` : value is like `http://localhost:3000` that linked to served POS APP microservice URL
  2. `TOKEN` : value is for put the token that you login and access CRUD of method each controller


- Flowchart
  https://drive.google.com/file/d/18z5ICoggPqc0-xc31ayGGAo1xJa-Zzlr/view?usp=sharing
---

