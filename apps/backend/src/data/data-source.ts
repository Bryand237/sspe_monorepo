import { DataSource } from "typeorm";
import { DB_NAME, DB_PORT, DB_PWD, DB_URL, DB_USER } from "../constants/env";

export const AppDataSource = new DataSource({
  type: "mysql",
  port: DB_PORT,
  host: DB_URL,
  username: DB_USER,
  password: DB_PWD,
  database: DB_NAME,
  synchronize: true,
  logging: false,
  entities: ["src/entity/**/*.ts"],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
});
