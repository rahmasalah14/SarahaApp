import { config } from "dotenv";
import {resolve} from 'node:path'
export const NODE_ENV = `.env.${process.env.NODE_ENV ?? 'development'}`
config({path:resolve(NODE_ENV)})
export const PORT = parseInt(process.env.PORT ?? "9000")

export const DB_URI=process.env.DB_URI
export const ENC_KEY=process.env.ENC_KEY
export const IV_LENGTH=parseInt(process.env.IV_LENGTH ?? "16")

export const ACCESS_TOKEN_EXPIRES_IN = parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN ?? "1800");
export const ACCESS_TOKEN_SIGNATURE = process.env.ACCESS_TOKEN_SIGNATURE;
export const SECRET_KEY = process.env.JWT_SECRET;

export const ACCESS_USER_TOKEN_SIGNATURE = process.env.ACCESS_USER_TOKEN_SIGNATURE;
export const ACCESS_ADMIN_TOKEN_SIGNATURE = process.env.ACCESS_ADMIN_TOKEN_SIGNATURE;

export const REFRESH_USER_TOKEN_SIGNATURE = process.env.REFRESH_USER_TOKEN_SIGNATURE;
export const REFRESH_ADMIN_TOKEN_SIGNATURE = process.env.REFRESH_ADMIN_TOKEN_SIGNATURE;

export const REFRESH_TOKEN_EXPIRES_IN = parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN ?? "31536000");
export const REFRESH_TOKEN_SIGNATURE = process.env.REFRESH_TOKEN_SIGNATURE;

export const WEB_CLIENT_IDS = process.env.WEB_CLIENT_IDS?.split(',') ?? [];