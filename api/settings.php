<?php
require 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT group_name AS groupName, system_title AS systemTitle, adviser_name AS adviserName,
        researchers, report_date AS reportDate, prepared_leader AS preparedLeader,
        prepared_programmer AS preparedProgrammer, checked_adviser AS checkedAdviser
        FROM print_settings WHERE id = 1");
    echo json_encode($stmt->fetch());
} elseif ($method === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true);

    $stmt = $pdo->prepare("UPDATE print_settings SET
        group_name = :groupName, system_title = :systemTitle, adviser_name = :adviserName,
        researchers = :researchers, report_date = :reportDate, prepared_leader = :preparedLeader,
        prepared_programmer = :preparedProgrammer, checked_adviser = :checkedAdviser
        WHERE id = 1");

    $stmt->execute([
        ':groupName' => $body['groupName'] ?? '',
        ':systemTitle' => $body['systemTitle'] ?? '',
        ':adviserName' => $body['adviserName'] ?? '',
        ':researchers' => $body['researchers'] ?? '',
        ':reportDate' => $body['reportDate'] ?? '',
        ':preparedLeader' => $body['preparedLeader'] ?? '',
        ':preparedProgrammer' => $body['preparedProgrammer'] ?? '',
        ':checkedAdviser' => $body['checkedAdviser'] ?? ''
    ]);

    echo json_encode(['success' => true]);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}