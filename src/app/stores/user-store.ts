import { Models } from "appwrite";
import { createStore } from "zustand/vanilla";
import { clientDatabase } from "../lib/client-appwrite";
import { Query } from "appwrite";
import { setCurrentShopCookie } from "@/utils";

export type UserState = {
  user: Models.User<Models.Preferences> | null;
  shop: Models.Document | null;
  userShops: Models.DocumentList<Models.Document> | null;
  isSidebar: boolean;
};

export type UserActions = {
  setCurrentUser: (user: Models.User<Models.Preferences>) => void;
  setUserShop: (user_id: Models.Identity["$id"]) => void;
  setActiveShop: (shop: Models.Document) => void;
  setSidebar: (isSidebar: boolean) => void;
};

export type UserStore = UserState & UserActions;

export const initUserStore = (): UserState => {
  return {
    user: null,
    shop: null,
    userShops: null,
    isSidebar: false,
  };
};

export const defaultInitState: UserState = {
  user: null,
  shop: null,
  userShops: null,
  isSidebar: false,
};

export const createUserStore = (initState: UserState = defaultInitState) => {
  return createStore<UserStore>()((set) => ({
    ...initState,
    setSidebar: (isSidebar: boolean) => set(() => ({ isSidebar })),
    setCurrentUser: (user: Models.User<Models.Preferences>) =>
      set(() => ({ user })),
    setUserShop: async (user_id) => {
      const response = await clientDatabase.listDocuments(
        process.env.NEXT_PUBLIC_PROJECT_DATABASE_ID!,
        process.env.NEXT_PUBLIC_SHOPS_COLLECTION_ID!,
        [Query.equal("user", user_id || "")]
      );

      const shopStorage = localStorage.getItem("shop");
      if (!shopStorage) {
        localStorage.setItem("shop", response.documents[0]?.shop);
        setCurrentShopCookie(response.documents[0]?.shop);
        set(() => ({ shop: response.documents[0], userShops: response }));
        return;
      }

      const shop = response.documents.find((shop) => shop.shop === shopStorage);
      console.log(shop);
      setCurrentShopCookie(shopStorage);
      set(() => ({ shop, userShops: response }));
    },
    setActiveShop: async (shop) => {
      localStorage.setItem("shop", shop?.shop);
      setCurrentShopCookie(shop?.shop);
      set({ shop: shop });
      console.log(shop);
    },
  }));
};
