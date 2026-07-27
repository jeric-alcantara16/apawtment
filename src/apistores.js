/**
 * Supabase Backed Data Store for BugStore and PrintSettingsStore.
 * Directly communicates with Supabase over HTTPS (Port 443).
 * Works natively on Netlify, Mobile, Tablets, Desktops — no backend server needed.
 *
 * Supabase Project: muyubeutdcrnjzdaacsh
 */

const SUPABASE_URL = 'https://muyubeutdcrnjzdaacsh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11eXViZXV0ZGNybmp6ZGFhY3NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxNDcyMTUsImV4cCI6MjEwMDcyMzIxNX0.h0nZ4njrkKLdooUS8-ZwJwTfsuFVYbCNy1Kr2008ZTI';

function getSupabase() {
    if (window._supabaseInstance) return window._supabaseInstance;
    if (window.supabase && typeof window.supabase.createClient === 'function') {
        window._supabaseInstance = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        return window._supabaseInstance;
    }
    throw new Error('Supabase SDK is not loaded. Make sure the CDN script tag is present in index.html');
}

// --- Helper: map DB row -> app object ---
function dbToApi(row) {
    return {
        id: row.test_logs_id,
        datetime: row.datetime ? row.datetime.slice(0, 16) : '',
        module: row.module,
        scenario: row.scenario,
        steps: row.steps,
        expected: row.expected,
        user: row.user_role,
        status: row.status,
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

// --- 18 Default Seed Test Cases ---
const defaultSeedLogs = [
    { id: "tc-001", datetime: "2026-03-23T08:00", module: "Login Form", scenario: "Verify login with valid credentials", steps: "1. Enter valid username & password\n2. Click \"Login\"", expected: "User should successfully log in and go to dashboard", user: "Admin", status: "PASS", comments: "" },
    { id: "tc-002", datetime: "2026-03-23T08:15", module: "Login Form", scenario: "Verify login with invalid credentials", steps: "1. Enter wrong username/password\n2. Click \"Login\"", expected: "System should display error message", user: "Fur Parent", status: "FAIL", comments: "Message should say: \"Invalid Username or Password\"" },
    { id: "tc-003", datetime: "2026-03-23T08:30", module: "Sign up form", scenario: "User account creation", steps: "1. Tap sign up button\n2. Enter email, password and retype the password then tap proceed button.\n3. Enter personal information such as first name, last name, middle name, suffix, cellphone number, and gender. Tap proceed button.\n4. Enter user address such as region, province, city, barangay, postal code, and street. Then tap the proceed button.\n5. Enter user age; to enter user age, swipe left or right to choose the user's age. Then tap proceed button.\n6. Confirm information, if the user's information is correct tap complete signup button, if no tap back button to edit the wrong user information.", expected: "The system should add the new account to the database.", user: "Fur Parent", status: "PASS", comments: "" },
    { id: "tc-004", datetime: "2026-03-23T09:00", module: "Dashboard", scenario: "Overview of the app functionality", steps: "1. After login, swipe up and down to see the dashboard.", expected: "System should display the events overview, search your Fur Friend, Lost and Found, and the donate buttons.", user: "Fur Parent", status: "PASS", comments: "" },
    { id: "tc-005", datetime: "2026-03-23T09:30", module: "Events", scenario: "Verify events viewer", steps: "1. Tap selected event\n2. Tap close button", expected: "System must display the created event from the sub-admin and admin side.", user: "Admin", status: "PASS", comments: "" },
    { id: "tc-006", datetime: "2026-03-23T10:00", module: "Search your Fur Friend", scenario: "Verify list of pets that are ready to adopt", steps: "1. Tap Fur Friends Button.\n2. Tap pet card\n3. Tap Adopt\n4. Check 'I accept all terms and conditions'\n5. Tap Proceed\n6. Tap Submit\n7. Tap Submit\n8. Tap pet card\n9. Tap 'No, Thanks'", expected: "The system should display the list of pets that are ready for adoption.", user: "Fur Parent", status: "FAIL", comments: "Bugs in the suggested pets with disabilities, navigation issue" },
    { id: "tc-007", datetime: "2026-03-23T10:30", module: "Lost and Found", scenario: "Verify list of pets that are reported missing.", steps: "1. Tap Lost and Found button\n2. Tap selected pet\n3. Tap contact button\n4. Tap mark as found button\n5. Tap \"Yes, Mark as Found\"", expected: "The system should display the list of the missing pets. The system should display the information about the missing pet. The system should mark the pet as found.", user: "Fur Parent", status: "PASS", comments: "" },
    { id: "tc-008", datetime: "2026-03-23T11:00", module: "Donate", scenario: "Verify functionality for donation", steps: "1. Tap donate button", expected: "The system should display an image that contains a QR code for faster and seamless donation.", user: "Fur Parent", status: "PASS", comments: "" },
    { id: "tc-009", datetime: "2026-03-23T11:30", module: "Pending adoption", scenario: "Verify list of pending adoption.", steps: "1. Tap drop down menu\n2. Tap pending\n3. Tap approved\n4. Tap declined\n5. Tap cancel\n6. Tap pet name", expected: "The system should display the list of pets that are currently pending, approved and declined. The system should display the pet's information and the adopter's information.", user: "Sub-Admin (Staff)", status: "PASS", comments: "" },
    { id: "tc-010", datetime: "2026-03-23T13:00", module: "Reports", scenario: "Verify viewing of user-submitted reports", steps: "1. Tap report a pet button\n2. Tap drop down\n3. Tap camera icon\n4. Tap take a photo\n5. Choose from gallery\n6. Take a photo\n7. Upload a photo\n8. Enter pet information\n9. Enter age\n10. Enter personality\n11. Enter contact number\n12. Other details of pet\n13. Health condition\n14. Add location\n15. Add date and time\n16. Tap proceed button\n17. Tap done button\n18. Tap 'My Reports'", expected: "The system should display two buttons (report a pet, and my reports). The system should add the reported pet on the database. The system should display the user submitted reports.", user: "Fur Parent", status: "PASS", comments: "" },
    { id: "tc-011", datetime: "2026-03-23T13:30", module: "Profile screen", scenario: "Verify the profile screen functionality", steps: "1. Tap profile picture\n2. Tap edit button\n3. Tap sign out button", expected: "System should display the personal information of the user including their name, sex, age, phone number, email, and their address. System should return to login screen.", user: "Fur Parent", status: "PASS", comments: "" },
    { id: "tc-012", datetime: "2026-03-23T14:00", module: "AI Page", scenario: "Send plain text, image, and video to the chatbot, and an interactive dog that can give pet tips", steps: "1. Click the dog\n2. Send plain text\n3. Click suggested response\n4. Send image\n5. Send video.\n6. Tap thumbs up icon\n7. Tap thumbs down icon\n8. Tap positive feedback buttons\n9. Submit Feedback\n10. Tap negative feedback\n11. Submit Feedback", expected: "The system should display tips of the interactive dog, send text, image, suggested response and video. The system should have feedback based on the given response.", user: "Fur Parent", status: "PASS", comments: "" },
    { id: "tc-013", datetime: "2026-03-23T14:30", module: "Adoption Page", scenario: "Overview of list of adoption request of pets in Pending, Approved and Declined status", steps: "1. Tap Pending\n2. Tap Cancel\n3. Tap pet card\n4. Tap dropdown and tap Approved\n5. Tap Update\n6. Tap Add Icon\n7. Tap to add image or video\n8. Tap 'Post'\n9. Tap 'Cancel'", expected: "The system should display 'Pending', 'Approved' and 'Declined' pets and should display the information of the pet.", user: "Sub-Admin (Staff)", status: "PASS", comments: "" },
    { id: "tc-014", datetime: "2026-03-23T15:00", module: "Verifications Page", scenario: "Verify the identity of Fur Parent to access adoption", steps: "1. Tap Not Verified card\n2. Tap List of IDs\n3. Upload front ID\n4. Upload back ID\n5. Upload face image", expected: "The system should upload files and transition correctly.", user: "Fur Parent", status: "FAIL", comments: "Message should say; 'Invalid ID' and navigation issue" },
    { id: "tc-015", datetime: "2026-03-23T15:30", module: "Notifications Page", scenario: "Overview of list of notifications", steps: "1. Tap bell icon\n2. Tap Adoption request notification\n3. Tap report notification\n4. Tap donation notification", expected: "The system should display notifications and when if clicked, it should navigate to their destination.", user: "Fur Parent", status: "FAIL", comments: "Message should say: 'Temporary Ban'" },
    { id: "tc-016", datetime: "2026-03-23T16:00", module: "QR Scanner", scenario: "Scan the QR Code to show pet information", steps: "1. Tap QR floating button\n2. Scan Pet QR Code", expected: "The system should display pet information after successfully scanned the QR Code of the pet", user: "Sub-Admin (Staff)", status: "FAIL", comments: "Message should say: 'Failed to scan pet. Pet not found.'" },
    { id: "tc-017", datetime: "2026-03-23T16:30", module: "Shelter Projects", scenario: "Overview of listed posts of the shelter, adoption and others.", steps: "1. Tap Shelter Projects\n2. Tap post", expected: "The system should display posts of the shelter", user: "Fur Parent", status: "PASS", comments: "" },
    { id: "tc-018", datetime: "2026-03-23T17:00", module: "Adoption Journey", scenario: "Overview of listed posts of the fur parent's adoption updates", steps: "1. Tap Adoption Journey\n2. Tap Add button\n3. Tap 'Add Image or Video'\n4. Tap 'Post'", expected: "The system should display fur parent's adoption updates", user: "Fur Parent", status: "PASS", comments: "" }
];

// ─────────────────────────────────────────────
// BugStore — CRUD for test_logs table
// ─────────────────────────────────────────────
class BugStore {
    static async getAll() {
        const db = getSupabase();
        const { data, error } = await db
            .from('test_logs')
            .select('*')
            .order('datetime', { ascending: true });
        if (error) throw new Error(error.message);
        return data.map(dbToApi);
    }

    static async saveAll(logs) {
        const db = getSupabase();
        // Delete all existing rows first
        await db.from('test_logs').delete().neq('test_logs_id', '____dummy____');

        const rows = logs.map(l => ({
            test_logs_id: l.id || generateId(),
            datetime: apiDatetimeToDb(l.datetime),
            module: l.module,
            scenario: l.scenario,
            steps: l.steps,
            expected: l.expected,
            user_role: l.user || 'Fur Parent',
            status: l.status || 'PASS',
            comments: l.comments || ''
        }));

        const { data, error } = await db.from('test_logs').insert(rows).select();
        if (error) throw new Error(error.message);
        return data.map(dbToApi);
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
        return this.saveAll(defaultSeedLogs);
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

export { BugStore, PrintSettingsStore };
