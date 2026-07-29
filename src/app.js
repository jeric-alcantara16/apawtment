import { BugStore, PrintSettingsStore, subscribeToBugStore, subscribeToPrintSettings } from './supastore.js';

/**
 * NovaBug - Bug Management & Test Run Registry
 * Core Javascript Application Logic - Branding, Rebranding, Roles & User Fields Edition
 */

// --- 18 Seed Test Cases from UCU Capstone 2 PDF with User Roles ---


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
        this.testerUser = document.getElementById('tester-user');
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

        // System Manual Controls
        this.btnOpenManual = document.getElementById('btn-open-manual');
        this.manualModal = document.getElementById('manual-modal');
        this.manualCloseBtn = document.getElementById('manual-close-btn');
        this.manualOkBtn = document.getElementById('manual-ok-btn');
        this.lockIconLocked = document.getElementById('lock-icon-locked');
        this.lockIconUnlocked = document.getElementById('lock-icon-unlocked');

        // Filters & Toolbar
        this.searchInput = document.getElementById('search-input');
        this.filterModule = document.getElementById('filter-module');
        this.filterStatus = document.getElementById('filter-status');
        this.filterUser = document.getElementById('filter-user');
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

    async init() {
        try {
            this.logs = await BugStore.getAll();
            this.printSettings = await PrintSettingsStore.get();
        } catch (err) {
            // Silently fall back to empty state — no error shown to user
            console.warn('Database unavailable, running with empty data:', err.message);
            if (!this.logs) this.logs = [];
            if (!this.printSettings) this.printSettings = null;
        }

        // Retrieve persistent admin login status
        this.isAdmin = sessionStorage.getItem('apawtment_admin') === 'true' || sessionStorage.getItem('novabug_admin') === 'true';

        this.initTheme();
        this.bindEvents();
        this.syncAdminUI();
        this.updateModuleFilters();
        this.render();

        // Initialize Realtime WebSockets Listener
        this.initRealtimeSubscriptions();
    }

    initRealtimeSubscriptions() {
        // 1. Supabase WebSockets push subscription
        subscribeToBugStore(async () => {
            await this.refreshDataFromStore(false);
        });

        subscribeToPrintSettings(async () => {
            try {
                const freshSettings = await PrintSettingsStore.get();
                if (freshSettings) this.printSettings = freshSettings;
            } catch (err) {
                console.warn('Failed to refresh print settings on realtime update:', err);
            }
        });

        // 2. Start high-frequency fallback polling (every 2.5s) to guarantee real-time updates
        this.startRealtimePolling();
    }

    startRealtimePolling() {
        if (this._pollInterval) clearInterval(this._pollInterval);
        this._pollInterval = setInterval(() => {
            if (document.visibilityState === 'visible') {
                this.refreshDataFromStore(false);
            }
        }, 2500);
    }

    async refreshDataFromStore(showToast = false) {
        try {
            const freshLogs = await BugStore.getAll();
            const freshSettings = await PrintSettingsStore.get();

            const logsChanged = JSON.stringify(freshLogs) !== JSON.stringify(this.logs);
            const settingsChanged = JSON.stringify(freshSettings) !== JSON.stringify(this.printSettings);

            if (logsChanged || settingsChanged) {
                if (logsChanged) this.logs = freshLogs;
                if (settingsChanged && freshSettings) this.printSettings = freshSettings;

                this.updateModuleFilters();

                // Avoid re-rendering open modal if admin user is actively typing in an input
                const isModalOpen = this.bugModal && !this.bugModal.classList.contains('hidden');
                const isUserTypingInModal = isModalOpen && this.bugModal.contains(document.activeElement);

                if (!isUserTypingInModal) {
                    this.render();
                }

                if (showToast) {
                    this.showToast("Data synchronized in real time", "info");
                }
            }
        } catch (err) {
            console.warn('Realtime refresh error:', err);
        }
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
        // Auto-sync real-time data when visiting site, returning to tab, window focus, or network reconnect
        window.addEventListener('focus', () => this.refreshDataFromStore());
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.refreshDataFromStore();
            }
        });
        window.addEventListener('online', () => this.refreshDataFromStore(true));

        // Admin Access Toggle Click
        this.btnAdminToggle.addEventListener('click', async () => {
            if (this.isAdmin) {
                this.isAdmin = false;
                sessionStorage.setItem('apawtment_admin', 'false');
                sessionStorage.removeItem('novabug_admin');
                this.syncAdminUI();
                await this.refreshDataFromStore();
                this.showToast("Logged out of Admin Mode", "info");
            } else {
                this.adminPasswordInput.value = '';
                this.adminLoginModal.classList.remove('hidden');
                this.adminPasswordInput.focus();
            }
        });

        // Admin login form controls
        this.adminLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const password = this.adminPasswordInput.value;
            if (password === 'admin123') {
                this.isAdmin = true;
                sessionStorage.setItem('apawtment_admin', 'true');
                this.adminLoginModal.classList.add('hidden');
                this.syncAdminUI();
                await this.refreshDataFromStore();
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

        // System Manual Modal Controls
        if (this.btnOpenManual) {
            this.btnOpenManual.addEventListener('click', () => {
                this.manualModal.classList.remove('hidden');
            });
        }
        if (this.manualCloseBtn) {
            this.manualCloseBtn.addEventListener('click', () => {
                this.manualModal.classList.add('hidden');
            });
        }
        if (this.manualOkBtn) {
            this.manualOkBtn.addEventListener('click', () => {
                this.manualModal.classList.add('hidden');
            });
        }
        if (this.manualModal) {
            this.manualModal.addEventListener('click', (e) => {
                if (e.target === this.manualModal) this.manualModal.classList.add('hidden');
            });
        }

        // Tester-Only Single Add Modal Controls
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
        this.filterUser.addEventListener('change', () => this.render());
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
        const phOffset = 8 * 60 * 60 * 1000; // GMT+8 offset in milliseconds
        return new Date(Date.now() + phOffset).toISOString().slice(0, 16);
    }

    // --- Modal Table Sheet Render Engine ---
    async openModal() {
        if (!this.isAdmin) {
            this.showToast("Permission denied. Admin rights required.", "error");
            return;
        }

        try {
            this.logs = await BugStore.getAll();
        } catch (err) {
            console.warn("Could not fetch latest logs before opening modal:", err);
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
        const userVal = log.user || 'Fur Parent';

        tr.innerHTML = `
            <td class="tc-id-cell">${tcId}</td>
            <td class="row-datetime-cell" data-val="${log.datetime || this.getLocalDateString()}" style="font-size: 0.8rem; text-align: center; color: var(--text-secondary); white-space: nowrap; padding: 0.4rem 0.6rem;">${escapeHTML(formatDateTime(log.datetime || this.getLocalDateString()))}</td>
            <td><input type="text" class="grid-input row-module" value="${escapeHTML(log.module || '')}" placeholder="e.g. Auth, Payments" required></td>
            <td><input type="text" class="grid-input row-scenario" value="${escapeHTML(log.scenario || '')}" placeholder="Verify login behaves..." required></td>
            <td><textarea class="grid-textarea row-steps" placeholder="1. Go to page..." required>${escapeHTML(log.steps || '')}</textarea></td>
            <td><textarea class="grid-textarea row-expected" placeholder="Dashboard page loads..." required>${escapeHTML(log.expected || '')}</textarea></td>
            <td>
                <select class="grid-select row-user">
                    <option value="Admin" ${userVal === 'Admin' ? 'selected' : ''}>Admin</option>
                    <option value="Sub-Admin (Staff)" ${userVal === 'Sub-Admin (Staff)' ? 'selected' : ''}>Sub-Admin (Staff)</option>
                    <option value="Sub-Admin (Vet)" ${userVal === 'Sub-Admin (Vet)' ? 'selected' : ''}>Sub-Admin (Vet)</option>
                    <option value="Fur Parent" ${userVal === 'Fur Parent' ? 'selected' : ''}>Fur Parent</option>
                </select>
            </td>
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

        // Trigger real-time save on user role select change
        const userSelectEl = tr.querySelector('.row-user');
        userSelectEl.addEventListener('change', () => this.syncSpreadsheetToStore());

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
    async syncSpreadsheetToStore() {
        const rows = this.modalTableBody.querySelectorAll('.modal-row');
        const updatedLogs = [];

        rows.forEach((row, idx) => {
            let id = row.getAttribute('data-id');
            const module = row.querySelector('.row-module').value.trim();
            const scenario = row.querySelector('.row-scenario').value.trim();
            const steps = row.querySelector('.row-steps').value.trim();
            const expected = row.querySelector('.row-expected').value.trim();
            const user = row.querySelector('.row-user').value;
            const status = row.querySelector('.row-status').value;
            const comments = row.querySelector('.row-comments').value.trim();

            const isRowEmpty = !module && !scenario && !steps && !expected && !comments;

            if (!isRowEmpty) {
                // If it's a new row without an ID, generate a new one now
                if (!id) {
                    id = 'tc-' + Date.now() + '-' + idx + '-' + Math.floor(Math.random() * 100);
                    row.setAttribute('data-id', id);
                }

                const datetime = row.querySelector('.row-datetime-cell').getAttribute('data-val');

                updatedLogs.push({
                    id,
                    datetime,
                    module,
                    scenario,
                    steps,
                    expected,
                    user,
                    status,
                    comments
                });
            }
        });

        try {
            // Save dynamically to storage and updates state
            await BugStore.saveAll(updatedLogs);
            this.logs = updatedLogs;

            // Re-draw background filters & tables dynamically
            this.updateModuleFilters();
            this.render();
        } catch (err) {
            console.error("Failed to sync spreadsheet to MySQL:", err);
            this.showToast("Database synchronization failed", "error");
        }
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
    async syncPrintSettingsToStore() {
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

        try {
            await PrintSettingsStore.save(this.printSettings);
        } catch (err) {
            console.error("Failed to save print settings to MySQL:", err);
        }
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

    async handlePrintSettingsSubmit() {
        // Save final variables and close modal
        await this.syncPrintSettingsToStore();
        this.showToast("Report print settings updated successfully!", "success");
        this.closePrintSettingsModal();
    }

    async handleTesterAddSubmit() {
        const datetime = this.getLocalDateString(); // Auto GMT+8 time
        const module = this.testerModule.value.trim();
        const scenario = this.testerScenario.value.trim();
        const steps = this.testerSteps.value.trim();
        const expected = this.testerExpected.value.trim();
        const user = this.testerUser.value;
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
            datetime,
            module,
            scenario,
            steps,
            expected,
            user,
            status,
            comments
        };

        try {
            await BugStore.add(newLog);
            this.logs = await BugStore.getAll();
            this.updateModuleFilters();
            this.render();

            this.testerAddModal.classList.add('hidden');
            this.showToast(`Test Case added successfully!`, "success");
        } catch (err) {
            console.error("Failed to add test log to MySQL:", err);
            this.showToast("Failed to save test case to database", "error");
        }
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
                    <td class="col-datetime" style="white-space: nowrap;">${escapeHTML(formatDateTime(log.datetime))}</td>
                    <td class="col-mod">${escapeHTML(log.module)}</td>
                    <td class="col-scen">${escapeHTML(log.scenario)}</td>
                    <td class="col-steps">${this.formatMultilinePrint(log.steps)}</td>
                    <td class="col-exp">${this.formatMultilinePrint(log.expected)}</td>
                    <td class="col-user">${escapeHTML(log.user || 'Fur Parent')}</td>
                    <td class="col-status">${statusDisplay}</td>
                    <td class="col-comments">${log.comments ? this.formatMultilinePrint(log.comments) : ''}</td>
                </tr>
            `;
        });

        printLayout.innerHTML = `
            <div class="print-page-wrapper">
                <!-- University Banner Header -->
                <header class="print-form-header">
                    <div class="print-logo-left">
                        <img src="assets/ucu_logo.png" class="print-img-logo" alt="Urdaneta City University Logo">
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
                        <img src="assets/cite_logo.jpg" class="print-img-logo" alt="CITE Logo">
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
                            <th class="col-datetime">Date & Time</th>
                            <th class="col-mod">Module/Form</th>
                            <th class="col-scen">Test Scenario</th>
                            <th class="col-steps">Test Steps</th>
                            <th class="col-exp">Expected Result</th>
                            <th class="col-user">User Role</th>
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

    async updateLogStatus(logId, newStatus) {
        try {
            await BugStore.updateStatus(logId, newStatus);
            this.logs = await BugStore.getAll();
            this.render();
            this.showToast(`Test status successfully updated to ${newStatus}`, "success");
        } catch (err) {
            console.error("Failed to update status in MySQL:", err);
            this.showToast("Failed to update status on server", "error");
        }
    }

    async deleteBug(id) {
        if (!this.isAdmin) {
            this.showToast("Permission denied. Admin rights required to delete log.", "error");
            return;
        }

        if (confirm("Are you sure you want to delete this test log entry?")) {
            try {
                await BugStore.delete(id);
                this.logs = await BugStore.getAll();
                this.updateModuleFilters();
                this.render();

                this.showToast("Test case log deleted", "info");
            } catch (err) {
                console.error("Failed to delete log in MySQL:", err);
                this.showToast("Failed to delete log from server", "error");
            }
        }
    }

    // --- Standard File IO Actions ---

    exportCSV() {
        if (this.logs.length === 0) {
            this.showToast("No log data to export", "error");
            return;
        }

        const headers = ["Date & Time Created", "Section / Module", "Test Scenario", "Test Steps", "Expected Result", "User Role", "Status", "Comments"];

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
            log.user || "Fur Parent",
            log.status,
            log.comments || ""
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + [headers.join(','), ...rows.map(r => r.map(escapeCSV).join(','))].join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `apawtment_export_${Date.now()}.csv`);
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
        link.setAttribute("download", `apawtment_export_${Date.now()}.json`);
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
        reader.onload = async (e) => {
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
                    const existing = await BugStore.getAll();
                    imported.forEach(item => {
                        item.id = 'tc-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
                        if (!item.datetime) item.datetime = this.getLocalDateString();
                        if (!item.user) item.user = 'Fur Parent';
                        existing.push(item);
                    });
                    await BugStore.saveAll(existing);
                } else {
                    const confirmReplace = confirm("Are you sure you want to replace ALL local data with the imported file?");
                    if (!confirmReplace) return;
                    imported.forEach((item, idx) => {
                        if (!item.id) item.id = 'tc-' + Date.now() + '-' + idx;
                        if (!item.datetime) item.datetime = this.getLocalDateString();
                        if (!item.user) item.user = 'Fur Parent';
                    });
                    await BugStore.saveAll(imported);
                }

                this.showToast("JSON data imported successfully!", "success");
                this.logs = await BugStore.getAll();
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

    async resetDataStore() {
        if (!this.isAdmin) {
            this.showToast("Admin credentials required to reset datastore.", "error");
            return;
        }

        if (confirm("Resetting will revert local data back to the default seed logs. Proceed?")) {
            try {
                this.logs = await BugStore.reset();
                this.updateModuleFilters();
                this.expandedCellIds.clear();
                this.render();
                this.showToast("Data store reset successfully", "info");
            } catch (err) {
                console.error("Failed to reset datastore in MySQL:", err);
                this.showToast("Failed to reset datastore", "error");
            }
        }
    }

    // --- Dynamic Text Highlight Helper ---
    highlightText(text, searchVal) {
        if (!searchVal.trim()) return text;
        const escapedQuery = searchVal.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`(${escapedQuery})`, 'gi');
        return text.replace(regex, '<mark class="highlight">$1</mark>');
    }

    // --- Numbered / Multi-line Text Formatter (Dashboard cells) ---
    // Renders each "\n"-separated line as its own row. If a line starts
    // with a number marker ("1.", "2)", etc.) the marker is pinned to a
    // fixed-width column and the text sits in a flexible column next to
    // it, so wrapped continuation text hangs indented under the text
    // instead of snapping back to the left edge under the number.
    formatMultilineHTML(text, searchVal) {
        if (!text) return '';
        const lines = text.split('\n');
        return lines.map(line => {
            const match = line.match(/^(\s*)(\d+[.)])\s*(.*)$/);
            if (match) {
                const marker = match[2];
                const content = match[3];
                return `<div class="line-row"><span class="line-marker">${marker}</span><span class="line-text">${this.highlightText(content, searchVal)}</span></div>`;
            }
            if (line.trim() === '') return '';
            return `<div class="line-row"><span class="line-text">${this.highlightText(line, searchVal)}</span></div>`;
        }).join('');
    }

    // --- Numbered / Multi-line Text Formatter (Print form cells) ---
    formatMultilinePrint(text) {
        if (!text) return '';
        const lines = escapeHTML(text).split('\n');
        return lines.map(line => {
            const match = line.match(/^(\s*)(\d+[.)])\s*(.*)$/);
            if (match) {
                const marker = match[2];
                const content = match[3];
                return `<div class="print-line-row"><span class="print-line-marker">${marker}</span><span class="print-line-text">${content}</span></div>`;
            }
            if (line.trim() === '') return '';
            return `<div class="print-line-row"><span class="print-line-text">${line}</span></div>`;
        }).join('');
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
        const selectedUser = this.filterUser.value;
        const sortBy = this.sortOrder.value;

        // Apply filters with defensive string casting
        this.filteredLogsForPrint = this.logs.filter(log => {
            const moduleText = String(log.module || '').toLowerCase();
            const scenarioText = String(log.scenario || '').toLowerCase();
            const stepsText = String(log.steps || '').toLowerCase();
            const expectedText = String(log.expected || '').toLowerCase();
            const userText = String(log.user || 'Fur Parent').toLowerCase();
            const commentsText = String(log.comments || '').toLowerCase();

            const matchesSearch = !searchQuery ||
                moduleText.includes(searchQuery) ||
                scenarioText.includes(searchQuery) ||
                stepsText.includes(searchQuery) ||
                expectedText.includes(searchQuery) ||
                userText.includes(searchQuery) ||
                commentsText.includes(searchQuery);

            const matchesModule = selectedMod === 'all' || log.module === selectedMod;
            const matchesStatus = selectedStat === 'all' || log.status === selectedStat;
            const matchesUser = selectedUser === 'all' || (log.user || 'Fur Parent') === selectedUser;

            return matchesSearch && matchesModule && matchesStatus && matchesUser;
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

                // Build status cell: dropdown for all users (Admin & Tester)
                const selectClass = log.status === 'FAIL' ? 'status-fail' : 'status-pass';
                const statusCellHTML = `
                    <select class="dashboard-status-select ${selectClass}" data-id="${log.id}">
                        <option value="PASS" ${log.status === 'PASS' ? 'selected' : ''}>PASS</option>
                        <option value="FAIL" ${log.status === 'FAIL' ? 'selected' : ''}>FAIL</option>
                    </select>
                `;

                // Actions cell (only for Admins)
                const actionsCellHTML = this.isAdmin ? `
                    <td data-label="Actions" style="text-align: right; vertical-align: middle; white-space: nowrap;">
                        <button class="btn btn-secondary btn-sm btn-edit-row" data-id="${log.id}" title="Edit this log" style="padding: 0.35rem 0.6rem; font-size: 0.75rem; border-color: var(--border-color); cursor: pointer;">
                            Edit
                        </button>
                        <button class="btn btn-secondary btn-sm danger btn-delete-row" data-id="${log.id}" title="Delete this log" style="padding: 0.35rem 0.6rem; font-size: 0.75rem; border-color: var(--border-color); cursor: pointer; margin-left: 4px;">
                            Delete
                        </button>
                    </td>
                ` : '';

                tr.innerHTML = `
                    <td data-label="Test ID" class="font-mono" style="font-weight:700; text-align:center;">${tcDisplayId}</td>
                    <td data-label="Date & Time" style="font-size: 0.8rem; color: var(--text-secondary); text-align:center; white-space: nowrap;">${escapeHTML(formatDateTime(log.datetime))}</td>
                    <td data-label="Module" class="col-module">${this.highlightText(log.module || '', searchQuery)}</td>
                    <td data-label="Test Scenario" style="font-weight:500;">${this.highlightText(log.scenario || '', searchQuery)}</td>
                    <td data-label="Test Steps">
                        <div class="cell-expandable ${stepsExpanded ? 'expanded' : ''}" data-cell-id="${stepsCellId}">
                            ${this.formatMultilineHTML(log.steps || '', searchQuery)}
                        </div>
                    </td>
                    <td data-label="Expected Result">
                        <div class="cell-expandable ${expectedExpanded ? 'expanded' : ''}" data-cell-id="${expectedCellId}">
                            ${this.formatMultilineHTML(log.expected || '', searchQuery)}
                        </div>
                    </td>
                    <td data-label="User Role" style="font-weight:600; font-size: 0.85rem; color: var(--text-secondary);">${escapeHTML(log.user || 'Fur Parent')}</td>
                    <td data-label="Status" style="text-align:center; vertical-align:middle;">
                        ${statusCellHTML}
                    </td>
                    <td data-label="Comments / Bugs Found">
                        <div class="cell-expandable ${commentsExpanded ? 'expanded' : ''}" data-cell-id="${commentsCellId}">
                            ${log.comments ? this.formatMultilineHTML(log.comments, searchQuery) : ''}
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

                // Attach inline status updater event listener for all users (Admin & Tester)
                const statusSelectEl = tr.querySelector('.dashboard-status-select');
                statusSelectEl.addEventListener('change', (e) => {
                    const logId = e.target.getAttribute('data-id');
                    const newStatus = e.target.value;
                    this.updateLogStatus(logId, newStatus);
                });

                // Attach click bindings in Admin mode
                if (this.isAdmin) {

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

// --- Date & Time Formatter Helper (AM / PM format) ---
function formatDateTime(isoStr) {
    if (!isoStr) return '';
    try {
        const parts = isoStr.split('T');
        if (parts.length < 2) return isoStr;
        const datePart = parts[0];
        const timePart = parts[1];

        const timeParts = timePart.split(':');
        let hours = parseInt(timeParts[0], 10);
        const minutes = timeParts[1];

        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // convert 0 to 12

        const hoursStr = String(hours).padStart(2, '0');
        return `${datePart} ${hoursStr}:${minutes} ${ampm}`;
    } catch (e) {
        return isoStr;
    }
}

// Instantiate application on window mount
window.addEventListener('DOMContentLoaded', () => {
    window.novabugApp = new App();
});