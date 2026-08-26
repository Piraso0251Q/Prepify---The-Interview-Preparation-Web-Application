import { createContext, useContext, useState } from "react";
import { storage, STORAGE_KEYS } from "../utils/storage";
import { authAPI } from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => storage.get(STORAGE_KEYS.USER));
  const [selectedRole, setSelectedRoleState] = useState(
    () => storage.get(STORAGE_KEYS.ROLE) || "Frontend"
  );
  const [subscription, setSubscription] = useState(
    () => storage.get(STORAGE_KEYS.SUBSCRIPTION)
  );

  // ── LOGIN — calls backend instead of checking hardcoded array ──
  const login = async (email, password) => {
    const data = await authAPI.login(email, password);
    if (!data.success) return { success: false, error: data.message };

    // Save token so future API calls are authenticated
    localStorage.setItem("accessToken", data.accessToken);

    setUser(data.user);
    storage.set(STORAGE_KEYS.USER, data.user);

    // Sync subscription from backend user
    if (data.user.subscription?.plan) {
      setSubscription(data.user.subscription);
      storage.set(STORAGE_KEYS.SUBSCRIPTION, data.user.subscription);
    }

    return { success: true, isAdmin: data.user.isAdmin };
  };

  // ── SIGNUP — calls backend to create a real account in DB ──────
  const signup = async (name, email, password) => {
    const data = await authAPI.signup(name, email, password);
    if (!data.success) return { success: false, error: data.message };

    // Save token
    localStorage.setItem("accessToken", data.accessToken);

    setUser(data.user);
    storage.set(STORAGE_KEYS.USER, data.user);

    return { success: true };
  };

  // ── LOGOUT — clears token + calls backend to clear cookie ──────
  const logout = async () => {
    await authAPI.logout();
    localStorage.removeItem("accessToken");
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
