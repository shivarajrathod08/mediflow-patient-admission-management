-- V2__seed_reference_data.sql
-- Seed Departments
INSERT INTO departments (name, code) VALUES
('Cardiology', 'CARD'),
('Intensive Care', 'ICU'),
('Orthopedics', 'ORTHO'),
('Neurology', 'NEURO'),
('Pulmonology', 'PULM'),
('Internal Medicine', 'INTMED'),
('Pediatrics', 'PED'),
('Emergency', 'EMERG')
ON CONFLICT (name) DO NOTHING;

-- Seed Wards
INSERT INTO wards (name, code, capacity) VALUES
('Ward 4B - Cardiology', 'W4B', 30),
('ICU - Bay 02', 'ICU02', 20),
('Ward 2A - Orthopedics', 'W2A', 25),
('Ward 5C - Neurology', 'W5C', 25),
('Ward 3A - Pulmonology', 'W3A', 25),
('Ward 1B - General', 'W1B', 35)
ON CONFLICT (name) DO NOTHING;

-- Seed Doctors
INSERT INTO doctors (name, department_id, specialization) VALUES
('Dr. Sarah Jenkins', (SELECT id FROM departments WHERE name = 'Cardiology'), 'Chief Cardiologist'),
('Dr. Alexander Vance', (SELECT id FROM departments WHERE name = 'Intensive Care'), 'Intensivist / Trauma Specialist'),
('Dr. Helena Thorne', (SELECT id FROM departments WHERE name = 'Orthopedics'), 'Orthopedic Surgeon'),
('Dr. Michael Zhao', (SELECT id FROM departments WHERE name = 'Neurology'), 'Consultant Neurologist'),
('Dr. Lucia Martinez', (SELECT id FROM departments WHERE name = 'Pulmonology'), 'Pulmonary Specialist'),
('Dr. Kiran Patel', (SELECT id FROM departments WHERE name = 'Internal Medicine'), 'Senior Physician'),
('Dr. Emily Watson', (SELECT id FROM departments WHERE name = 'Pediatrics'), 'Pediatric Care Specialist'),
('Dr. David Ross', (SELECT id FROM departments WHERE name = 'Emergency'), 'Emergency Medicine Lead');

-- Seed Initial Realistic Patients for Demo Demonstration
INSERT INTO patients (patient_code, name, age, gender, ward_id, department_id, doctor_id, admission_date, status, diagnosis) VALUES
('PAT-1001', 'Eleanor Vance', 54, 'Female',
    (SELECT id FROM wards WHERE name = 'Ward 4B - Cardiology'),
    (SELECT id FROM departments WHERE name = 'Cardiology'),
    (SELECT id FROM doctors WHERE name = 'Dr. Sarah Jenkins'),
    CURRENT_DATE, 'ADMITTED', 'Acute Coronary Syndrome'),

('PAT-1002', 'Marcus Aurel Chen', 42, 'Male',
    (SELECT id FROM wards WHERE name = 'ICU - Bay 02'),
    (SELECT id FROM departments WHERE name = 'Intensive Care'),
    (SELECT id FROM doctors WHERE name = 'Dr. Alexander Vance'),
    CURRENT_DATE - INTERVAL '1 day', 'ADMITTED', 'Polytrauma Stabilization'),

('PAT-1003', 'Sophia Alverez', 67, 'Female',
    (SELECT id FROM wards WHERE name = 'Ward 2A - Orthopedics'),
    (SELECT id FROM departments WHERE name = 'Orthopedics'),
    (SELECT id FROM doctors WHERE name = 'Dr. Helena Thorne'),
    CURRENT_DATE - INTERVAL '3 days', 'ADMITTED', 'Post-op Hip Arthroplasty'),

('PAT-1004', 'David K. O Reilly', 59, 'Male',
    (SELECT id FROM wards WHERE name = 'Ward 3A - Pulmonology'),
    (SELECT id FROM departments WHERE name = 'Pulmonology'),
    (SELECT id FROM doctors WHERE name = 'Dr. Lucia Martinez'),
    CURRENT_DATE - INTERVAL '6 days', 'DISCHARGED', 'Chronic Bronchitis Flare'),

('PAT-1005', 'Amina Yusuf', 38, 'Female',
    (SELECT id FROM wards WHERE name = 'Ward 5C - Neurology'),
    (SELECT id FROM departments WHERE name = 'Neurology'),
    (SELECT id FROM doctors WHERE name = 'Dr. Michael Zhao'),
    CURRENT_DATE - INTERVAL '2 days', 'ADMITTED', 'Transient Ischemic Attack'),

('PAT-1006', 'Robert Sterling', 71, 'Male',
    (SELECT id FROM wards WHERE name = 'Ward 1B - General'),
    (SELECT id FROM departments WHERE name = 'Internal Medicine'),
    (SELECT id FROM doctors WHERE name = 'Dr. Kiran Patel'),
    CURRENT_DATE, 'ADMITTED', 'Hypertensive Crisis & Observation'),

('PAT-1007', 'Katherine Lee', 29, 'Female',
    (SELECT id FROM wards WHERE name = 'Ward 4B - Cardiology'),
    (SELECT id FROM departments WHERE name = 'Cardiology'),
    (SELECT id FROM doctors WHERE name = 'Dr. Sarah Jenkins'),
    CURRENT_DATE - INTERVAL '4 days', 'DISCHARGED', 'Supraventricular Tachycardia'),

('PAT-1008', 'James Thorne', 48, 'Male',
    (SELECT id FROM wards WHERE name = 'Ward 2A - Orthopedics'),
    (SELECT id FROM departments WHERE name = 'Orthopedics'),
    (SELECT id FROM doctors WHERE name = 'Dr. Helena Thorne'),
    CURRENT_DATE - INTERVAL '1 day', 'ADMITTED', 'Tibial Fracture Repair');
