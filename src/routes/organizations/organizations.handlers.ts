import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import postgres from "@/db/postgres/postgres";
import { organization_status, organizations } from "@/db/postgres/schemas/organizations/schema";
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@/lib/constants";

import type { AllOrganizationsRoute, CreateOrganizationRoute, GetOrganizationRoute, PatchOrganizationRoute } from "./organizations.routes";

export const allOrganizations: AppRouteHandler<AllOrganizationsRoute> = async (c) => {
  const allOrganizations = await postgres
    .select()
    .from(organizations);
  return c.json(allOrganizations);
};

export const createOrganization: AppRouteHandler<CreateOrganizationRoute> = async (c) => {
  const { organization, status } = c.req.valid("json");
  const [insertedOrganization] = await postgres
    .insert(organizations)
    .values(organization)
    .returning();
  // FIX: El organization_id deberia ser opcional cuando se crea el organization
  status.organization_id = insertedOrganization.id;
  const [insertedStatus] = await postgres
    .insert(organization_status)
    .values(status)
    .returning();
  const inserted = { organization: insertedOrganization, status: insertedStatus };
  return c.json(inserted, HttpStatusCodes.OK);
};

export const getOrganization: AppRouteHandler<GetOrganizationRoute> = async (c) => {
  const { slug } = c.req.valid("param");
  const [selectedOrganization] = await postgres
    .select()
    .from(organizations)
    .where(eq(organizations.organization_id, slug));

  if (!selectedOrganization) {
    return c.json(
      {
        message: "Organization not found",
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(selectedOrganization, HttpStatusCodes.OK);
};

export const patchOrganization: AppRouteHandler<PatchOrganizationRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  if (Object.keys(updates).length === 0) {
    return c.json(
      {
        success: false,
        error: {
          issues: [
            {
              code: ZOD_ERROR_CODES.INVALID_UPDATES,
              path: [],
              message: ZOD_ERROR_MESSAGES.NO_UPDATES,
            },
          ],
          name: "ZodError",
        },
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY,
    );
  }

  const [updatedUser] = await postgres
    .update(organizations)
    .set(updates)
    .where(eq(organizations.id, id))
    .returning();

  if (!updatedUser) {
    return c.json(
      {
        message: "Organization not found",
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(updatedUser, HttpStatusCodes.OK);
};
