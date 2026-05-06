"use client";
import {
  createContext, useContext, useEffect, useState, ReactNode, useCallback,
} from "react";
import {
  User, onAuthStateChanged, signInWithEmailAndPassword, signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getClientAuth, getClientDb } from "@/lib/firebase/client";

interface AdminAuthCtx {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getToken: () => Promise<string>;
}

const Ctx = createContext<AdminAuthCtx | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getClientAuth();
    const db = getClientDb();

    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const snap = await getDoc(doc(db, "admins", u.uid));
          setIsAdmin(snap.exists());
        } catch {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const auth = getClientAuth();
    const db = getClientDb();
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const snap = await getDoc(doc(db, "admins", cred.user.uid));
    if (!snap.exists()) {
      await signOut(auth);
      throw new Error("Access denied. This account is not an admin.");
    }
    setIsAdmin(true);
  }, []);

  const logout = useCallback(async () => {
    await signOut(getClientAuth());
    setIsAdmin(false);
  }, []);

  const getToken = useCallback(async (): Promise<string> => {
    if (!user) throw new Error("Not authenticated");
    return user.getIdToken();
  }, [user]);

  return (
    <Ctx.Provider value={{ user, isAdmin, loading, login, logout, getToken }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAdminAuth must be inside AdminAuthProvider");
  return ctx;
}
