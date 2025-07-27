"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
  type UserStore,
  createUserStore,
  initUserStore,
} from "../stores/user-store";

export type userStoreApi = ReturnType<typeof createUserStore>;

export const UserStoreContext = createContext<userStoreApi | undefined>(
  undefined
);

export interface userStoreProviderProps {
  children: ReactNode;
}

export const UserStoreProvider = ({ children }: userStoreProviderProps) => {
  const userRef = useRef<userStoreApi | null>(null);
  if (userRef.current === null) {
    userRef.current = createUserStore(initUserStore());
  }

  return (
    <UserStoreContext.Provider value={userRef.current}>
      {children}
    </UserStoreContext.Provider>
  );
};

export const useUserStore = <T,>(selector: (store: UserStore) => T): T => {
  const userStoreContext = useContext(UserStoreContext);

  if (!userStoreContext) {
    throw new Error(`useCounterStore must be used within CounterStoreProvider`);
  }

  return useStore(userStoreContext, selector);
};
