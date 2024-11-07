-- 2 new columns that flag whether or not this employee has clocked in or out within the region.
ALTER TABLE timesheet
ADD COLUMN clock_in_region BOOLEAN,
ADD COLUMN clock_out_region BOOLEAN;