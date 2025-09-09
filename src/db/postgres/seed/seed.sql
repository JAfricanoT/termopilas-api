INSERT INTO "user_roles" ("name", "description") VALUES('SuperAdmin', 'Control total');
INSERT INTO "users" ("lida_id", "role_id") VALUES('JaAT10-pq2AaOK', 1);
INSERT INTO "user_information" ("user_id", "username", "name", "last_name", "identity_number") VALUES(1, 'JAfricanoT', 'Joséfrancisco', 'Africano', 26581850);
INSERT INTO "user_status" ("user_id", "is_active", "created_by") VALUES(1, true, 1);
INSERT INTO "user_role_status" ("user_role_id", "is_active", "created_by") VALUES(1, true, 1);

INSERT INTO "user_roles" ("name", "description") VALUES('Admin', 'Control limitado');
INSERT INTO "user_role_status" ("user_role_id", "is_active", "created_by") VALUES(2, true, 1);

INSERT INTO "user_roles" ("name", "description") VALUES('User', 'Usuario normal');
INSERT INTO "user_role_status" ("user_role_id", "is_active", "created_by") VALUES(3, true, 1);

INSERT INTO "users" ("lida_id", "role_id") VALUES('8N0w8gxOrtszGB', 2);
INSERT INTO "user_information" ("user_id", "username", "name", "last_name", "identity_number") VALUES(2, 'GLopez', 'Gustavo', 'López', 22408940);
INSERT INTO "user_status" ("user_id", "is_active", "created_by") VALUES(2, true, 1);

INSERT INTO "users" ("lida_id", "role_id") VALUES('AgUOAV3B9EAqd1', 3);
INSERT INTO "user_information" ("user_id", "username", "name", "last_name", "identity_number") VALUES(3, 'SLeon', 'Susan', 'León', 14049987);
INSERT INTO "user_status" ("user_id", "is_active", "created_by") VALUES(3, true, 1);

INSERT INTO "users" ("lida_id", "role_id") VALUES('tmKuCxeI64ayjo', 3);
INSERT INTO "user_information" ("user_id", "username", "name", "last_name", "identity_number") VALUES(4, 'JMiranda', 'José', 'Miranda', 14049987);
INSERT INTO "user_status" ("user_id", "is_active", "created_by") VALUES(4, true, 1);

INSERT INTO "users" ("lida_id", "role_id") VALUES('598jzerM4oO0y2', 3);
INSERT INTO "user_information" ("user_id", "username", "name", "last_name", "identity_number") VALUES(5, 'ARodriguez', 'Argenis', 'Rodriguez', 14049987);
INSERT INTO "user_status" ("user_id", "is_active", "created_by") VALUES(5, true, 1);

INSERT INTO "users" ("lida_id", "role_id") VALUES('LutF5ifoPJeKGA', 3);
INSERT INTO "user_information" ("user_id", "username", "name", "last_name", "identity_number") VALUES(6, 'ASalazar', 'Andrés', 'Salazar', 1000000);
INSERT INTO "user_status" ("user_id", "is_active", "created_by") VALUES(6, true, 1);

INSERT INTO "users" ("lida_id", "role_id") VALUES('AGOKxFAJ-9gJg3', 3);
INSERT INTO "user_information" ("user_id", "username", "name", "last_name", "identity_number") VALUES(7, 'CMendez', 'Carolina', 'Méndez', 1000001);
INSERT INTO "user_status" ("user_id", "is_active", "created_by") VALUES(7, true, 1);

INSERT INTO "users" ("lida_id", "role_id") VALUES('uEmMlzAXPc0QBJ', 3);
INSERT INTO "user_information" ("user_id", "username", "name", "last_name", "identity_number") VALUES(8, 'CMendezC', 'Carlos', 'Méndez', 1000002);
INSERT INTO "user_status" ("user_id", "is_active", "created_by") VALUES(8, true, 1);

INSERT INTO "organizations" ("organization_id", "name", "created_by") VALUES('LIDA-hPlI_7723', 'LIDA', 1);
INSERT INTO "organization_status" ("organization_id", "is_active", "created_by") VALUES(1, true, 1);

INSERT INTO "identifiers" ("identifier_id","factory_id", "user_id", "organization_id", "created_by") VALUES('LIDA-MtiD_7723', 'F3B40E0E', 1, 1, 1);
INSERT INTO "identifier_status" ("identifier_id", "is_active", "created_by") VALUES(1, true, 1);

INSERT INTO "identifiers" ("identifier_id","factory_id", "user_id", "organization_id", "created_by") VALUES('295qjRKHCYQrdR', '711CD845', 3, 1, 1);
INSERT INTO "identifier_status" ("identifier_id", "is_active", "created_by") VALUES(2, true, 1);

INSERT INTO "identifiers" ("identifier_id","factory_id", "user_id", "organization_id", "created_by") VALUES('guCsbTP1aIJi4s', '70538C55', 4, 1, 1);
INSERT INTO "identifier_status" ("identifier_id", "is_active", "created_by") VALUES(3, true, 1);

INSERT INTO "identifiers" ("identifier_id","factory_id", "user_id", "organization_id", "created_by") VALUES('d9OdEQ7iUlWLun', '52FE2D51', 5, 1, 1);
INSERT INTO "identifier_status" ("identifier_id", "is_active", "created_by") VALUES(4, true, 1);

INSERT INTO "temporary_identifiers" ("temporary_identifier_id","factory_id", "created_by") VALUES('AAYj5_9iBgwF1M2', '6BE3ADAF', 1);
INSERT INTO "temporary_identifier_bearers" ("temporary_identifier_id", "user_id", "organization_id", "valid_from", "valid_to", "created_by") VALUES(1, 2, 1, NOW(), '2777-07-07 07:07:07.77777', 1);
INSERT INTO "temporary_identifier_bearer_status" ("temporary_identifier_bearer_id", "is_active", "created_by") VALUES(1, true, 1);

INSERT INTO "temporary_identifiers" ("temporary_identifier_id","factory_id", "created_by") VALUES('Xm96zsRovXecZ6', '0B80B2AF', 1);
INSERT INTO "temporary_identifier_bearers" ("temporary_identifier_id", "user_id", "organization_id", "valid_from", "valid_to", "created_by") VALUES(2, 6, 1, NOW(), '2025-10-10 23:59:59.59', 1);
INSERT INTO "temporary_identifier_bearer_status" ("temporary_identifier_bearer_id", "is_active", "created_by") VALUES(2, true, 1);

INSERT INTO "temporary_identifiers" ("temporary_identifier_id","factory_id", "created_by") VALUES('fv8ptrZFHGabo9', 'CBA5303E', 1);
INSERT INTO "temporary_identifier_bearers" ("temporary_identifier_id", "user_id", "organization_id", "valid_from", "valid_to", "created_by") VALUES(3, 7, 1, NOW(), '2025-10-10 23:59:59.59', 1);
INSERT INTO "temporary_identifier_bearer_status" ("temporary_identifier_bearer_id", "is_active", "created_by") VALUES(3, true, 1);

INSERT INTO "device_roles" ("name", "description", "created_by") VALUES('PedestrianEntry', 'Modulo de acceso peatonal', 1);
INSERT INTO "device_role_status" ("device_role_id", "is_active", "created_by") VALUES(1, true, 1);

INSERT INTO "device_roles" ("name", "description", "created_by") VALUES('VehicleEntry', 'Modulo de acceso vehicular', 1);
INSERT INTO "device_role_status" ("device_role_id", "is_active", "created_by") VALUES(2, true, 1);

INSERT INTO "devices" ("device_id", "token", "role_id") VALUES('0uGkjBlJH8O4RT', '0lisikmL24Bf5Oem6CZj9quNqOuHjVdw1', 1);
INSERT INTO "device_status" ("device_id", "is_active", "created_by") VALUES(1, true, 1);

INSERT INTO "devices" ("device_id", "token", "role_id") VALUES('L1d4o0KFaqDNqK', '77kij3gBPseRae9In-tkaPFUbXbqAUDp', 1);
INSERT INTO "device_status" ("device_id", "is_active", "created_by") VALUES(2, true, 1);

INSERT INTO "devices" ("device_id", "token", "role_id") VALUES('o3np4DnQ1h0Dps', '_fAEu5le32d-m4iqrZNimx719RFBPc8n', 1);
INSERT INTO "device_status" ("device_id", "is_active", "created_by") VALUES(3, true, 1);

INSERT INTO "actions" ("name", "description", "created_by") VALUES('PedestrianEntry', 'Entrada peatonal', 1);
INSERT INTO "action_status" ("action_id", "is_active", "created_by") VALUES(1, true, 1);

INSERT INTO "actions" ("name", "description", "created_by") VALUES('PedestrianExit', 'Salida peatonal', 1);
INSERT INTO "action_status" ("action_id", "is_active", "created_by") VALUES(2, true, 1);

INSERT INTO "actions" ("name", "description", "created_by") VALUES('PedestrianEntryExit', 'Entrada y Salida peatonal', 1);
INSERT INTO "action_status" ("action_id", "is_active", "created_by") VALUES(3, true, 1);

INSERT INTO "actions" ("name", "description", "created_by") VALUES('VehicleEntry', 'Entrada vehicular', 1);
INSERT INTO "action_status" ("action_id", "is_active", "created_by") VALUES(4, true, 1);

INSERT INTO "actions" ("name", "description", "created_by") VALUES('VehicleExit', 'Salida vehicular', 1);
INSERT INTO "action_status" ("action_id", "is_active", "created_by") VALUES(5, true, 1);

INSERT INTO "actions" ("name", "description", "created_by") VALUES('VehicleEntryExit', 'Entrada y Salida vehicular', 1);
INSERT INTO "action_status" ("action_id", "is_active", "created_by") VALUES(6, true, 1);

INSERT INTO "action_device_roles" ("action_id", "device_role_id", "is_active", "created_by") VALUES(1, 1,  true, 1);
INSERT INTO "action_device_roles" ("action_id", "device_role_id", "is_active", "created_by") VALUES(2, 1,  true, 1);
INSERT INTO "action_device_roles" ("action_id", "device_role_id", "is_active", "created_by") VALUES(3, 1,  true, 1);
INSERT INTO "action_device_roles" ("action_id", "device_role_id", "is_active", "created_by") VALUES(4, 2,  true, 1);
INSERT INTO "action_device_roles" ("action_id", "device_role_id", "is_active", "created_by") VALUES(5, 2,  true, 1);
INSERT INTO "action_device_roles" ("action_id", "device_role_id", "is_active", "created_by") VALUES(6, 2,  true, 1);

INSERT INTO "action_user_roles" ("action_id", "user_role_id", "is_active", "created_by") VALUES(1, 1,  true, 1);
INSERT INTO "action_user_roles" ("action_id", "user_role_id", "is_active", "created_by") VALUES(1, 2,  true, 1);
INSERT INTO "action_user_roles" ("action_id", "user_role_id", "is_active", "created_by") VALUES(1, 3,  true, 1);
INSERT INTO "action_user_roles" ("action_id", "user_role_id", "is_active", "created_by") VALUES(2, 1,  true, 1);
INSERT INTO "action_user_roles" ("action_id", "user_role_id", "is_active", "created_by") VALUES(2, 2,  true, 1);
INSERT INTO "action_user_roles" ("action_id", "user_role_id", "is_active", "created_by") VALUES(2, 3,  true, 1);
INSERT INTO "action_user_roles" ("action_id", "user_role_id", "is_active", "created_by") VALUES(4, 1,  true, 1);
INSERT INTO "action_user_roles" ("action_id", "user_role_id", "is_active", "created_by") VALUES(4, 2,  true, 1);
INSERT INTO "action_user_roles" ("action_id", "user_role_id", "is_active", "created_by") VALUES(4, 3,  true, 1);
INSERT INTO "action_user_roles" ("action_id", "user_role_id", "is_active", "created_by") VALUES(5, 1,  true, 1);
INSERT INTO "action_user_roles" ("action_id", "user_role_id", "is_active", "created_by") VALUES(5, 2,  true, 1);
INSERT INTO "action_user_roles" ("action_id", "user_role_id", "is_active", "created_by") VALUES(5, 3,  true, 1);

INSERT INTO "device_action_mode" ("device_id", "action_id", "created_by") VALUES(1, 3, 1);
INSERT INTO "device_action_mode" ("device_id", "action_id", "created_by") VALUES(2, 1, 1);
INSERT INTO "device_action_mode" ("device_id", "action_id", "created_by") VALUES(3, 2, 1);


INSERT INTO "gates" ("name", "description", "created_by") VALUES('Puerta Principal', 'Entrada Principal', 1);
INSERT INTO "gates" ("name", "description", "created_by") VALUES('Puerta Sur', 'Entrada de Odontologia', 1);
INSERT INTO "gates" ("name", "description", "created_by") VALUES('Puerta Norte', 'Entrada Estacionamiento', 1);

INSERT INTO "gate_status" ("gate_id", "is_active", "created_by") VALUES(1, true, 1);
INSERT INTO "gate_status" ("gate_id", "is_active", "created_by") VALUES(2, true, 1);
INSERT INTO "gate_status" ("gate_id", "is_active", "created_by") VALUES(3, true, 1);

INSERT INTO "gate_devices" ("gate_id", "device_id", "created_by") VALUES(1, 1, 1);
INSERT INTO "gate_devices" ("gate_id", "device_id", "created_by") VALUES(1, 2, 1);
INSERT INTO "gate_devices" ("gate_id", "device_id", "created_by") VALUES(1, 3, 1);

INSERT INTO "gate_device_status" ("gate_device_id", "is_active", "created_by") VALUES(1, true, 1);
INSERT INTO "gate_device_status" ("gate_device_id", "is_active", "created_by") VALUES(2, true, 1);
INSERT INTO "gate_device_status" ("gate_device_id", "is_active", "created_by") VALUES(3, true, 1);

INSERT INTO "errors" ("name", "description", "created_by") VALUES('Identificacion no es válida', 'Identificacion no es válida', 1); -- 1
INSERT INTO "errors" ("name", "description", "created_by") VALUES('Identificacion Temporal no está activa', 'Identificacion Temporal no está activa', 1); -- 2
INSERT INTO "errors" ("name", "description", "created_by") VALUES('Identificacion Temporal no es válida', 'Identificacion Temporal no es válida', 1); -- 3
INSERT INTO "errors" ("name", "description", "created_by") VALUES('Identificacion entrada no permitida', 'Identificacion entrada no permitida', 1); -- 4
INSERT INTO "errors" ("name", "description", "created_by") VALUES('Identificacion salida no permitida', 'Identificacion salida no permitida', 1); -- 5
INSERT INTO "errors" ("name", "description", "created_by") VALUES('Identificacion Temporal entrada no permitida', 'Identificacion Temporal entrada no permitida', 1); -- 6
INSERT INTO "errors" ("name", "description", "created_by") VALUES('Identificacion Temporal salida no permitida', 'Identificacion Temporal salida no permitida', 1); -- 7
INSERT INTO "errors" ("name", "description", "created_by") VALUES('Identificacion peatonal no permitido', 'Identificacion peatonal no permitido', 1); -- 8
INSERT INTO "errors" ("name", "description", "created_by") VALUES('Identificacion vehicular no permitido', 'Identificacion vehicular no permitido', 1); -- 9
INSERT INTO "errors" ("name", "description", "created_by") VALUES('Identificacion Temporal peatonal no permitido', 'Identificacion Temporal peatonal no permitido', 1); -- 10
INSERT INTO "errors" ("name", "description", "created_by") VALUES('Identificacion Temporal vehicular no permitido', 'Identificacion Temporal vehicular no permitido', 1); -- 11
INSERT INTO "errors" ("name", "description", "created_by") VALUES('Identificador está en imcumplimineto', 'Identificacion está en imcumplimineto', 1); -- 12
INSERT INTO "errors" ("name", "description", "created_by") VALUES('Identificador Temporal está en imcumplimineto', 'Identificacion Temporal está en imcumplimineto', 1); -- 13
