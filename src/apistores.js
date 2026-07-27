/**
 * Drop-in replacements for BugStore and PrintSettingsStore.
 * Same method names as before, but now backed by the MySQL API
 * instead of localStorage. All methods are now async — every
 * call site needs `await`.
 *
 * Set API_BASE_URL to wherever your Express server is running.
 */
const API_BASE_URL = '/api';

class BugStore {
    static async getAll() {
        const res = await fetch(`${API_BASE_URL}/test-logs`);
        if (!res.ok) throw new Error('Failed to load test logs');
        return res.json();
    }

    // Used by the spreadsheet editor and JSON import to replace the whole table at once.
    static async saveAll(logs) {
        const res = await fetch(`${API_BASE_URL}/test-logs/bulk-replace`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ logs })
        });
        if (!res.ok) throw new Error('Failed to save test logs');
        return res.json();
    }

    static async add(log) {
        const res = await fetch(`${API_BASE_URL}/test-logs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(log)
        });
        if (!res.ok) throw new Error('Failed to add test log');
        return res.json();
    }

    static async update(id, log) {
        const res = await fetch(`${API_BASE_URL}/test-logs/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(log)
        });
        if (!res.ok) throw new Error('Failed to update test log');
        return res.json();
    }

    static async updateStatus(id, status) {
        const res = await fetch(`${API_BASE_URL}/test-logs/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        if (!res.ok) throw new Error('Failed to update status');
        return res.json();
    }

    static async delete(id) {
        const res = await fetch(`${API_BASE_URL}/test-logs/${id}`, { method: 'DELETE' });
        if (!res.ok && res.status !== 204) throw new Error('Failed to delete test log');
    }

    static async reset() {
        const res = await fetch(`${API_BASE_URL}/test-logs/reset`, { method: 'POST' });
        if (!res.ok) throw new Error('Failed to reset test logs');
        return res.json();
    }
}

class PrintSettingsStore {
    static async get() {
        const res = await fetch(`${API_BASE_URL}/print-settings`);
        if (!res.ok) throw new Error('Failed to load print settings');
        return res.json();
    }

    static async save(settings) {
        const res = await fetch(`${API_BASE_URL}/print-settings`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
        });
        if (!res.ok) throw new Error('Failed to save print settings');
        return res.json();
    }
}

export { BugStore, PrintSettingsStore };