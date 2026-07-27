# APawtMent Bug Management System — System & User Manual

Welcome to the **APawtMent Bug Management System** (QA Test Run Registry). This document provides a complete, step-by-step procedure on how every section, feature, and button works within the application.

---

## Table of Contents
1. [System Overview](#1-system-overview)
2. [Header & Navigation Bar Buttons](#2-header--navigation-bar-buttons)
3. [Dashboard Analytics Panel](#3-dashboard-analytics-panel)
4. [Search & Filtering Toolbar](#4-search--filtering-toolbar)
5. [Data Management & Export/Import](#5-data-management--exportimport)
6. [Main Bug Registry Table](#6-main-bug-registry-table)
7. [Modal Dialogs & Step-by-Step Operating Instructions](#7-modal-dialogs--step-by-step-operating-instructions)
   - [7.1 How to Log In as Admin](#71-how-to-log-in-as-admin)
   - [7.2 How to Add a Single Test Case (Tester / Fur Parent)](#72-how-to-add-a-single-test-case-tester--fur-parent)
   - [7.3 How to Use the Bulk Spreadsheet Grid Editor (Admin Only)](#73-how-to-use-the-bulk-spreadsheet-grid-editor-admin-only)
   - [7.4 How to Configure Print Layout Metadata](#74-how-to-configure-print-layout-metadata)
   - [7.5 How to Print the Official QA Testing Form](#75-how-to-print-the-official-qa-testing-form)
8. [Database Synchronization (Supabase)](#8-database-synchronization-supabase)

---

## 1. System Overview
The **APawtMent Bug Management System** is a real-time web application designed to track Quality Assurance (QA) test cases, bug reports, and user role execution metrics for the APawtMent mobile and web platform.

All test logs and metadata are synchronized directly with a cloud database (**Supabase**), allowing multiple testers, developers, and advisers across different mobile devices and computers to view and update test data seamlessly over standard HTTPS (Port 443).

---

## 2. Header & Navigation Bar Buttons

The top header bar contains key quick-action controls:

### 🔒 Admin Mode Toggle (`btn-admin-toggle`)
* **Location**: Far right of the header logo area (Lock icon).
* **Icon States**:
  * 🔒 *Locked Icon*: Indicates standard user/tester mode.
  * 🔓 *Unlocked Green Icon*: Indicates Admin mode is active.
* **How to Use**:
  1. Click the Lock icon.
  2. In the modal popup, enter the admin password (default: `admin123`).
  3. Click **Verify Credentials**.
  4. Once unlocked, the **Edit Logs Table** button becomes accessible.

### ☀️/🌙 Theme Toggle (`theme-toggle-btn`)
* **Location**: Top header bar (Sun/Moon icon).
* **Function**: Instantly switches between **Dark Mode** (default sleek dark UI) and **Light Mode** (high-contrast light UI). Your preference is saved automatically in browser storage.

### ⚙️ Print Settings Configuration (`btn-open-print-settings`)
* **Location**: Top header bar (Gear icon).
* **Function**: Opens the Capstone QA Testing Form configuration modal to update document title, group name, adviser name, list of student researchers, and signature names before printing.

### 🖨️ Print Testing Form (`btn-trigger-print`)
* **Location**: Top header bar ("Print Testing Form" button).
* **Function**: Generates and formats the test logs into the official UCU Capstone QA Testing Form layout and opens the browser print dialog to save as PDF or print on paper.

### ➕ Add Test Case (`btn-tester-add`)
* **Location**: Top header bar ("Add Test Case" button).
* **Function**: Opens a clean form for Testers and Fur Parents to submit a single new test scenario run.

### 📊 Edit Logs Table (`new-bug-btn`)
* **Location**: Top header bar ("Edit Logs Table" button).
* **Access Requirement**: Requires Admin Mode to be unlocked.
* **Function**: Opens a full-screen, spreadsheet-like grid editor (similar to Microsoft Excel / Google Sheets) where admins can add, modify, or delete multiple test cases simultaneously in row format.

---

## 3. Dashboard Analytics Panel

The analytics section dynamically calculates real-time test execution statistics from Supabase:

1. **Total Logged**: Shows the overall count of registered test scenarios.
2. **Passed Tests**: Displays the total count and percentage of tests marked with status `PASS`.
3. **Failed / Bugs Found**: Displays the count and percentage of tests marked with status `FAIL`.
4. **Success Rate Circular Chart**: Visual SVG progress ring showing the overall pass rate percentage (`Passed / Total * 100%`).

---

## 4. Search & Filtering Toolbar

Located below the analytics panel, the toolbar helps you find specific test cases instantly:

* **Search Bar (`search-input`)**: Type any keyword to instantly filter by Test ID (e.g. `tc-001`), Module name, Scenario, Steps, Expected Result, or Comments.
* **Module Filter (`filter-module`)**: Filter the table by specific application features (e.g. *Login Form*, *Dashboard*, *Reports*, *AI Page*, *QR Scanner*, *Adoption Page*).
* **Status Filter (`filter-status`)**: Filter logs by `All Statuses`, `PASS` (Green), or `FAIL` (Red).
* **User Role Filter (`filter-user`)**: Filter logs by specific user persona (*Admin*, *Sub-Admin (Staff)*, *Sub-Admin (Vet)*, or *Fur Parent*).
* **Sort Order (`sort-order`)**: Toggle between *Newest First* and *Oldest First*.

---

## 5. Data Management & Export/Import

Click the **Data Actions** dropdown menu button (`data-actions-btn`) on the toolbar to access data tools:

1. **Export as CSV**: Downloads the complete test registry as a `.csv` file compatible with Microsoft Excel, Google Sheets, or Apple Numbers.
2. **Export as JSON**: Downloads a structured backup file (`.json`) containing all test logs.
3. **Import JSON**: Allows you to restore or load test logs from a local `.json` backup file.
4. **Reset Store**: Deletes all current test logs and re-seeds the database with the 18 default UCU Capstone QA test cases in Supabase.

---

## 6. Main Bug Registry Table

The central table displays all test logs with real-time interactive actions:

| Column | Description |
|---|---|
| **Test ID** | Unique identifier (e.g. `tc-001`, `tc-002`) |
| **Date & Time** | Date and time when the test run was executed |
| **Module** | Target component or screen in the APawtMent app |
| **Test Scenario** | Specific scenario tested |
| **Test Steps** | Step-by-step instructions executed during test |
| **Expected Result** | Behavior expected from the system |
| **User Role** | Account type used (*Admin*, *Staff*, *Vet*, *Fur Parent*) |
| **Status** | Interactive badge (`PASS` or `FAIL`). **Clicking the badge toggles status instantly in Supabase.** |
| **Comments / Bugs** | Bug descriptions, error messages, or extra notes |
| **Actions** | Contains **Edit** and **Delete** buttons for row-level management |

---

## 7. Modal Dialogs & Step-by-Step Operating Instructions

### 7.1 How to Log In as Admin
1. Click the 🔒 **Lock Icon** in the top header.
2. Enter the admin password: `admin123`.
3. Click **Verify Credentials**.
4. The lock icon will change to a green 🔓 **Unlocked Icon**, enabling the **Edit Logs Table** button.

### 7.2 How to Add a Single Test Case (Tester / Fur Parent)
1. Click the **➕ Add Test Case** button in the header.
2. In the popup table row, enter:
   - **Module/Form**: e.g., `Profile screen`
   - **Test Scenario**: e.g., `Verify user sign out`
   - **Test Steps**: e.g., `1. Tap profile picture\n2. Click sign out`
   - **Expected Result**: e.g., `User is returned to login screen`
   - **User Role**: Select *Fur Parent*, *Admin*, *Sub-Admin (Staff)*, or *Sub-Admin (Vet)*
   - **Status**: Select *PASS* or *FAIL*
   - **Comments**: Enter optional notes or error messages
3. Click **Add Test Case**.
4. The test case is saved immediately to Supabase and added to the table.

### 7.3 How to Use the Bulk Spreadsheet Grid Editor (Admin Only)
1. Ensure Admin Mode is unlocked (see [7.1](#71-how-to-log-in-as-admin)).
2. Click **Edit Logs Table** in the header.
3. A spreadsheet grid will open displaying all test logs.
4. You can:
   - Edit any text cell directly like in Excel.
   - Click **➕ Add New Row** at the bottom to insert a new row.
   - Click **🗑️ Delete** on any row to remove it.
5. Click **Save All Changes** to push all updates to Supabase simultaneously.

### 7.4 How to Configure Print Layout Metadata
1. Click the ⚙️ **Gear Icon** in the header.
2. Fill in the official Capstone document details:
   - **Group Name**: e.g., `Team Harvard`
   - **System Title**: `APawtMent: A Multi-Platform Information System...`
   - **Adviser Name**: `Jeffrey M. Caoile, LPT, DIT`
   - **Researchers**: List student researcher names (one per line)
   - **Form Date**: e.g., `March 23, 2026`
   - **Prepared By (Tester & Programmer)**: Student lead & programmer names
   - **Checked By**: Adviser signature title line
3. Click **Save Config Settings**.

### 7.5 How to Print the Official QA Testing Form
1. Click **🖨️ Print Testing Form** in the header.
2. The application will render the formal university Capstone QA Testing Form layout containing all system metadata, summary statistics, signature sections, and detailed test execution tables.
3. Use the browser print window to **Save as PDF** or send to a connected printer.

---

## 8. Database Synchronization (Supabase)

All data modifications (add, edit, status toggle, delete, bulk save, reset) connect directly to your **Supabase Cloud Database**:
* **Supabase Project**: `muyubeutdcrnjzdaacsh`
* **Transport**: Direct HTTPS (Port 443) via JS Client SDK.
* **Compatibility**: Works across all desktop web browsers, iOS Safari, Android Chrome, and Netlify static hosting without requiring local server execution.
