#!/bin/sh

cat <<End-of-message | sqlite3 credit.db
CREATE TABLE LEDGER ( 'source' TEXT, 'amount' REAL);
INSERT INTO "LEDGER" VALUES('urn:coinbase',1000000.0);
CREATE TABLE START ( 'source' TEXT, 'destination' TEXT, 'amount' REAL, 'timestamp' TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, context TEXT, description TEXT);
CREATE TABLE CREDIT ( '@id' TEXT, 'source' TEXT, 'amount' REAL, 'currency' TEXT DEFAULT 'https://w3id.org/cc#bit', 'destination' TEXT, 'timestamp' TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, context TEXT, description TEXT);
End-of-message
