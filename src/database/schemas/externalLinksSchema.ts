import { jsonb, pgEnum, pgTable, text, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { providerEnum } from "./accountSchema";
import { institutionTable } from "./institutionSchema";
import { unitTable } from "./unitSchema";
import { classRoomTable } from "./classRoomSchema";

export const linkOriginEnum = pgEnum("link_origin", ["SYNC", "MANUAL", "AUTO_MATCH"]);

// função (e não const) pra cada tabela receber builders novos
const externalLinkColumns = () => ({
    provider: providerEnum("provider").notNull(),
    externalId: varchar("external_id").notNull(),      // identificador canônico
    externalPath: varchar("external_path"),            // ex: orgUnitPath (atributo mutável)
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    syncHash: varchar("sync_hash", { length: 255 }),
    origin: linkOriginEnum("origin").notNull(),
    lastSyncedAt: timestamp("last_synced_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdateFn(() => new Date()),
});

export const institutionIntegrationTable = pgTable("institution_integrations", {
    id: uuid().defaultRandom().primaryKey(),
    institutionId: uuid("institution_id").notNull().references(() => institutionTable.id, { onDelete: "cascade" }),
    credentials: text("credentials"), // segredo CRIPTOGRAFADO (ex: api key da Lex); nunca em claro
    ...externalLinkColumns(),
}, (t) => [
    unique("institution_integration_institution_provider").on(t.institutionId, t.provider),
    unique("institution_integration_provider_external_id").on(t.provider, t.externalId),
]);

export const unitExternalLinkTable = pgTable("unit_external_links", {
    id: uuid().defaultRandom().primaryKey(),
    unitId: uuid("unit_id").notNull().references(() => unitTable.id, { onDelete: "cascade" }),
    ...externalLinkColumns(),
}, (t) => [
    unique("unit_link_unit_provider").on(t.unitId, t.provider),
    unique("unit_link_provider_external_id").on(t.provider, t.externalId),
]);

export const classroomExternalLinkTable = pgTable("classroom_external_links", {
    id: uuid().defaultRandom().primaryKey(),
    classroomId: uuid("classroom_id").notNull().references(() => classRoomTable.id, { onDelete: "cascade" }),
    ...externalLinkColumns(),
}, (t) => [
    unique("classroom_link_classroom_provider").on(t.classroomId, t.provider),
    unique("classroom_link_provider_external_id").on(t.provider, t.externalId),
]);