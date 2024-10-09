<?php
// Set the path to the JSON file
$jsonFilePath = 'leaderboard.json';

// Read the existing data from the JSON file
$leaderboard = [];
if (file_exists($jsonFilePath)) {
    $leaderboard = json_decode(file_get_contents($jsonFilePath), true);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $userName = $_POST['username'];
    $file = $_FILES['file'];

    // File upload path
    $targetDir = "uploads/";
    $targetFile = $targetDir . basename($file['name']);
    
    // Move uploaded file to server directory
    if (move_uploaded_file($file['tmp_name'], $targetFile)) {
        // Add the new entry to the leaderboard array
        $leaderboard[] = [
            'user_name' => $userName,
            'file_name' => basename($file['name'])
        ];

        // Save the updated leaderboard back to the JSON file
        file_put_contents($jsonFilePath, json_encode($leaderboard, JSON_PRETTY_PRINT));

        echo "File uploaded and leaderboard updated successfully";
    } else {
        echo "Sorry, there was an error uploading your file.";
    }
}
?>
