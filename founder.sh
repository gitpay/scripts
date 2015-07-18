#!/bin/bash
# ------------------------------------------------------------------
#
#          This script uses sets an initial coin offering for
#          an initially setup sqlite3 database
#
# ------------------------------------------------------------------


SOURCE="https://workbot.databox.me/profile/card#me"
DESTINATION="$1"
AMOUNT=10000
DESCRIPTION="founder"
CURRENCY="http://w3id.org/cc#bit"

nodejs ./insert.js "$SOURCE" "$AMOUNT" "$CURRENCY" "$DESTINATION" "$DESCRIPTION"
