<?php
require 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT id, datetime, module, scenario, steps, expected, user_role AS user, status, comments FROM test_logs ORDER BY datetime DESC");
        echo json_encode($stmt->fetchAll());
        break;

    case 'POST':
        $body = json_decode(file_get_contents('php://input'), true);

        if (empty($body['module']) || empty($body['scenario']) || empty($body['steps']) || empty($body['expected'])) {
            http_response_code(400);
            echo json_encode(['error' => 'module, scenario, steps, and expected are required']);
            exit;
        }

        $id = $body['id'] ?? ('tc-' . time() . '-' . bin2hex(random_bytes(3)));
        $datetime = $body['datetime'] ?? date('Y-m-d H:i:s');

        $stmt = $pdo->prepare("INSERT INTO test_logs (id, datetime, module, scenario, steps, expected, user_role, status, comments)
            VALUES (:id, :datetime, :module, :scenario, :steps, :expected, :user_role, :status, :comments)
            ON DUPLICATE KEY UPDATE
                datetime = VALUES(datetime), module = VALUES(module), scenario = VALUES(scenario),
                steps = VALUES(steps), expected = VALUES(expected), user_role = VALUES(user_role),
                status = VALUES(status), comments = VALUES(comments)");

        $stmt->execute([
            ':id' => $id,
            ':datetime' => $datetime,
            ':module' => $body['module'],
            ':scenario' => $body['scenario'],
            ':steps' => $body['steps'],
            ':expected' => $body['expected'],
            ':user_role' => $body['user'] ?? 'Fur Parent',
            ':status' => $body['status'] ?? 'PASS',
            ':comments' => $body['comments'] ?? ''
        ]);

        echo json_encode(['success' => true, 'id' => $id]);
        break;

    case 'PUT':
        // Update just the status (used by the inline dashboard dropdown)
        parse_str(file_get_contents('php://input'), $put);
        $body = json_decode(file_get_contents('php://input'), true);

        $id = $body['id'] ?? null;
        $status = $body['status'] ?? null;

        if (!$id || !$status) {
            http_response_code(400);
            echo json_encode(['error' => 'id and status are required']);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE test_logs SET status = :status WHERE id = :id");
        $stmt->execute([':status' => $status, ':id' => $id]);

        echo json_encode(['success' => true]);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;

        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'id is required']);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM test_logs WHERE id = :id");
        $stmt->execute([':id' => $id]);

        echo json_encode(['success' => true]);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}