"""Constants for the Enua Charge integration."""

DOMAIN = "enua"
MANUFACTURER = "Enua"

API_BASE_URL = "https://api.enua.io"
API_VERSION = "1"

# OAuth2 (Azure AD B2C)
OAUTH2_AUTHORIZE = "https://enuab2c.b2clogin.com/enuab2c.onmicrosoft.com/B2C_1A_SIGNUP_SIGNIN/oauth2/v2.0/authorize"
OAUTH2_TOKEN = "https://enuab2c.b2clogin.com/enuab2c.onmicrosoft.com/B2C_1A_SIGNUP_SIGNIN/oauth2/v2.0/token"
OAUTH2_SCOPES = ["openid", "offline_access"]

# Config entry keys
CONF_CLIENT_ID = "client_id"
CONF_CLIENT_SECRET = "client_secret"

# Update interval in seconds
UPDATE_INTERVAL = 30

# Vehicle states
VEHICLE_STATE_NO_VEHICLE = "A"
VEHICLE_STATE_CONNECTED = "B"
VEHICLE_STATE_CHARGING = "C"
VEHICLE_STATE_ERROR = "F"

VEHICLE_STATE_MAP = {
    "A": "No vehicle",
    "B": "Connected",
    "C": "Charging",
    "D": "Charging (ventilation)",
    "E": "Error (short circuit)",
    "F": "Error",
}

# Lock states
LOCK_STATUS_LOCKED = "Locked"
LOCK_STATUS_UNLOCKED = "Unlocked"
