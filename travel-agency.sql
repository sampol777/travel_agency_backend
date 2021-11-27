DROP DATABASE travel_agency;
CREATE DATABASE travel_agency;
\connect travel_agency

\i travel-agency-schema.sql
\i travel-seed.sql


DROP DATABASE travel_agency_test;
CREATE DATABASE travel_agency_test;
\connect travel_agency_test

\i travel-agency-schema.sql