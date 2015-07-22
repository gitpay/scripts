#!/bin/bash
# ------------------------------------------------------------------
#
#          This script converts the ledger into mysql format
#
# ------------------------------------------------------------------

WALLET=$1
CURRENCY="https://w3id.org/cc#bit"
DB="credit.db"

echo "select distinct source, amount from ledger;" | sqlite3 $DB | while read i
do
  URI=$(echo -n $i | sed 's/^\(.*\)|\(.*\).*$/\1/')
  AMOUNT=$(echo -n $i | sed 's/^\(.*\)|\(.*\).*$/\2/')
  echo "INSERT INTO ledger VALUES (NULL, '$URI', '$AMOUNT', '$CURRENCY', '$WALLET', NULL);"
done
