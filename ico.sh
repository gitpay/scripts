#!/bin/bash
# ------------------------------------------------------------------
#
#          This script uses sets an initial coin offering for
#          an initially setup sqlite3 database
#
# ------------------------------------------------------------------


SOURCE="urn:coinbase"
DESTINATION="https://workbot.databox.me/profile/card#me"
AMOUNT=100000
DESCRIPTION="ICO"
CURRENCY="http://w3id.org/cc#bit"

nodejs ./insert.js "$SOURCE" "$AMOUNT" "$CURRENCY" "$DESTINATION" "$DESCRIPTION"
