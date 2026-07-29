/**
 * Supabase Backed Data Store for BugStore and PrintSettingsStore.
 * Directly communicates with Supabase over HTTPS (Port 443).
 * Works natively on Netlify, Mobile, Tablets, Desktops — no backend server needed.
 *
 * Supabase Project: muyubeutdcrnjzdaacsh
 */

const SUPABASE_URL = 'https://muyubeutdcrnjzdaacsh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11eXViZXV0ZGNybmp6ZGFhY3NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxNDcyMTUsImV4cCI6MjEwMDcyMzIxNX0.h0nZ4njrkKLdooUS8-ZwJwTfsuFVYbCNy1Kr2008ZTI';

// ES modules are deferred — regular CDN <script> tags finish BEFORE modules execute.
// So window.supabase is always available here. We create the client once at module load time.
const _db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function getSupabase() {
    return _db;
}
// --- Helper: map DB row -> app object ---
function dbToApi(row) {
    if (!row) return null;
    return {
        id: row.test_logs_id,
        datetime: row.datetime ? row.datetime.slice(0, 16) : '',
        module: row.module || '',
        scenario: row.scenario || '',
        steps: row.steps || '',
        expected: row.expected || '',
        user: row.user_role || 'Fur Parent',
        testerName: row.tester_name || 'Jeric Alcantara',
        status: row.status || 'PASS',
        comments: row.comments || ''
    };
}

// --- Helper: pad datetime to ISO ---
function apiDatetimeToDb(datetime) {
    if (!datetime) return new Date().toISOString();
    return datetime.length === 16 ? `${datetime}:00Z` : datetime;
}

// --- Helper: generate unique test case ID ---
function generateId() {
    return 'tc-' + Date.now() + '-' + Math.floor(Math.random() * 100000);
}

// ─────────────────────────────────────────────
// BugStore — CRUD for test_logs table
// ─────────────────────────────────────────────
class BugStore {
    // Throws on Supabase error — queries live records from database
    static async getAll() {
        const db = getSupabase();
        if (!db) return [];
        const { data, error } = await db
            .from('test_logs')
            .select('*')
            .order('datetime', { ascending: true });
        if (error) throw new Error(`Supabase error: ${error.message}`);
        return (data || []).map(dbToApi).filter(Boolean);
    }

    // Safe version for polling — returns live data or empty array on error
    static async getAllSafe() {
        try {
            return await BugStore.getAll();
        } catch (err) {
            console.warn('[BugStore] getAllSafe fallback:', err.message);
            return [];
        }
    }

    static async saveAll(logs) {
        const db = getSupabase();
        if (!db) return [];

        // 1. Fetch existing IDs in database
        const { data: existingData } = await db.from('test_logs').select('test_logs_id');
        const existingIds = new Set((existingData || []).map(r => r.test_logs_id));
        const currentIds = new Set(logs.map(l => l.id).filter(Boolean));

        // 2. Delete rows removed from the active log set
        const idsToDelete = Array.from(existingIds).filter(id => !currentIds.has(id));
        if (idsToDelete.length > 0) {
            await db.from('test_logs').delete().in('test_logs_id', idsToDelete);
        }

        // 3. Prepare rows for upsert
        const rows = logs.map(l => ({
            test_logs_id: l.id || generateId(),
            datetime: apiDatetimeToDb(l.datetime),
            module: l.module,
            scenario: l.scenario,
            steps: l.steps,
            expected: l.expected,
            user_role: l.user || 'Fur Parent',
            tester_name: l.testerName || 'Jeric Alcantara',
            status: l.status || 'PASS',
            comments: l.comments || ''
        }));

        if (rows.length > 0) {
            const { data, error } = await db.from('test_logs').upsert(rows).select();
            if (error) throw new Error(error.message);
            return (data || []).map(dbToApi);
        }
        return [];
    }

    static async add(log) {
        const db = getSupabase();
        const row = {
            test_logs_id: log.id || generateId(),
            datetime: apiDatetimeToDb(log.datetime),
            module: log.module,
            scenario: log.scenario,
            steps: log.steps,
            expected: log.expected,
            user_role: log.user || 'Fur Parent',
            tester_name: log.testerName || 'Jeric Alcantara',
            status: log.status || 'PASS',
            comments: log.comments || ''
        };
        const { data, error } = await db.from('test_logs').insert([row]).select();
        if (error) throw new Error(error.message);
        return dbToApi(data[0]);
    }

    static async update(id, log) {
        const db = getSupabase();
        const row = {
            datetime: apiDatetimeToDb(log.datetime),
            module: log.module,
            scenario: log.scenario,
            steps: log.steps,
            expected: log.expected,
            user_role: log.user || 'Fur Parent',
            tester_name: log.testerName || 'Jeric Alcantara',
            status: log.status || 'PASS',
            comments: log.comments || ''
        };
        const { data, error } = await db
            .from('test_logs')
            .update(row)
            .eq('test_logs_id', id)
            .select();
        if (error) throw new Error(error.message);
        return dbToApi(data[0]);
    }

    static async updateStatus(id, status) {
        const db = getSupabase();
        const { data, error } = await db
            .from('test_logs')
            .update({ status })
            .eq('test_logs_id', id)
            .select();
        if (error) throw new Error(error.message);
        return dbToApi(data[0]);
    }

    static async delete(id) {
        const db = getSupabase();
        const { error } = await db
            .from('test_logs')
            .delete()
            .eq('test_logs_id', id);
        if (error) throw new Error(error.message);
    }

    static async reset() {
        const db = getSupabase();
        if (db) {
            await db.from('test_logs').delete().neq('test_logs_id', '');
        }
        return [];
    }
}

// ─────────────────────────────────────────────
// PrintSettingsStore — CRUD for print_settings table
// ─────────────────────────────────────────────
class PrintSettingsStore {
    static async get() {
        const db = getSupabase();
        const { data, error } = await db
            .from('print_settings')
            .select('*')
            .eq('print_settings_id', 1)
            .maybeSingle();

        // Return defaults if no row or query error
        if (error || !data) {
            return {
                groupName: "Team Harvard",
                systemTitle: "APawtMent: A Multi-Platform Information System for Adopting Pets of Luca's Sanctuary and Cawa's Gang",
                adviserName: "Jeffrey M. Caoile, LPT, DIT",
                researchers: "John Lee T. Agustin\nJeric Jay P. Alcantara\nPhilip James S. Marquez\nJohn Denver C. Petinez\nJacques Esmond B. Fernandez",
                reportDate: "March 23, 2026",
                preparedLeader: "John Denver C. Petinez",
                preparedProgrammer: "Jeric Jay P. Alcantara",
                checkedAdviser: "Jeffrey M. Caoile, LPT, DIT"
            };
        }

        return {
            groupName: data.group_name,
            systemTitle: data.system_title,
            adviserName: data.adviser_name,
            researchers: data.researchers,
            reportDate: data.report_date,
            preparedLeader: data.prepared_leader,
            preparedProgrammer: data.prepared_programmer,
            checkedAdviser: data.checked_adviser
        };
    }

    static async save(settings) {
        const db = getSupabase();
        const row = {
            print_settings_id: 1,
            group_name: settings.groupName,
            system_title: settings.systemTitle,
            adviser_name: settings.adviserName,
            researchers: settings.researchers,
            report_date: settings.reportDate,
            prepared_leader: settings.preparedLeader,
            prepared_programmer: settings.preparedProgrammer,
            checked_adviser: settings.checkedAdviser
        };
        const { error } = await db.from('print_settings').upsert([row]);
        if (error) throw new Error(error.message);
        return settings;
    }
}

// ─────────────────────────────────────────────
// Real-time Subscriptions using Supabase WebSockets
// ─────────────────────────────────────────────
function subscribeToBugStore(onDataChange) {
    try {
        const db = getSupabase();
        const channel = db.channel('test_logs_realtime_channel')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'test_logs' }, (payload) => {
                if (typeof onDataChange === 'function') {
                    onDataChange(payload);
                }
            })
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('[Supabase Realtime] Connected to test_logs stream');
                } else if (status === 'CHANNEL_ERROR') {
                    console.warn('[Supabase Realtime] WebSocket subscription fallback active');
                }
            });
        return channel;
    } catch (err) {
        console.warn('Realtime subscription to test_logs failed:', err);
        return null;
    }
}

function subscribeToPrintSettings(onDataChange) {
    try {
        const db = getSupabase();
        const channel = db.channel('print_settings_realtime_channel')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'print_settings' }, (payload) => {
                if (typeof onDataChange === 'function') {
                    onDataChange(payload);
                }
            })
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('[Supabase Realtime] Connected to print_settings stream');
                }
            });
        return channel;
    } catch (err) {
        console.warn('Realtime subscription to print_settings failed:', err);
        return null;
    }
}

export { BugStore, PrintSettingsStore, subscribeToBugStore, subscribeToPrintSettings };


