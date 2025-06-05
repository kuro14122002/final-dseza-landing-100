@echo off
echo ===========================================
echo DSEZA API Testing with cURL
echo ===========================================
echo.

REM Đặt base URL
set BASE_URL=http://localhost/final-dseza-landing-85

echo 🔍 Test 1: API Information
echo -------------------------------------------
curl -X GET "%BASE_URL%/api/" -H "Content-Type: application/json"
echo.
echo.

echo 🔍 Test 2: API Index
echo -------------------------------------------
curl -X GET "%BASE_URL%/api/index.php" -H "Content-Type: application/json"
echo.
echo.

echo 🔍 Test 3: Login API - Valid Credentials
echo -------------------------------------------
curl -X POST "%BASE_URL%/api/v1/auth/login.php" ^
     -H "Content-Type: application/json" ^
     -d "{\"email\":\"admin@dseza.gov.vn\",\"password\":\"password123\"}"
echo.
echo.

echo 🔍 Test 4: Login API - Invalid Password
echo -------------------------------------------
curl -X POST "%BASE_URL%/api/v1/auth/login.php" ^
     -H "Content-Type: application/json" ^
     -d "{\"email\":\"admin@dseza.gov.vn\",\"password\":\"wrongpassword\"}"
echo.
echo.

echo 🔍 Test 5: Login API - Missing Password
echo -------------------------------------------
curl -X POST "%BASE_URL%/api/v1/auth/login.php" ^
     -H "Content-Type: application/json" ^
     -d "{\"email\":\"admin@dseza.gov.vn\"}"
echo.
echo.

echo 🔍 Test 6: Stats API
echo -------------------------------------------
curl -X GET "%BASE_URL%/api/v1/stats/" -H "Content-Type: application/json"
echo.
echo.

echo ===========================================
echo Tests completed!
echo ===========================================
pause 