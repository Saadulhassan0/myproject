<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <link rel="stylesheet" href="login.css">
    <link rel="stylesheet" href="dashboard.css">
    <style>
        .dashboard-container {
            max-width: 600px;
            margin: 100px auto 50px auto;
            padding: 40px;
            background: white;
            border-radius: 14px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
            text-align: center;
        }
        h1 {
            color: #333;
            margin-bottom: 30px;
            font-size: 32px;
        }
        .user-info {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 10px;
            margin-bottom: 30px;
            text-align: left;
        }
        .user-info h3 {
            color: #6c4ce0;
            margin-bottom: 15px;
            border-bottom: 2px solid #6c4ce0;
            padding-bottom: 5px;
        }
        .user-info p {
            margin: 10px 0;
            font-size: 16px;
        }
        .btn-logout {
            background: #dc3545;
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            transition: all 0.3s;
        }
        .btn-logout:hover {
            background: #c82333;
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <button class="back-btn" onclick="window.location.href='dashboard.html'">← Back Home</button>
    <div class="dashboard-container">
        <h1>Welcome, <?php echo htmlspecialchars($_SESSION['user_name']); ?>!</h1>
        
        <div class="user-info">
            <h3>Your Account Information</h3>
            <p><strong>User ID:</strong> <?php echo $_SESSION['user_id']; ?></p>
            <p><strong>Email:</strong> <?php echo htmlspecialchars($_SESSION['user_email']); ?></p>
            <p><strong>Session Status:</strong> Active</p>
        </div>
        
        <button class="btn-logout" onclick="logout()">Logout</button>
    </div>

    <script>
        async function logout() {
            try {
                const response = await fetch('logout.php');
                const result = await response.json();
                if (result.success) {
                    window.location.href = 'index.php';
                }
            } catch (error) {
                alert('Logout failed. Please try again.');
            }
        }
    </script>
</body>
</html>