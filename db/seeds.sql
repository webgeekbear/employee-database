INSERT INTO department (name)
VALUES
  ('Software Development'),
  ('Human Resources'),
  ('Marketing'),
  ('Quality Assurance');

INSERT INTO role(title, salary, department_id)
VALUES
  ('Manager', 90000.00, 1),
  ('Programmer', 70000.00, 1),
  ('Director', 80000.00, 2),
  ('Executive Assistant', 35000.00, 2),
  ('Manager', 55000.00, 3),
  ('Marketer', 40000.00, 3),
  ('Manager', 80000.00, 4),
  ('Tester', 60000.00, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
  ('David', 'Dorango', 1, NULL),
  ('Rosanne', 'Roxbery', 2, 1),
  ('Ishmael', 'Jones', 3, NULL),
  ('Rika', 'Rotsma', 4, 3),
  ('Kelly', 'Axup', 5, NULL),
  ('Bill', 'Malley', 6, 5),
  ('Denise', 'Crosby', 7, NULL),
  ('Stephen', 'Stills', 8, 7);