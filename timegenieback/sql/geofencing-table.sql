CREATE TABLE Geofence (
    geofence_id SERIAL PRIMARY KEY,
    employee_id uuid REFERENCES Employee(emp_id),
    geolocation POINT NOT NULL,
    radius INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
)