import { database } from './client'
import { seedDatabase } from './seed'
import fs from 'fs'
import path from 'path'

let isInitialized = false

export async function initializeDatabase() {
  if (isInitialized) return

  try {
    console.log('Initializing database...')
    
    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
      console.log('Created data directory')
    }

    // Initialize database connection
    const { db, provider } = database
    console.log(`Database initialized with provider: ${provider}`)

    // Check if database is empty and seed if needed
    if (provider === 'sqlite') {
      try {
        // Try to query users table to see if it has data
        const result = await db.run('SELECT COUNT(*) as count FROM users')
        const userCount = result?.count || 0
        
        if (userCount === 0) {
          console.log('Database is empty, seeding with sample data...')
          await seedDatabase()
          console.log('Database seeded successfully')
        } else {
          console.log(`Database already has ${userCount} users`)
        }
      } catch (error) {
        console.log('Database tables may not exist yet, this is normal for first run')
      }
    }

    isInitialized = true
    console.log('Database initialization completed')
  } catch (error) {
    console.error('Database initialization failed:', error)
    // Don't throw error to prevent app from crashing
    // The app should still work with limited functionality
  }
}

// Auto-initialize in development
if (process.env.NODE_ENV === 'development') {
  initializeDatabase().catch(console.error)
}
