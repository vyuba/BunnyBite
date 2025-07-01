import { Models } from "appwrite";
import { createStore } from "zustand/vanilla";
import { clientDatabase } from "../lib/client-appwrite";
import { Query } from "appwrite";

export type CounterState = {
  count: number;
  user: Models.User<Models.Preferences> | null;
  shop: Models.Document | null;
  userShops: Models.DocumentList<Models.Document> | null;
  isSidebar: boolean;
};

export type CounterActions = {
  decrementCount: () => void;
  incrementCount: () => void;
  setCurrentUser: (user: Models.User<Models.Preferences>) => void;
  setUserShop: (user_id: Models.Identity["$id"]) => void;
  setActiveShop: (shop: Models.Document) => void;
  setSidebar: (isSidebar: boolean) => void;
};

export type CounterStore = CounterState & CounterActions;

export const initCounterStore = (): CounterState => {
  return {
    count: new Date().getFullYear(),
    user: null,
    shop: null,
    userShops: null,
    isSidebar: false,
  };
};

export const defaultInitState: CounterState = {
  count: 0,
  user: null,
  shop: null,
  userShops: null,
  isSidebar: false,
};

export const createCounterStore = (
  initState: CounterState = defaultInitState
) => {
  return createStore<CounterStore>()((set) => ({
    ...initState,
    setSidebar: (isSidebar: boolean) => set(() => ({ isSidebar })),
    decrementCount: () => set((state) => ({ count: state.count - 1 })),
    incrementCount: () => set((state) => ({ count: state.count + 1 })),
    setCurrentUser: (user: Models.User<Models.Preferences>) =>
      set(() => ({ user })),
    setUserShop: async (user_id) => {
      const response = await clientDatabase.listDocuments(
        process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
        process.env.NEXT_PUBLIC_SHOPS_COLLECTION_ID!,
        [Query.equal("user", user_id || "")]
      );

      const shop = response.documents[0]; // assuming you're fetching a single shop per user
      console.log(shop);

      set(() => ({ shop, userShops: response }));
    },
    setActiveShop: async (shop) => {
      set({ shop });
    },
  }));
};
