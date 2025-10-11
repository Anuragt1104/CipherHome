import dotenv from 'dotenv';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
  jwtExpiry: process.env.JWT_EXPIRY || '7d',
  
  // Database
  databaseUrl: process.env.DATABASE_URL || 'postgresql://localhost:5432/cipherhome',
  
  // Storage (MinIO)
  minioEndpoint: process.env.MINIO_ENDPOINT || 'localhost',
  minioPort: parseInt(process.env.MINIO_PORT || '9000', 10),
  minioAccessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  minioSecretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
  
  // AI (Ollama)
  ollamaUrl: process.env.OLLAMA_URL || 'http://localhost:11434',
  
  // Blockchain (Solana)
  solanaRpcUrl: process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
  solanaNetwork: process.env.SOLANA_NETWORK || 'devnet',
  
  // Media (Jellyfin)
  jellyfinUrl: process.env.JELLYFIN_URL || 'http://localhost:8096',
  
  // CORS
  corsOrigin: process.env.CORS_ORIGIN || '*',
};
