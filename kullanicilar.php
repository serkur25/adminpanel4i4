<?php
header('Content-Type: application/json');
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "oyun_incelemeleri";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Bağlantı hatası: " . $conn->connect_error);
}

$sql = "SELECT * FROM kullanicilar";
$result = $conn->query($sql);

$kullanicilar = [];
while ($row = $result->fetch_assoc()) {
    $kullanicilar[] = $row;
}

echo json_encode($kullanicilar);

$conn->close();
?>