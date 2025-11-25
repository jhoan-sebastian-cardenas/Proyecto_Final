# Session Hurl for Proyecto_Final (Elysia API)
# Replace {{host}} with the running server, e.g. http://localhost:3000
# Updated version with GET and PATCH operations

# NOTES:
# - Run with: `hurl --verbose --variable host=http://localhost:3000 session.hurl`

# ---
# 1) Get computers list (should be empty initially)
GET {{host}}/api/computers
HTTP 200

# ---
# 2) Get medical devices list (should be empty initially)
GET {{host}}/api/medicaldevices
HTTP 200

# ---
# 3) Get frequent computers list (should be empty initially)
GET {{host}}/api/computers/frequent
HTTP 200

# ---
# 4) Get entered devices list (should be empty initially)
GET {{host}}/api/devices/entered
HTTP 200

# ---
# 5) Try a PATCH operation (checkout a non-existent device)
# This will fail with 422 due to validation error
PATCH {{host}}/api/devices/checkout/invalid-id
HTTP 422

# ---
# Notes / Tips:
# - This version includes both GET and PATCH operations
# - All POST operations in the API require file uploads which don't work well with Hurl
# - For complete testing, consider using Postman or JavaScript tests
# - Run with:
#     hurl --verbose --variable host=http://localhost:3000 session.hurl