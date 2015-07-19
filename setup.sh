#!/bin/bash
# ------------------------------------------------------------------
#
#          This script uses sets an initial coin offering for
#          an initially setup sqlite3 database
#
# ------------------------------------------------------------------

# eg setup.sh "https://localhost/etc/wallet/github.com/linkeddata/SoLiD/wallet" "https://deiu.me/profile#me"
#
WALLET="$1"
FOUNDER="$2"

rm credit.db

./createsqlite.sh
./ico.sh
./founder.sh "$FOUNDER"

nodejs ./commits.js $WALLET
nodejs ./issues.js $WALLET
nodejs ./comments.js $WALLET
