To run first add the table to datbase by running if this causes problems ask but shouldnt
npx sequelize-cli db:migrate

Next in the sql files run this function and trigger
CREATE OR REPLACE FUNCTION update_employee_break_time()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE breaks 
    SET total_time_spent = (
        SELECT COALESCE(SUM(extract(epoch from (stop_time AT TIME ZONE 'UTC' - start_time AT TIME ZONE 'UTC'))))
        FROM breaks
        WHERE break_id = NEW.break_id
    )
    WHERE break_id = NEW.break_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE TRIGGER update_employee_break_time_trigger
AFTER UPDATE ON breaks
FOR EACH ROW
WHEN (pg_trigger_depth() < 1) 
EXECUTE FUNCTION update_employee_break_time();

Ensure that each is created correctly
Lastly use postman and run Post on api/break to create a break and patch to close the break 
then use get to get all breaks and ensure total time is calculated

