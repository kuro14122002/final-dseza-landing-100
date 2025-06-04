<?php
// Simple password hash generator for testing
$password = "password123";
$hash = password_hash($password, PASSWORD_BCRYPT);

echo "Password: " . $password . "\n";
echo "Hash: " . $hash . "\n";
echo "Verification: " . (password_verify($password, $hash) ? "OK" : "FAIL") . "\n";
?> 