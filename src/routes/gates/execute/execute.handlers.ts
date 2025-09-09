import postgres from "@/db/postgres/postgres";
import { action_device_roles, actions } from "@/db/postgres/schemas/actions/schema";
import { defaulting } from "@/db/postgres/schemas/defaulting/schema";
import { device_action_mode, device_status, devices } from "@/db/postgres/schemas/devices/schema";
import { identifier_errors, temporary_identifier_errors } from "@/db/postgres/schemas/errors/schema";
import { identifiers } from "@/db/postgres/schemas/identifiers/schema";
import { temporary_identifier_bearer_status, temporary_identifier_bearers, temporary_identifiers } from "@/db/postgres/schemas/identifiers/temporary/schema";
import { identifier_logs, temporary_identifier_logs } from "@/db/postgres/schemas/logs/schema";
import { user_information, users } from "@/db/postgres/schemas/users/schema";
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
  console.log("");
  console.log("");
  console.log("");
  console.log("__________");
  console.log("Action:", action);

  const [device] = await postgres
    .select({
      id: devices.id,
      role_id: devices.role_id,
    })
    .from(devices)
    .where(eq(devices.device_id, action.device_id))
    .orderBy(asc(devices.id))
    .limit(1);

  console.log("Device:", device);

  if (!device) {
    c.var.logger.warn("Device %d not found", action.device_id)
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

  const deviceActionMode = await postgres
    .select()
    .from(device_action_mode)
    .where(eq(device_action_mode.device_id, device.id));

  const deviceActions = await postgres
    .select()
    .from(actions)
    .where(inArray(actions.id, deviceActionMode.map(dra => dra.action_id)))

  const deviceActionModesNames = deviceActions.map(da => da.name);

  console.log("Device Action Mode:", deviceActionModesNames);

  // const deviceRoleActions = await postgres
  //   .select()
  //   .from(action_device_roles)
  //   .where(eq(action_device_roles.id, device.role_id));

  // const deviceActions = await postgres
  //   .select()
  //   .from(actions)
  //   .where(inArray(actions.id, deviceRoleActions.map(dra => dra.action_id)))

  // const deviceActionsNames = deviceActions.map(da => da.name);

  console.log("")
  console.log("")
  console.log("")
  console.log("Device Allows Entry:", ENTRY_ACTIONS.filter(item => deviceActionModesNames.includes(item)))
  console.log("Device Allows Exit:", EXIT_ACTIONS.filter(item => deviceActionModesNames.includes(item)))
  console.log("Device Allows Vehicle:", VEHICLE_ACTIONS.filter(item => deviceActionModesNames.includes(item)))
  console.log("")
  console.log("")
  console.log("")

  const deviceAllowsEntry = (ENTRY_ACTIONS.filter(item => deviceActionModesNames.includes(item))).length > 0;
  const deviceAllowsExit = (EXIT_ACTIONS.filter(item => deviceActionModesNames.includes(item))).length > 0;
  const deviceAllowsVehicle = (VEHICLE_ACTIONS.filter(item => deviceActionModesNames.includes(item))).length > 0;
  // const deviceAllowsPedestrian = (PEDESTRIAN_ACTIONS.filter(item => deviceActionsNames.includes(item))).length > 0;

  console.log("")
  console.log("")
  console.log("")
  console.log("Device Allows Entry:", deviceAllowsEntry)
  console.log("Device Allows Exit:", deviceAllowsExit)
  console.log("Device Allows Vehicle:", deviceAllowsVehicle)
  console.log("")
  console.log("")
  console.log("")

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

  console.log("Identifier:", identifier);

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
    c.var.logger.info("Identifier %d not found", action.identifier_id)
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
      c.var.logger.info("Temporary Identifier %d not found", action.identifier_id)
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
      c.var.logger.info("Temporary Identifier Bearer for %d not found", action.identifier_id)
      return c.json(
        {
          message: "Temporary Identifier Bearer not found",
        },
        HttpStatusCodes.NOT_FOUND,
      );
    }

    const [userPID] = await postgres
    .select({
      identity_number: user_information.identity_number,
    })
    .from(user_information)
    .where(eq(user_information.user_id, temporaryIdentifierBearer.user_id))
    .limit(1);

    const [isDefaulting] = await postgres
    .select({
      is_defaulting: defaulting.is_defaulting,
    })
    .from(defaulting)
    .where(eq(defaulting.identity_number, userPID.identity_number))
    .limit(1)

    if (isDefaulting){
      c.var.logger.info("Temporary Identifier Bearer %d is defaulting", action.identifier_id)
      const [actionError] = await postgres
      .insert(temporary_identifier_errors)
      .values({
        temporary_identifier_bearer_id: temporaryIdentifierBearer.id,
        device_id: device.id,
        error_id: 13,
      })
      .returning()
      return c.json(
        {
          message: `(13) Temporary Identifier Bearer is defaulting - ${actionError.id}` ,
        },
        HttpStatusCodes.NOT_FOUND,
      );
    }

    const now = new Date();

    if (temporaryIdentifierBearer.valid_from) {
      if (temporaryIdentifierBearer.valid_from > now) {
        c.var.logger.info("Temporary Identifier %d not valid", action.identifier_id)
        const [actionError] = await postgres
        .insert(temporary_identifier_errors)
        .values({
          temporary_identifier_bearer_id: temporaryIdentifierBearer.id,
          device_id: device.id,
          error_id: 1,
        })
        .returning()
        return c.json(
          {
            message: `(1) Temporary Identifier is not valid - ${actionError.id}` ,
          },
          HttpStatusCodes.NOT_FOUND,
        );
      }
    }

    if (temporaryIdentifierBearer.valid_to < now) {
      c.var.logger.info("Temporary Identifier %d not valid", action.identifier_id)
      const [actionError] = await postgres
      .insert(temporary_identifier_errors)
      .values({
        temporary_identifier_bearer_id: temporaryIdentifierBearer.id,
        device_id: device.id,
        error_id: 1,
      })
      .returning()
      return c.json(
        {
          message: `(1) Temporary Identifier is not valid | ${actionError.id}` ,
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
      c.var.logger.info("Temporary Identifier %d not active", action.identifier_id)
      const [actionError] = await postgres
      .insert(temporary_identifier_errors)
      .values({
        temporary_identifier_bearer_id: temporaryIdentifierBearer.id,
        device_id: device.id,
        error_id: 2,
      })
      .returning()
      return c.json(
        {
          message: `(2) Temporary Identifier is not active | ${actionError.id}` ,
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

    console.log("")
    console.log("")
    console.log("")
    console.log(userRole)
    console.log("")
    console.log("")
    console.log("")

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

    console.log("")
    console.log("")
    console.log("")
    console.log("Can Entry:", canEntry)
    console.log("Can Exit:", canExit)
    console.log("Is Pedestrian:", isPedestrian)
    console.log("Is Vehicle:", isVehicle)
    console.log("Is Temp:", isTemp)
    console.log("Temporary Identifier ID:", temporaryIdentifierId)
    console.log("")
    console.log("")
    console.log("")

    const tempUserLastActions = await postgres
      .select({
        device_id: temporary_identifier_logs.device_id,
        action_id: temporary_identifier_logs.action_id,
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
      .orderBy(desc(temporary_identifier_logs.id))
      .limit(1);

    const tempUserLastAction = tempUserLastActions.length > 0 ? tempUserLastActions[0] : null

    console.log("")
    console.log("")
    console.log("")
    console.log("Temporary User Last Action:", tempUserLastAction)
    console.log("")
    console.log("")
    console.log("")

    userLastActionName = tempUserLastAction ? allActions.find(a => a.id == tempUserLastAction?.action_id)?.name : null

    console.log("")
    console.log("")
    console.log("")
    console.log("User Last Action Name:", userLastActionName)
    console.log("")
    console.log("")
    console.log("")
  } else {

    const [userPID] = await postgres
    .select({
      identity_number: user_information.identity_number,
    })
    .from(user_information)
    .where(eq(user_information.user_id, identifier.user_id))
    .limit(1);

    const [isDefaulting] = await postgres
    .select({
      is_defaulting: defaulting.is_defaulting,
    })
    .from(defaulting)
    .where(eq(defaulting.identity_number, userPID.identity_number))
    .limit(1)

    if (isDefaulting){
      c.var.logger.info("Identifier Bearer %d is defaulting", action.identifier_id)
      const [actionError] = await postgres
      .insert(identifier_errors)
      .values({
        identifier_id: identifier.user_id,
        device_id: device.id,
        error_id: 12,
      })
      .returning()
      return c.json(
        {
          message: `(12) Identifier Bearer is defaulting - ${actionError.id}` ,
        },
        HttpStatusCodes.NOT_FOUND,
      );
    }

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

    console.log("")
    console.log("")
    console.log("")
    console.log("User Role:", userRole)
    console.log("")
    console.log("")
    console.log("")

    const userRoleActions = await postgres
      .select()
      .from(action_device_roles)
      .where(eq(action_device_roles.id, userRole.role_id));

    const userActions = await postgres
      .select()
      .from(actions)
      .where(inArray(actions.id, userRoleActions.map(ura => ura.action_id)))

    const userActionsNames = userActions.map(ua => ua.name);

    console.log("")
    console.log("")
    console.log("")
    console.log("User Actions Names:", userActionsNames)
    console.log("")
    console.log("")
    console.log("")

    canEntry = (ENTRY_ACTIONS.filter(item => userActionsNames.includes(item))).length > 0;
    canExit = (EXIT_ACTIONS.filter(item => userActionsNames.includes(item))).length > 0;
    isPedestrian = (PEDESTRIAN_ACTIONS.filter(item => userActionsNames.includes(item))).length > 0;
    isVehicle = (VEHICLE_ACTIONS.filter(item => userActionsNames.includes(item))).length > 0;

    console.log("")
    console.log("")
    console.log("")
    console.log("Can Entry:", canEntry)
    console.log("Can Exit:", canExit)
    console.log("Is Pedestrian:", isPedestrian)
    console.log("Is Vehicle:", isVehicle)
    console.log("")
    console.log("")
    console.log("")

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

    console.log("")
    console.log("")
    console.log("")
    console.log("User Last Action:", userLastAction)
    console.log("")
    console.log("")
    console.log("")

    userLastActionName = userLastAction ? allActions.find(a => a.id == userLastAction?.action_id)?.name : null

    console.log("")
    console.log("")
    console.log("")
    console.log("User Last Action Name:", userLastActionName)
    console.log("")
    console.log("")
    console.log("")
  }

  const isEntry = !userLastActionName || EXIT_ACTIONS.includes(userLastActionName)

  console.log("")
  console.log("")
  console.log("")
  console.log("Es entrada?:", isEntry)
  console.log("")
  console.log("")
  console.log("")

  // !ES UNA ENTRADA
  if (isEntry) {
    if (isEntry && !deviceAllowsEntry) {
      c.var.logger.warn("Device %d does not allow entry", action.device_id)
      
      if(isTemp && temporaryIdentifierId){
        const [actionError] = await postgres
        .insert(temporary_identifier_errors)
        .values({
          temporary_identifier_bearer_id: temporaryIdentifierId,
          device_id: device.id,
          error_id: 6,
        })
        .returning()
        return c.json(
          {
            message: `(6) Action not allowed - Entry not allowed | ${actionError.id}` ,
          },
          HttpStatusCodes.NOT_FOUND,
        );
      }

      const [actionError] = await postgres
      .insert(identifier_errors)
      .values({
        identifier_id: identifier.id,
        device_id: device.id,
        error_id: 4,
      })
      .returning()
      return c.json(
        {
          message: `(4) Action not allowed - Entry not allowed | ${actionError.id}` ,
        },
        HttpStatusCodes.NOT_FOUND,
      );
    }
  } else {
    // !ES UNA SALIDA
    if (!isEntry && !deviceAllowsExit) {
      c.var.logger.warn("Device %d does not allow exit", action.device_id)
      if(isTemp && temporaryIdentifierId){
        const [actionError] = await postgres
        .insert(temporary_identifier_errors)
        .values({
          temporary_identifier_bearer_id: temporaryIdentifierId,
          device_id: device.id,
          error_id: 7,
        })
        .returning()
        return c.json(
          {
            message: `(7) Action not allowed - Exit not allowed | ${actionError.id}` ,
          },
          HttpStatusCodes.NOT_FOUND,
        );
      }

      const [actionError] = await postgres
      .insert(identifier_errors)
      .values({
        identifier_id: identifier.id,
        device_id: device.id,
        error_id: 5,
      })
      .returning()
      return c.json(
        {
          message: `(5) Action not allowed - Exit not allowed | ${actionError.id}` ,
        },
        HttpStatusCodes.NOT_FOUND,
      );
    }
  }

  // !ES VEHICULAR
  if (!deviceAllowsVehicle) {
    if (isVehicle) {
      c.var.logger.warn("Device %d does not allow vehichle", action.device_id)
      if(isTemp && temporaryIdentifierId){
        const [actionError] = await postgres
        .insert(temporary_identifier_errors)
        .values({
          temporary_identifier_bearer_id: temporaryIdentifierId,
          device_id: device.id,
          error_id: 11,
        })
        .returning()
        return c.json(
          {
            message: `(11) Action not allowed - Vehicle not allowed | ${actionError.id}` ,
          },
          HttpStatusCodes.NOT_FOUND,
        );
      }

      const [actionError] = await postgres
      .insert(identifier_errors)
      .values({
        identifier_id: identifier.id,
        device_id: device.id,
        error_id: 9,
      })
      .returning()
      return c.json(
        {
          message: `(9) Action not allowed - Vehicle not allowed | ${actionError.id}` ,
        },
        HttpStatusCodes.NOT_FOUND,
      );
    }
  } else {
    // !ES PEATONAL
    if (isPedestrian) {
      c.var.logger.warn("Device %d does not allow pedestrian", action.device_id)
      if(isTemp && temporaryIdentifierId){
        const [actionError] = await postgres
        .insert(temporary_identifier_errors)
        .values({
          temporary_identifier_bearer_id: temporaryIdentifierId,
          device_id: device.id,
          error_id: 10,
        })
        .returning()
        return c.json(
          {
            message: `(10) Action not allowed - Pedestrian not allowed | ${actionError.id}` ,
          },
          HttpStatusCodes.NOT_FOUND,
        );
      }

      const [actionError] = await postgres
      .insert(identifier_errors)
      .values({
        identifier_id: identifier.id,
        device_id: device.id,
        error_id: 8,
      })
      .returning()
      return c.json(
        {
          message: `(8) Action not allowed - Pedestrian not allowed | ${actionError.id}` ,
        },
        HttpStatusCodes.NOT_FOUND,
      );
    }
  }

  // SE SUPONE QUE YA SABES QUE EL USUARIO PUEDE HACER EL REGISTRO QUE VAYA A HACER
  const actionId = isEntry
    ? (deviceAllowsVehicle ? VEHICLE_ENTRY_ID : PEDESTRIAN_ENTRY_ID)
    : (deviceAllowsVehicle ? VEHICLE_EXIT_ID : PEDESTRIAN_EXIT_ID);

  console.log("")
  console.log("")
  console.log("")
  console.log("Action:", actionId)
  console.log("")
  console.log("")
  console.log("")

  if (isTemp && temporaryIdentifierId) {
    const [insertedTemporaryAction] = await postgres
      .insert(temporary_identifier_logs)
      .values({
        temporary_identifier_bearer_id: temporaryIdentifierId,
        device_id: device.id,
        action_id: actionId,
      })
      .returning();
    console.log("Inserted Temporary Identifier Action:", insertedTemporaryAction)
    const responseActionTemporary = {
      action: insertedTemporaryAction,
      isEntry: isEntry
    }
    return c.json(responseActionTemporary, HttpStatusCodes.OK);
  }
  const [insertedAction] = await postgres
    .insert(identifier_logs)
    .values({
      identifier_id: identifier.id,
      device_id: device.id,
      action_id: actionId,
    })
    .returning();
  console.log("Inserted Temporary Identifier Action:", insertedAction)
  const responseAction = {
    action: insertedAction,
    isEntry: isEntry
  }
  return c.json(responseAction, HttpStatusCodes.OK);
};
