import { Models } from "appwrite";
import { createStore } from "zustand/vanilla";
import { clientDatabase } from "../lib/client-appwrite";
import { Query } from "appwrite";
import { setCurrentShopCookie } from "@/utils";
import { Shop } from "@/types";

export type UserState = {
  user: Models.User<Models.Preferences> | null;
  shop: Shop | null;
  userShops: Models.DocumentList<Shop> | null;
  isSidebar: boolean;
};

export type UserActions = {
  setCurrentUser: (user: Models.User<Models.Preferences>) => void;
  setUserShop: (user_id: Models.Identity["$id"]) => void;
  setActiveShop: (shop: Shop) => void;
  setSidebar: (isSidebar: boolean) => void;
  removeUserShop: (shop_id: Shop["$id"]) => void;
  updateUserShop: (shop_id: Shop["$id"], shop: Shop) => void;
  addUserShop: (shop: Shop) => void;
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
      const response: Models.DocumentList<Shop> =
        await clientDatabase.listDocuments(
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
    removeUserShop: async (shop_id: Shop["$id"]) => {
      set((state) => ({
        userShops: {
          ...state.userShops,
          documents: state.userShops.documents.filter(
            (shop) => shop.id !== shop_id
          ),
        },
        shop: state.shop.$id === shop_id ? null : state.shop,
      }));
    },
    updateUserShop: (shop_id: Shop["$id"], shop: Shop) => {
      set((state) => ({
        userShops: {
          ...state.userShops,
          documents: state.userShops.documents.map((userShop) =>
            userShop.$id === shop_id ? shop : userShop
          ),
        },
        shop: state.shop.$id === shop_id ? shop : state.shop,
      }));
    },
    addUserShop: (shop: Shop) => {
      set((state) => ({
        userShops: {
          ...state.userShops,
          documents: [...state.userShops.documents, shop],
        },
      }));
    },
    setActiveShop: async (shop) => {
      localStorage.setItem("shop", shop?.shop);
      setCurrentShopCookie(shop?.shop);
      set({ shop: shop });
      console.log(shop);
    },
  }));
};
