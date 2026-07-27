/**
 * NovaBug - Bug Management & Test Run Registry
 * Core Javascript Application Logic - Admin/Tester Roles & Auto-Numbering Edition
 */

// --- 18 Seed Test Cases from UCU Capstone 2 PDF ---
const SEED_DATA = [
    {
        id: "tc-001",
        datetime: "2026-03-23T08:00",
        module: "Login Form",
        scenario: "Verify login with valid credentials",
        steps: "1. Enter valid username & password\n2. Click \"Login\"",
        expected: "User should successfully log in and go to dashboard",
        status: "PASS",
        comments: ""
    },
    {
        id: "tc-002",
        datetime: "2026-03-23T08:15",
        module: "Login Form",
        scenario: "Verify login with invalid credentials",
        steps: "1. Enter wrong username/password\n2. Click \"Login\"",
        expected: "System should display error message",
        status: "FAIL",
        comments: "Message should say: \"Invalid Username or Password\""
    },
    {
        id: "tc-003",
        datetime: "2026-03-23T08:30",
        module: "Sign up form",
        scenario: "User account creation",
        steps: "1. Tap sign up button\n2. Enter email, password and retype the password then tap proceed button.\n3. Enter personal information such as first name, last name, middle name, suffix, cellphone number, and gender. Tap proceed button.\n4. Enter user address such as region, province, city, barangay, postal code, and street. Then tap the proceed button.\n5. Enter user age; to enter user age, swipe left or right to choose the user's age. Then tap proceed button.\n6. Confirm information, if the user's information is correct tap complete signup button, if no tap back button to edit the wrong user information.",
        expected: "The system should add the new account to the database.",
        status: "PASS",
        comments: ""
    },
    {
        id: "tc-004",
        datetime: "2026-03-23T09:00",
        module: "Dashboard",
        scenario: "Overview of the app functionality",
        steps: "1. After login, swipe up and down to see the dashboard.",
        expected: "System should display the events overview, search your Fur Friend, Lost and Found, and the donate buttons.",
        status: "PASS",
        comments: ""
    },
    {
        id: "tc-005",
        datetime: "2026-03-23T09:30",
        module: "Events",
        scenario: "Verify events viewer",
        steps: "1. Tap selected event\n2. Tap close button",
        expected: "System must display the created event from the sub-admin and admin side.",
        status: "PASS",
        comments: ""
    },
    {
        id: "tc-006",
        datetime: "2026-03-23T10:00",
        module: "Search your Fur Friend",
        scenario: "Verify list of pets that are ready to adopt",
        steps: "1. Tap Fur Friends Button.\n2. Tap pet card\n3. Tap Adopt\n4. Check 'I accept all terms and conditions'\n5. Tap Proceed\n6. Tap Submit\n7. Tap Submit\n8. Tap pet card\n9. Tap 'No, Thanks'",
        expected: "The system should display the list of pets that are ready for adoption.",
        status: "FAIL",
        comments: "Bugs in the suggested pets with disabilities, navigation issue"
    },
    {
        id: "tc-007",
        datetime: "2026-03-23T10:30",
        module: "Lost and Found",
        scenario: "Verify list of pets that are reported missing.",
        steps: "1. Tap Lost and Found button\n2. Tap selected pet\n3. Tap contact button\n4. Tap mark as found button\n5. Tap \"Yes, Mark as Found\"",
        expected: "The system should display the list of the missing pets. The system should display the information about the missing pet. The system should mark the pet as found.",
        status: "PASS",
        comments: ""
    },
    {
        id: "tc-008",
        datetime: "2026-03-23T11:00",
        module: "Donate",
        scenario: "Verify functionality for donation",
        steps: "1. Tap donate button",
        expected: "The system should display an image that contains a QR code for faster and seamless donation.",
        status: "PASS",
        comments: ""
    },
    {
        id: "tc-009",
        datetime: "2026-03-23T11:30",
        module: "Pending adoption",
        scenario: "Verify list of pending adoption.",
        steps: "1. Tap drop down menu\n2. Tap pending\n3. Tap approved\n4. Tap declined\n5. Tap cancel\n6. Tap pet name",
        expected: "The system should display the list of pets that are currently pending, approved and declined. The system should display the pet's information and the adopter's information.",
        status: "PASS",
        comments: ""
    },
    {
        id: "tc-010",
        datetime: "2026-03-23T13:00",
        module: "Reports",
        scenario: "Verify viewing of user-submitted reports",
        steps: "1. Tap report a pet button\n2. Tap drop down\n3. Tap camera icon\n4. Tap take a photo\n5. Choose from gallery\n6. Take a photo\n7. Upload a photo\n8. Enter pet information\n9. Enter age\n10. Enter personality\n11. Enter contact number\n12. Other details of pet\n13. Health condition\n14. Add location\n15. Add date and time\n16. Tap proceed button\n17. Tap done button\n18. Tap 'My Reports'",
        expected: "The system should display two buttons (report a pet, and my reports). The system should add the reported pet on the database. The system should display the user submitted reports.",
        status: "PASS",
        comments: ""
    },
    {
        id: "tc-011",
        datetime: "2026-03-23T13:30",
        module: "Profile screen",
        scenario: "Verify the profile screen functionality",
        steps: "1. Tap profile picture\n2. Tap edit button\n3. Tap sign out button",
        expected: "System should display the personal information of the user including their name, sex, age, phone number, email, and their address. System should return to login screen.",
        status: "PASS",
        comments: ""
    },
    {
        id: "tc-012",
        datetime: "2026-03-23T14:00",
        module: "AI Page",
        scenario: "Send plain text, image, and video to the chatbot, and an interactive dog that can give pet tips",
        steps: "1. Click the dog\n2. Send plain text\n3. Click suggested response\n4. Send image\n5. Send video.\n6. Tap thumbs up icon\n7. Tap thumbs down icon\n8. Tap positive feedback buttons\n9. Submit Feedback\n10. Tap negative feedback\n11. Submit Feedback",
        expected: "The system should display tips of the interactive dog, send text, image, suggested response and video. The system should have feedback based on the given response.",
        status: "PASS",
        comments: ""
    },
    {
        id: "tc-013",
        datetime: "2026-03-23T14:30",
        module: "Adoption Page",
        scenario: "Overview of list of adoption request of pets in Pending, Approved and Declined status",
        steps: "1. Tap Pending\n2. Tap Cancel\n3. Tap pet card\n4. Tap dropdown and tap Approved\n5. Tap Update\n6. Tap Add Icon\n7. Tap to add image or video\n8. Tap 'Post'\n9. Tap 'Cancel'",
        expected: "The system should display 'Pending', 'Approved' and 'Declined' pets and should display the information of the pet.",
        status: "PASS",
        comments: ""
    },
    {
        id: "tc-014",
        datetime: "2026-03-23T15:00",
        module: "Verifications Page",
        scenario: "Verify the identity of Fur Parent to access adoption",
        steps: "1. Tap Not Verified card\n2. Tap List of IDs\n3. Upload front ID\n4. Upload back ID\n5. Upload face image",
        expected: "The system should upload files and transition correctly.",
        status: "FAIL",
        comments: "Message should say; 'Invalid ID' and navigation issue"
    },
    {
        id: "tc-015",
        datetime: "2026-03-23T15:30",
        module: "Notifications Page",
        scenario: "Overview of list of notifications",
        steps: "1. Tap bell icon\n2. Tap Adoption request notification\n3. Tap report notification\n4. Tap donation notification",
        expected: "The system should display notifications and when if clicked, it should navigate to their destination.",
        status: "FAIL",
        comments: "Message should say: 'Temporary Ban'"
    },
    {
        id: "tc-016",
        datetime: "2026-03-23T16:00",
        module: "QR Scanner",
        scenario: "Scan the QR Code to show pet information",
        steps: "1. Tap QR floating button\n2. Scan Pet QR Code",
        expected: "The system should display pet information after successfully scanned the QR Code of the pet",
        status: "FAIL",
        comments: "Message should say: 'Failed to scan pet. Pet not found.'"
    },
    {
        id: "tc-017",
        datetime: "2026-03-23T16:30",
        module: "Shelter Projects",
        scenario: "Overview of listed posts of the shelter, adoption and others.",
        steps: "1. Tap Shelter Projects\n2. Tap post",
        expected: "The system should display posts of the shelter",
        status: "PASS",
        comments: ""
    },
    {
        id: "tc-018",
        datetime: "2026-03-23T17:00",
        module: "Adoption Journey",
        scenario: "Overview of listed posts of the fur parent's adoption updates",
        steps: "1. Tap Adoption Journey\n2. Tap Add button\n3. Tap 'Add Image or Video'\n4. Tap 'Post'",
        expected: "The system should display fur parent's adoption updates",
        status: "PASS",
        comments: ""
    }
];

// --- Default Capstone UCU Form Metadata ---
const DEFAULT_PRINT_SETTINGS = {
    groupName: "Team Harvard",
    systemTitle: "APawtMent: A Multi-Platform Information System for Adopting Pets of Luca’s Sanctuary and Cawa’s Gang",
    adviserName: "Jeffrey M. Caoile, LPT, DIT",
    researchers: "John Lee T. Agustin\nJeric Jay P. Alcantara\nPhilip James S. Marquez\nJohn Denver C. Petinez\nJacques Esmond B. Fernandez",
    reportDate: "March 23, 2026",
    preparedLeader: "Anthony G. Marquez",
    preparedProgrammer: "Anthony G. Marquez",
    checkedAdviser: "Anthony G. Marquez, LPT, MIT"
};

// --- Local Storage Management Store ---
class BugStore {
    static STORAGE_KEY = 'novabug_test_logs';

    static getAll() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        if (!data) {
            this.saveAll(SEED_DATA);
            return SEED_DATA;
        }
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error("Failed to parse logs, resetting store.", e);
            this.saveAll([]);
            return [];
        }
    }

    static saveAll(logs) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(logs));
    }

    static reset() {
        this.saveAll(SEED_DATA);
        return SEED_DATA;
    }
}

// --- Print Settings Storage ---
class PrintSettingsStore {
    static STORAGE_KEY = 'novabug_print_settings';

    static get() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        if (!data) {
            this.save(DEFAULT_PRINT_SETTINGS);
            return DEFAULT_PRINT_SETTINGS;
        }
        try {
            return JSON.parse(data);
        } catch (e) {
            return DEFAULT_PRINT_SETTINGS;
        }
    }

    static save(settings) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
    }
}

// --- Application UI Controller ---
class App {
    constructor() {
        // Elements Cache
        this.bugListContainer = document.getElementById('bug-list-container');
        this.dashboardTableWrapper = document.getElementById('dashboard-table-wrapper');
        this.dashboardTableBody = document.getElementById('dashboard-table-body');
        this.emptyState = document.getElementById('empty-state');
        
        // Modal & Form elements (Editable Grid Modal for Admin)
        this.bugModal = document.getElementById('bug-modal');
        this.bugForm = document.getElementById('bug-form');
        this.modalTableBody = document.getElementById('modal-table-body');
        this.btnModalAddRow = document.getElementById('btn-modal-add-row');
        this.modalCloseBtn = document.getElementById('modal-close-btn');
        this.modalCancelBtn = document.getElementById('modal-cancel-btn');
        
        // Header Controls
        this.newBugBtn = document.getElementById('new-bug-btn');
        this.emptyStateBtn = document.getElementById('empty-state-btn');
        this.themeToggleBtn = document.getElementById('theme-toggle-btn');
        
        // Tester-Only Single Add Modal Controls
        this.btnTesterAdd = document.getElementById('btn-tester-add');
        this.testerAddModal = document.getElementById('tester-add-modal');
        this.testerAddForm = document.getElementById('tester-add-form');
        this.testerModule = document.getElementById('tester-module');
        this.testerScenario = document.getElementById('tester-scenario');
        this.testerSteps = document.getElementById('tester-steps');
        this.testerExpected = document.getElementById('tester-expected');
        this.testerStatus = document.getElementById('tester-status');
        this.testerComments = document.getElementById('tester-comments');
        this.testerAddCloseBtn = document.getElementById('tester-add-close-btn');
        this.testerAddCancelBtn = document.getElementById('tester-add-cancel-btn');

        // Admin Access Controls
        this.btnAdminToggle = document.getElementById('btn-admin-toggle');
        this.adminLoginModal = document.getElementById('admin-login-modal');
        this.adminLoginForm = document.getElementById('admin-login-form');
        this.adminPasswordInput = document.getElementById('admin-password');
        this.adminLoginCloseBtn = document.getElementById('admin-login-close-btn');
        this.adminLoginCancelBtn = document.getElementById('admin-login-cancel-btn');
        this.lockIconLocked = document.getElementById('lock-icon-locked');
        this.lockIconUnlocked = document.getElementById('lock-icon-unlocked');

        // Filters & Toolbar
        this.searchInput = document.getElementById('search-input');
        this.filterModule = document.getElementById('filter-module');
        this.filterStatus = document.getElementById('filter-status');
        this.sortOrder = document.getElementById('sort-order');
        
        // Dashboard Stats
        this.statTotal = document.getElementById('stat-total');
        this.statPass = document.getElementById('stat-pass');
        this.statPassPct = document.getElementById('stat-pass-pct');
        this.statFail = document.getElementById('stat-fail');
        this.statFailPct = document.getElementById('stat-fail-pct');
        this.statChartStroke = document.getElementById('stat-chart-stroke');
        this.statChartPct = document.getElementById('stat-chart-pct');

        // Dropdown Actions menu
        this.dataActionsBtn = document.getElementById('data-actions-btn');
        this.dataDropdownMenu = document.getElementById('data-dropdown-menu');
        this.btnExportCSV = document.getElementById('btn-export-csv');
        this.btnExportJSON = document.getElementById('btn-export-json');
        this.importJsonFile = document.getElementById('import-json-file');
        this.btnResetData = document.getElementById('btn-reset-data');

        // Print Config Elements
        this.printSettingsModal = document.getElementById('print-settings-modal');
        this.printSettingsForm = document.getElementById('print-settings-form');
        this.btnOpenPrintSettings = document.getElementById('btn-open-print-settings');
        this.btnTriggerPrint = document.getElementById('btn-trigger-print');
        this.printSettingsCloseBtn = document.getElementById('print-settings-close-btn');
        this.printSettingsCancelBtn = document.getElementById('print-settings-cancel-btn');

        // Application State variables
        this.logs = [];
        this.expandedCellIds = new Set();
        this.printSettings = {};
        this.filteredLogsForPrint = [];
        this.isAdmin = false;
        
        this.init();
    }

    init() {
        this.logs = BugStore.getAll();
        this.printSettings = PrintSettingsStore.get();
        
        // Retrieve persistent admin login status
        this.isAdmin = sessionStorage.getItem('novabug_admin') === 'true';

        this.initTheme();
        this.bindEvents();
        this.syncAdminUI();
        this.updateModuleFilters();
        this.render();
    }

    initTheme() {
        const savedTheme = localStorage.getItem('novabug_theme') || 'dark';
        if (savedTheme === 'light') {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
        } else {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
        }
    }

    toggleTheme() {
        if (document.body.classList.contains('dark-theme')) {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            localStorage.setItem('novabug_theme', 'light');
            this.showToast("Theme switched to Light Mode", "info");
        } else {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            localStorage.setItem('novabug_theme', 'dark');
            this.showToast("Theme switched to Dark Mode", "info");
        }
    }

    syncAdminUI() {
        if (this.isAdmin) {
            this.btnAdminToggle.classList.add('admin-active');
            this.lockIconLocked.classList.add('hidden');
            this.lockIconUnlocked.classList.remove('hidden');
            this.newBugBtn.classList.remove('hidden');
            
            // Hide the tester-only single add case button for admin
            this.btnTesterAdd.classList.add('hidden');
            
            this.emptyStateBtn.textContent = "Open Table Editor";
            
            // Show administrative buttons inside the drop menu
            this.btnResetData.classList.remove('hidden');
            const fileLabel = this.importJsonFile.closest('.file-label');
            if (fileLabel) fileLabel.classList.remove('hidden');
        } else {
            this.btnAdminToggle.classList.remove('admin-active');
            this.lockIconLocked.classList.remove('hidden');
            this.lockIconUnlocked.classList.add('hidden');
            this.newBugBtn.classList.add('hidden');
            
            // Show the tester-only single add case button for tester
            this.btnTesterAdd.classList.remove('hidden');
            
            this.emptyStateBtn.textContent = "Add Test Case";
            
            // Hide administrative buttons from viewers
            this.btnResetData.classList.add('hidden');
            const fileLabel = this.importJsonFile.closest('.file-label');
            if (fileLabel) fileLabel.classList.add('hidden');
        }
    }

    // --- Steps List Auto Numbering Engine ---
    setupAutoNumbering(textarea) {
        if (!textarea) return;

        textarea.addEventListener('focus', () => {
            if (!textarea.value.trim()) {
                textarea.value = '1. ';
                setTimeout(() => {
                    textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
                }, 0);
            }
        });

        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const value = textarea.value;

                // Find current line text
                const beforeText = value.substring(0, start);
                const afterText = value.substring(end);
                const lines = beforeText.split('\n');
                const currentLine = lines[lines.length - 1];

                // Match step prefix, e.g. "1. " or "  3. "
                const match = currentLine.match(/^(\s*)(\d+)\.\s*(.*)$/);

                if (match) {
                    e.preventDefault();
                    const indent = match[1];
                    const num = parseInt(match[2], 10);
                    const content = match[3].trim();

                    if (content === '') {
                        // User pressed Enter on empty step (e.g. "3. ") -> clear it
                        lines.pop();
                        const restoredText = lines.join('\n') + (lines.length > 0 ? '\n' : '');
                        textarea.value = restoredText + afterText;
                        textarea.selectionStart = textarea.selectionEnd = restoredText.length;
                    } else {
                        // Append next sequential number
                        const nextNum = num + 1;
                        const insertion = `\n${indent}${nextNum}. `;
                        textarea.value = beforeText + insertion + afterText;
                        const newCursorPos = start + insertion.length;
                        textarea.selectionStart = textarea.selectionEnd = newCursorPos;
                    }

                    // Force trigger input change event for real-time saving
                    textarea.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }
        });
    }

    bindEvents() {
        // Admin Access Toggle Click
        this.btnAdminToggle.addEventListener('click', () => {
            if (this.isAdmin) {
                this.isAdmin = false;
                sessionStorage.setItem('novabug_admin', 'false');
                this.syncAdminUI();
                this.render();
                this.showToast("Logged out of Admin Mode", "info");
            } else {
                this.adminPasswordInput.value = '';
                this.adminLoginModal.classList.remove('hidden');
                this.adminPasswordInput.focus();
            }
        });

        // Admin login form controls
        this.adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const password = this.adminPasswordInput.value;
            if (password === 'admin123') {
                this.isAdmin = true;
                sessionStorage.setItem('novabug_admin', 'true');
                this.adminLoginModal.classList.add('hidden');
                this.syncAdminUI();
                this.render();
                this.showToast("Access granted. Admin mode active.", "success");
            } else {
                this.showToast("Invalid admin credentials", "error");
            }
        });

        this.adminLoginCloseBtn.addEventListener('click', () => {
            this.adminLoginModal.classList.add('hidden');
        });
        this.adminLoginCancelBtn.addEventListener('click', () => {
            this.adminLoginModal.classList.add('hidden');
        });
        this.adminLoginModal.addEventListener('click', (e) => {
            if (e.target === this.adminLoginModal) this.adminLoginModal.classList.add('hidden');
        });

        // Tester Single Add Modal Controls
        this.btnTesterAdd.addEventListener('click', () => {
            this.testerAddForm.reset();
            this.testerStatus.className = 'grid-select status-pass';
            
            // Remove error glow borders
            const row = this.testerAddModal.querySelector('.modal-row');
            if (row) {
                row.style.outline = 'none';
                row.style.backgroundColor = 'transparent';
            }

            this.testerAddModal.classList.remove('hidden');
            this.testerModule.focus();
        });

        this.testerStatus.addEventListener('change', (e) => {
            if (e.target.value === 'FAIL') {
                e.target.className = 'grid-select status-fail';
            } else {
                e.target.className = 'grid-select status-pass';
            }
        });

        this.testerAddCloseBtn.addEventListener('click', () => {
            this.testerAddModal.classList.add('hidden');
        });
        this.testerAddCancelBtn.addEventListener('click', () => {
            this.testerAddModal.classList.add('hidden');
        });
        this.testerAddModal.addEventListener('click', (e) => {
            if (e.target === this.testerAddModal) this.testerAddModal.classList.add('hidden');
        });

        this.testerAddForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleTesterAddSubmit();
        });

        // Setup Auto numbering for single Tester add text area
        this.setupAutoNumbering(this.testerSteps);

        // Modal opening triggers
        this.newBugBtn.addEventListener('click', () => this.openModal());
        this.emptyStateBtn.addEventListener('click', () => {
            if (this.isAdmin) {
                this.openModal();
            } else {
                // Open the single add modal for testers
                this.testerAddForm.reset();
                this.testerStatus.className = 'grid-select status-pass';
                
                const row = this.testerAddModal.querySelector('.modal-row');
                if (row) {
                    row.style.outline = 'none';
                    row.style.backgroundColor = 'transparent';
                }

                this.testerAddModal.classList.remove('hidden');
                this.testerModule.focus();
            }
        });
        
        // Modal closures
        this.modalCloseBtn.addEventListener('click', () => this.closeModal());
        this.modalCancelBtn.addEventListener('click', () => this.closeModal());
        this.bugModal.addEventListener('click', (e) => {
            if (e.target === this.bugModal) this.closeModal();
        });
        
        // Add row in modal
        this.btnModalAddRow.addEventListener('click', () => {
            this.addNewRowToModalTable();
            this.syncSpreadsheetToStore();
        });

        // Save button just closes the modal, since everything syncs in real-time!
        this.bugForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Theme Switch
        this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());

        // Filtering options
        this.searchInput.addEventListener('input', () => this.render());
        this.filterModule.addEventListener('change', () => this.render());
        this.filterStatus.addEventListener('change', () => this.render());
        this.sortOrder.addEventListener('change', () => this.render());

        // Data actions dropdown toggle
        this.dataActionsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.dataDropdownMenu.classList.toggle('hidden');
        });
        document.addEventListener('click', () => {
            this.dataDropdownMenu.classList.add('hidden');
        });

        // Data actions triggers
        this.btnExportCSV.addEventListener('click', () => this.exportCSV());
        this.btnExportJSON.addEventListener('click', () => this.exportJSON());
        this.importJsonFile.addEventListener('change', (e) => this.importJSON(e));
        this.btnResetData.addEventListener('click', () => this.resetDataStore());

        // UCU Print settings & actions
        this.btnOpenPrintSettings.addEventListener('click', () => this.openPrintSettingsModal());
        this.printSettingsCloseBtn.addEventListener('click', () => this.closePrintSettingsModal());
        this.printSettingsCancelBtn.addEventListener('click', () => this.closePrintSettingsModal());
        this.printSettingsModal.addEventListener('click', (e) => {
            if (e.target === this.printSettingsModal) this.closePrintSettingsModal();
        });
        
        // Save buttons for print settings just close the modal (since print settings sync in real-time)
        this.printSettingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePrintSettingsSubmit();
        });
        
        // Bind input listeners to print settings fields for real-time saving
        const printInputs = this.printSettingsForm.querySelectorAll('input, textarea');
        printInputs.forEach(inputEl => {
            inputEl.addEventListener('input', () => this.syncPrintSettingsToStore());
        });

        this.btnTriggerPrint.addEventListener('click', () => this.triggerPrintQAForm());
    }

    getLocalDateString() {
        const tzOffset = (new Date()).getTimezoneOffset() * 60000;
        return (new Date(Date.now() - tzOffset)).toISOString().slice(0, 16);
    }

    // --- Modal Table Sheet Render Engine ---
    openModal() {
        if (!this.isAdmin) {
            this.showToast("Permission denied. Admin rights required.", "error");
            return;
        }

        this.modalTableBody.innerHTML = '';
        
        if (this.logs.length === 0) {
            this.addNewRowToModalTable();
        } else {
            this.logs.forEach((log, index) => {
                this.addNewRowToModalTable(log, index);
            });
        }

        this.bugModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.bugModal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    addNewRowToModalTable(log = {}, index = null) {
        const rowIndex = index !== null ? index : this.modalTableBody.children.length;
        const tcId = `TC-${String(rowIndex + 1).padStart(3, '0')}`;
        const tr = document.createElement('tr');
        tr.className = 'modal-row';
        tr.setAttribute('data-id', log.id || '');

        const statusVal = log.status || 'PASS';
        const statusClass = statusVal === 'FAIL' ? 'status-fail' : 'status-pass';

        tr.innerHTML = `
            <td class="tc-id-cell">${tcId}</td>
            <td><input type="text" class="grid-input row-module" value="${escapeHTML(log.module || '')}" placeholder="e.g. Auth, Payments" required></td>
            <td><input type="text" class="grid-input row-scenario" value="${escapeHTML(log.scenario || '')}" placeholder="Verify login behaves..." required></td>
            <td><textarea class="grid-textarea row-steps" placeholder="1. Go to page..." required>${escapeHTML(log.steps || '')}</textarea></td>
            <td><textarea class="grid-textarea row-expected" placeholder="Dashboard page loads..." required>${escapeHTML(log.expected || '')}</textarea></td>
            <td>
                <select class="grid-select row-status ${statusClass}">
                    <option value="PASS" ${statusVal === 'PASS' ? 'selected' : ''}>PASS</option>
                    <option value="FAIL" ${statusVal === 'FAIL' ? 'selected' : ''}>FAIL</option>
                </select>
            </td>
            <td><textarea class="grid-textarea row-comments" placeholder="Optional notes...">${escapeHTML(log.comments || '')}</textarea></td>
            <td>
                <button type="button" class="btn-row-delete" title="Delete Row">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </button>
            </td>
        `;

        // Change select class color dynamically and trigger save on status change
        const selectEl = tr.querySelector('.row-status');
        selectEl.addEventListener('change', (e) => {
            if (e.target.value === 'FAIL') {
                e.target.className = 'grid-select row-status status-fail';
            } else {
                e.target.className = 'grid-select row-status status-pass';
            }
            this.syncSpreadsheetToStore();
        });

        // Bind auto numbering to Steps textarea in editable spreadsheet row
        const stepsTextarea = tr.querySelector('.row-steps');
        this.setupAutoNumbering(stepsTextarea);

        // Trigger real-time save on cell inputs and textareas
        const inputs = tr.querySelectorAll('input, textarea');
        inputs.forEach(inputEl => {
            inputEl.addEventListener('input', () => this.syncSpreadsheetToStore());
        });

        // Hook up row delete action with real-time save
        tr.querySelector('.btn-row-delete').addEventListener('click', () => {
            tr.remove();
            this.recalculateModalRowNumbers();
            this.syncSpreadsheetToStore();
        });

        this.modalTableBody.appendChild(tr);
    }

    recalculateModalRowNumbers() {
        const rows = this.modalTableBody.querySelectorAll('.modal-row');
        rows.forEach((row, idx) => {
            row.querySelector('.tc-id-cell').textContent = `TC-${String(idx + 1).padStart(3, '0')}`;
        });
    }

    // --- Real-time Spreadsheet Synchronization ---
    syncSpreadsheetToStore() {
        const rows = this.modalTableBody.querySelectorAll('.modal-row');
        const updatedLogs = [];

        rows.forEach((row, idx) => {
            let id = row.getAttribute('data-id');
            const module = row.querySelector('.row-module').value.trim();
            const scenario = row.querySelector('.row-scenario').value.trim();
            const steps = row.querySelector('.row-steps').value.trim();
            const expected = row.querySelector('.row-expected').value.trim();
            const status = row.querySelector('.row-status').value;
            const comments = row.querySelector('.row-comments').value.trim();

            const isRowEmpty = !module && !scenario && !steps && !expected && !comments;

            if (!isRowEmpty) {
                // If it's a new row without an ID, generate a new one now
                if (!id) {
                    id = 'tc-' + Date.now() + '-' + idx + '-' + Math.floor(Math.random() * 100);
                    row.setAttribute('data-id', id);
                }

                // Preserve original datetime creation timestamp
                const existingLog = this.logs.find(item => item.id === id);
                const datetime = existingLog ? existingLog.datetime : this.getLocalDateString();

                updatedLogs.push({
                    id,
                    datetime,
                    module,
                    scenario,
                    steps,
                    expected,
                    status,
                    comments
                });
            }
        });

        // Save dynamically to storage and updates state
        BugStore.saveAll(updatedLogs);
        this.logs = updatedLogs;

        // Re-draw background filters & tables dynamically
        this.updateModuleFilters();
        this.render();
    }

    // --- Close Sheet Validation ---
    handleFormSubmit() {
        // Run validations when the user clicks 'Save All Logs'
        const rows = this.modalTableBody.querySelectorAll('.modal-row');
        let hasValidationError = false;

        rows.forEach((row) => {
            const module = row.querySelector('.row-module').value.trim();
            const scenario = row.querySelector('.row-scenario').value.trim();
            const steps = row.querySelector('.row-steps').value.trim();
            const expected = row.querySelector('.row-expected').value.trim();
            const comments = row.querySelector('.row-comments').value.trim();

            const isRowEmpty = !module && !scenario && !steps && !expected && !comments;

            if (!isRowEmpty) {
                if (!module || !scenario || !steps || !expected) {
                    hasValidationError = true;
                    row.style.outline = '1.5px solid var(--fail-color)';
                    row.style.backgroundColor = 'var(--fail-glow)';
                } else {
                    row.style.outline = 'none';
                    row.style.backgroundColor = 'transparent';
                }
            }
        });

        if (hasValidationError) {
            this.showToast("All fields (except comments) are required for active test rows.", "error");
            return;
        }

        // Data is already saved in real-time, so we simply close the modal
        this.showToast("All test logs synchronized!", "success");
        this.closeModal();
    }

    // --- Print Settings Real-time Sync ---
    syncPrintSettingsToStore() {
        this.printSettings = {
            groupName: document.getElementById('setup-group-name').value.trim(),
            systemTitle: document.getElementById('setup-system-title').value.trim(),
            adviserName: document.getElementById('setup-adviser-name').value.trim(),
            researchers: document.getElementById('setup-researchers').value.trim(),
            reportDate: document.getElementById('setup-report-date').value.trim(),
            preparedLeader: document.getElementById('setup-prepared-leader').value.trim(),
            preparedProgrammer: document.getElementById('setup-prepared-programmer').value.trim(),
            checkedAdviser: document.getElementById('setup-checked-adviser').value.trim()
        };

        PrintSettingsStore.save(this.printSettings);
    }

    openPrintSettingsModal() {
        document.getElementById('setup-group-name').value = this.printSettings.groupName;
        document.getElementById('setup-system-title').value = this.printSettings.systemTitle;
        document.getElementById('setup-adviser-name').value = this.printSettings.adviserName;
        document.getElementById('setup-researchers').value = this.printSettings.researchers;
        document.getElementById('setup-report-date').value = this.printSettings.reportDate;
        document.getElementById('setup-prepared-leader').value = this.printSettings.preparedLeader;
        document.getElementById('setup-prepared-programmer').value = this.printSettings.preparedProgrammer;
        document.getElementById('setup-checked-adviser').value = this.printSettings.checkedAdviser;

        this.printSettingsModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closePrintSettingsModal() {
        this.printSettingsModal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    handlePrintSettingsSubmit() {
        // Save final variables and close modal
        this.syncPrintSettingsToStore();
        this.showToast("Report print settings updated successfully!", "success");
        this.closePrintSettingsModal();
    }

    // --- Tester Add Form Handler ---
    handleTesterAddSubmit() {
        const module = this.testerModule.value.trim();
        const scenario = this.testerScenario.value.trim();
        const steps = this.testerSteps.value.trim();
        const expected = this.testerExpected.value.trim();
        const status = this.testerStatus.value;
        const comments = this.testerComments.value.trim();

        const row = this.testerAddModal.querySelector('.modal-row');

        if (!module || !scenario || !steps || !expected) {
            this.showToast("All fields (except comments) are required.", "error");
            if (row) {
                row.style.outline = '1.5px solid var(--fail-color)';
                row.style.backgroundColor = 'var(--fail-glow)';
            }
            return;
        }

        if (row) {
            row.style.outline = 'none';
            row.style.backgroundColor = 'transparent';
        }

        const newLog = {
            id: 'tc-' + Date.now(),
            datetime: this.getLocalDateString(),
            module,
            scenario,
            steps,
            expected,
            status,
            comments
        };

        const logs = BugStore.getAll();
        logs.push(newLog);
        BugStore.saveAll(logs);
        
        this.logs = logs;
        this.updateModuleFilters();
        this.render();

        this.testerAddModal.classList.add('hidden');
        this.showToast(`Test Case added successfully!`, "success");
    }

    updateModuleFilters() {
        const allModules = Array.from(new Set(this.logs.map(log => log.module).filter(Boolean)));
        const prevFilterVal = this.filterModule.value;
        this.filterModule.innerHTML = '<option value="all">All Modules</option>';
        allModules.forEach(mod => {
            const opt = document.createElement('option');
            opt.value = mod;
            opt.textContent = mod;
            this.filterModule.appendChild(opt);
        });
        
        if (allModules.includes(prevFilterVal)) {
            this.filterModule.value = prevFilterVal;
        }

        const datalist = document.getElementById('modules-list');
        if (datalist) {
            datalist.innerHTML = '';
            allModules.forEach(mod => {
                const opt = document.createElement('option');
                opt.value = mod;
                datalist.appendChild(opt);
            });
        }
    }

    // --- UCU QA Testing Form PDF Printing Engine ---
    syncPrintLayoutDOM() {
        let printLayout = document.getElementById('print-layout-container');
        if (!printLayout) {
            printLayout = document.createElement('div');
            printLayout.id = 'print-layout-container';
            printLayout.className = 'print-only-layout';
            document.body.appendChild(printLayout);
        }

        const researchersLines = this.printSettings.researchers
            .split('\n')
            .filter(line => line.trim() !== '')
            .map((name, idx) => `${idx + 1}. ${name}`)
            .join('<br>');

        let bugRowsHTML = '';
        this.filteredLogsForPrint.forEach((log, index) => {
            const tcId = `TC-${String(index + 1).padStart(3, '0')}`;
            const statusDisplay = log.status === 'PASS' ? 
                '<div class="status-print-cell"><span class="box-checked">&#9745;</span> Pass</div>' : 
                '<div class="status-print-cell"><span class="box-failed">&#9746;</span> Fail</div>';

            bugRowsHTML += `
                <tr>
                    <td class="col-id">${tcId}</td>
                    <td class="col-mod">${escapeHTML(log.module)}</td>
                    <td class="col-scen">${escapeHTML(log.scenario)}</td>
                    <td class="col-steps">${escapeHTML(log.steps).replace(/\n/g, '<br>')}</td>
                    <td class="col-exp">${escapeHTML(log.expected).replace(/\n/g, '<br>')}</td>
                    <td class="col-status">${statusDisplay}</td>
                    <td class="col-comments">${log.comments ? escapeHTML(log.comments).replace(/\n/g, '<br>') : ''}</td>
                </tr>
            `;
        });

        printLayout.innerHTML = `
            <div class="print-page-wrapper">
                <!-- University Banner Header -->
                <header class="print-form-header">
                    <div class="print-logo-left">
                        <svg class="print-svg-logo" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#d97706" stroke-width="4"/>
                            <circle cx="50" cy="50" r="38" fill="none" stroke="#1d4ed8" stroke-width="2"/>
                            <polygon points="50,20 25,45 25,75 50,85 75,75 75,45" fill="#1e3a8a" opacity="0.3"/>
                            <path d="M50,15 L50,85" stroke="#d97706" stroke-width="2" stroke-dasharray="2 2"/>
                            <path d="M30,50 Q50,70 70,50" fill="none" stroke="#d97706" stroke-width="3" stroke-linecap="round"/>
                            <circle cx="50" cy="42" r="8" fill="#d97706"/>
                        </svg>
                        <div class="print-logo-text-left">
                            <div class="txt-main-uni">URDANETA CITY</div>
                            <div class="txt-sub-uni">Owned and operated by the City Government of Urdaneta</div>
                            <div class="txt-main-uni">UNIVERSITY</div>
                        </div>
                    </div>
                    <div class="print-logo-right">
                        <div class="print-logo-text-right">
                            <div class="txt-college">College of</div>
                            <div class="txt-college-sub">Information and</div>
                            <div class="txt-college-sub">Technology</div>
                            <div class="txt-college-sub">Education</div>
                        </div>
                        <svg class="print-svg-logo" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="32" fill="#1e3a8a"/>
                            <circle cx="50" cy="50" r="22" fill="#ffffff"/>
                            <path d="M50,10 L50,20 M50,80 L50,90 M10,50 L20,50 M80,50 L90,50 M22,22 L29,29 M71,71 L78,78 M22,78 L29,71 M71,22 L78,29" stroke="#1e3a8a" stroke-width="8" stroke-linecap="round"/>
                            <rect x="42" y="42" width="16" height="16" rx="2" fill="#1e3a8a"/>
                        </svg>
                    </div>
                </header>
                
                <!-- Main Header Title -->
                <div class="print-title-banner">
                    Capstone 2 -QA Testing Form
                </div>

                <!-- Capstone Meta details table -->
                <table class="print-meta-table">
                    <tr>
                        <td class="meta-label">Group Name:</td>
                        <td class="meta-val">${escapeHTML(this.printSettings.groupName)}</td>
                    </tr>
                    <tr>
                        <td class="meta-label">System Title:</td>
                        <td class="meta-val">${escapeHTML(this.printSettings.systemTitle)}</td>
                    </tr>
                    <tr>
                        <td class="meta-label">Adviser Name:</td>
                        <td class="meta-val">${escapeHTML(this.printSettings.adviserName)}</td>
                    </tr>
                    <tr>
                        <td class="meta-label">Researchers:</td>
                        <td class="meta-val researchers-list">${researchersLines}</td>
                    </tr>
                    <tr>
                        <td class="meta-label">Date:</td>
                        <td class="meta-val">${escapeHTML(this.printSettings.reportDate)}</td>
                    </tr>
                </table>

                <!-- Main Test Results Data Table -->
                <table class="print-data-table">
                    <thead>
                        <tr>
                            <th class="col-id">Test ID</th>
                            <th class="col-mod">Module/Form</th>
                            <th class="col-scen">Test Scenario</th>
                            <th class="col-steps">Test Steps</th>
                            <th class="col-exp">Expected Result</th>
                            <th class="col-status">Status<br>(PASS/FAIL)</th>
                            <th class="col-comments">Comments / Bugs Found</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${bugRowsHTML}
                    </tbody>
                </table>

                <!-- Signatures Panel -->
                <div class="print-signatures-area">
                    <div class="signature-block">
                        <div class="signature-title">Prepared by:</div>
                        <div class="signature-line-name">${escapeHTML(this.printSettings.preparedLeader)}</div>
                        <div class="signature-line-desc">Tester</div>
                        <div class="signature-date">Date: ______________</div>
                        
                        <div class="signature-line-name" style="margin-top: 1.5rem;">${escapeHTML(this.printSettings.preparedProgrammer)}</div>
                        <div class="signature-line-desc">Programmer</div>
                        <div class="signature-date">Date: ______________</div>
                    </div>
                    <div class="signature-block">
                        <div class="signature-title">Checked by:</div>
                        <div class="signature-line-name">${escapeHTML(this.printSettings.checkedAdviser)}</div>
                        <div class="signature-line-desc">Adviser</div>
                        <div class="signature-date">Date: ______________</div>
                    </div>
                </div>

                <!-- Footer contact elements -->
                <footer class="print-form-footer">
                    <div class="footer-motto">Bright future starts here</div>
                    <div class="footer-contact">
                        (075) 600 - 1507<br>
                        San Vicente West, Urdaneta City, Pangasinan<br>
                        ucu.edu.ph | univpresidentofficial@gmail.com
                    </div>
                </footer>
            </div>
        `;
    }

    triggerPrintQAForm() {
        if (this.filteredLogsForPrint.length === 0) {
            this.showToast("No test logs matched the filters. Cannot print empty form.", "error");
            return;
        }
        
        this.syncPrintLayoutDOM();
        setTimeout(() => {
            window.print();
        }, 150);
    }

    updateLogStatus(logId, newStatus) {
        if (!this.isAdmin) {
            this.showToast("Admin privilege required to update test status.", "error");
            return;
        }

        const logs = BugStore.getAll();
        const updated = logs.map(item => {
            if (item.id === logId) {
                return { ...item, status: newStatus };
            }
            return item;
        });

        BugStore.saveAll(updated);
        this.logs = updated;
        this.render();
        this.showToast(`Test status successfully updated to ${newStatus}`, "success");
    }

    deleteBug(id) {
        if (!this.isAdmin) {
            this.showToast("Permission denied. Admin rights required to delete log.", "error");
            return;
        }

        if (confirm("Are you sure you want to delete this test log entry?")) {
            const logs = BugStore.getAll();
            const filtered = logs.filter(item => item.id !== id);
            BugStore.saveAll(filtered);
            
            this.logs = filtered;
            this.updateModuleFilters();
            this.render();
            
            this.showToast("Test case log deleted", "info");
        }
    }

    // --- Standard File IO Actions ---

    exportCSV() {
        if (this.logs.length === 0) {
            this.showToast("No log data to export", "error");
            return;
        }

        const headers = ["Date & Time Created", "Section / Module", "Test Scenario", "Test Steps", "Expected Result", "Status", "Comments"];
        
        const escapeCSV = (val) => {
            if (val === null || val === undefined) return '';
            let stringVal = String(val).replace(/"/g, '""');
            if (stringVal.search(/("|,|\n)/g) >= 0) {
                stringVal = `"${stringVal}"`;
            }
            return stringVal;
        };

        const rows = this.logs.map(log => [
            log.datetime,
            log.module,
            log.scenario,
            log.steps,
            log.expected,
            log.status,
            log.comments || ""
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + [headers.join(','), ...rows.map(r => r.map(escapeCSV).join(','))].join('\n');
            
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `novabug_export_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.showToast("CSV file exported successfully", "success");
    }

    exportJSON() {
        if (this.logs.length === 0) {
            this.showToast("No log data to export", "error");
            return;
        }

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.logs, null, 2));
        const link = document.createElement("a");
        link.setAttribute("href", dataStr);
        link.setAttribute("download", `novabug_export_${Date.now()}.json`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.showToast("JSON file exported successfully", "success");
    }

    importJSON(event) {
        if (!this.isAdmin) {
            this.showToast("Admin permissions required to import data files.", "error");
            return;
        }

        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                if (!Array.isArray(imported)) {
                    throw new Error("Data should be an array of logs");
                }

                const isValidSchema = imported.every(item => 
                    item.module && item.scenario && item.steps && item.expected && item.status
                );

                if (!isValidSchema) {
                    throw new Error("Invalid structure. Items must contain module, scenario, steps, expected, status.");
                }

                const confirmAppend = confirm(`Loaded ${imported.length} items. Do you want to merge these with your existing store? (Cancel to replace instead)`);
                
                if (confirmAppend) {
                    const existing = BugStore.getAll();
                    imported.forEach(item => {
                        item.id = 'tc-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
                        if (!item.datetime) item.datetime = this.getLocalDateString();
                        existing.push(item);
                    });
                    BugStore.saveAll(existing);
                } else {
                    const confirmReplace = confirm("Are you sure you want to replace ALL local data with the imported file?");
                    if (!confirmReplace) return;
                    imported.forEach((item, idx) => {
                        if (!item.id) item.id = 'tc-' + Date.now() + '-' + idx;
                        if (!item.datetime) item.datetime = this.getLocalDateString();
                    });
                    BugStore.saveAll(imported);
                }

                this.showToast("JSON data imported successfully!", "success");
                this.logs = BugStore.getAll();
                this.updateModuleFilters();
                this.render();
            } catch (err) {
                console.error(err);
                this.showToast(`Import failed: ${err.message}`, "error");
            }
        };
        reader.readAsText(file);
        event.target.value = "";
    }

    resetDataStore() {
        if (!this.isAdmin) {
            this.showToast("Admin credentials required to reset datastore.", "error");
            return;
        }

        if (confirm("Resetting will revert local data back to the default seed logs. Proceed?")) {
            this.logs = BugStore.reset();
            this.updateModuleFilters();
            this.expandedCellIds.clear();
            this.render();
            this.showToast("Data store reset successfully", "info");
        }
    }

    // --- Dynamic Text Highlight Helper ---
    highlightText(text, searchVal) {
        if (!searchVal.trim()) return text;
        const escapedQuery = searchVal.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`(${escapedQuery})`, 'gi');
        return text.replace(regex, '<mark class="highlight">$1</mark>');
    }

    // --- Toast Alerts System ---
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = '';
        if (type === 'success') {
            icon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        } else if (type === 'error') {
            icon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
        } else {
            icon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
        }

        toast.innerHTML = `${icon}<span>${message}</span>`;
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }

    // --- Dashboard Cell Expansion Click Handler ---
    toggleCellExpand(cellId) {
        if (this.expandedCellIds.has(cellId)) {
            this.expandedCellIds.delete(cellId);
        } else {
            this.expandedCellIds.add(cellId);
        }
    }

    // --- Render Screen Grid View ---
    render() {
        const total = this.logs.length;
        const passCount = this.logs.filter(log => log.status === 'PASS').length;
        const failCount = total - passCount;
        const successRate = total > 0 ? Math.round((passCount / total) * 100) : 0;

        this.statTotal.textContent = total;
        this.statPass.textContent = passCount;
        this.statFail.textContent = failCount;

        if (total > 0) {
            this.statPassPct.textContent = `${Math.round((passCount / total) * 100)}% of total runs`;
            this.statFailPct.textContent = `${Math.round((failCount / total) * 100)}% of total runs`;
        } else {
            this.statPassPct.textContent = "0% of total runs";
            this.statFailPct.textContent = "0% of total runs";
        }

        this.statChartStroke.setAttribute('stroke-dasharray', `${successRate}, 100`);
        this.statChartPct.textContent = `${successRate}%`;

        if (successRate >= 80) {
            this.statChartStroke.setAttribute('stroke', 'var(--pass-color)');
            this.statChartStroke.style.filter = 'drop-shadow(0 0 4px var(--pass-glow))';
        } else if (successRate >= 50) {
            this.statChartStroke.setAttribute('stroke', 'var(--warning-color)');
            this.statChartStroke.style.filter = 'drop-shadow(0 0 4px var(--warning-glow))';
        } else {
            this.statChartStroke.setAttribute('stroke', 'var(--fail-color)');
            this.statChartStroke.style.filter = 'drop-shadow(0 0 4px var(--fail-glow))';
        }

        const searchQuery = this.searchInput.value.toLowerCase().trim();
        const selectedMod = this.filterModule.value;
        const selectedStat = this.filterStatus.value;
        const sortBy = this.sortOrder.value;

        // Apply filters with defensive string casting
        this.filteredLogsForPrint = this.logs.filter(log => {
            const moduleText = String(log.module || '').toLowerCase();
            const scenarioText = String(log.scenario || '').toLowerCase();
            const stepsText = String(log.steps || '').toLowerCase();
            const expectedText = String(log.expected || '').toLowerCase();
            const commentsText = String(log.comments || '').toLowerCase();

            const matchesSearch = !searchQuery || 
                moduleText.includes(searchQuery) ||
                scenarioText.includes(searchQuery) ||
                stepsText.includes(searchQuery) ||
                expectedText.includes(searchQuery) ||
                commentsText.includes(searchQuery);

            const matchesModule = selectedMod === 'all' || log.module === selectedMod;
            const matchesStatus = selectedStat === 'all' || log.status === selectedStat;

            return matchesSearch && matchesModule && matchesStatus;
        });

        // Apply sort
        this.filteredLogsForPrint.sort((a, b) => {
            const timeA = new Date(a.datetime).getTime();
            const timeB = new Date(b.datetime).getTime();
            return sortBy === 'newest' ? timeB - timeA : timeA - timeB;
        });

        // Hide/Show dynamic actions column header
        const thActions = this.dashboardTableWrapper.querySelector('thead th:last-child');
        if (thActions) {
            if (this.isAdmin) {
                thActions.classList.remove('hidden');
            } else {
                thActions.classList.add('hidden');
            }
        }

        // Draw / empty state
        if (this.filteredLogsForPrint.length === 0) {
            this.dashboardTableWrapper.classList.add('hidden');
            
            if (this.logs.length === 0) {
                this.emptyState.querySelector('h2').textContent = "No Test Logs Found";
                this.emptyState.querySelector('p').textContent = this.isAdmin ? 
                    "Start recording your test cycles by clicking 'Edit Logs Table' in the top bar." :
                    "Start logging test cases by clicking 'Add Test Case' in the top bar.";
            } else {
                this.emptyState.querySelector('h2').textContent = "No Matches Found";
                this.emptyState.querySelector('p').textContent = "Try refining your search text or removing filters to locate the logs.";
            }
            this.emptyState.classList.remove('hidden');
        } else {
            this.emptyState.classList.add('hidden');
            this.dashboardTableWrapper.classList.remove('hidden');

            this.dashboardTableBody.innerHTML = '';
            
            this.filteredLogsForPrint.forEach((log, index) => {
                const tcDisplayId = `TC-${String(index + 1).padStart(3, '0')}`;
                
                const tr = document.createElement('tr');
                tr.className = log.status === 'FAIL' ? 'dashboard-row-fail' : '';

                const stepsCellId = `steps-${log.id}`;
                const expectedCellId = `exp-${log.id}`;
                const commentsCellId = `comm-${log.id}`;

                const stepsExpanded = this.expandedCellIds.has(stepsCellId);
                const expectedExpanded = this.expandedCellIds.has(expectedCellId);
                const commentsExpanded = this.expandedCellIds.has(commentsCellId);

                // Build status cell: dropdown for admin, badge for user
                let statusCellHTML = '';
                if (this.isAdmin) {
                    const selectClass = log.status === 'FAIL' ? 'status-fail' : 'status-pass';
                    statusCellHTML = `
                        <select class="dashboard-status-select ${selectClass}" data-id="${log.id}">
                            <option value="PASS" ${log.status === 'PASS' ? 'selected' : ''}>PASS</option>
                            <option value="FAIL" ${log.status === 'FAIL' ? 'selected' : ''}>FAIL</option>
                        </select>
                    `;
                } else {
                    statusCellHTML = `
                        <span class="status-badge ${log.status === 'PASS' ? 'pass' : 'fail'}">
                            ${log.status === 'PASS' ? 'PASS' : 'FAIL'}
                        </span>
                    `;
                }

                // Actions cell (only for Admins)
                const actionsCellHTML = this.isAdmin ? `
                    <td style="text-align: right; vertical-align: middle; white-space: nowrap;">
                        <button class="btn btn-secondary btn-sm btn-edit-row" data-id="${log.id}" title="Edit this log" style="padding: 0.35rem 0.6rem; font-size: 0.75rem; border-color: var(--border-color); cursor: pointer;">
                            Edit
                        </button>
                        <button class="btn btn-secondary btn-sm danger btn-delete-row" data-id="${log.id}" title="Delete this log" style="padding: 0.35rem 0.6rem; font-size: 0.75rem; border-color: var(--border-color); cursor: pointer; margin-left: 4px;">
                            Delete
                        </button>
                    </td>
                ` : '';

                tr.innerHTML = `
                    <td class="font-mono" style="font-weight:700; text-align:center;">${tcDisplayId}</td>
                    <td class="col-module">${this.highlightText(log.module || '', searchQuery)}</td>
                    <td style="font-weight:500;">${this.highlightText(log.scenario || '', searchQuery)}</td>
                    <td>
                        <div class="cell-expandable ${stepsExpanded ? 'expanded' : ''}" data-cell-id="${stepsCellId}">
                            ${this.highlightText(log.steps || '', searchQuery)}
                        </div>
                    </td>
                    <td>
                        <div class="cell-expandable ${expectedExpanded ? 'expanded' : ''}" data-cell-id="${expectedCellId}">
                            ${this.highlightText(log.expected || '', searchQuery)}
                        </div>
                    </td>
                    <td style="text-align:center; vertical-align:middle;">
                        ${statusCellHTML}
                    </td>
                    <td>
                        <div class="cell-expandable ${commentsExpanded ? 'expanded' : ''}" data-cell-id="${commentsCellId}">
                            ${log.comments ? this.highlightText(log.comments, searchQuery) : ''}
                        </div>
                    </td>
                    ${actionsCellHTML}
                `;

                // Expand/collapse text inside cell wrapper on click
                tr.querySelectorAll('.cell-expandable').forEach(cellEl => {
                    cellEl.addEventListener('click', (e) => {
                        const cellId = cellEl.getAttribute('data-cell-id');
                        this.toggleCellExpand(cellId);
                        cellEl.classList.toggle('expanded');
                    });
                });

                // Attach inline status updater event listener and click bindings in Admin mode
                if (this.isAdmin) {
                    const statusSelectEl = tr.querySelector('.dashboard-status-select');
                    statusSelectEl.addEventListener('change', (e) => {
                        const logId = e.target.getAttribute('data-id');
                        const newStatus = e.target.value;
                        this.updateLogStatus(logId, newStatus);
                    });

                    // Row action edit click handler
                    tr.querySelector('.btn-edit-row').addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.openModal();
                        // Scroll to the specific row in the modal
                        setTimeout(() => {
                            const modalRowEl = this.modalTableBody.querySelector(`[data-id="${log.id}"]`);
                            if (modalRowEl) {
                                modalRowEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                modalRowEl.style.outline = '2px solid var(--primary-color)';
                                setTimeout(() => {
                                    modalRowEl.style.transition = 'outline 0.5s';
                                    modalRowEl.style.outline = 'none';
                                }, 1500);
                            }
                        }, 200);
                    });

                    // Row action delete click handler
                    tr.querySelector('.btn-delete-row').addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.deleteBug(log.id);
                    });

                    // Double click opens the modal table and highlights that specific row (Admin only)
                    tr.addEventListener('dblclick', () => {
                        this.openModal();
                        setTimeout(() => {
                            const modalRowEl = this.modalTableBody.querySelector(`[data-id="${log.id}"]`);
                            if (modalRowEl) {
                                modalRowEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                modalRowEl.style.outline = '2px solid var(--primary-color)';
                                setTimeout(() => {
                                    modalRowEl.style.transition = 'outline 0.5s';
                                    modalRowEl.style.outline = 'none';
                                }, 1500);
                            }
                        }, 200);
                    });
                }

                this.dashboardTableBody.appendChild(tr);
            });
        }
    }
}

// --- HTML Escape Helper ---
function escapeHTML(str) {
    if (!str) return '';
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Instantiate application on window mount
window.addEventListener('DOMContentLoaded', () => {
    window.novabugApp = new App();
});
