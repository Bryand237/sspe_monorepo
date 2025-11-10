const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;

  if (value === undefined) {
    throw new Error(`Missing environment variable ${key}`);
  }

  return value;
};

export const NODE_ENV = getEnv("NODE_ENV");
export const PORT = getEnv("PORT");
export const DB_TYPE = getEnv("DB_TYPE");
export const DB_PORT = parseInt(getEnv("DB_PORT", "3306"), 3300);
export const DB_NAME = getEnv("DATABASE_NAME");
export const DB_URL = getEnv("DB_URL");
export const DB_USER = getEnv("DB_USER");
export const DB_PWD = getEnv("DB_PASSWORD");
export const FRONTEND_URL = getEnv("FRONTEND_URL");
export const DB_FULL_URL = getEnv("DATABASE_URL");
