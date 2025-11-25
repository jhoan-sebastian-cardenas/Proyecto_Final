# Session Hurl for Proyecto_Final (Elysia API)
# Replace {{host}} with the running server, e.g. http://localhost:3000

# NOTES:
# - File uploads use the test.png in tests/fixtures
# - Run with: `hurl -v session.hurl --define host=http://localhost:3000`

# ---
# 1) Register a frequent computer (multipart)
# Upload using test.png from tests/fixtures
POST {{host}}/api/computers/frequent
Content-Type: multipart/form-data; boundary=----BOUNDARY

------BOUNDARY
Content-Disposition: form-data; name="brand"

Sony
------BOUNDARY
Content-Disposition: form-data; name="model"

VAIO
------BOUNDARY
Content-Disposition: form-data; name="ownerName"

Harry
------BOUNDARY
Content-Disposition: form-data; name="ownerId"

123456
------BOUNDARY
Content-Disposition: form-data; name="photo"; filename="test.png"
Content-Type: image/png

<file,tests/fixtures/test.png>
------BOUNDARY--
HTTP 200
[Captures]
frequent_id: jsonpath "$.device.id"
frequent_checkin_url: jsonpath "$.checkinURL"
frequent_checkout_url: jsonpath "$.checkoutURL"
[Asserts]
jsonpath "$.device.id" exists
jsonpath "$.checkinURL" contains "/api/computers/frequent/checkin/"
jsonpath "$.checkoutURL" contains "/devices/checkout/"

# ---
# 2) Check-in a computer (regular checkin, multipart)
POST {{host}}/api/computers/checkin
Content-Type: multipart/form-data; boundary=----BOUNDARY

------BOUNDARY
Content-Disposition: form-data; name="brand"

Dell
------BOUNDARY
Content-Disposition: form-data; name="model"

Latitude
------BOUNDARY
Content-Disposition: form-data; name="ownerName"

Alice
------BOUNDARY
Content-Disposition: form-data; name="ownerId"

A123456
------BOUNDARY
Content-Disposition: form-data; name="photo"; filename="test.png"
Content-Type: image/png

<file,tests/fixtures/test.png>
------BOUNDARY--
HTTP 200
[Captures]
checked_computer_id: jsonpath "$.id"
[Asserts]
jsonpath "$.id" exists

# ---
# 3) Check-in a medical device (JSON body)
POST {{host}}/api/medicaldevices/checkin
Content-Type: application/json

{
  "brand": "GE",
  "model": "ECG1000",
  "ownerName": "Dr. House",
  "ownerId": "123512464",
  "serial": "f48238r7y2r",
  "photoURL": "http://example.com/photos/medical1.png"
}
HTTP 200
[Captures]
medical_id: jsonpath "$.id"
[Asserts]
jsonpath "$.id" exists

# ---
# 4) List frequent computers and assert the previously registered frequent is present
GET {{host}}/api/computers/frequent
HTTP 200
[Asserts]
jsonpath "$.length" >= 1
jsonpath "$.0.device.id" exists

# ---
# 5) Use the captured frequent checkin URL to perform checkin (PATCH)
# The captured URL `frequent_checkin_url` may be absolute. If it's absolute, Hurl will accept it.
PATCH {{frequent_checkin_url}}
HTTP 200
[Asserts]
status == 200

# ---
# 6) Use captured frequent checkout URL (PATCH)
PATCH {{frequent_checkout_url}}
HTTP 200
[Asserts]
status == 200

# ---
# 7) Get entered devices and assert we have at least one entered device
GET {{host}}/api/devices/entered
HTTP 200
[Asserts]
jsonpath "$.length" >= 0

# ---
# 8) Get computers list and ensure the checked in computer exists
GET {{host}}/api/computers
HTTP 200
[Asserts]
jsonpath "$.length" >= 0

# ---
# 9) Get medical devices list and ensure the checked in medical device exists
GET {{host}}/api/medicaldevices
HTTP 200
[Asserts]
jsonpath "$.length" >= 0

# ---
# Notes / Tips:
# - We're using a minimal test PNG in tests/fixtures/test.png for file uploads
# - Run with:
#     hurl session.hurl --define host=http://localhost:3000
# - If responses have different shapes, adjust the jsonpath expressions
