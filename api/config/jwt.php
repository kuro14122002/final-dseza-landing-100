<?php
// File: api/config/jwt.php
return [
    'secret_key' => 'MotChuoiBiMatRatDaiVaPhucTapCuaBan!@#$%%^&', // THAY THẾ BẰNG KHÓA BÍ MẬT CỦA BẠN
    'issuer' => 'danang-invest-hub.gov.vn', // Có thể là domain của bạn
    'audience' => 'danang-invest-hub.gov.vn', // Có thể là domain của bạn
    'expiration_time' => 24 * 60 * 60, // 24 giờ (86400 giây)
    'refresh_expiration_time' => 7 * 24 * 60 * 60, // 7 ngày (604800 giây)
    'algorithm' => 'HS256'
];
?>