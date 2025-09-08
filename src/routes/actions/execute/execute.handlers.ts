import postgres from "@/db/postgres/postgres";
import { action_device_roles, actions } from "@/db/postgres/schemas/actions/schema";
import { device_status, devices } from "@/db/postgres/schemas/devices/schema";
import { identifiers } from "@/db/postgres/schemas/identifiers/schema";
import { temporary_identifier_bearer_status, temporary_identifier_bearers, temporary_identifiers } from "@/db/postgres/schemas/identifiers/temporary/schema";
import { identifier_logs, temporary_identifier_logs } from "@/db/postgres/schemas/logs/schema";
import { users } from "@/db/postgres/schemas/users/schema";
import type { AppRouteHandler } from "@/lib/types";
import { and, asc, desc, eq, inArray } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import type { ExecuteActionRoute } from "./execute.routes";

const PEDESTRIAN_ACTIONS = [
  'PedestrianEntry',
  'PedestrianExit',
  'PedestrianEntryExit',
]


const VEHICLE_ACTIONS = [
  'VehicleEntry',
  'VehicleExit',
  'VehicleEntryExit',
]

const ENTRY_ACTIONS = [
  'PedestrianEntry',
  'PedestrianEntryExit',
  'VehicleEntry',
  'VehicleEntryExit',
]

const EXIT_ACTIONS = [
  'PedestrianExit',
  'PedestrianEntryExit',
  'VehicleExit',
  'VehicleEntryExit',
]

export const executeAction: AppRouteHandler<ExecuteActionRoute> = async (c) => {
  const action = c.req.valid("json");

  const [device] = await postgres
    .select({
      id: devices.id,
      role_id: devices.role_id,
    })
    .from(devices)
    .where(eq(devices.device_id, action.device_id))
    .orderBy(asc(devices.id))
    .limit(1);

  if (!device) {
    return c.json(
      {
        message: "Device not found",
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  const [deviceStatus] = await postgres
    .select({
      is_active: device_status.is_active,
    })
    .from(device_status)
    .where(eq(device_status.device_id, device.id))
    .orderBy(desc(device_status.id))
    .limit(1);

  if (!deviceStatus || !deviceStatus.is_active) {
    return c.json(
      {
        message: "Device is not active",
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  const deviceRoleActions = await postgres
    .select()
    .from(action_device_roles)
    .where(eq(action_device_roles.id, device.role_id));

  const deviceActions = await postgres
    .select()
    .from(actions)
    .where(inArray(actions.id, deviceRoleActions.map(dra => dra.action_id)))

  const deviceActionsNames = deviceActions.map(da => da.name);

  const deviceAllowsEntry = (ENTRY_ACTIONS.filter(item => deviceActionsNames.includes(item))).length > 0;
  const deviceAllowsExit = (EXIT_ACTIONS.filter(item => deviceActionsNames.includes(item))).length > 0;
  const deviceAllowsVehicle = (VEHICLE_ACTIONS.filter(item => deviceActionsNames.includes(item))).length > 0;
  // const deviceAllowsPedestrian = (PEDESTRIAN_ACTIONS.filter(item => deviceActionsNames.includes(item))).length > 0;

  const [identifier] = await postgres
    .select({
      id: identifiers.id,
      identifier_id: identifiers.identifier_id,
      user_id: identifiers.user_id,
      organization_id: identifiers.organization_id,
    })
    .from(identifiers)
    .where(eq(identifiers.factory_id, action.identifier_id))
    .orderBy(asc(identifiers.id))
    .limit(1);


  let canEntry = false;
  let canExit = false;
  let isPedestrian = false;
  let isVehicle = false;
  let isTemp = false;
  let userLastActionName = null;
  let temporaryIdentifierId = null;

  const allActions = await postgres.select().from(actions)
  const pedestrianActions = allActions.filter(a => PEDESTRIAN_ACTIONS.includes(a.name))
  const vehiclesActions = allActions.filter(a => VEHICLE_ACTIONS.includes(a.name))
  const PEDESTRIAN_ENTRY_ID = allActions.find(a => a.name == 'PedestrianEntry')!.id
  const PEDESTRIAN_EXIT_ID = allActions.find(a => a.name == 'PedestrianExit')!.id

  const VEHICLE_ENTRY_ID = allActions.find(a => a.name == 'VehicleEntry')!.id
  const VEHICLE_EXIT_ID = allActions.find(a => a.name == 'VehicleExit')!.id

  //! IDENTIFICADOR TEMPORAL
  if (!identifier) {
    c.var.logger.warn("Identifier %d not found", action.identifier_id)
    const [temporaryIdentifier] = await postgres
      .select({
        id: temporary_identifiers.id,
        temporary_identifier_id: temporary_identifiers.temporary_identifier_id,
      })
      .from(temporary_identifiers)
      .where(eq(temporary_identifiers.factory_id, action.identifier_id))
      .orderBy(asc(temporary_identifiers.id))
      .limit(1);

    if (!temporaryIdentifier) {
      return c.json(
        {
          message: "Identifier not found",
        },
        HttpStatusCodes.NOT_FOUND,
      );
    }

    const [temporaryIdentifierBearer] = await postgres
      .select({
        id: temporary_identifier_bearers.id,
        user_id: temporary_identifier_bearers.user_id,
        organization_id: temporary_identifier_bearers.organization_id,
        valid_from: temporary_identifier_bearers.valid_from,
        valid_to: temporary_identifier_bearers.valid_to,
      })
      .from(temporary_identifier_bearers)
      .where(eq(temporary_identifier_bearers.temporary_identifier_id, temporaryIdentifier.id))
      .orderBy(desc(temporary_identifier_bearers.id))
      .limit(1);

    if (!temporaryIdentifierBearer) {
      return c.json(
        {
          message: "Temporary Identifier Bearer not found",
        },
        HttpStatusCodes.NOT_FOUND,
      );
    }

    const now = new Date();

    if (temporaryIdentifierBearer.valid_from) {
      if (temporaryIdentifierBearer.valid_from > now) {
        return c.json(
          {
            message: "Temporary Identifier Bearer is not valid",
          },
          HttpStatusCodes.NOT_FOUND,
        );
      }
    }

    if (temporaryIdentifierBearer.valid_to < now) {
      return c.json(
        {
          message: "Temporary Identifier Bearer is not valid",
        },
        HttpStatusCodes.NOT_FOUND,
      );
    }

    const [temporaryIdentifierBearerStatus] = await postgres
      .select({
        is_active: temporary_identifier_bearer_status.is_active,
        created_by: temporary_identifier_bearer_status.created_by,
        created_at: temporary_identifier_bearer_status.created_at,
      })
      .from(temporary_identifier_bearer_status)
      .where(eq(temporary_identifier_bearer_status.temporary_identifier_bearer_id, temporaryIdentifierBearer.id))
      .orderBy(desc(temporary_identifier_bearer_status.id))
      .limit(1);

    if (!temporaryIdentifierBearerStatus || !temporaryIdentifierBearerStatus.is_active) {
      return c.json(
        {
          message: "Temporary Identifier Bearer is not active",
        },
        HttpStatusCodes.NOT_FOUND,
      );
    }

    //! ORGANIZATION

    const [userRole] = await postgres
      .select({
        lida_id: users.lida_id,
        role_id: users.role_id,
      })
      .from(users)
      .where(eq(users.id, temporaryIdentifierBearer.user_id))
      .orderBy(desc(users.id))
      .limit(1);

    const userRoleActions = await postgres
      .select()
      .from(action_device_roles)
      .where(eq(action_device_roles.id, userRole.role_id));

    const userActions = await postgres
      .select()
      .from(actions)
      .where(inArray(actions.id, userRoleActions.map(ura => ura.action_id)))

    const userActionsNames = userActions.map(ua => ua.name);

    canEntry = (ENTRY_ACTIONS.filter(item => userActionsNames.includes(item))).length > 0;
    canExit = (EXIT_ACTIONS.filter(item => userActionsNames.includes(item))).length > 0;
    isPedestrian = (PEDESTRIAN_ACTIONS.filter(item => userActionsNames.includes(item))).length > 0;
    isVehicle = (VEHICLE_ACTIONS.filter(item => userActionsNames.includes(item))).length > 0;
    isTemp = true;
    temporaryIdentifierId = temporaryIdentifierBearer.id

    const tempUserLastActions = await postgres
      .select({
        device_id: identifier_logs.device_id,
        action_id: identifier_logs.action_id,
      })
      .from(temporary_identifier_logs)
      .where(
        and(
          eq(temporary_identifier_logs.temporary_identifier_bearer_id, temporaryIdentifierBearer.id),
          inArray(temporary_identifier_logs.action_id,
            !deviceAllowsVehicle ? pedestrianActions.map(a => a.id) : vehiclesActions.map(a => a.id)
          )
        )
      )
      .orderBy(desc(identifier_logs.id))
      .limit(1);

    const tempUserLastAction = tempUserLastActions.length > 0 ? tempUserLastActions[0] : null

    userLastActionName = tempUserLastAction ? allActions.find(a => a.id == tempUserLastAction?.action_id)?.name : null
  } else {
    //! IDENTIFICADOR PERMANENT
    const [userRole] = await postgres
      .select({
        lida_id: users.lida_id,
        role_id: users.role_id,
      })
      .from(users)
      .where(eq(users.id, identifier.user_id))
      .orderBy(asc(users.id))
      .limit(1);

    const userRoleActions = await postgres
      .select()
      .from(action_device_roles)
      .where(eq(action_device_roles.id, userRole.role_id));

    const userActions = await postgres
      .select()
      .from(actions)
      .where(inArray(actions.id, userRoleActions.map(ura => ura.action_id)))

    const userActionsNames = userActions.map(ua => ua.name);

    canEntry = (ENTRY_ACTIONS.filter(item => userActionsNames.includes(item))).length > 0;
    canExit = (EXIT_ACTIONS.filter(item => userActionsNames.includes(item))).length > 0;
    isPedestrian = (PEDESTRIAN_ACTIONS.filter(item => userActionsNames.includes(item))).length > 0;
    isVehicle = (VEHICLE_ACTIONS.filter(item => userActionsNames.includes(item))).length > 0;

    const userLastActions = await postgres
      .select({
        device_id: identifier_logs.device_id,
        action_id: identifier_logs.action_id,
      })
      .from(identifier_logs)
      .where(and(
        eq(identifier_logs.identifier_id, identifier.id),
        inArray(identifier_logs.action_id,
          !deviceAllowsVehicle ? pedestrianActions.map(a => a.id) : vehiclesActions.map(a => a.id)
        )
      ))
      .orderBy(desc(identifier_logs.id))
      .limit(1);

    const userLastAction = userLastActions.length > 0 ? userLastActions[0] : null

    userLastActionName = userLastAction ? allActions.find(a => a.id == userLastAction?.action_id)?.name : null
  }

  const isEntry = !userLastActionName || EXIT_ACTIONS.includes(userLastActionName)

  // !ES UNA ENTRADA
  if (isEntry) {
    if (canEntry && !deviceAllowsEntry) {
      return c.json(
        {
          message: "Action not allowed - Entry not allowed",
        },
        HttpStatusCodes.NOT_FOUND,
      );
    }
  } else {
    // !ES UNA SALIDA
    if (canExit && !deviceAllowsExit) {
      return c.json(
        {
          message: "Action not allowed - Exit not allowed",
        },
        HttpStatusCodes.NOT_FOUND,
      );
    }
  }

  // !ES VEHICULAR
  if (!deviceAllowsVehicle) {
    if (!isVehicle) {
      return c.json(
        {
          message: "Action not allowed - Vehicle not allowed",
        },
        HttpStatusCodes.NOT_FOUND,
      );
    }
  } else {
    // !ES PEATONAL
    if (!isPedestrian) {
      return c.json(
        {
          message: "Action not allowed - Pedestrian not allowed",
        },
        HttpStatusCodes.NOT_FOUND,
      );
    }
  }


  // SE SUPONE QUE YA SABES QUE EL USUARIO PUEDE HACER EL REGISTRO QUE VAYA A HACER

  const actionId = isEntry
    ? (deviceAllowsVehicle ? VEHICLE_ENTRY_ID : PEDESTRIAN_ENTRY_ID)
    : (deviceAllowsVehicle ? VEHICLE_EXIT_ID : PEDESTRIAN_EXIT_ID);

  if (isTemp) {
    const [insertedAction] = await postgres
      .insert(temporary_identifier_logs)
      .values({
        temporary_identifier_bearer_id: temporaryIdentifierId!,
        device_id: device.id,
        action_id: actionId,
      })
      .returning();
    return c.json(insertedAction, HttpStatusCodes.OK);
  }
  const [insertedAction] = await postgres
    .insert(identifier_logs)
    .values({
      identifier_id: identifier.id!,
      device_id: device.id,
      action_id: actionId,
    })
    .returning();
  return c.json(insertedAction, HttpStatusCodes.OK);
};
