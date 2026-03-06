/**
 * TimeLedger Persistence Layer
 * This service handles switching between different database engines.
 */

// 1. LocalStorage Adapter (Current)
const LocalStorageAdapter = {
    name: 'Local Browser (Default)',
    save: (key, data) => {
        localStorage.setItem(key, JSON.stringify(data));
        return Promise.resolve(true);
    },
    load: (key) => {
        const data = localStorage.getItem(key);
        return Promise.resolve(data ? JSON.parse(data) : null);
    }
};

// 2. Firebase Adapter (Stub)
const FirebaseAdapter = {
    name: 'Firebase Firestore',
    save: async (key, data) => {
        console.log(`[Firebase] Saving ${key}... (Credentials Required)`);
        // Implementation would use doc(db, 'users', uid, key, 'data')
        return Promise.resolve(true);
    },
    load: async (key) => {
        console.log(`[Firebase] Loading ${key}...`);
        return Promise.resolve(null);
    }
};

// 3. Supabase Adapter (Stub)
const SupabaseAdapter = {
    name: 'Supabase (PostgreSQL)',
    save: async (key, data) => {
        console.log(`[Supabase] Upserting to ${key} table...`);
        // Implementation would use supabase.from(key).upsert(data)
        return Promise.resolve(true);
    },
    load: async (key) => {
        console.log(`[Supabase] Fetching ${key}...`);
        return Promise.resolve(null);
    }
};

const adapters = {
    local: LocalStorageAdapter,
    firebase: FirebaseAdapter,
    supabase: SupabaseAdapter
};

class DatabaseService {
    constructor() {
        this.engine = localStorage.getItem('tl_db_engine') || 'local';
        this.adapter = adapters[this.engine] || adapters.local;
    }

    setEngine(engineId) {
        if (adapters[engineId]) {
            this.engine = engineId;
            this.adapter = adapters[engineId];
            localStorage.setItem('tl_db_engine', engineId);
            return true;
        }
        return false;
    }

    async save(key, data) {
        return await this.adapter.save(key, data);
    }

    async load(key) {
        return await this.adapter.load(key);
    }

    getAvailableEngines() {
        return Object.keys(adapters).map(id => ({
            id,
            name: adapters[id].name
        }));
    }
}

export const db = new DatabaseService();
