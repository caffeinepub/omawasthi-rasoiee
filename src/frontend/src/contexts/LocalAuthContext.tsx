import type React from "react";
import { createContext, useCallback, useContext, useState } from "react";

const SESSION_KEY = "localAuthSession";
const USERS_KEY = "localRegisteredUsers";

const ADMIN_USERNAME = "omawasthi07122006";
const ADMIN_PASSWORD = "7122006";

export interface LocalAuthUser {
  name: string;
  email: string;
}

interface Session {
  name: string;
  email: string;
  isAdmin: boolean;
}

interface StoredUser {
  name: string;
  email: string;
  hash: string;
}

function simpleHash(password: string): string {
  return btoa(encodeURIComponent(password));
}

function getStoredUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

interface LocalAuthContextValue {
  session: Session | null;
  localUser: LocalAuthUser | null;
  isLocalAdmin: boolean;
  adminLogin: (username: string, password: string) => boolean;
  userSignup: (name: string, email: string, password: string) => void;
  userLogin: (email: string, password: string) => void;
  localLogout: () => void;
  logout: () => void;
}

const LocalAuthContext = createContext<LocalAuthContextValue | null>(null);

export function LocalAuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => readSession());

  const localUser: LocalAuthUser | null =
    session && !session.isAdmin
      ? { name: session.name, email: session.email }
      : null;

  const isLocalAdmin = session?.isAdmin ?? false;

  const adminLogin = useCallback(
    (username: string, password: string): boolean => {
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const s: Session = {
          name: "Om Awasthi",
          email: "omawasthi379@gmail.com",
          isAdmin: true,
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(s));
        setSession(s);
        return true;
      }
      return false;
    },
    [],
  );

  const userSignup = useCallback(
    (name: string, email: string, password: string): void => {
      const hash = simpleHash(password);
      const users = getStoredUsers();
      if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("This email is already registered. Please sign in.");
      }
      users.push({ name, email, hash });
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      const s: Session = { name, email, isAdmin: false };
      localStorage.setItem(SESSION_KEY, JSON.stringify(s));
      setSession(s);
    },
    [],
  );

  const userLogin = useCallback((email: string, password: string): void => {
    const hash = simpleHash(password);
    const users = getStoredUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.hash === hash,
    );
    if (!user) {
      throw new Error("Invalid email or password. Please try again.");
    }
    const s: Session = { name: user.name, email: user.email, isAdmin: false };
    localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    setSession(s);
  }, []);

  const localLogout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
  }, []);

  return (
    <LocalAuthContext.Provider
      value={{
        session,
        localUser,
        isLocalAdmin,
        adminLogin,
        userSignup,
        userLogin,
        localLogout,
        logout: localLogout,
      }}
    >
      {children}
    </LocalAuthContext.Provider>
  );
}

export function useLocalAuth(): LocalAuthContextValue {
  const ctx = useContext(LocalAuthContext);
  if (!ctx)
    throw new Error("useLocalAuth must be used within LocalAuthProvider");
  return ctx;
}
