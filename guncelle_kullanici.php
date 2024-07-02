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

$id = $_POST['id'];
$kullanici_adi = $_POST['kullanici_adi'];
$sifre = $_POST['sifre'];

$sql = "UPDATE kullanicilar SET kullanici_adi = ?, sifre = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssi", $kullanici_adi, $sifre, $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Kullanıcı güncellenemedi."]);
}

$stmt->close();
$conn->close();
?>