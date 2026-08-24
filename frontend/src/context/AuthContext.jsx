import { createContext, useContext, useState } from "react";
import { storage, STORAGE_KEYS } from "../utils/storage";
import { USERS } from "../data/users";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => storage.get(STORAGE_KEYS.USER));
  const [selectedRole, setSelectedRoleState] = useState(
    () => storage.get(STORAGE_KEYS.ROLE) || "Frontend"
  );
  const [subscription, setSubscription] = useState(
    () => storage.get(STORAGE_KEYS.SUBSCRIPTION)
  );

  const login = (email, password) => {
    const found = USERS.find(u => u.email === email && u.password === password);
    if (!found) return { success: false, error: "Invalid email or password." };
    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    storage.set(STORAGE_KEYS.USER, safeUser);
    return { success: true, isAdmin: safeUser.isAdmin };
  };

  const signup = (name, email, password) => {
    const exists = USERS.find(u => u.email === email);
    if (exists) return { success: false, error: "An account with this email already exists." };
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      avatar: name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
      role: "Frontend",
      isAdmin: false,
      joinedAt: new Date().toISOString().split("T")[0],
    };
    setUser(newUser);
    storage.set(STORAGE_KEYS.USER, newUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    storage.remove(STORAGE_KEYS.USER);
    // Subscription is intentionally NOT cleared on logout so returning admins keep their plan
  };

  const setSelectedRole = (role) => {
    setSelectedRoleState(role);
    storage.set(STORAGE_KEYS.ROLE, role);
    if (user) {
      const updated = { ...user, role };
      setUser(updated);
      storage.set(STORAGE_KEYS.USER, updated);
    }
  };

  // Subscribe to a plan: 'monthly' | 'quarterly' | 'yearly'
  const subscribe = (plan) => {
    const now = new Date();
    const daysMap = { monthly: 30, quarterly: 90, yearly: 365 };
    const expiry = new Date(now);
    expiry.setDate(expiry.getDate() + (daysMap[plan] ?? 30));
    const sub = {
      plan,
      startDate: now.toISOString(),
      expiryDate: expiry.toISOString(),
    };
    setSubscription(sub);
    storage.set(STORAGE_KEYS.SUBSCRIPTION, sub);
    return sub;
  };

  const hasActiveSubscription = () => {
    if (!subscription) return false;
    return new Date(subscription.expiryDate) > new Date();
  };

  return (
    <AuthContext.Provider value={{
      user, login, signup, logout,
      selectedRole, setSelectedRole,
      subscription, subscribe, hasActiveSubscription,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
