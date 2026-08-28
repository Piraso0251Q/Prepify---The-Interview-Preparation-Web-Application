
// USERS MOCK DATA

export const USERS = [
  {
    id: "user-001",
    name: "Alex Chen",
    email: "alex@example.com",
    password: "password123",
    role: "Frontend",
    avatar: "AC",
    isAdmin: false,
    joinedAt: "2024-01-15",
  },
  {
    id: "user-admin",
    name: "Admin User",
    email: "admin@prepify.dev",
    password: "admin123",
    role: "Full-Stack",
    avatar: "AU",
    isAdmin: true,
    joinedAt: "2023-12-01",
  },
];

export const DEFAULT_USER = USERS[0];
