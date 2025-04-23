import { openDB, DBSchema } from "idb";

interface AuthData {
  id?: string;
  email?: string;
  privateKey?: string;
  publicKey?: string;
  timestamp?: number;
}

class AuthStorageService {
  private dbName = "AuthDatabase";
  private storeName = "AuthStore";

  private async createDatabase() {
    return await openDB<AuthSchema>(this.dbName, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("AuthStore")) {
          const store = db.createObjectStore("AuthStore", {
            keyPath: "id",
            autoIncrement: true,
          });
          store.createIndex("email", "email", { unique: true });
          store.createIndex("timestamp", "timestamp");
        }
      },
    });
  }
  async saveEmail(email: string) {
    const db = await this.createDatabase();

    try {
      const existingEntry = await db.getFromIndex(
        this.storeName,
        "email",
        email
      );

      if (existingEntry) {
        await db.put(this.storeName, {
          ...existingEntry,
          email,
          timestamp: Date.now(),
        });
      } else {
        await db.add(this.storeName, {
          email,
          timestamp: Date.now(),
        });
      }
    } catch (error) {
      console.error("Error saving email to IndexedDB:", error);
      throw error;
    }
  }

  async savePrivateKey(privateKey: string | undefined, publicKey: string) {
    const db = await this.createDatabase();

    try {
      const allEntries = await db.getAll(this.storeName);
      const latestEntry = allEntries[allEntries.length - 1];

      if (latestEntry) {
        const updatedPrivateKey =
          privateKey !== undefined ? privateKey : latestEntry.privateKey;

        await db.put(this.storeName, {
          ...latestEntry,
          privateKey: updatedPrivateKey,
          publicKey,
          timestamp: Date.now(),
        });
      }
    } catch (error) {
      console.error("Error saving private key to IndexedDB:", error);
      throw error;
    }
  }

  async getAuthData() {
    const db = await this.createDatabase();

    try {
      const allEntries = await db.getAll(this.storeName);
      return allEntries[allEntries.length - 1] || null;
    } catch (error) {
      console.error("Error retrieving auth data:", error);
      return null;
    }
  }

  async clearAuthData() {
    const db = await this.createDatabase();

    try {
      const allKeys = await db.getAllKeys(this.storeName);
      for (const key of allKeys) {
        await db.delete(this.storeName, key);
      }
    } catch (error) {
      console.error("Error clearing auth data:", error);
    }
  }
}

export const authStorageService = new AuthStorageService();
