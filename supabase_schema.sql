-- Supabase Database Schema for APawtMent Bug Management System

-- 1. Create test_logs table
CREATE TABLE IF NOT EXISTS public.test_logs (
    test_logs_id VARCHAR(64) PRIMARY KEY,
    datetime TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    module VARCHAR(255) NOT NULL,
    scenario TEXT NOT NULL,
    steps TEXT NOT NULL,
    expected TEXT NOT NULL,
    user_role VARCHAR(64) DEFAULT 'Fur Parent',
    tester_name VARCHAR(255) DEFAULT '',
    status VARCHAR(20) DEFAULT 'PASS',
    comments TEXT DEFAULT ''
);

-- Alter existing test_logs table if column doesn't exist yet
ALTER TABLE public.test_logs ADD COLUMN IF NOT EXISTS tester_name VARCHAR(255) DEFAULT '';


-- 2. Create print_settings table
CREATE TABLE IF NOT EXISTS public.print_settings (
    print_settings_id INT PRIMARY KEY DEFAULT 1,
    group_name TEXT,
    system_title TEXT,
    adviser_name TEXT,
    researchers TEXT,
    report_date TEXT,
    prepared_leader TEXT,
    prepared_programmer TEXT,
    checked_adviser TEXT
);

-- 3. Enable Row Level Security (RLS) and allow public read/write access
ALTER TABLE public.test_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.print_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read/write for test_logs" 
ON public.test_logs FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read/write for print_settings" 
ON public.print_settings FOR ALL USING (true) WITH CHECK (true);

-- 4. Seed default print settings
INSERT INTO public.print_settings
    (print_settings_id, group_name, system_title, adviser_name, researchers, report_date, prepared_leader, prepared_programmer, checked_adviser)
VALUES
    (1, 'Team Harvard',
     'APawtMent: A Multi-Platform Information System for Adopting Pets of Luca''s Sanctuary and Cawa''s Gang',
     'Jeffrey M. Caoile, LPT, DIT',
     'John Lee T. Agustin\nJeric Jay P. Alcantara\nPhilip James S. Marquez\nJohn Denver C. Petinez\nJacques Esmond B. Fernandez',
     'March 23, 2026', 'John Denver C. Petinez', 'Jeric Jay P. Alcantara', 'Jeffrey M. Caoile, LPT, DIT')
ON CONFLICT (print_settings_id) DO NOTHING;

-- 5. Seed default 18 test cases
INSERT INTO public.test_logs
    (test_logs_id, datetime, module, scenario, steps, expected, user_role, status, comments)
VALUES
    ('tc-001', '2026-03-23 08:00:00+00', 'Login Form', 'Verify login with valid credentials', '1. Enter valid username & password\n2. Click "Login"', 'User should successfully log in and go to dashboard', 'Admin', 'PASS', ''),
    ('tc-002', '2026-03-23 08:15:00+00', 'Login Form', 'Verify login with invalid credentials', '1. Enter wrong username/password\n2. Click "Login"', 'System should display error message', 'Fur Parent', 'FAIL', 'Message should say: "Invalid Username or Password"'),
    ('tc-003', '2026-03-23 08:30:00+00', 'Sign up form', 'User account creation', '1. Tap sign up button\n2. Enter email, password and retype the password then tap proceed button.\n3. Enter personal information such as first name, last name, middle name, suffix, cellphone number, and gender. Tap proceed button.\n4. Enter user address such as region, province, city, barangay, postal code, and street. Then tap the proceed button.\n5. Enter user age; to enter user age, swipe left or right to choose the user''s age. Then tap proceed button.\n6. Confirm information, if the user''s information is correct tap complete signup button, if no tap back button to edit the wrong user information.', 'The system should add the new account to the database.', 'Fur Parent', 'PASS', ''),
    ('tc-004', '2026-03-23 09:00:00+00', 'Dashboard', 'Overview of the app functionality', '1. After login, swipe up and down to see the dashboard.', 'System should display the events overview, search your Fur Friend, Lost and Found, and the donate buttons.', 'Fur Parent', 'PASS', ''),
    ('tc-005', '2026-03-23 09:30:00+00', 'Events', 'Verify events viewer', '1. Tap selected event\n2. Tap close button', 'System must display the created event from the sub-admin and admin side.', 'Admin', 'PASS', ''),
    ('tc-006', '2026-03-23 10:00:00+00', 'Search your Fur Friend', 'Verify list of pets that are ready to adopt', '1. Tap Fur Friends Button.\n2. Tap pet card\n3. Tap Adopt\n4. Check ''I accept all terms and conditions''\n5. Tap Proceed\n6. Tap Submit\n7. Tap Submit\n8. Tap pet card\n9. Tap ''No, Thanks''', 'The system should display the list of pets that are ready for adoption.', 'Fur Parent', 'FAIL', 'Bugs in the suggested pets with disabilities, navigation issue'),
    ('tc-007', '2026-03-23 10:30:00+00', 'Lost and Found', 'Verify list of pets that are reported missing.', '1. Tap Lost and Found button\n2. Tap selected pet\n3. Tap contact button\n4. Tap mark as found button\n5. Tap "Yes, Mark as Found"', 'The system should display the list of the missing pets. The system should display the information about the missing pet. The system should mark the pet as found.', 'Fur Parent', 'PASS', ''),
    ('tc-008', '2026-03-23 11:00:00+00', 'Donate', 'Verify functionality for donation', '1. Tap donate button', 'The system should display an image that contains a QR code for faster and seamless donation.', 'Fur Parent', 'PASS', ''),
    ('tc-009', '2026-03-23 11:30:00+00', 'Pending adoption', 'Verify list of pending adoption.', '1. Tap drop down menu\n2. Tap pending\n3. Tap approved\n4. Tap declined\n5. Tap cancel\n6. Tap pet name', 'The system should display the list of pets that are currently pending, approved and declined. The system should display the pet''s information and the adopter''s information.', 'Sub-Admin (Staff)', 'PASS', ''),
    ('tc-010', '2026-03-23 13:00:00+00', 'Reports', 'Verify viewing of user-submitted reports', '1. Tap report a pet button\n2. Tap drop down\n3. Tap camera icon\n4. Tap take a photo\n5. Choose from gallery\n6. Take a photo\n7. Upload a photo\n8. Enter pet information\n9. Enter age\n10. Enter personality\n11. Enter contact number\n12. Other details of pet\n13. Health condition\n14. Add location\n15. Add date and time\n16. Tap proceed button\n17. Tap done button\n18. Tap ''My Reports''', 'The system should display two buttons (report a pet, and my reports). The system should add the reported pet on the database. The system should display the user submitted reports.', 'Fur Parent', 'PASS', ''),
    ('tc-011', '2026-03-23 13:30:00+00', 'Profile screen', 'Verify the profile screen functionality', '1. Tap profile picture\n2. Tap edit button\n3. Tap sign out button', 'System should display the personal information of the user including their name, sex, age, phone number, email, and their address. System should return to login screen.', 'Fur Parent', 'PASS', ''),
    ('tc-012', '2026-03-23 14:00:00+00', 'AI Page', 'Send plain text, image, and video to the chatbot, and an interactive dog that can give pet tips', '1. Click the dog\n2. Send plain text\n3. Click suggested response\n4. Send image\n5. Send video.\n6. Tap thumbs up icon\n7. Tap thumbs down icon\n8. Tap positive feedback buttons\n9. Submit Feedback\n10. Tap negative feedback\n11. Submit Feedback', 'The system should display tips of the interactive dog, send text, image, suggested response and video. The system should have feedback based on the given response.', 'Fur Parent', 'PASS', ''),
    ('tc-013', '2026-03-23 14:30:00+00', 'Adoption Page', 'Overview of list of adoption request of pets in Pending, Approved and Declined status', '1. Tap Pending\n2. Tap Cancel\n3. Tap pet card\n4. Tap dropdown and tap Approved\n5. Tap Update\n6. Tap Add Icon\n7. Tap to add image or video\n8. Tap ''Post''\n9. Tap ''Cancel''', 'The system should display ''Pending'', ''Approved'' and ''Declined'' pets and should display the information of the pet.', 'Sub-Admin (Staff)', 'PASS', ''),
    ('tc-014', '2026-03-23 15:00:00+00', 'Verifications Page', 'Verify the identity of Fur Parent to access adoption', '1. Tap Not Verified card\n2. Tap List of IDs\n3. Upload front ID\n4. Upload back ID\n5. Upload face image', 'The system should upload files and transition correctly.', 'Fur Parent', 'FAIL', 'Message should say; ''Invalid ID'' and navigation issue'),
    ('tc-015', '2026-03-23 15:30:00+00', 'Notifications Page', 'Overview of list of notifications', '1. Tap bell icon\n2. Tap Adoption request notification\n3. Tap report notification\n4. Tap donation notification', 'The system should display notifications and when if clicked, it should navigate to their destination.', 'Fur Parent', 'FAIL', 'Message should say: ''Temporary Ban'''),
    ('tc-016', '2026-03-23 16:00:00+00', 'QR Scanner', 'Scan the QR Code to show pet information', '1. Tap QR floating button\n2. Scan Pet QR Code', 'The system should display pet information after successfully scanned the QR Code of the pet', 'Sub-Admin (Staff)', 'FAIL', 'Message should say: ''Failed to scan pet. Pet not found.'''),
    ('tc-017', '2026-03-23 16:30:00+00', 'Shelter Projects', 'Overview of listed posts of the shelter, adoption and others.', '1. Tap Shelter Projects\n2. Tap post', 'The system should display posts of the shelter', 'Fur Parent', 'PASS', ''),
    ('tc-018', '2026-03-23 17:00:00+00', 'Adoption Journey', 'Overview of listed posts of the fur parent''s adoption updates', '1. Tap Adoption Journey\n2. Tap Add button\n3. Tap ''Add Image or Video''\n4. Tap ''Post''', 'The system should display fur parent''s adoption updates', 'Fur Parent', 'PASS', '')
ON CONFLICT (test_logs_id) DO NOTHING;

-- 6. Enable Realtime Replication for tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.test_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.print_settings;

