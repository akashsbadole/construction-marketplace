// Mock database client for client-side use
export const mockDatabase = {
  db: {
    prepare: () => ({
      run: () => ({ changes: 0 }),
      get: () => null,
      all: () => []
    })
  },
  provider: 'mock'
}

// Export for client-side compatibility
export const database = mockDatabase
