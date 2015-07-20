#!/bin/bash
# ------------------------------------------------------------------
#
#          This script uses sets directories for inboxes and acls
#          they go both into the inbox and the tx directory
#
# ------------------------------------------------------------------

BASE=$1
DB="credit.db"

echo "select distinct source from ledger;" | sqlite3 $DB | while read i
do
  D=$(echo -n $i | sha256sum | sed 's/^\(.*\) .*$/\1/')
  curl -k "$1" -X POST -H 'Content-Type: text/turtle' -H "Slug: $D" -H 'Link: <http://www.w3.org/ns/ldp#BasicContainer>; rel="type"' -H 'Content-Length: 0'
  sleep 1
done

#IDS="$(echo "select distinct source from ledger;" | sqlite3 $DB)"

#IFS=$'\n'

#echo $IDS
