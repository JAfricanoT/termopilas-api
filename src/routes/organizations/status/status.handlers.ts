import { desc, eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import postgres from "@/db/postgres/postgres";
import { organization_status, organizations } from "@/db/postgres/schemas/organizations/schema";

import type { CreateOrganizationStatusRoute, GetOrganizationStatusRoute } from "./status.routes";

export const createOrganizationStatus: AppRouteHandler<CreateOrganizationStatusRoute> = async (c) => {
  const newOrganizationStatus = c.req.valid("json");
  const [inserted] = await postgres
    .insert(organization_status)
    .values(newOrganizationStatus)
    .returning();
  return c.json(inserted, HttpStatusCodes.OK);
};

export const getOrganizationStatus: AppRouteHandler<GetOrganizationStatusRoute> = async (c) => {
  const { slug } = c.req.valid("param");
  const [selectedOrganization] = await postgres
    .select()
    .from(organizations)
    .where(eq(organizations.organization_id, slug));

  const [selectedOrganizationStatus] = await postgres
    .select()
    .from(organization_status)
    .where(eq(organization_status.organization_id, selectedOrganization.id))
    .orderBy(desc(organization_status.id))
    .limit(1);

  if (!selectedOrganizationStatus) {
    return c.json(
      {
        message: "Organization Status not found",
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(selectedOrganizationStatus, HttpStatusCodes.OK);
};
