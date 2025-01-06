import Dexie from "dexie";

export interface ProductionChain {
  id: number;
  name: string;
  rate: number; // Represents production rate (e.g., items per minute)
}

export interface Build {
  id?: number;
  name: string;
  productionChains: ProductionChain[];
}

class AppDatabase extends Dexie {
  builds!: Dexie.Table<Build, number>;

  constructor() {
    super("SatisfactoryDashboard");
    this.version(1).stores({
      builds: "++id,name", // Auto-increment ID and name as indexed fields
    });
  }
}

const db = new AppDatabase();
export default db;

export const addBuild = async (name: string, productionChains: any[]) => {
  return await db.builds.add({ name, productionChains });
};

export const getBuilds = async () => {
  return await db.builds.toArray();
};

export const deleteBuild = async (id: number) => {
  return await db.builds.delete(id);
};
