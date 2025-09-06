INSERT INTO "user_roles" ("name", "description") VALUES('SuperAdmin', 'Control total');
INSERT INTO "users" ("lida_id", "role_id") VALUES('JaAT10-pq2AaOK', 1);
INSERT INTO "user_status" ("user_id", "is_active", "created_by") VALUES(1, true, 1);
INSERT INTO "user_role_status" ("user_role_id", "is_active", "created_by") VALUES(1, true, 1);

INSERT INTO "user_roles" ("name", "description") VALUES('Admin', 'Control limitado');
INSERT INTO "user_role_status" ("user_role_id", "is_active", "created_by") VALUES(2, true, 1);

INSERT INTO "user_roles" ("name", "description") VALUES('User', 'Usuario normal');
INSERT INTO "user_role_status" ("user_role_id", "is_active", "created_by") VALUES(3, true, 1);

INSERT INTO "organizations" ("organization_id", "name", "created_by") VALUES('LIDA-hPlI_7723', 'LIDA', 1);
INSERT INTO "organization_status" ("organization_id", "is_active", "created_by") VALUES(1, true, 1);

INSERT INTO "identifiers" ("identifier_id","factory_id", "user_id", "organization_id", "created_by") VALUES('LIDA-MtiD_7723', 'F3B40E0E', 1, 1, 1);
INSERT INTO "identifier_status" ("identifier_id", "is_active", "created_by") VALUES(1, true, 1);

INSERT INTO "temporary_identifiers" ("temporary_identifier_id","factory_id", "created_by") VALUES('AAYj5_9iBgwF1M2', '6BE3ADAF', 1);
INSERT INTO "temporary_identifier_bearers" ("temporary_identifier_id", "user_id", "organization_id", "valid_from", "valid_to", "created_by") VALUES(1, 1, 1, NOW(), '2777-07-07 07:07:07.77777', 1);
INSERT INTO "temporary_identifier_bearer_status" ("temporary_identifier_bearer_id", "is_active", "created_by") VALUES(1, true, 1);

INSERT INTO "device_roles" ("name", "description", "created_by") VALUES('PedestrianEntry', 'Modulo de acceso peatonal', 1);
INSERT INTO "device_role_status" ("device_role_id", "is_active", "created_by") VALUES(1, true, 1);

INSERT INTO "device_roles" ("name", "description", "created_by") VALUES('VehicleEntry', 'Modulo de acceso vehicular', 1);
INSERT INTO "device_role_status" ("device_role_id", "is_active", "created_by") VALUES(2, true, 1);

INSERT INTO "devices" ("device_id", "token", "role_id") VALUES('0uGkjBlJH8O4RT', '0lisikmL24Bf5Oem6CZj9quNqOuHjVdw1', 1);
INSERT INTO "device_status" ("device_id", "is_active", "created_by") VALUES(1, true, 1);

INSERT INTO "actions" ("name", "description", "created_by") VALUES('PedestrianEntry', 'Entrada peatonal', 1);
INSERT INTO "action_status" ("action_id", "is_active", "created_by") VALUES(1, true, 1);

INSERT INTO "actions" ("name", "description", "created_by") VALUES('PedestrianExit', 'Salida peatonal', 1);
INSERT INTO "action_status" ("action_id", "is_active", "created_by") VALUES(2, true, 1);

INSERT INTO "actions" ("name", "description", "created_by") VALUES('VehicleEntry', 'Entrada vehicular', 1);
INSERT INTO "action_status" ("action_id", "is_active", "created_by") VALUES(3, true, 1);

INSERT INTO "actions" ("name", "description", "created_by") VALUES('VehicleExit', 'Salida vehicular', 1);
INSERT INTO "action_status" ("action_id", "is_active", "created_by") VALUES(4, true, 1);

INSERT INTO "action_roles" ("action_id", "device_role_id", "user_role_id", "is_active", "created_by") VALUES(1, 1, 1, true, 1);
INSERT INTO "action_roles" ("action_id", "device_role_id", "user_role_id", "is_active", "created_by") VALUES(1, 1, 2, true, 1);
INSERT INTO "action_roles" ("action_id", "device_role_id", "user_role_id", "is_active", "created_by") VALUES(1, 1, 3, true, 1);
INSERT INTO "action_roles" ("action_id", "device_role_id", "user_role_id", "is_active", "created_by") VALUES(2, 1, 1, true, 1);
INSERT INTO "action_roles" ("action_id", "device_role_id", "user_role_id", "is_active", "created_by") VALUES(2, 1, 2, true, 1);
INSERT INTO "action_roles" ("action_id", "device_role_id", "user_role_id", "is_active", "created_by") VALUES(2, 1, 3, true, 1);
INSERT INTO "action_roles" ("action_id", "device_role_id", "user_role_id", "is_active", "created_by") VALUES(3, 2, 1, true, 1);
INSERT INTO "action_roles" ("action_id", "device_role_id", "user_role_id", "is_active", "created_by") VALUES(3, 2, 2, true, 1);
INSERT INTO "action_roles" ("action_id", "device_role_id", "user_role_id", "is_active", "created_by") VALUES(3, 2, 3, true, 1);
INSERT INTO "action_roles" ("action_id", "device_role_id", "user_role_id", "is_active", "created_by") VALUES(4, 2, 1, true, 1);
INSERT INTO "action_roles" ("action_id", "device_role_id", "user_role_id", "is_active", "created_by") VALUES(4, 2, 2, true, 1);
INSERT INTO "action_roles" ("action_id", "device_role_id", "user_role_id", "is_active", "created_by") VALUES(4, 2, 3, true, 1);