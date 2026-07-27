CREATE DATABASE IF NOT EXISTS apawtment_bugtracker;
USE apawtment_bugtracker;

CREATE TABLE test_logs (
    test_logs_id VARCHAR(64) PRIMARY KEY,
    datetime DATETIME NOT NULL,
    module VARCHAR(255) NOT NULL,
    scenario TEXT NOT NULL,
    steps TEXT NOT NULL,
    expected TEXT NOT NULL,
    user_role VARCHAR(64) NOT NULL DEFAULT 'Fur Parent',
    status ENUM('PASS','FAIL') NOT NULL DEFAULT 'PASS',
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE print_settings (
    print_settings_id INT PRIMARY KEY DEFAULT 1,
    group_name VARCHAR(255),
    system_title VARCHAR(500),
    adviser_name VARCHAR(255),
    researchers TEXT,
    report_date VARCHAR(64),
    prepared_leader VARCHAR(255),
    prepared_programmer VARCHAR(255),
    checked_adviser VARCHAR(255)
);

INSERT INTO print_settings (print_settings_id, group_name, system_title, adviser_name, researchers, report_date, prepared_leader, prepared_programmer, checked_adviser)
VALUES (1, 'Team Harvard', 'APawtMent: A Multi-Platform Information System for Adopting Pets of Luca\'s Sanctuary and Cawa\'s Gang', 'Jeffrey M. Caoile, LPT, DIT', 'John Lee T. Agustin\nJeric Jay P. Alcantara\nPhilip James S. Marquez\nJohn Denver C. Petinez\nJacques Esmond B. Fernandez', 'March 23, 2026', 'John Denver C. Petinez', 'Jeric Jay P. Alcantara', 'Jeffrey M. Caoile, LPT, DIT');