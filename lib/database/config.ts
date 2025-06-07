export type DatabaseProvider = 'sqlite' | 'postgresql' | 'dynamodb'

export interface DatabaseConfig {
  provider: DatabaseProvider
  sqlite?: {
    filename: string
  }
  postgresql?: {
    host: string
    port: number
    database: string
    username: string
    password: string
    ssl?: boolean
  }
  dynamodb?: {
    region: string
    accessKeyId?: string
    secretAccessKey?: string
    endpoint?: string // for local development
  }
}

export const getDatabaseConfig = (): DatabaseConfig => {
  const provider = (process.env.DATABASE_PROVIDER || 'sqlite') as DatabaseProvider

  switch (provider) {
    case 'sqlite':
      return {
        provider: 'sqlite',
        sqlite: {
          filename: process.env.SQLITE_FILENAME || './data/buildconnect.db'
        }
      }

    case 'postgresql':
      return {
        provider: 'postgresql',
        postgresql: {
          host: process.env.POSTGRES_HOST || 'localhost',
          port: parseInt(process.env.POSTGRES_PORT || '5432'),
          database: process.env.POSTGRES_DB || 'buildconnect',
          username: process.env.POSTGRES_USER || 'postgres',
          password: process.env.POSTGRES_PASSWORD || '',
          ssl: process.env.POSTGRES_SSL === 'true'
        }
      }

    case 'dynamodb':
      return {
        provider: 'dynamodb',
        dynamodb: {
          region: process.env.AWS_REGION || 'us-east-1',
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          endpoint: process.env.DYNAMODB_ENDPOINT // for local development
        }
      }

    default:
      throw new Error(`Unsupported database provider: ${provider}`)
  }
}
