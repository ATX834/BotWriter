import dotenv from "dotenv";

dotenv.config();

export const config = {
	server: process.env.SERVER,
	dbHost: process.env.DB_HOST,
	db: process.env.DB,
	dbUser: process.env.DB_USER,
	dbPass: process.env.DB_PASS,
	port: process.env.PORT
};
