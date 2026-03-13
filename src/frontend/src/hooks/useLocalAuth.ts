import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "localAuth";

const ADMIN_EMAIL_1 = "omawasthi379@gmail.com";
const ADMIN_EMAIL_2 = "admin";
const ADMIN_PASSWORD = "omawasthi07122006";

export interface LocalUser {
  name: string;
  email: string;
  mobile: string;
}

interface StoredAuth {
  user: LocalUser;
  isAdmin: boolean;
}

export function useLocalAuth() {
  const [localUser, setLocalUser] = useState<LocalUser | null>(null);
  const [isLocalAdmin, setIsLocalAdmin] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: StoredAuth = JSON.parse(raw);
        setLocalUser(parsed.user);
        setIsLocalAdmin(parsed.isAdmin);
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const localLogin = useCallback(
    (email: string, password: string, name = "", mobile = "") => {
      const adminFlag =
        (email === ADMIN_EMAIL_1 || email === ADMIN_EMAIL_2) &&
        password === ADMIN_PASSWORD;

      const user: LocalUser = {
        name: name || (adminFlag ? "Om Awasthi" : email.split("@")[0]),
        email,
        mobile,
      };

      const stored: StoredAuth = { user, isAdmin: adminFlag };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
      setLocalUser(user);
      setIsLocalAdmin(adminFlag);
      return adminFlag;
    },
    [],
  );

  const localLogout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setLocalUser(null);
    setIsLocalAdmin(false);
  }, []);

  return { localUser, isLocalAdmin, localLogin, localLogout };
}
