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

$kullaniciadi = $_POST['kullanici_adi'];
$sifre = $_POST['sifre'];

$sql = "INSERT INTO kullanicilar (kullanici_adi, sifre) VALUES (?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $kullaniciadi, $sifre);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Kullanıcı eklenemedi."]);
}

$stmt->close();
$conn->close();
?>