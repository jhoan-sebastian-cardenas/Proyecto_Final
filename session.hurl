# Session Hurl for Proyecto_Final (Elysia API)
# Replace {{host}} with the running server, e.g. http://localhost:3000
# Updated version with GET and PATCH operations

# NOTES:
# - Run with: `hurl --verbose --variable host=http://localhost:3000 session.hurl`

# ---
# 1) Check OpenAPI documentation is available
GET {{host}}/openapi
HTTP 200

# ---
# 2) Get computers list (should be empty initially)
GET {{host}}/api/computers
HTTP 200

# ---
# 3) Get medical devices list (should be empty initially)
GET {{host}}/api/medicaldevices
HTTP 200

# ---
# 4) Get frequent computers list (should be empty initially)
GET {{host}}/api/computers/frequent
HTTP 200

# ---
# 5) Get entered devices list (should be empty initially)
GET {{host}}/api/devices/entered
HTTP 200

# ---
# 6) Try a PATCH operation (checkout a non-existent device)
# This will fail with 422 due to validation error
PATCH {{host}}/api/devices/checkout/invalid-id
HTTP 422

# ---
# 7) Try a PATCH operation (checkin a non-existent frequent computer)
# This will fail with 422 due to validation error
PATCH {{host}}/api/computers/frequent/checkin/invalid-id
HTTP 422

# ---
# Notes / Tips:
# - This version includes GET and PATCH operations
# - Validates that OpenAPI documentation is available
# - POST operations require file uploads which don't work well with Hurl
# - For complete POST testing, consider using tools that can read OpenAPI specs
# - Run with:
#     hurl --verbose --variable host=http://localhost:3000 session.hurl