import { Session } from "@shopify/shopify-api";
import { Databases, Query, Client } from "node-appwrite";

// Custom session storage implementation using Appwrite
class AppwriteSessionStorage {
  private databases: Databases;
  private databaseId: string;
  private collectionId: string;
  constructor(
    appwriteClient: Client,
    databaseId: string,
    collectionId: string
  ) {
    this.databases = new Databases(appwriteClient);
    this.databaseId = databaseId;
    this.collectionId = collectionId;
  }

  async storeSession(session: Session) {
    if (!session) {
      return false;
    }
    const sessionData = session.toObject();
    console.log("sessionData", sessionData);
    const document = {
      shop: sessionData.shop,
      state: sessionData.state,
      isOnline: sessionData.isOnline,
      scope: sessionData.scope,
      accessToken: sessionData.accessToken,
      expires: sessionData.expires,
      onlineAccessInfo: sessionData.onlineAccessInfo,
    };

    try {
      await this.databases.updateDocument(
        this.databaseId,
        this.collectionId,
        session.id,
        document
      );
      return true;
    } catch (error) {
      if (error.code === 404) {
        await this.databases.createDocument(
          this.databaseId,
          this.collectionId,
          session.id,
          document
        );
        return true;
      }
      throw error;
    }
  }

  async loadSession(id: string) {
    try {
      const document = await this.databases.getDocument(
        this.databaseId,
        this.collectionId,
        id
      );
      if (!document) return undefined;
      //   console.log("document", document);
      //   const sessionData = JSON.parse(document);
      //   console.log("session", sessionData);
      const cleanDocument = {
        id: document.$id,
        shop: document.shop,
        state: document.state,
        isOnline: document.isOnline,
        scope: document.scope,
        accessToken: document.accessToken,
        expires: document.expires,
        onlineAccessInfo: document.onlineAccessInfo,
      };
      return new Session(cleanDocument);
    } catch (error) {
      if (error.code === 404) return undefined;
      throw error;
    }
  }

  async deleteSession(id: string) {
    try {
      await this.databases.deleteDocument(
        this.databaseId,
        this.collectionId,
        id
      );
      return true;
    } catch (error) {
      if (error.code === 404) return false;
      throw error;
    }
  }

  async deleteSessions(ids: string[]) {
    try {
      for (const id of ids) {
        await this.deleteSession(id);
      }
      return true;
    } catch (error) {
      console.log("Error deleting sessions:", error);
      return false;
    }
  }

  async findSessionsByShop(shop: string) {
    try {
      const response = await this.databases.listDocuments(
        this.databaseId,
        this.collectionId,
        [Query.equal("shop", shop)]
      );
      return response.documents.map((doc) => {
        const sessionData = JSON.parse(doc.data);
        return new Session(sessionData);
      });
    } catch (error) {
      throw error;
    }
  }
}

// Initialize Appwrite client
// const appwrite = new Client()
//   .setEndpoint('https://your-appwrite-endpoint') // Replace with your Appwrite endpoint
//   .setProject('your-project-id'); // Replace with your Appwrite project ID

// Create session storage instance
// const sessionStorage = new AppwriteSessionStorage(appwrite, 'your-database-id', 'shopify_sessions');

// // Initialize Shopify app
// const shopify = shopifyApp({
//   sessionStorage,
//   apiKey: 'your-api-key',
//   apiSecret: 'your-api-secret',
//   scopes: ['read_products', 'write_products'],
//   hostName: 'your-app-hostname',
// });

export { AppwriteSessionStorage };
