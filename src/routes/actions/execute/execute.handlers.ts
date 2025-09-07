import postgres from "@/db/postgres/postgres";
import { action_device_roles, actions } from "@/db/postgres/schemas/actions/schema";
import { device_status, devices } from "@/db/postgres/schemas/devices/schema";
import { identifiers } from "@/db/postgres/schemas/identifiers/schema";
import { temporary_identifier_bearer_status, temporary_identifier_bearers, temporary_identifiers } from "@/db/postgres/schemas/identifiers/temporary/schema";
import { identifier_logs, temporary_identifier_logs } from "@/db/postgres/schemas/logs/schema";
import { users } from "@/db/postgres/schemas/users/schema";
import type { AppRouteHandler } from "@/lib/types";
import { asc, desc, eq, inArray } from "drizzle-orm";
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
  const deviceAllowsPedestrian = (PEDESTRIAN_ACTIONS.filter(item => deviceActionsNames.includes(item))).length > 0;
  const deviceAllowsVehicle = (VEHICLE_ACTIONS.filter(item => deviceActionsNames.includes(item))).length > 0;

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

  //! IDENTIFICADOR TEMPORAL
  if (!identifier) {
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

    const canEntry = (ENTRY_ACTIONS.filter(item => userActionsNames.includes(item))).length > 0;
    const canExit = (EXIT_ACTIONS.filter(item => userActionsNames.includes(item))).length > 0;
    const isPedestrian = (PEDESTRIAN_ACTIONS.filter(item => userActionsNames.includes(item))).length > 0;
    const isVehicle = (VEHICLE_ACTIONS.filter(item => userActionsNames.includes(item))).length > 0;

    const [userLastAction] = await postgres
      .select({
        device_id: temporary_identifier_logs.device_id,
        action_id: temporary_identifier_logs.action_id,
      })
      .from(temporary_identifier_logs)
      .where(eq(temporary_identifier_logs.temporary_identifier_bearer_id, temporaryIdentifierBearer.id))
      .orderBy(desc(temporary_identifier_logs.id))
      .limit(1);

    //! NO EXISTE ULTIMA ACCION TEMPORARY IDENTIFIER
    if (!userLastAction) {

      if (isVehicle && !deviceAllowsVehicle) {
        return c.json(
          {
            message: "Action not allowed - Vehicle not allowed",
          },
          HttpStatusCodes.NOT_FOUND,
        );
      }

      if (isPedestrian && !deviceAllowsPedestrian) {
        return c.json(
          {
            message: "Action not allowed - Pedestrian not allowed",
          },
          HttpStatusCodes.NOT_FOUND,
        );
      }

      if (canEntry && !deviceAllowsEntry) {
        return c.json(
          {
            message: "Action not allowed - Entry not allowed",
          },
          HttpStatusCodes.NOT_FOUND,
        );
      }

      if (canExit && !deviceAllowsExit) {
        return c.json(
          {
            message: "Action not allowed - Exit not allowed",
          },
          HttpStatusCodes.NOT_FOUND,
        );
      }

      if (isPedestrian && canEntry) {
        const [insertedAction] = await postgres
          .insert(temporary_identifier_logs)
          .values({
            temporary_identifier_bearer_id: temporaryIdentifierBearer.id,
            device_id: device.id,
            action_id: 1,
          })
          .returning();
        return c.json(insertedAction, HttpStatusCodes.OK);
      }

      // if (isPedestrian && canExit) {
      //   const [insertedAction] = await postgres
      //     .insert(temporary_identifier_logs)
      //     .values({
      //       temporary_identifier_bearer_id: temporaryIdentifierBearer.id,
      //       device_id: device.id,
      //       action_id: 2,
      //     })
      //     .returning();
      //   return c.json(insertedAction, HttpStatusCodes.OK);
      // }

      if (isVehicle && canEntry) {
        const [insertedAction] = await postgres
          .insert(temporary_identifier_logs)
          .values({
            temporary_identifier_bearer_id: temporaryIdentifierBearer.id,
            device_id: device.id,
            action_id: 4,
          })
          .returning();
        return c.json(insertedAction, HttpStatusCodes.OK);
      }

      // if (isVehicle && canExit) {
      //   const [insertedAction] = await postgres
      //     .insert(temporary_identifier_logs)
      //     .values({
      //       temporary_identifier_bearer_id: temporaryIdentifierBearer.id,
      //       device_id: device.id,
      //       action_id: 5,
      //     })
      //     .returning();
      //   return c.json(insertedAction, HttpStatusCodes.OK);
      // }

      return c.json(
        {
          message: "Action not allowed",
        },
        HttpStatusCodes.NOT_FOUND,
      );
    }

    const [userLastActionName] = await postgres
      .select({
        name: actions.name,
      })
      .from(actions)
      .where(eq(actions.id, userLastAction.action_id))
      .orderBy(desc(actions.id))
      .limit(1);

    console.log("LAST ACTION", userLastActionName.name);

    //! ENTRADA
    if (userLastActionName.name == "PedestrianEntry") {
      if (isVehicle && !deviceAllowsVehicle) {
        return c.json(
          {
            message: "Action not allowed - Vehicle not allowed",
          },
          HttpStatusCodes.NOT_FOUND,
        );
      }

      if (isPedestrian && !deviceAllowsPedestrian) {
        return c.json(
          {
            message: "Action not allowed - Pedestrian not allowed",
          },
          HttpStatusCodes.NOT_FOUND,
        );
      }

      if (canEntry && !deviceAllowsEntry) {
        return c.json(
          {
            message: "Action not allowed - Entry not allowed",
          },
          HttpStatusCodes.NOT_FOUND,
        );
      }

      if (canExit && !deviceAllowsExit) {
        return c.json(
          {
            message: "Action not allowed - Exit not allowed",
          },
          HttpStatusCodes.NOT_FOUND,
        );
      }

      if (isPedestrian && canEntry) {
        const [insertedAction] = await postgres
          .insert(temporary_identifier_logs)
          .values({
            temporary_identifier_bearer_id: temporaryIdentifierBearer.id,
            device_id: device.id,
            action_id: 1,
          })
          .returning();
        return c.json(insertedAction, HttpStatusCodes.OK);
      }

      // if (isPedestrian && canExit) {
      //   const [insertedAction] = await postgres
      //     .insert(temporary_identifier_logs)
      //     .values({
      //       temporary_identifier_bearer_id: temporaryIdentifierBearer.id,
      //       device_id: device.id,
      //       action_id: 2,
      //     })
      //     .returning();
      //   return c.json(insertedAction, HttpStatusCodes.OK);
      // }

      if (isVehicle && canEntry) {
        const [insertedAction] = await postgres
          .insert(temporary_identifier_logs)
          .values({
            temporary_identifier_bearer_id: temporaryIdentifierBearer.id,
            device_id: device.id,
            action_id: 4,
          })
          .returning();
        return c.json(insertedAction, HttpStatusCodes.OK);
      }

      // if (isVehicle && canExit) {
      //   const [insertedAction] = await postgres
      //     .insert(temporary_identifier_logs)
      //     .values({
      //       temporary_identifier_bearer_id: temporaryIdentifierBearer.id,
      //       device_id: device.id,
      //       action_id: 5,
      //     })
      //     .returning();
      //   return c.json(insertedAction, HttpStatusCodes.OK);
      // }
    }
    // LAST ACTION
    const wasEntry = (ENTRY_ACTIONS.filter(item => userActionsNames.includes(item))).length > 0;
    const wasExit = (EXIT_ACTIONS.filter(item => userActionsNames.includes(item))).length > 0;
    const wasPedestrian = (PEDESTRIAN_ACTIONS.filter(item => userActionsNames.includes(item))).length > 0;
    const wasVehicle = (VEHICLE_ACTIONS.filter(item => userActionsNames.includes(item))).length > 0;

    const executedAction = {
      id: 1,
      identifier_id: 1,
      device_id: 1,
      action_id: 1,
      created_at: new Date(),
    };
    return c.json(executedAction, HttpStatusCodes.OK);
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

  const userRoleActions = await postgres
    .select()
    .from(action_device_roles)
    .where(eq(action_device_roles.id, userRole.role_id));

  const userActions = await postgres
    .select()
    .from(actions)
    .where(inArray(actions.id, userRoleActions.map(ura => ura.action_id)))

  const userActionsNames = userActions.map(ua => ua.name);

  const canEntry = (ENTRY_ACTIONS.filter(item => userActionsNames.includes(item))).length > 0;
  const canExit = (EXIT_ACTIONS.filter(item => userActionsNames.includes(item))).length > 0;
  const isPedestrian = (PEDESTRIAN_ACTIONS.filter(item => userActionsNames.includes(item))).length > 0;
  const isVehicle = (VEHICLE_ACTIONS.filter(item => userActionsNames.includes(item))).length > 0;

  console.log("DEVICE", deviceAllowsEntry, deviceAllowsExit, deviceAllowsPedestrian, deviceAllowsVehicle);
  console.log("USER", canEntry, canExit, isPedestrian, isVehicle);

  const [userLastAction] = await postgres
    .select({
      device_id: identifier_logs.device_id,
      action_id: identifier_logs.action_id,
    })
    .from(identifier_logs)
    .where(eq(temporary_identifier_logs.temporary_identifier_bearer_id, identifier.id))
    .orderBy(desc(identifier_logs.id))
    .limit(1);

  //! NO EXISTE ULTIMA ACCION IDENTIFIER
  if (!userLastAction) {

    //! ERRORES
    if (isVehicle && !deviceAllowsVehicle) {
      return c.json(
        {
          message: "Action not allowed - Vehicle not allowed",
        },
        HttpStatusCodes.NOT_FOUND,
      );
    }

    if (isPedestrian && !deviceAllowsPedestrian) {
      return c.json(
        {
          message: "Action not allowed - Pedestrian not allowed",
        },
        HttpStatusCodes.NOT_FOUND,
      );
    }

    if (canEntry && !deviceAllowsEntry) {
      return c.json(
        {
          message: "Action not allowed - Entry not allowed",
        },
        HttpStatusCodes.NOT_FOUND,
      );
    }

    if (canExit && !deviceAllowsExit) {
      return c.json(
        {
          message: "Action not allowed - Exit not allowed",
        },
        HttpStatusCodes.NOT_FOUND,
      );
    }

    //! ACCIONES
    if (isPedestrian && canEntry) {

      return c.json(
        {
          id: 1,
          identifier_id: 1,
          device_id: 1,
          action_id: 1,
          created_at: new Date(),
        },
        HttpStatusCodes.OK,
      );
    }

    // if (isPedestrian && canExit) {
    //   return c.json(
    //     {
    //       id: 1,
    //       identifier_id: 1,
    //       device_id: 1,
    //       action_id: 2,
    //       created_at: new Date(),
    //     },
    //     HttpStatusCodes.OK,
    //   );
    // }

    if (isVehicle && canEntry) {
      return c.json(
        {
          id: 1,
          identifier_id: 1,
          device_id: 1,
          action_id: 4,
          created_at: new Date(),
        },
        HttpStatusCodes.OK,
      );
    }

    // if (isVehicle && canExit) {
    //   return c.json(
    //     {
    //       id: 1,
    //       identifier_id: 1,
    //       device_id: 1,
    //       action_id: 5,
    //       created_at: new Date(),
    //     },
    //     HttpStatusCodes.OK,
    //   );
    // }

    return c.json(
      {
        message: "Action not allowed",
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  const [userLastActionName] = await postgres
    .select({
      name: actions.name,
    })
    .from(actions)
    .where(eq(actions.id, userLastAction.action_id))
    .orderBy(desc(actions.id))
    .limit(1);

  console.log("LAST ACTION", userLastActionName.name);

  const executedAction = {
    id: 1,
    identifier_id: 1,
    device_id: 1,
    action_id: 1,
    created_at: new Date(),
  };
  return c.json(executedAction, HttpStatusCodes.OK);
};
