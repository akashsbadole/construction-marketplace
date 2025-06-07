// Simple mock client for backward compatibility

// Create a Supabase-like interface for backward compatibility
export const supabase = {
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        single: async () => {
          // This is a simplified implementation
          // In a real app, you'd implement proper query building
          console.warn(
            "Supabase compatibility layer - implement proper query for:",
            table,
            columns,
            column,
            value
          );
          return { data: null, error: null };
        },
      }),
      order: (column: string, options?: any) => ({
        limit: (count: number) => ({
          then: async (callback: any) => {
            console.warn(
              "Supabase compatibility layer - implement proper query for:",
              table
            );
            return callback({ data: [], error: null });
          },
        }),
      }),
      limit: (count: number) => ({
        then: async (callback: any) => {
          console.warn(
            "Supabase compatibility layer - implement proper query for:",
            table
          );
          return callback({ data: [], error: null });
        },
      }),
    }),
    insert: (data: any) => ({
      select: () => ({
        single: async () => {
          console.warn(
            "Supabase compatibility layer - implement proper insert for:",
            table
          );
          return { data: null, error: null };
        },
      }),
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        select: () => ({
          single: async () => {
            console.warn(
              "Supabase compatibility layer - implement proper update for:",
              table
            );
            return { data: null, error: null };
          },
        }),
      }),
    }),
    delete: () => ({
      eq: (column: string, value: any) => ({
        then: async (callback: any) => {
          console.warn(
            "Supabase compatibility layer - implement proper delete for:",
            table
          );
          return callback({ data: null, error: null });
        },
      }),
    }),
  }),
  storage: {
    from: (bucket: string) => ({
      upload: async (path: string, file: File) => {
        console.warn("Storage not implemented yet");
        return { data: null, error: new Error("Storage not implemented") };
      },
      getPublicUrl: (path: string) => ({
        data: { publicUrl: `/uploads/${path}` },
      }),
    }),
  },
};

// For backward compatibility
export const supabaseAdmin = supabase;
