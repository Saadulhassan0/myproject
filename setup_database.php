<?php
// Automatic Database and Table Setup Script
$host = 'localhost';
$username = 'root';
$password = '';

try {
    // 1. Connect to MySQL without choosing a database
    $pdo = new PDO("mysql:host=$host", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 2. Create the Database
    $pdo->exec("CREATE DATABASE IF NOT EXISTS user_auth");
    echo "✅ Database 'user_auth' created or already exists.<br>";

    // 3. Select the Database
    $pdo->exec("USE user_auth");

    // 4. Create the Users Table
    $sql = "CREATE TABLE IF NOT EXISTS users (
        id INT(11) AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        cnic VARCHAR(15) NOT NULL UNIQUE,
        phone VARCHAR(15) NOT NULL,
        dob DATE NOT NULL,
        password VARCHAR(255) NOT NULL,
        profile_pic VARCHAR(255) DEFAULT 'default.png',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";

    $pdo->exec($sql);
    echo "✅ Table 'users' created or already exists.<br>";
    echo "<br><b>Setup Complete!</b> You can now use the Login and Registration forms.<br>";
    echo "<a href='login.html'>Go to Login Page</a>";

    // 5. Create uploads directory
    if (!is_dir('uploads')) {
        mkdir('uploads', 0777, true);
        echo "<br>✅ 'uploads' folder created.";
    }

} catch (PDOException $e) {
    die("❌ Error during setup: " . $e->getMessage());
}
?>
