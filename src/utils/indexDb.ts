import { openDB, DBSchema, IDBPDatabase } from "idb";

interface UserData {
  id?: string;
  email?: string;
  privateKey?: string;
  publicKey?: string;
  loginToken?: string;
  timestamp?: number;
}

interface UsersSchema extends DBSchema {
  usersData: {
    key: string;
    value: UserData;
    indexes: {
      email: string;
      timestamp: number;
    };
  };
}

class UserStorageService {
  private dbName = "users";
  private storeName = "usersData";
  private static instance: UserStorageService;
  private dbPromise: Promise<IDBPDatabase<UsersSchema>> | null = null;

  private constructor() {}

  public static getInstance(): UserStorageService {
    if (!UserStorageService.instance) {
      UserStorageService.instance = new UserStorageService();
    }
    return UserStorageService.instance;
  }

  private async getDatabase(): Promise<IDBPDatabase<UsersSchema>> {
    try {
      if (this.dbPromise) {
        try {
          const db = await this.dbPromise;

          db.transaction(this.storeName);
          return db;
        } catch (err) {
          console.warn(
            "IndexedDB connection is closing or closed. Reinitializing..."
          );
          this.dbPromise = null;
        }
      }

      this.dbPromise = openDB<UsersSchema>(this.dbName, 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains("usersData")) {
            const store = db.createObjectStore("usersData", {
              keyPath: "id",
              autoIncrement: true,
            });
            store.createIndex("email", "email", { unique: true });
            store.createIndex("timestamp", "timestamp");
          }
        },
      });

      return this.dbPromise;
    } catch (error) {
      console.error("Error opening IndexedDB:", error);
      throw error;
    }
  }

  async saveUserData(
    userEmail: string,
    publicKey: string,
    loginToken: string,
    privateKey?: string
  ) {
    const db = await this.getDatabase();

    try {
      const emailIndex = db.transaction(this.storeName).store.index("email");
      const existingUser = await emailIndex.get(userEmail);

      let savedRecord;
      console.log(`existingUser`, existingUser);

      if (existingUser) {
        const updatedPrivateKey = privateKey
          ? privateKey
          : existingUser.privateKey;

        const updatedUser = {
          ...existingUser,
          privateKey: updatedPrivateKey,
          publicKey,
          loginToken,
          timestamp: Date.now(),
        };

        await db.put(this.storeName, updatedUser);
        savedRecord = updatedUser;
      } else {
        const newUser = {
          email: userEmail,
          privateKey,
          publicKey,
          loginToken,
          timestamp: Date.now(),
        };

        await db.add(this.storeName, newUser);
        savedRecord = newUser;
      }

      console.log("Saved user data:", savedRecord);
    } catch (error) {
      console.error("Error saving user data to IndexedDB:", error);
      throw error;
    }
  }

  async getUserData(userEmail: string) {
    const db = await this.getDatabase();
    try {
      console.log(`userEmail`, userEmail);

      const emailIndex = db.transaction(this.storeName).store.index("email");
      console.log(`emailIndex`, emailIndex);

      const userData = await emailIndex.get(userEmail);
      console.log(`userData`, userData);

      return userData || null;
    } catch (error) {
      console.error("Error retrieving user data:", error);
      return null;
    }
  }

  async clearAuthData(email: string) {
    const db = await this.getDatabase();

    try {
      const emailIndex = db.transaction(this.storeName).store.index("email");
      const userData = await emailIndex.get(email);
      console.log(`userData`, userData);

      if (userData) {
        await db.put(this.storeName, {
          ...userData,
          loginToken: undefined,
          timestamp: Date.now(),
        });
      }
    } catch (error) {
      console.error("Error clearing auth data:", error);
    }
  }
}

export const userStorageService = UserStorageService.getInstance();
