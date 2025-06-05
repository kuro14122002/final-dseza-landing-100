<?php
/**
 * cURL Commands Generator for DSEZA API Testing
 * File: api/generate_curl_commands.php
 * 
 * Generates ready-to-use cURL commands for testing both Login and Stats APIs
 */

// Configuration
$baseUrl = 'http://localhost/final-dseza-landing-85/api';

echo "# DSEZA API Testing - cURL Commands\n";
echo "# Generated on: " . date('Y-m-d H:i:s') . "\n";
echo "# Base URL: $baseUrl\n\n";

echo "# =============================================\n";
echo "# LOGIN API TESTS (/api/v1/auth/login.php)\n";
echo "# =============================================\n\n";

echo "# 1. Valid Admin Login (Success Case)\n";
echo "curl -X POST \\\n";
echo "  '$baseUrl/v1/auth/login.php' \\\n";
echo "  -H 'Content-Type: application/json' \\\n";
echo "  -d '{\n";
echo "    \"email\": \"admin@dseza.gov.vn\",\n";
echo "    \"password\": \"password123\"\n";
echo "  }'\n\n";

echo "# 2. Valid Editor Login (Success Case)\n";
echo "curl -X POST \\\n";
echo "  '$baseUrl/v1/auth/login.php' \\\n";
echo "  -H 'Content-Type: application/json' \\\n";
echo "  -d '{\n";
echo "    \"email\": \"editor@dseza.gov.vn\",\n";
echo "    \"password\": \"password123\"\n";
echo "  }'\n\n";

echo "# 3. Invalid Password (Should return 401)\n";
echo "curl -X POST \\\n";
echo "  '$baseUrl/v1/auth/login.php' \\\n";
echo "  -H 'Content-Type: application/json' \\\n";
echo "  -d '{\n";
echo "    \"email\": \"admin@dseza.gov.vn\",\n";
echo "    \"password\": \"wrongpassword\"\n";
echo "  }'\n\n";

echo "# 4. Non-existent User (Should return 401)\n";
echo "curl -X POST \\\n";
echo "  '$baseUrl/v1/auth/login.php' \\\n";
echo "  -H 'Content-Type: application/json' \\\n";
echo "  -d '{\n";
echo "    \"email\": \"notexist@dseza.gov.vn\",\n";
echo "    \"password\": \"password123\"\n";
echo "  }'\n\n";

echo "# 5. Inactive User (Should return 401)\n";
echo "curl -X POST \\\n";
echo "  '$baseUrl/v1/auth/login.php' \\\n";
echo "  -H 'Content-Type: application/json' \\\n";
echo "  -d '{\n";
echo "    \"email\": \"inactive.user@dseza.gov.vn\",\n";
echo "    \"password\": \"password123\"\n";
echo "  }'\n\n";

echo "# 6. Missing Email Field (Should return 400)\n";
echo "curl -X POST \\\n";
echo "  '$baseUrl/v1/auth/login.php' \\\n";
echo "  -H 'Content-Type: application/json' \\\n";
echo "  -d '{\n";
echo "    \"password\": \"password123\"\n";
echo "  }'\n\n";

echo "# 7. Missing Password Field (Should return 400)\n";
echo "curl -X POST \\\n";
echo "  '$baseUrl/v1/auth/login.php' \\\n";
echo "  -H 'Content-Type: application/json' \\\n";
echo "  -d '{\n";
echo "    \"email\": \"admin@dseza.gov.vn\"\n";
echo "  }'\n\n";

echo "# 8. Invalid JSON Format (Should return 400)\n";
echo "curl -X POST \\\n";
echo "  '$baseUrl/v1/auth/login.php' \\\n";
echo "  -H 'Content-Type: application/json' \\\n";
echo "  -d '{invalid json}'\n\n";

echo "# 9. Wrong HTTP Method (Should return 405)\n";
echo "curl -X GET \\\n";
echo "  '$baseUrl/v1/auth/login.php' \\\n";
echo "  -H 'Content-Type: application/json'\n\n";

echo "# =============================================\n";
echo "# STATS API TESTS (/api/v1/stats/overview.php)\n";
echo "# =============================================\n\n";

echo "# IMPORTANT: First, get a valid JWT token by running a successful login command above.\n";
echo "# Copy the token from the response and replace 'YOUR_JWT_TOKEN_HERE' below.\n\n";

echo "# 1. Valid Token Access (Success Case)\n";
echo "curl -X GET \\\n";
echo "  '$baseUrl/v1/stats/overview.php' \\\n";
echo "  -H 'Content-Type: application/json' \\\n";
echo "  -H 'Authorization: Bearer YOUR_JWT_TOKEN_HERE'\n\n";

echo "# 2. No Token (Should return 401)\n";
echo "curl -X GET \\\n";
echo "  '$baseUrl/v1/stats/overview.php' \\\n";
echo "  -H 'Content-Type: application/json'\n\n";

echo "# 3. Invalid Token (Should return 401)\n";
echo "curl -X GET \\\n";
echo "  '$baseUrl/v1/stats/overview.php' \\\n";
echo "  -H 'Content-Type: application/json' \\\n";
echo "  -H 'Authorization: Bearer invalid.token.here'\n\n";

echo "# 4. Wrong HTTP Method (Should return 405)\n";
echo "curl -X POST \\\n";
echo "  '$baseUrl/v1/stats/overview.php' \\\n";
echo "  -H 'Content-Type: application/json' \\\n";
echo "  -H 'Authorization: Bearer YOUR_JWT_TOKEN_HERE' \\\n";
echo "  -d '{\"test\": \"data\"}'\n\n";

echo "# 5. Malformed Authorization Header (Should return 401)\n";
echo "curl -X GET \\\n";
echo "  '$baseUrl/v1/stats/overview.php' \\\n";
echo "  -H 'Content-Type: application/json' \\\n";
echo "  -H 'Authorization: InvalidFormat'\n\n";

echo "# =============================================\n";
echo "# WORKFLOW EXAMPLE\n";
echo "# =============================================\n\n";

echo "# Step 1: Login and save token\n";
echo "TOKEN=\$(curl -s -X POST \\\n";
echo "  '$baseUrl/v1/auth/login.php' \\\n";
echo "  -H 'Content-Type: application/json' \\\n";
echo "  -d '{\n";
echo "    \"email\": \"admin@dseza.gov.vn\",\n";
echo "    \"password\": \"password123\"\n";
echo "  }' | jq -r '.token')\n\n";

echo "# Step 2: Use token to access stats\n";
echo "curl -X GET \\\n";
echo "  '$baseUrl/v1/stats/overview.php' \\\n";
echo "  -H 'Content-Type: application/json' \\\n";
echo "  -H \"Authorization: Bearer \$TOKEN\"\n\n";

echo "# =============================================\n";
echo "# POSTMAN/INSOMNIA COLLECTION DATA\n";
echo "# =============================================\n\n";

echo "# For Postman/Insomnia, create requests with these details:\n\n";

echo "# REQUEST 1: Login\n";
echo "# Method: POST\n";
echo "# URL: $baseUrl/v1/auth/login.php\n";
echo "# Headers:\n";
echo "#   Content-Type: application/json\n";
echo "# Body (JSON):\n";
echo "# {\n";
echo "#   \"email\": \"admin@dseza.gov.vn\",\n";
echo "#   \"password\": \"password123\"\n";
echo "# }\n\n";

echo "# REQUEST 2: Stats (with token from Login response)\n";
echo "# Method: GET\n";
echo "# URL: $baseUrl/v1/stats/overview.php\n";
echo "# Headers:\n";
echo "#   Content-Type: application/json\n";
echo "#   Authorization: Bearer {{token}}\n\n";

echo "# =============================================\n";
echo "# TIPS FOR TESTING\n";
echo "# =============================================\n\n";

echo "# 1. Install jq for JSON parsing: sudo apt-get install jq (Linux) or brew install jq (Mac)\n";
echo "# 2. Use -v flag with curl to see detailed request/response headers\n";
echo "# 3. Use -s flag with curl for silent mode (no progress bar)\n";
echo "# 4. Save successful login response to file: curl ... > login_response.json\n";
echo "# 5. Extract token: cat login_response.json | jq -r '.token'\n";
echo "# 6. Test database connection before running API tests\n";
echo "# 7. Check PHP error logs if getting 500 errors\n";
echo "# 8. Verify web server and database are running\n\n";

echo "# =============================================\n";
echo "# BATCH TESTING SCRIPT\n";
echo "# =============================================\n\n";

echo "#!/bin/bash\n";
echo "# Save this as test_api.sh and run: chmod +x test_api.sh && ./test_api.sh\n\n";

echo "BASE_URL=\"$baseUrl\"\n";
echo "echo \"Testing DSEZA APIs...\"\n\n";

echo "echo \"1. Testing valid admin login...\"\n";
echo "curl -s -X POST \"\$BASE_URL/v1/auth/login.php\" \\\n";
echo "  -H 'Content-Type: application/json' \\\n";
echo "  -d '{\"email\":\"admin@dseza.gov.vn\",\"password\":\"password123\"}' \\\n";
echo "  | jq .\n\n";

echo "echo \"2. Testing invalid password...\"\n";
echo "curl -s -X POST \"\$BASE_URL/v1/auth/login.php\" \\\n";
echo "  -H 'Content-Type: application/json' \\\n";
echo "  -d '{\"email\":\"admin@dseza.gov.vn\",\"password\":\"wrong\"}' \\\n";
echo "  | jq .\n\n";

echo "echo \"3. Getting token and testing stats...\"\n";
echo "TOKEN=\$(curl -s -X POST \"\$BASE_URL/v1/auth/login.php\" \\\n";
echo "  -H 'Content-Type: application/json' \\\n";
echo "  -d '{\"email\":\"admin@dseza.gov.vn\",\"password\":\"password123\"}' \\\n";
echo "  | jq -r '.token')\n\n";

echo "if [ \"\$TOKEN\" != \"null\" ] && [ \"\$TOKEN\" != \"\" ]; then\n";
echo "  echo \"Token obtained: \${TOKEN:0:30}...\"\n";
echo "  echo \"Testing stats with valid token...\"\n";
echo "  curl -s -X GET \"\$BASE_URL/v1/stats/overview.php\" \\\n";
echo "    -H 'Content-Type: application/json' \\\n";
echo "    -H \"Authorization: Bearer \$TOKEN\" \\\n";
echo "    | jq .\n";
echo "else\n";
echo "  echo \"Failed to obtain token!\"\n";
echo "fi\n\n";

echo "echo \"4. Testing stats without token (should fail)...\"\n";
echo "curl -s -X GET \"\$BASE_URL/v1/stats/overview.php\" \\\n";
echo "  -H 'Content-Type: application/json' \\\n";
echo "  | jq .\n\n";

echo "echo \"Testing completed!\"\n\n";

echo "# =============================================\n";
echo "# END OF GENERATED COMMANDS\n";
echo "# =============================================\n";
?> 