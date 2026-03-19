"""OAuth2 config flow for Enua Charge."""
from __future__ import annotations

from homeassistant.helpers import config_entry_oauth2_flow

from .const import DOMAIN, OAUTH2_AUTHORIZE, OAUTH2_TOKEN, OAUTH2_SCOPES


class EnuaOAuth2FlowHandler(
    config_entry_oauth2_flow.AbstractOAuth2FlowHandler, domain=DOMAIN
):
    """OAuth2 flow handler for Enua."""

    DOMAIN = DOMAIN

    @property
    def logger(self):
        import logging
        return logging.getLogger(__name__)

    @property
    def extra_authorize_data(self) -> dict:
        """Extra data to append to authorization url."""
        return {"scope": " ".join(OAUTH2_SCOPES)}
