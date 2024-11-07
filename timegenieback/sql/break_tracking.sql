-- adds tracking to ensure that employee can hold breaks
ALTER TABLE employee
DROP COLUMN breaks_remaining,
DROP COLUMN break_duration,
ADD COLUMN breaks_remaining Integer,
ADD COLUMN break_duration Integer;