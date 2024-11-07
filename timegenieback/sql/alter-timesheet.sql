-- we need to be able to get the location of an employees clock in and out locations.
-- at first we only had location.
ALTER TABLE timesheet
DROP COLUMN location,
ADD COLUMN clock_in_location POINT,
ADD COLUMN clock_out_location POINT;
