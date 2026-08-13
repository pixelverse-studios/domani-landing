# Domani Release Communication Contract

Status: Binding implementation contract

Epic: DEV-1004

Architecture gate: DEV-1005

Milestone: `1.1-changelog`
Last updated: 2026-08-05

## 1. Authority and change control

This document is the source of truth for DEV-1006, DEV-1007, DEV-1008, DEV-1009, DEV-1010, DEV-1011, DEV-1012, DEV-1013, DEV-1014, and DEV-1042. Those tickets must not introduce different shared fields, states, endpoints, permissions, ordering rules, or public response shapes.

If implementation reveals a necessary deviation, the dependent pull request must first update this document, explain the reason in its pull request, and link the affected tickets. A deviation is not approved merely because one repository already implements it.

The v1 system has three user-facing capabilities:

1. A public `/coming-soon` page for eligible planned work.
2. A public `/changelog` page for published releases.
3. An authenticated PVS dashboard workflow for authoring, importing, converting, reviewing, and publishing release content.

## 2. Repository ownership and dependency order

| Repository                  | Owned work                                                                                                                                                                                                                                         |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domani-landing`            | This contract; `/coming-soon`; `/changelog`; page metadata; sitemap entries; public loading, error, and empty states; header Resources menu; footer links; release-page cache revalidation receiver.                                               |
| `pixelverse-studios-server` | Supabase migrations; public release APIs; dashboard authentication and authorization middleware; admin release and note APIs; Markdown import; deterministic conversion boundary; audit events; public cache invalidation dispatch; backend tests. |
| `pvs-site`                  | Release list/editor; note editor and reorder controls; Markdown import; conversion review; publish controls; optimistic-concurrency conflict handling; dashboard visual states.                                                                    |

Neither frontend may query release tables directly. Both frontends consume `pixelverse-studios-server` APIs. The dashboard may use Supabase Auth only to establish the signed-in identity and obtain an access token.

Implementation order:

1. DEV-1005 — binding contract.
2. DEV-1006 — schema, constraints, roles, audit, and query support.
3. DEV-1007 and DEV-1042 — public and admin API foundations.
4. DEV-1008 — Markdown intake.
5. DEV-1009 — conversion.
6. DEV-1010 and DEV-1011 — public pages and navigation.
7. DEV-1012 — release management dashboard.
8. DEV-1013 — import and conversion review dashboard.
9. DEV-1014 — cross-repository QA.

## 3. Canonical vocabulary and scalar formats

| Name               | Values or format                                                                                                                                                    |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Release version    | `major.minor` or `major.minor.patch`; canonical decimal components from 0 through 999,999,999; no leading zero unless the component is exactly `0`; no leading `v`. |
| Release type       | `major`, `minor`, `patch`, `roadmap`.                                                                                                                               |
| Lifecycle status   | `draft`, `planned`, `in_progress`, `released`, `canceled`.                                                                                                          |
| Visibility         | `private`, `public_preview`, `published`.                                                                                                                           |
| Note type          | `feature`, `improvement`, `fix`, `breaking`.                                                                                                                        |
| Platform           | `ios`, `android`. A note has one or both; `web` is invalid in v1.                                                                                                   |
| Source type        | `linear_epic`, `linear_ticket`, `milestone`, `manual`.                                                                                                              |
| Intended surface   | `changelog`, `coming_soon`, `both`.                                                                                                                                 |
| Conversion status  | `raw`, `needs_review`, `approved`, `failed`, `superseded`. `Converted` is a UI event label, not a stored state.                                                     |
| Dashboard access   | Any user already authenticated into the existing PixelVerse dashboard. No Domani or release-specific sign-in or role enrollment exists.                             |
| Calendar date      | ISO `YYYY-MM-DD`, interpreted without a time zone.                                                                                                                  |
| Target month       | API string `YYYY-MM`; stored as the first day of that month in a SQL `date`.                                                                                        |
| Timestamp          | UTC ISO 8601, such as `2026-08-05T14:30:00.000Z`.                                                                                                                   |
| Identifier         | UUID v4 generated by PostgreSQL.                                                                                                                                    |
| Optimistic version | Positive `bigint`, beginning at `1` and increasing by one on every mutation.                                                                                        |

PostgreSQL `timestamptz` defaults and update triggers use `now()` directly. PostgreSQL stores the resulting instant independently of the session display time zone; wrapping `now()` in `timezone('utc', ...)` would first discard its time-zone information and can shift the stored instant in non-UTC sessions.

Version comparison is semantic numeric comparison, not lexical comparison. `1.10` sorts after `1.9`, and `1.2.1` sorts after `1.2.0`.

The canonical regex is `^(0|[1-9][0-9]{0,8})\.(0|[1-9][0-9]{0,8})(?:\.(0|[1-9][0-9]{0,8}))?$`. Patch releases use three components. Major, minor, and roadmap releases use two components. Canonical formatting rejects aliases such as `01.2`, while the release-type rule distinguishes `1.2` from patch version `1.2.0`.

## 4. SQL-oriented storage contract

DEV-1006 owns the migration. Names below are canonical. PostgreSQL enums may be used, or text columns with equivalent check constraints when migration compatibility requires it.

### 4.1 Required enum types

```sql
create type release_type as enum ('major', 'minor', 'patch', 'roadmap');
create type release_lifecycle_status as enum ('draft', 'planned', 'in_progress', 'released', 'canceled');
create type release_visibility as enum ('private', 'public_preview', 'published');
create type release_note_type as enum ('feature', 'improvement', 'fix', 'breaking');
create type release_platform as enum ('ios', 'android');
create type release_source_type as enum ('linear_epic', 'linear_ticket', 'milestone', 'manual');
create type release_intended_surface as enum ('changelog', 'coming_soon', 'both');
create type release_conversion_status as enum ('raw', 'needs_review', 'approved', 'failed', 'superseded');
create type dashboard_role as enum ('viewer', 'editor', 'admin');
```

### 4.2 Cross-project identity boundary

The existing PixelVerse Supabase project remains the sole authentication source for dashboard operators. The Domani Supabase project owns only Domani product and release data; it must not receive a duplicate dashboard user, session, role, or sign-in table.

`pixelverse-studios-server` validates the PVS access token before using its server-only Domani service client. Verified PVS actor UUIDs and email snapshots may be stored in Domani release rows for ownership and audit, but those UUID columns intentionally have no foreign key to Domani `auth.users`: they identify users from a different Supabase project.

The `dashboard_role` enum remains an internal response/audit compatibility value. Existing PVS dashboard operators receive the full `admin` capability envelope after token verification; it is not backed by a second role lookup.

### 4.3 `releases`

| Column             | SQL shape                                           | Rules                                                                |
| ------------------ | --------------------------------------------------- | -------------------------------------------------------------------- |
| `id`               | `uuid primary key default gen_random_uuid()`        | Immutable.                                                           |
| `version`          | `text not null unique`                              | Must match the canonical version regex.                              |
| `version_major`    | `integer generated always stored`                   | First canonical component derived from `version`; expression below.  |
| `version_minor`    | `integer generated always stored`                   | Second canonical component derived from `version`; expression below. |
| `version_patch`    | `integer generated always stored`                   | Third component or null; expression below.                           |
| `slug`             | `text not null unique`                              | Lowercase kebab case; regex `^[a-z0-9]+(?:-[a-z0-9]+)*$`.            |
| `title`            | `text not null`                                     | Trimmed, 1–160 characters.                                           |
| `release_type`     | `release_type not null`                             | Canonical enum.                                                      |
| `lifecycle_status` | `release_lifecycle_status not null default 'draft'` | New records start as `draft`.                                        |
| `visibility`       | `release_visibility not null default 'private'`     | New records start as `private`.                                      |
| `public_summary`   | `text`                                              | Required before public preview or publication; max 2,000 characters. |
| `internal_summary` | `text`                                              | Private; max 10,000 characters.                                      |
| `target_month`     | `date`                                              | Must be the first day of a month.                                    |
| `target_date`      | `date`                                              | Optional calendar date.                                              |
| `confirmed_date`   | `date`                                              | Optional calendar date.                                              |
| `released_at`      | `timestamptz`                                       | Required for published releases.                                     |
| `owner_user_id`    | `uuid`                                              | Optional external PVS actor identifier; no Domani Auth FK.           |
| `created_by`       | `uuid not null`                                     | Verified external PVS actor identifier.                              |
| `updated_by`       | `uuid not null`                                     | Verified external PVS actor identifier.                              |
| `row_version`      | `bigint not null default 1`                         | Incremented atomically on update.                                    |
| `created_at`       | `timestamptz not null default now()`                | Immutable.                                                           |
| `updated_at`       | `timestamptz not null default now()`                | Updated by trigger.                                                  |
| `archived_at`      | `timestamptz`                                       | Null while active.                                                   |
| `archived_by`      | `uuid`                                              | External PVS actor identifier; required when archived.               |

Database checks:

```sql
check (version ~ '^(0|[1-9][0-9]{0,8})\.(0|[1-9][0-9]{0,8})(\.(0|[1-9][0-9]{0,8}))?$')
check ((release_type = 'patch' and version_patch is not null) or (release_type <> 'patch' and version_patch is null))
check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
check (char_length(btrim(title)) between 1 and 160)
check (public_summary is null or char_length(public_summary) <= 2000)
check (internal_summary is null or char_length(internal_summary) <= 10000)
check (target_month is null or extract(day from target_month) = 1)
check ((archived_at is null and archived_by is null) or (archived_at is not null and archived_by is not null))
check (
  (visibility = 'private')
  or (visibility = 'public_preview' and lifecycle_status in ('planned', 'in_progress') and release_type in ('major', 'minor', 'roadmap'))
  or (visibility = 'published' and lifecycle_status = 'released' and released_at is not null)
)
check (release_type <> 'patch' or visibility <> 'public_preview')
check (lifecycle_status not in ('draft', 'canceled') or visibility = 'private')
```

The application must additionally verify that a published release has at least one active public note; that cross-row rule is enforced in the publish transaction.

Indexes:

- Public preview: `(visibility, lifecycle_status, target_month, target_date, confirmed_date)` where `archived_at is null`.
- Changelog: `(visibility, lifecycle_status, released_at desc)` where `archived_at is null`.
- Admin list: `(updated_at desc, id desc)` where `archived_at is null`.
- Admin filters: `(lifecycle_status, visibility, release_type)` where `archived_at is null`.
- Semantic version uniqueness and ordering: unique `(version_major, version_minor, coalesce(version_patch, -1))`.

The migration defines the generated expressions from the canonical `version` text:

```sql
version_major integer generated always as (split_part(version, '.', 1)::integer) stored,
version_minor integer generated always as (split_part(version, '.', 2)::integer) stored,
version_patch integer generated always as (nullif(split_part(version, '.', 3), '')::integer) stored
```

Clients and the server never accept or write the generated component columns directly.

`releases.row_version` is the aggregate version for the release and its active note/source collection. Every mutation that changes release fields, creates/updates/archives/reorders a note, imports or changes a source, converts Markdown, or approves a conversion must lock the release row, validate the supplied aggregate version, and increment it exactly once in the same transaction. Audit-event and cache-outbox delivery updates do not increment it. A version mismatch rolls back the complete mutation.

### 4.4 `release_prds`

| Column                     | SQL shape                                               | Rules                                                          |
| -------------------------- | ------------------------------------------------------- | -------------------------------------------------------------- |
| `id`                       | `uuid primary key default gen_random_uuid()`            | Immutable.                                                     |
| `release_id`               | `uuid not null references releases(id)`                 | Parent release.                                                |
| `raw_markdown`             | `text not null`                                         | Immutable UTF-8 source; decoded size at most 1 MiB.            |
| `original_filename`        | `text`                                                  | Required for multipart uploads; sanitized display name only.   |
| `source_type`              | `release_source_type not null`                          | Canonical enum.                                                |
| `source_reference`         | `text not null`                                         | Trimmed stable identifier or URL; max 2,048 characters.        |
| `source_content_sha256`    | `text not null`                                         | Lowercase 64-character SHA-256 hex.                            |
| `intended_surface`         | `release_intended_surface not null default 'changelog'` | Canonical enum.                                                |
| `conversion_status`        | `release_conversion_status not null default 'raw'`      | Canonical durable status.                                      |
| `latest_conversion_run_id` | `uuid`                                                  | Added as a deferred FK after `release_conversion_runs` exists. |
| `conversion_error_code`    | `text`                                                  | Stable private machine code for latest failure.                |
| `conversion_error_message` | `text`                                                  | Sanitized private diagnostic; never public.                    |
| `created_by`               | `uuid not null`                                         | Verified external PVS actor identifier.                        |
| `updated_by`               | `uuid not null`                                         | Verified external PVS actor identifier.                        |
| `row_version`              | `bigint not null default 1`                             | Incremented atomically on status or metadata update.           |
| `created_at`               | `timestamptz not null default now()`                    | Immutable.                                                     |
| `updated_at`               | `timestamptz not null default now()`                    | Updated by trigger.                                            |

The raw Markdown and `source_content_sha256` are immutable. A changed file creates a new source record. Idempotency is enforced by:

```sql
unique (release_id, source_type, source_reference, source_content_sha256)
```

For a given `(release_id, source_type, source_reference)`, exactly one source may be current. Importing a different content hash atomically marks every prior non-superseded source for that logical key as `superseded`, increments each changed source version, inserts the new `raw` source, records the audit events, and increments the aggregate release version once. Supersession preserves raw Markdown, conversion runs, and generated notes for history; it never archives, republishes, or changes the review/public state of existing notes. A superseded source cannot be converted or approved.

An exact-hash duplicate remains idempotent: it returns the existing record without changing the current source or any row version. If that exact record was already superseded, the duplicate response returns it with `conversionStatus: "superseded"`; restoring old content requires a new explicit workflow outside v1 rather than silently making history current again. A conflicting `intendedSurface` still returns 409.

Indexes: `(release_id, created_at desc)`, `(conversion_status, updated_at desc)`, `(source_content_sha256)`, and a partial unique index on `(release_id, source_type, source_reference)` where `conversion_status <> 'superseded'`.

### 4.5 `release_conversion_runs`

This table preserves provenance and makes reruns non-destructive.

| Column                  | SQL shape                                     | Rules                                                          |
| ----------------------- | --------------------------------------------- | -------------------------------------------------------------- |
| `id`                    | `uuid primary key default gen_random_uuid()`  | Conversion run ID.                                             |
| `release_id`            | `uuid not null references releases(id)`       | Must match source release.                                     |
| `prd_id`                | `uuid not null references release_prds(id)`   | Source Markdown.                                               |
| `source_content_sha256` | `text not null`                               | Snapshot of immutable source hash.                             |
| `converter_version`     | `text not null`                               | Deterministic converter release, such as `domani-markdown-v1`. |
| `provider`              | `text`                                        | Null for deterministic-only conversion.                        |
| `model`                 | `text`                                        | Null unless provider assistance ran.                           |
| `status`                | `text not null`                               | Constrained to `running`, `succeeded`, `failed`, `superseded`. |
| `error_code`            | `text`                                        | Stable private machine code.                                   |
| `error_message`         | `text`                                        | Sanitized private diagnostic.                                  |
| `superseded_by_run_id`  | `uuid references release_conversion_runs(id)` | Set when a newer run succeeds.                                 |
| `created_by`            | `uuid not null`                               | Verified external PVS actor identifier.                        |
| `started_at`            | `timestamptz not null default now()`          | Start time.                                                    |
| `completed_at`          | `timestamptz`                                 | Required for terminal states.                                  |

Checks ensure terminal states have `completed_at`, failed runs have an error code, and only superseded runs have `superseded_by_run_id`.

Indexes: `(prd_id, started_at desc)` and `(release_id, started_at desc)`.

### 4.6 `release_notes`

| Column                     | SQL shape                                     | Rules                                                      |
| -------------------------- | --------------------------------------------- | ---------------------------------------------------------- |
| `id`                       | `uuid primary key default gen_random_uuid()`  | Immutable.                                                 |
| `release_id`               | `uuid not null references releases(id)`       | Parent release.                                            |
| `note_type`                | `release_note_type not null`                  | Canonical enum.                                            |
| `public_title`             | `text not null`                               | Trimmed, 1–160 characters.                                 |
| `public_body`              | `text not null`                               | Trimmed, 1–4,000 characters; canonical safe Markdown only. |
| `technical_notes`          | `text`                                        | Private; max 20,000 characters.                            |
| `platforms`                | `release_platform[] not null`                 | One or both canonical platforms; no duplicates.            |
| `is_public`                | `boolean not null default false`              | Generated and new notes start private.                     |
| `sort_order`               | `integer not null`                            | Zero-based, contiguous within active notes for a release.  |
| `source_prd_id`            | `uuid references release_prds(id)`            | Optional provenance.                                       |
| `source_conversion_run_id` | `uuid references release_conversion_runs(id)` | Required for generated notes.                              |
| `created_by`               | `uuid not null`                               | Verified external PVS actor identifier.                    |
| `updated_by`               | `uuid not null`                               | Verified external PVS actor identifier.                    |
| `row_version`              | `bigint not null default 1`                   | Incremented atomically on update.                          |
| `created_at`               | `timestamptz not null default now()`          | Immutable.                                                 |
| `updated_at`               | `timestamptz not null default now()`          | Updated by trigger.                                        |
| `archived_at`              | `timestamptz`                                 | Null while active.                                         |
| `archived_by`              | `uuid`                                        | External PVS actor identifier; required when archived.     |

Checks enforce text lengths, `sort_order >= 0`, one or two unique platforms, matching archive fields, and paired source provenance. A deferred trigger verifies that source records belong to the same release.

An active partial unique index enforces deterministic ordering:

```sql
create unique index release_notes_release_sort_active_unique
on release_notes (release_id, sort_order)
where archived_at is null;
```

Reorder operations lock all active notes for the release and update them in one transaction. Temporary negative positions or a deferrable unique constraint may be used internally; partial updates are forbidden.

An active GIN index on `platforms` supports public and admin platform filters:

```sql
create index release_notes_platforms_active_gin
on release_notes using gin (platforms)
where archived_at is null;
```

### 4.7 `release_audit_events`

| Column          | SQL shape                                    | Rules                                                        |
| --------------- | -------------------------------------------- | ------------------------------------------------------------ |
| `id`            | `uuid primary key default gen_random_uuid()` | Immutable event.                                             |
| `actor_user_id` | `uuid not null`                              | Verified external PVS actor identifier; no Domani Auth FK.   |
| `actor_email`   | `text not null`                              | Verified email snapshot.                                     |
| `actor_role`    | `dashboard_role not null`                    | Effective role snapshot.                                     |
| `action`        | `text not null`                              | Canonical lower-case dotted action name defined below.       |
| `entity_type`   | `text not null`                              | `release`, `note`, `source`, or `conversion_run`.            |
| `entity_id`     | `uuid not null`                              | Target entity.                                               |
| `release_id`    | `uuid not null references releases(id)`      | Parent release.                                              |
| `request_id`    | `text not null`                              | Request correlation ID.                                      |
| `before_data`   | `jsonb`                                      | Allowlisted private snapshot before mutation.                |
| `after_data`    | `jsonb`                                      | Allowlisted private snapshot after mutation.                 |
| `metadata`      | `jsonb not null default '{}'::jsonb`         | Reason and operation context; never secrets or raw Markdown. |
| `created_at`    | `timestamptz not null default now()`         | Immutable.                                                   |

Audit writes occur in the same database transaction as the mutation. Failure to record the event fails the mutation. Tokens, raw Markdown, and provider credentials are never written to audit data.

`entity_type` has a database check constraint limiting it to `release`, `note`, `source`, or `conversion_run`. Storage, `ReleaseAuditEntityType`, query filters, and response examples use those exact values without translation. `action` is likewise a closed vocabulary, enforced in storage rather than an arbitrary string:

```sql
alter table release_audit_events
add constraint release_audit_events_action_check
check (action in (
  'release.created',
  'release.updated',
  'release.archived',
  'release.preview_published',
  'release.preview_returned_private',
  'release.published',
  'release.unpublished',
  'note.created',
  'note.updated',
  'note.archived',
  'note.reordered',
  'source.imported',
  'source.superseded',
  'source.approved',
  'conversion.started',
  'conversion.succeeded',
  'conversion.failed',
  'conversion.superseded'
));
```

Each mutation endpoint emits its matching specific action. Generic release PATCH emits `release.updated`, including when it changes lifecycle; the named visibility actions emit their named action instead. A new source import emits `source.imported` and one `source.superseded` event per historical source changed by that transaction. An exact duplicate import makes no database mutation and emits no audit event. Conversion writes one `conversion.started` event and one terminal `conversion.succeeded` or `conversion.failed` event; a rerun also emits `conversion.superseded` for each prior run changed. Approval emits `source.approved`. Note reorder emits one aggregate `note.reordered` event whose metadata contains the ordered note IDs, not one event per note. These rules make event cardinality and filtering deterministic.

Indexes: `(release_id, created_at desc)`, `(actor_user_id, created_at desc)`, and `(action, created_at desc)`.

### 4.8 `release_cache_invalidation_jobs`

This durable outbox prevents a committed publication change from losing its required cache purge.

| Column            | SQL shape                                    | Rules                                                  |
| ----------------- | -------------------------------------------- | ------------------------------------------------------ |
| `id`              | `uuid primary key default gen_random_uuid()` | Immutable job.                                         |
| `release_id`      | `uuid not null references releases(id)`      | Affected release.                                      |
| `event_key`       | `text not null unique`                       | Idempotency key derived from the mutation audit event. |
| `targets`         | `text[] not null`                            | Constrained to the four public API/page targets.       |
| `status`          | `text not null default 'pending'`            | `pending`, `delivered`, or `failed`.                   |
| `attempt_count`   | `integer not null default 0`                 | Non-negative.                                          |
| `next_attempt_at` | `timestamptz not null default now()`         | Retry scheduling.                                      |
| `last_error`      | `text`                                       | Sanitized operational diagnostic.                      |
| `created_at`      | `timestamptz not null default now()`         | Immutable.                                             |
| `updated_at`      | `timestamptz not null default now()`         | Updated by trigger.                                    |
| `delivered_at`    | `timestamptz`                                | Required only when delivered.                          |

Indexes: `(status, next_attempt_at)` and `(release_id, created_at desc)`.

### 4.9 RLS and database access

- Enable RLS on every table above.
- Revoke direct `anon` and `authenticated` table access for release tables, role rows, conversion runs, and audit events.
- `pixelverse-studios-server` accesses tables with its server-only Supabase service role.
- Public data is exposed only through the two allowlisted server endpoints.
- Dashboard data is exposed only after server-side token validation and role authorization.
- Service-role credentials must never be present in either frontend bundle.
- Raw Markdown remains in PostgreSQL and is never copied to public object storage.

## 5. Lifecycle and visibility state machine

### 5.1 Valid combinations

| Lifecycle     | Private | Public preview                           | Published                                                                  |
| ------------- | ------- | ---------------------------------------- | -------------------------------------------------------------------------- |
| `draft`       | Valid   | Invalid                                  | Invalid                                                                    |
| `planned`     | Valid   | Valid for `major`, `minor`, or `roadmap` | Invalid                                                                    |
| `in_progress` | Valid   | Valid for `major`, `minor`, or `roadmap` | Invalid                                                                    |
| `released`    | Valid   | Invalid                                  | Valid when `released_at` exists and at least one active public note exists |
| `canceled`    | Valid   | Invalid                                  | Invalid                                                                    |

`patch` releases can be private or `released + published`; they can never be public preview.

### 5.2 Permitted actions

| Action                    | Access       | Preconditions                                                                                     | Result                                                                        |
| ------------------------- | ------------ | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Create release            | PVS operator | Valid version, slug, title, and type                                                              | `draft + private`, `row_version = 1`.                                         |
| Edit draft metadata       | PVS operator | Active release and matching `If-Match`                                                            | Requested valid fields; version increments.                                   |
| Set planned               | PVS operator | Current lifecycle `draft` or `in_progress`; visibility private                                    | `planned + private`.                                                          |
| Set in progress           | PVS operator | Current lifecycle `planned`; visibility private or public preview                                 | `in_progress`; visibility retained if valid.                                  |
| Publish preview           | PVS operator | Planned/in-progress; major/minor/roadmap; public summary present; at least one active public note | Visibility becomes `public_preview`.                                          |
| Return preview to private | PVS operator | Planned/in-progress public preview                                                                | Visibility becomes `private`.                                                 |
| Mark released privately   | PVS operator | Planned/in-progress; visibility private; `releasedAt` supplied                                    | `released + private`.                                                         |
| Publish                   | PVS operator | Released; `released_at`; public summary; at least one active public note                          | `released + published`.                                                       |
| Unpublish                 | PVS operator | Published release                                                                                 | Lifecycle remains `released`; visibility becomes `private`; history retained. |
| Cancel                    | PVS operator | Draft/planned/in-progress and private                                                             | `canceled + private`.                                                         |
| Archive                   | PVS operator | Active release                                                                                    | Sets archive fields and visibility private atomically; history retained.      |

Arbitrary lifecycle and visibility pairs are not accepted in a generic patch. The PATCH endpoint may edit metadata and may request a permitted private lifecycle transition, but public-preview, publish, unpublish, and archive changes use explicit action endpoints.

Timeline slips are never automatic. Dates remain unchanged until a PVS dashboard operator explicitly updates them.

## 6. Timeline derivation

The backend returns a derived timeline and the frontend renders its supplied label. Precedence is strict:

1. `released_at` → kind `released`, machine value is the ISO timestamp, label `Released {localized date}`.
2. `confirmed_date` → kind `confirmed_date`, machine value `YYYY-MM-DD`, label `Scheduled for {localized date}`.
3. `target_date` → kind `target_date`, machine value `YYYY-MM-DD`, label `Targeting {localized date}`.
4. `target_month` → kind `target_month`, machine value `YYYY-MM`, label `Targeting {localized month and year}`.
5. No timing → kind `tbd`, machine value null, label `Date to be announced.`.

The backend formats English labels using locale `en-US` and UTC for timestamps. Calendar dates are parsed as date components, not midnight timestamps, so their displayed day cannot shift by user time zone.

```ts
export type ReleaseTimeline =
  | { kind: 'released'; value: string; label: string }
  | { kind: 'confirmed_date'; value: string; label: string }
  | { kind: 'target_date'; value: string; label: string }
  | { kind: 'target_month'; value: string; label: string }
  | { kind: 'tbd'; value: null; label: 'Date to be announced.' };
```

## 7. Shared TypeScript contracts

The server owns the canonical definitions. Frontends may duplicate them in generated or manually synchronized API type modules until a shared package exists, but names and shapes must remain equivalent.

```ts
export type ReleaseType = 'major' | 'minor' | 'patch' | 'roadmap';
export type ReleaseLifecycle = 'draft' | 'planned' | 'in_progress' | 'released' | 'canceled';
export type ReleaseVisibility = 'private' | 'public_preview' | 'published';
export type ReleaseNoteType = 'feature' | 'improvement' | 'fix' | 'breaking';
export type ReleasePlatform = 'ios' | 'android';
export type ReleaseSourceType = 'linear_epic' | 'linear_ticket' | 'milestone' | 'manual';
export type ReleaseIntendedSurface = 'changelog' | 'coming_soon' | 'both';
export type ReleaseConversionStatus = 'raw' | 'needs_review' | 'approved' | 'failed' | 'superseded';
export type DashboardRole = 'viewer' | 'editor' | 'admin';

export interface ApiMeta {
  apiVersion: '2026-08-05';
  requestId: string;
  nextCursor: string | null;
  cacheInvalidation?: CacheInvalidationReceipt;
}

export interface CacheInvalidationReceipt {
  jobId: string;
  status: 'pending' | 'delivered';
  targets: Array<
    | '/api/domani/releases/coming-soon'
    | '/api/domani/releases/changelog'
    | '/coming-soon'
    | '/changelog'
  >;
}

export interface ApiSuccess<T> {
  data: T;
  meta: ApiMeta;
}

export type FieldErrors = Record<string, string[]>;

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    fieldErrors: FieldErrors;
    requestId: string;
  };
}
```

`fieldErrors` is always an object keyed by the request field's camelCase path. Nested fields use dot notation and array entries use numeric segments, such as `notes.0.platforms`. Each value is a non-empty array of stable, human-readable validation messages. Non-field errors return `{}`. This shape matches the locked DEV-1005 error envelope.

### 7.1 Public allowlist DTOs

```ts
export interface PublicReleaseNote {
  id: string;
  type: ReleaseNoteType;
  title: string;
  body: string;
  platforms: ReleasePlatform[];
  order: number;
}

export interface PublicRelease {
  id: string;
  version: string;
  slug: string;
  title: string;
  releaseType: ReleaseType;
  lifecycleStatus: 'planned' | 'in_progress' | 'released';
  publicSummary: string;
  timeline: ReleaseTimeline;
  releasedAt: string | null;
  notes: PublicReleaseNote[];
}

export interface PublicReleaseCollection {
  releases: PublicRelease[];
}
```

Public serializers construct these DTOs from an explicit selection. They must not serialize an admin object and delete private fields afterward.

### 7.2 Public text and Markdown safety

`publicTitle` and `publicSummary` are plain text. Clients render them through normal text nodes and must never interpret them as HTML or Markdown.

`publicBody` accepts only this CommonMark subset: paragraphs, soft or hard line breaks, emphasis, strong emphasis, inline code, ordered lists, unordered lists, and links. Raw HTML, images, headings, blockquotes, fenced or indented code blocks, tables, task lists, autoloaded embeds, and extension syntax are forbidden. Link destinations may use only `https:`, `http:`, or `mailto:`, or may be root-relative paths beginning with `/` or same-page fragments beginning with `#`. Protocol-relative URLs and every other scheme, including `javascript:`, `data:`, and `file:`, are forbidden.

The server normalizes line endings to LF, parses the Markdown with raw HTML and extension plugins disabled, validates every node and link against the allowlist, and stores the canonical Markdown only after validation. It rejects forbidden input with 422 `UNSAFE_PUBLIC_MARKDOWN` and a `fieldErrors` entry for `publicBody`; it does not silently preserve or render rejected nodes. Deterministic conversion removes unsupported source constructs, produces only the allowed subset, and runs the same validator before persistence.

The landing site renders the validated Markdown through an allowlisted AST-to-React renderer with raw HTML disabled and never uses `dangerouslySetInnerHTML`. External HTTP(S) links receive `rel="noopener noreferrer"`; user-controlled content cannot choose executable attributes. Backend and landing tests must cover encoded and mixed-case unsafe schemes, raw HTML, images, malformed links, and allowed internal/external links.

### 7.3 Admin DTOs

```ts
export interface AdminActor {
  userId: string;
  email: string;
  role: DashboardRole;
}

export interface AdminReleaseNote {
  id: string;
  releaseId: string;
  noteType: ReleaseNoteType;
  publicTitle: string;
  publicBody: string;
  technicalNotes: string | null;
  platforms: ReleasePlatform[];
  isPublic: boolean;
  sortOrder: number;
  sourcePrdId: string | null;
  sourceConversionRunId: string | null;
  rowVersion: number;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
}

export interface AdminReleaseSource {
  id: string;
  releaseId: string;
  rawMarkdown: string;
  originalFilename: string | null;
  sourceType: ReleaseSourceType;
  sourceReference: string;
  sourceContentSha256: string;
  intendedSurface: ReleaseIntendedSurface;
  conversionStatus: ReleaseConversionStatus;
  latestConversionRunId: string | null;
  conversionErrorCode: string | null;
  conversionErrorMessage: string | null;
  rowVersion: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminRelease {
  id: string;
  version: string;
  slug: string;
  title: string;
  releaseType: ReleaseType;
  lifecycleStatus: ReleaseLifecycle;
  visibility: ReleaseVisibility;
  publicSummary: string | null;
  internalSummary: string | null;
  targetMonth: string | null;
  targetDate: string | null;
  confirmedDate: string | null;
  releasedAt: string | null;
  ownerUserId: string | null;
  rowVersion: number;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
}

export interface AdminReleaseDetail extends AdminRelease {
  notes: AdminReleaseNote[];
  sources: AdminReleaseSource[];
  allowedActions: Array<
    'edit' | 'publish_preview' | 'return_to_private' | 'publish' | 'unpublish' | 'archive'
  >;
}

export interface AdminReleaseCapabilities {
  canCreateRelease: boolean;
  canViewArchivedReleases: boolean;
}

export type ReleaseAuditEntityType = 'release' | 'note' | 'source' | 'conversion_run';

export type ReleaseAuditAction =
  | 'release.created'
  | 'release.updated'
  | 'release.archived'
  | 'release.preview_published'
  | 'release.preview_returned_private'
  | 'release.published'
  | 'release.unpublished'
  | 'note.created'
  | 'note.updated'
  | 'note.archived'
  | 'note.reordered'
  | 'source.imported'
  | 'source.superseded'
  | 'source.approved'
  | 'conversion.started'
  | 'conversion.succeeded'
  | 'conversion.failed'
  | 'conversion.superseded';

export interface AdminReleaseAuditEvent {
  id: string;
  releaseId: string;
  actor: AdminActor;
  action: ReleaseAuditAction;
  entityType: ReleaseAuditEntityType;
  entityId: string;
  requestId: string;
  beforeData: Record<string, unknown> | null;
  afterData: Record<string, unknown> | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface AdminReleaseAuditCollection {
  events: AdminReleaseAuditEvent[];
}
```

### 7.4 Mutation payloads

```ts
export interface CreateReleaseRequest {
  version: string;
  slug: string;
  title: string;
  releaseType: ReleaseType;
  publicSummary?: string | null;
  internalSummary?: string | null;
  targetMonth?: string | null;
  targetDate?: string | null;
  confirmedDate?: string | null;
  ownerUserId?: string | null;
}

export interface UpdateReleaseRequest {
  title?: string;
  slug?: string;
  releaseType?: ReleaseType;
  lifecycleStatus?: ReleaseLifecycle;
  publicSummary?: string | null;
  internalSummary?: string | null;
  targetMonth?: string | null;
  targetDate?: string | null;
  confirmedDate?: string | null;
  releasedAt?: string | null;
  ownerUserId?: string | null;
}

export interface CreateReleaseNoteRequest {
  noteType: ReleaseNoteType;
  publicTitle: string;
  publicBody: string;
  technicalNotes?: string | null;
  platforms: ReleasePlatform[];
  isPublic?: boolean;
}

export interface UpdateReleaseNoteRequest {
  releaseRowVersion: number;
  noteType?: ReleaseNoteType;
  publicTitle?: string;
  publicBody?: string;
  technicalNotes?: string | null;
  platforms?: ReleasePlatform[];
  isPublic?: boolean;
}

export interface ArchiveReleaseNoteRequest {
  releaseRowVersion: number;
}

export interface ReorderReleaseNotesRequest {
  notes: Array<{ id: string; rowVersion: number }>;
}

export interface ApproveConvertedSourceRequest {
  releaseRowVersion: number;
  noteRowVersions: Array<{ id: string; rowVersion: number }>;
}

export interface ApproveConvertedSourceResponse {
  source: AdminReleaseSource;
  approvedNoteIds: string[];
  releaseRowVersion: number;
}
```

## 8. Authentication, authorization, and request identity

The PVS dashboard already uses its own PixelVerse Supabase Auth project. Release management reuses that working session without adding a Domani login, release-specific sign-in, or separate role enrollment.

1. `pvs-site` obtains the current Supabase access token.
2. It sends `Authorization: Bearer <access-token>` to every admin release endpoint.
3. `pixelverse-studios-server` validates the token against PixelVerse Supabase Auth on every request and uses only the returned user ID and email.
4. Middleware attaches `{ userId, email, role: 'admin' }` to the request; `admin` represents the existing dashboard's uniform operator capability and is not loaded from Domani.
5. The server performs release reads and writes through its separate server-only Domani Supabase client.

Missing, malformed, expired, or unverifiable PVS tokens return 401. Client-supplied identity or role fields are ignored and rejected when present in mutation payloads. The Domani database never validates dashboard sessions and never contains dashboard authentication or role records.

The existing `pvs_media_admin_session` cookie remains limited to media administration and does not authorize release endpoints.

Every authenticated PVS dashboard operator may list, create, edit, import, convert, preview, publish, unpublish, and archive release content. State-transition, optimistic-concurrency, input-validation, and audit rules remain server-authoritative.

Admin API CORS allowlists only configured PVS dashboard origins. Bearer authentication does not use ambient cookies, so release mutations do not rely on cookie-based CSRF protection.

## 9. Public APIs — DEV-1007

### 9.1 `GET /api/domani/releases/coming-soon`

Eligibility:

- `archived_at is null`
- `visibility = public_preview`
- `lifecycle_status in (planned, in_progress)`
- `release_type in (major, minor, roadmap)`
- active notes only, with `is_public = true`

Ordering:

1. Effective future timing ascending, using `confirmed_date`, then `target_date`, then `target_month`.
2. Releases without timing last.
3. Semantic version ascending.
4. Release UUID ascending as the stable final tie-breaker.
5. Notes by `sort_order` ascending, then note UUID ascending.

Query parameters: `platform=ios|android`, `limit` default 20 and maximum 100, and opaque `cursor`.

When `platform` is omitted, the response contains every eligible public note. When supplied, the server includes only notes whose `platforms` array contains that platform and omits any release left with zero matching notes. The signed cursor binds the selected platform, so it cannot be reused with a different filter.

Example response:

```json
{
  "data": {
    "releases": [
      {
        "id": "5f75ab8d-8b70-4d26-a414-bc75abef882d",
        "version": "1.2",
        "slug": "smarter-evening-planning",
        "title": "Smarter evening planning setup",
        "releaseType": "minor",
        "lifecycleStatus": "planned",
        "publicSummary": "A calmer first-plan experience with clearer guidance.",
        "timeline": {
          "kind": "target_month",
          "value": "2026-08",
          "label": "Targeting August 2026"
        },
        "releasedAt": null,
        "notes": [
          {
            "id": "4f449c68-b9f7-42d2-a6c8-af40bbb118f3",
            "type": "feature",
            "title": "Guided first plan",
            "body": "Choose your first most important task with a calmer walkthrough.",
            "platforms": ["ios", "android"],
            "order": 0
          }
        ]
      }
    ]
  },
  "meta": {
    "apiVersion": "2026-08-05",
    "requestId": "req_01J4K9X8E2T4M3Q7Y5R6W1Z0AB",
    "nextCursor": null
  }
}
```

### 9.2 `GET /api/domani/releases/changelog`

Eligibility:

- `archived_at is null`
- `visibility = published`
- `lifecycle_status = released`
- `released_at is not null`
- active notes only, with `is_public = true`

Ordering:

1. `released_at` descending.
2. Semantic version descending.
3. Release UUID ascending.
4. Notes by `sort_order` ascending, then note UUID ascending.

Query parameters match Coming Soon. The response uses the same `PublicReleaseCollection` envelope.

### 9.3 Public field exclusion

Only fields declared in `PublicRelease` and `PublicReleaseNote` are selectable. The following are forbidden even when null: internal summary, technical notes, raw Markdown, source references, hashes, conversion metadata, owner or actor fields, approval data, audit data, risk data, row versions, and archive metadata.

Empty results return HTTP 200 with `releases: []` and `nextCursor: null`.

Both endpoints set:

```text
Cache-Control: public, s-maxage=300, stale-while-revalidate=600
Vary: Accept-Encoding
```

## 10. Admin management APIs — DEV-1042

All routes require a verified dashboard actor. Existing-record mutations require `If-Match: "<row_version>"` for the primary mutated resource. Missing `If-Match` returns 428 `PRECONDITION_REQUIRED`; malformed values return 400; stale values return 409 `VERSION_CONFLICT` and include no private current record in the error. Multi-resource operations also carry explicitly named related row versions in their body and validate all versions before writing.

For every aggregate mutation, the server locks the release row and re-evaluates its stored state before transition and version validation. `allowedActions` is calculated from the current stored state for the verified PVS operator; client code must not invent additional authentication or authorization state.

### 10.1 Release endpoints

| Method and path                                         | Access       | Contract                                                                                                                                                          |
| ------------------------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET /api/admin/releases`                               | PVS operator | Cursor list with filters `lifecycle`, `visibility`, `releaseType`, `platform`, `version`, `archived`, `limit`, `cursor`; default sort `updated_at desc, id desc`. |
| `POST /api/admin/releases`                              | PVS operator | Accepts `CreateReleaseRequest`; returns 201 with `AdminRelease`; always creates `draft + private`.                                                                |
| `GET /api/admin/releases/:releaseId`                    | PVS operator | Returns `AdminReleaseDetail` with active notes and sources.                                                                                                       |
| `GET /api/admin/releases/:releaseId/audit`              | PVS operator | Cursor audit list with `action`, `entityType`, `limit`, and `cursor`; default sort `created_at desc, id desc`.                                                    |
| `PATCH /api/admin/releases/:releaseId`                  | PVS operator | Accepts `UpdateReleaseRequest` and matching `If-Match`; returns updated detail.                                                                                   |
| `POST /api/admin/releases/:releaseId/archive`           | PVS operator | Matching `If-Match`; non-destructive archive and private visibility.                                                                                              |
| `POST /api/admin/releases/:releaseId/publish-preview`   | PVS operator | Matching `If-Match`; validates preview rules.                                                                                                                     |
| `POST /api/admin/releases/:releaseId/return-to-private` | PVS operator | Matching `If-Match`; removes public preview only.                                                                                                                 |
| `POST /api/admin/releases/:releaseId/publish`           | PVS operator | Matching `If-Match`; validates and publishes released content atomically.                                                                                         |
| `POST /api/admin/releases/:releaseId/unpublish`         | PVS operator | Matching `If-Match`; retains released lifecycle and history.                                                                                                      |

List response:

```json
{
  "data": {
    "releases": [],
    "capabilities": {
      "canCreateRelease": true,
      "canViewArchivedReleases": true
    },
    "filters": {
      "lifecycle": null,
      "visibility": null,
      "releaseType": null,
      "platform": null,
      "version": null,
      "archived": false
    }
  },
  "meta": {
    "apiVersion": "2026-08-05",
    "requestId": "req_01J4K9X8E2T4M3Q7Y5R6W1Z0AC",
    "nextCursor": null
  }
}
```

`capabilities` is derived from the verified PVS dashboard actor on every list request. Both values are `true` for an authenticated dashboard operator. The dashboard must still use these server-derived booleans so future platform-level capability changes do not require client-side auth inference.

The admin `platform` filter selects releases having at least one active note containing that platform. `action` accepts `ReleaseAuditAction` and is an exact, case-sensitive match against the canonical lower-case dotted value; unknown values return 400 `VALIDATION_ERROR`. `entityType` accepts `release`, `note`, `source`, or `conversion_run`. Audit pagination defaults to 20, caps at 100, and uses the shared signed cursor rules. Audit serializers expose only `AdminReleaseAuditEvent`: before/after payloads are field allowlists and must exclude raw Markdown, tokens, credentials, provider prompts/responses, and internal exception data.

Audit response example:

```json
{
  "data": {
    "events": [
      {
        "id": "f35e09de-c51d-4cdb-a1fd-30de7d36c70b",
        "releaseId": "5f75ab8d-8b70-4d26-a414-bc75abef882d",
        "actor": {
          "userId": "168a4e31-74c4-487d-ad0d-131dd45bcf8a",
          "email": "operator@pixelversestudios.com",
          "role": "admin"
        },
        "action": "note.updated",
        "entityType": "note",
        "entityId": "4f449c68-b9f7-42d2-a6c8-af40bbb118f3",
        "requestId": "req_01J4K9X8E2T4M3Q7Y5R6W1Z0AI",
        "beforeData": {
          "publicTitle": "First plan"
        },
        "afterData": {
          "publicTitle": "Guided first plan"
        },
        "metadata": {
          "source": "dashboard"
        },
        "createdAt": "2026-08-05T14:50:00.000Z"
      }
    ]
  },
  "meta": {
    "apiVersion": "2026-08-05",
    "requestId": "req_01J4K9X8E2T4M3Q7Y5R6W1Z0AJ",
    "nextCursor": null
  }
}
```

Action endpoints accept an empty JSON object. For example, publishing sends `If-Match: "4"` with:

```json
{}
```

It returns the updated release detail with `lifecycleStatus: "released"`, `visibility: "published"`, and an incremented `rowVersion` in the standard success envelope.

Create request and response:

```json
{
  "version": "1.2",
  "slug": "smarter-evening-planning",
  "title": "Smarter evening planning setup",
  "releaseType": "minor",
  "publicSummary": "A calmer first-plan experience with clearer guidance.",
  "internalSummary": "Coordinate API and onboarding rollout.",
  "targetMonth": "2026-08"
}
```

```json
{
  "data": {
    "release": {
      "id": "5f75ab8d-8b70-4d26-a414-bc75abef882d",
      "version": "1.2",
      "slug": "smarter-evening-planning",
      "title": "Smarter evening planning setup",
      "releaseType": "minor",
      "lifecycleStatus": "draft",
      "visibility": "private",
      "publicSummary": "A calmer first-plan experience with clearer guidance.",
      "internalSummary": "Coordinate API and onboarding rollout.",
      "targetMonth": "2026-08",
      "targetDate": null,
      "confirmedDate": null,
      "releasedAt": null,
      "ownerUserId": null,
      "rowVersion": 1,
      "createdAt": "2026-08-05T14:30:00.000Z",
      "updatedAt": "2026-08-05T14:30:00.000Z",
      "archivedAt": null
    }
  },
  "meta": {
    "apiVersion": "2026-08-05",
    "requestId": "req_01J4K9X8E2T4M3Q7Y5R6W1Z0AD",
    "nextCursor": null
  }
}
```

### 10.2 Release-note endpoints

| Method and path                                             | Access       | Contract                                                                                                  |
| ----------------------------------------------------------- | ------------ | --------------------------------------------------------------------------------------------------------- |
| `POST /api/admin/releases/:releaseId/notes`                 | PVS operator | Requires release `If-Match`; creates a private note by default at the next contiguous order.              |
| `PATCH /api/admin/releases/:releaseId/notes/:noteId`        | PVS operator | Requires note `If-Match` plus body `releaseRowVersion`; updates allowlisted fields.                       |
| `POST /api/admin/releases/:releaseId/notes/:noteId/archive` | PVS operator | Requires note `If-Match` plus body `releaseRowVersion`; archives and compacts remaining order atomically. |
| `POST /api/admin/releases/:releaseId/notes/reorder`         | PVS operator | Requires release `If-Match`; body contains every active note exactly once with each note row version.     |

Reorder request:

```json
{
  "notes": [
    { "id": "4f449c68-b9f7-42d2-a6c8-af40bbb118f3", "rowVersion": 2 },
    { "id": "5f4fac83-9aaa-494d-87c4-c2e70f0fe0f7", "rowVersion": 1 }
  ]
}
```

The array order becomes `sortOrder` 0 and 1. Missing, duplicate, foreign, archived, or stale notes reject the entire transaction.

Create-note example:

```json
{
  "noteType": "feature",
  "publicTitle": "Guided first plan",
  "publicBody": "Choose your first most important task with a calmer walkthrough.",
  "technicalNotes": "Backed by the onboarding-state API.",
  "platforms": ["ios", "android"],
  "isPublic": false
}
```

Create and reorder use the release `If-Match` as the aggregate version. Update and archive use the note `If-Match` as the primary-resource version and the required body `releaseRowVersion` as the aggregate version. Each successful note mutation increments the aggregate release version exactly once. Create, update, and archive responses return the complete `data.note` plus `data.releaseRowVersion`; reorder returns the ordered complete `data.notes` plus `data.releaseRowVersion`. Update/reorder responses use HTTP 200, archive uses HTTP 200 with the archived note, `ETag` identifies the primary returned resource version, and `X-Release-ETag` identifies the aggregate release version. Any note or aggregate mismatch returns 409 and rolls back ordering, audit, and invalidation work.

The response is HTTP 201 with a standard envelope whose `data.note` is the complete concrete `AdminReleaseNote` record.

```json
{
  "data": {
    "note": {
      "id": "4f449c68-b9f7-42d2-a6c8-af40bbb118f3",
      "releaseId": "5f75ab8d-8b70-4d26-a414-bc75abef882d",
      "noteType": "feature",
      "publicTitle": "Guided first plan",
      "publicBody": "Choose your first most important task with a calmer walkthrough.",
      "technicalNotes": "Backed by the onboarding-state API.",
      "platforms": ["ios", "android"],
      "isPublic": false,
      "sortOrder": 0,
      "sourcePrdId": null,
      "sourceConversionRunId": null,
      "rowVersion": 1,
      "createdAt": "2026-08-05T14:45:00.000Z",
      "updatedAt": "2026-08-05T14:45:00.000Z",
      "archivedAt": null
    },
    "releaseRowVersion": 2
  },
  "meta": {
    "apiVersion": "2026-08-05",
    "requestId": "req_01J4K9X8E2T4M3Q7Y5R6W1Z0AH",
    "nextCursor": null
  }
}
```

## 11. Markdown import API — DEV-1008

### 11.1 Endpoint

`POST /api/admin/releases/import-markdown`

Access: existing authenticated PVS dashboard operator.

Supported media types:

- `application/json`
- `multipart/form-data` with exactly one `.md` file in the form field named `file`

Maximum decoded Markdown size is 1,048,576 bytes. Content must be valid UTF-8 and must not contain a NUL byte. Multipart filenames must end in `.md` case-insensitively. MIME metadata alone is not trusted.

```ts
export interface ImportMarkdownJsonRequest {
  markdown: string;
  filename?: string;
  releaseId?: string;
  releaseVersion?: string;
  releaseTitle?: string;
  releaseSlug?: string;
  releaseType?: ReleaseType;
  sourceType: ReleaseSourceType;
  sourceReference: string;
  intendedSurface?: ReleaseIntendedSurface;
  convert?: false;
}

export interface ImportMarkdownResponse {
  release: AdminRelease;
  source: AdminReleaseSource;
  duplicate: boolean;
}
```

Exactly one of `releaseId` or `releaseVersion` is accepted. If `releaseVersion` does not exist, the request also supplies `releaseTitle`, `releaseSlug`, and `releaseType`, and the server creates a private draft release in the same transaction. If an existing version is found, it is linked rather than recreated.

Importing into an existing release requires that release's `If-Match`. The server locks and validates the aggregate release version before inserting a new source, then increments it once and returns the updated release. Creating a new release needs no `If-Match`; its initial source is part of creation and the returned release starts at version 1. A duplicate import is read-only, does not increment either version, and returns the existing release/source. Reusing the same idempotency tuple with a conflicting `intendedSurface` returns 409 `IDEMPOTENCY_CONFLICT`.

`intendedSurface` defaults to `changelog`. `convert` defaults to `false`; `true` is rejected with 422 `IMPORT_CONVERSION_NOT_SUPPORTED`. Conversion uses the separate endpoint.

JSON example:

```json
{
  "markdown": "# Domani 1.2\n\n## Guided first plan\n\n- A calmer setup flow.",
  "filename": "domani-1.2.md",
  "releaseId": "5f75ab8d-8b70-4d26-a414-bc75abef882d",
  "sourceType": "linear_epic",
  "sourceReference": "DEV-1004",
  "intendedSurface": "both",
  "convert": false
}
```

The server hashes decoded UTF-8 bytes with SHA-256. A duplicate `(release, sourceType, sourceReference, hash)` returns HTTP 200 and the existing source with `duplicate: true`. A new source returns 201 with `duplicate: false`. No notes are created.

Example new-source response:

```json
{
  "data": {
    "release": {
      "id": "5f75ab8d-8b70-4d26-a414-bc75abef882d",
      "version": "1.2",
      "slug": "smarter-evening-planning",
      "title": "Smarter evening planning setup",
      "releaseType": "minor",
      "lifecycleStatus": "draft",
      "visibility": "private",
      "publicSummary": "A calmer first-plan experience with clearer guidance.",
      "internalSummary": "Coordinate API and onboarding rollout.",
      "targetMonth": "2026-08",
      "targetDate": null,
      "confirmedDate": null,
      "releasedAt": null,
      "ownerUserId": null,
      "rowVersion": 2,
      "createdAt": "2026-08-05T14:30:00.000Z",
      "updatedAt": "2026-08-05T14:40:00.000Z",
      "archivedAt": null
    },
    "source": {
      "id": "30142faf-bc40-4503-a4f7-83a8590c64d4",
      "releaseId": "5f75ab8d-8b70-4d26-a414-bc75abef882d",
      "rawMarkdown": "# Domani 1.2\n\n## Guided first plan\n\n- A calmer setup flow.",
      "originalFilename": "domani-1.2.md",
      "sourceType": "linear_epic",
      "sourceReference": "DEV-1004",
      "sourceContentSha256": "bc1fc72446f7a951fb736fcddece6b1f59fbac5ad2d234f4508eb5bcaa2bcb15",
      "intendedSurface": "both",
      "conversionStatus": "raw",
      "latestConversionRunId": null,
      "conversionErrorCode": null,
      "conversionErrorMessage": null,
      "rowVersion": 1,
      "createdAt": "2026-08-05T14:40:00.000Z",
      "updatedAt": "2026-08-05T14:40:00.000Z"
    },
    "duplicate": false
  },
  "meta": {
    "apiVersion": "2026-08-05",
    "requestId": "req_01J4K9X8E2T4M3Q7Y5R6W1Z0AF",
    "nextCursor": null
  }
}
```

Raw Markdown is returned only by authenticated admin detail/import responses and never by public APIs or public object storage.

## 12. Conversion API — DEV-1009

### 12.1 Endpoint

`POST /api/admin/releases/:releaseId/prds/:prdId/convert`

Access: existing authenticated PVS dashboard operator. The request requires `If-Match` for the source record.

```ts
export interface ConvertMarkdownRequest {
  rewriteMode?: 'deterministic' | 'provider_assisted';
  releaseRowVersion: number;
}

export interface ConvertMarkdownResponse {
  source: AdminReleaseSource;
  conversionRun: {
    id: string;
    sourceContentSha256: string;
    converterVersion: string;
    provider: string | null;
    model: string | null;
    status: 'succeeded';
    createdAt: string;
    completedAt: string;
    resultingNoteIds: string[];
  };
  notes: AdminReleaseNote[];
  releaseRowVersion: number;
}
```

`If-Match` carries the source `rowVersion`; `releaseRowVersion` protects the parent note set. Either stale value returns 409 without creating a run or notes.

Example request:

```json
{
  "rewriteMode": "deterministic",
  "releaseRowVersion": 3
}
```

Example response:

```json
{
  "data": {
    "source": {
      "id": "30142faf-bc40-4503-a4f7-83a8590c64d4",
      "releaseId": "5f75ab8d-8b70-4d26-a414-bc75abef882d",
      "rawMarkdown": "# Domani 1.2\n\n## Guided first plan\n\n- A calmer setup flow.",
      "originalFilename": "domani-1.2.md",
      "sourceType": "linear_epic",
      "sourceReference": "DEV-1004",
      "sourceContentSha256": "bc1fc72446f7a951fb736fcddece6b1f59fbac5ad2d234f4508eb5bcaa2bcb15",
      "intendedSurface": "both",
      "conversionStatus": "needs_review",
      "latestConversionRunId": "d616cc04-d3df-4203-b2bd-ce8fc1e7b593",
      "conversionErrorCode": null,
      "conversionErrorMessage": null,
      "rowVersion": 2,
      "createdAt": "2026-08-05T14:40:00.000Z",
      "updatedAt": "2026-08-05T15:00:00.150Z"
    },
    "conversionRun": {
      "id": "d616cc04-d3df-4203-b2bd-ce8fc1e7b593",
      "sourceContentSha256": "bc1fc72446f7a951fb736fcddece6b1f59fbac5ad2d234f4508eb5bcaa2bcb15",
      "converterVersion": "domani-markdown-v1",
      "provider": null,
      "model": null,
      "status": "succeeded",
      "createdAt": "2026-08-05T15:00:00.000Z",
      "completedAt": "2026-08-05T15:00:00.150Z",
      "resultingNoteIds": ["4f449c68-b9f7-42d2-a6c8-af40bbb118f3"]
    },
    "notes": [
      {
        "id": "4f449c68-b9f7-42d2-a6c8-af40bbb118f3",
        "releaseId": "5f75ab8d-8b70-4d26-a414-bc75abef882d",
        "noteType": "feature",
        "publicTitle": "Guided first plan",
        "publicBody": "A calmer walkthrough for choosing tomorrow's focus.",
        "technicalNotes": null,
        "platforms": ["ios", "android"],
        "isPublic": false,
        "sortOrder": 0,
        "sourcePrdId": "30142faf-bc40-4503-a4f7-83a8590c64d4",
        "sourceConversionRunId": "d616cc04-d3df-4203-b2bd-ce8fc1e7b593",
        "rowVersion": 1,
        "createdAt": "2026-08-05T15:00:00.100Z",
        "updatedAt": "2026-08-05T15:00:00.100Z",
        "archivedAt": null
      }
    ],
    "releaseRowVersion": 4
  },
  "meta": {
    "apiVersion": "2026-08-05",
    "requestId": "req_01J4K9X8E2T4M3Q7Y5R6W1Z0AG",
    "nextCursor": null
  }
}
```

Deterministic conversion runs first and is always available:

1. Normalize line endings to LF without changing stored raw Markdown.
2. Parse ATX and Setext headings and unordered/ordered list items.
3. Ignore fenced code blocks for public-note extraction.
4. Treat each level-two or deeper heading with its following prose/bullets as one candidate.
5. When no qualifying heading exists, use non-empty top-level bullet items as candidates.
6. Map explicit `feature`, `improvement`, `fix`, and `breaking` heading keywords to note type; otherwise default to `improvement`.
7. Strip HTML and unsafe links from candidate public text.
8. Default platforms to both `ios` and `android` for review; never infer `web`.
9. Create notes with `is_public = false` and contiguous order after manually authored active notes.

Provider-assisted rewriting is optional behind a backend `ReleaseNoteRewriter` interface. Provider failure may either fall back to deterministic text when the request permits it or fail the run with a retryable error; it must never publish. Provider/model identifiers, converter version, source hash, timestamps, and resulting note IDs are persisted.

On successful conversion:

- The source becomes `needs_review`.
- Generated notes remain private.
- A new successful run supersedes the previous successful generated set.
- Notes from the previous run are archived only when they remain private, have `rowVersion = 1`, and their source still points to that run.
- Previously reviewed, manually edited, approved, or public notes are retained and never overwritten.
- The previous run is marked `superseded` and points to the new run.

On failure:

- Raw Markdown remains unchanged.
- No partial notes remain.
- The run is `failed` with a retryable private error.
- The source becomes `failed` and may be retried.

Conversion may start from `raw`, `needs_review`, `approved`, or `failed`. Rerunning conversion supersedes conversion runs, not the current source record. Only importing replacement content for the same logical source key marks the previous source `superseded`; that source is immutable and cannot be converted again.

### 12.2 Approval endpoint

`POST /api/admin/releases/:releaseId/prds/:prdId/approve` requires an authenticated PVS dashboard operator and source `If-Match`. Its body is `ApproveConvertedSourceRequest`:

```json
{
  "releaseRowVersion": 4,
  "noteRowVersions": [
    {
      "id": "4f449c68-b9f7-42d2-a6c8-af40bbb118f3",
      "rowVersion": 1
    }
  ]
}
```

The source must be `needs_review`. The supplied note set must contain every active note generated by the latest successful run exactly once, with no foreign, archived, duplicate, extra, or stale note. The server validates the source, aggregate release, and note versions before writing; a mismatch returns 409 `VERSION_CONFLICT` and performs no changes. A valid approval changes the source to `approved`, increments the source and aggregate release versions once, and records an audit event in the same transaction.

The response is `ApproveConvertedSourceResponse` in the standard envelope:

```json
{
  "data": {
    "source": {
      "id": "30142faf-bc40-4503-a4f7-83a8590c64d4",
      "releaseId": "5f75ab8d-8b70-4d26-a414-bc75abef882d",
      "rawMarkdown": "# Domani 1.2\n\n## Guided first plan\n\n- A calmer setup flow.",
      "originalFilename": "domani-1.2.md",
      "sourceType": "linear_epic",
      "sourceReference": "DEV-1004",
      "sourceContentSha256": "bc1fc72446f7a951fb736fcddece6b1f59fbac5ad2d234f4508eb5bcaa2bcb15",
      "intendedSurface": "both",
      "conversionStatus": "approved",
      "latestConversionRunId": "d616cc04-d3df-4203-b2bd-ce8fc1e7b593",
      "conversionErrorCode": null,
      "conversionErrorMessage": null,
      "rowVersion": 3,
      "createdAt": "2026-08-05T14:40:00.000Z",
      "updatedAt": "2026-08-05T15:10:00.000Z"
    },
    "approvedNoteIds": ["4f449c68-b9f7-42d2-a6c8-af40bbb118f3"],
    "releaseRowVersion": 5
  },
  "meta": {
    "apiVersion": "2026-08-05",
    "requestId": "req_01J4K9X8E2T4M3Q7Y5R6W1Z0AK",
    "nextCursor": null
  }
}
```

Approval does not make notes public and does not publish the release. Publication is never part of import, conversion, or approval.

## 13. Errors, concurrency, and pagination

Every endpoint returns `X-Request-Id`. Errors use:

```json
{
  "error": {
    "code": "VERSION_CONFLICT",
    "message": "The release changed after it was loaded. Refresh and review the latest version.",
    "fieldErrors": {},
    "requestId": "req_01J4K9X8E2T4M3Q7Y5R6W1Z0AE"
  }
}
```

Status mapping:

| HTTP | Use                                                                                   |
| ---- | ------------------------------------------------------------------------------------- |
| 400  | Malformed JSON, invalid cursor, malformed `If-Match`, invalid scalar syntax.          |
| 401  | Missing, expired, malformed, or unverifiable bearer token.                            |
| 403  | Authenticated request rejected by a server-owned operation or state restriction.      |
| 404  | Missing or inaccessible release, note, or source.                                     |
| 409  | Version conflict, unique version/slug conflict, or incompatible idempotency conflict. |
| 413  | Decoded Markdown exceeds 1 MiB.                                                       |
| 415  | Unsupported content type or invalid upload type.                                      |
| 422  | Well-formed request violates field or release-state rules.                            |
| 428  | Required `If-Match` header is absent.                                                 |
| 500  | Unexpected internal failure with sanitized message.                                   |
| 503  | A requested provider-assisted rewrite is temporarily unavailable before any commit.   |

Stable codes include `VALIDATION_ERROR`, `UNSAFE_PUBLIC_MARKDOWN`, `AUTH_REQUIRED`, `AUTH_INVALID`, `FORBIDDEN`, `NOT_FOUND`, `VERSION_CONFLICT`, `VERSION_ALREADY_EXISTS`, `SLUG_ALREADY_EXISTS`, `IDEMPOTENCY_CONFLICT`, `INVALID_STATE_TRANSITION`, `PUBLIC_NOTE_REQUIRED`, `PRECONDITION_REQUIRED`, `MARKDOWN_TOO_LARGE`, `MARKDOWN_INVALID_UTF8`, `MARKDOWN_FILE_REQUIRED`, `MARKDOWN_FILE_TYPE_INVALID`, `IMPORT_CONVERSION_NOT_SUPPORTED`, and `CONVERSION_FAILED`.

Cursor pagination uses an opaque base64url-encoded, signed payload containing the active filters, ordered values, record ID, and API version. A cursor cannot be reused with different filters. Limit defaults to 20 and is capped at 100. Responses never expose total counts unless the query can supply them without a separate unbounded scan.

Every aggregate mutation locks the release row with `SELECT FOR UPDATE` before checking child rows. It validates every supplied release, note, and source version before changing data, writes all business rows and the audit event in one transaction, and returns the new aggregate version. This serialization applies to concurrent note creation as well as edit, archive, reorder, import, conversion, and approval, preventing two individually valid child mutations from silently producing a stale combined release.

## 14. Public cache invalidation

The backend owns a `ReleasePublicCacheInvalidator` interface with adapters for its API/CDN cache and the landing site revalidation receiver. Public-affecting mutations enqueue invalidation through `release_cache_invalidation_jobs`:

- publish preview or return preview to private;
- publish or unpublish;
- archive a publicly visible release;
- edit public summary, title, slug, timing, released timestamp, or type on visible content;
- create, edit, archive, public-toggle, or reorder notes under visible content.

Invalidation targets `/api/domani/releases/coming-soon`, `/api/domani/releases/changelog`, `/coming-soon`, and `/changelog` as applicable. Calls include a signed server-to-server secret and release ID, contain no private content, and are idempotent by job ID plus target.

The state mutation, audit event, and durable invalidation job are inserted in one database transaction. If the outbox insert fails, the whole transaction rolls back and the API returns 500; no successful state transition exists to repeat. The request does not wait for external cache/CDN delivery after commit. It returns the normal 200 or 201 success with the updated resource, aggregate `rowVersion`, matching `ETag`/`X-Release-ETag` headers, and `meta.cacheInvalidation` containing the durable job ID, applicable targets, and status `pending` (or `delivered` only if an in-transaction local adapter completed without external I/O).

The asynchronous dispatcher claims jobs safely, records each delivery attempt, and retries failed targets after 1 minute, 5 minutes, 15 minutes, then hourly until delivered. It emits an operational alert with the originating request ID after the third failed attempt. Delivery failure never changes an already committed success response into 503 and never asks the client to repeat the business mutation. Public cache lifetime remains bounded by the declared cache headers.

Example metadata for a committed public mutation:

```json
{
  "apiVersion": "2026-08-05",
  "requestId": "req_01J4K9X8E2T4M3Q7Y5R6W1Z0AL",
  "nextCursor": null,
  "cacheInvalidation": {
    "jobId": "a8877fc6-e93a-4608-af7d-2e7d99d60991",
    "status": "pending",
    "targets": ["/api/domani/releases/coming-soon", "/coming-soon"]
  }
}
```

## 15. Frontend behavior contracts

### 15.1 `domani-landing`

- `/coming-soon` uses the Coming Soon API only.
- `/changelog` uses the Changelog API only.
- Server-rendered initial data is preferred; client filters operate only on public DTOs.
- Both pages implement loading, API error with retry, no releases, and no platform matches states.
- Platform filters are `All`, `iOS`, and `Android`.
- Metadata has unique titles, descriptions, canonical URLs, and social cards.
- Sitemap includes both routes.
- Coming Soon is a top-level desktop header link.
- Resources contains Blog, FAQ, Changelog, and Support.
- Changelog is not a top-level desktop header link.
- Mobile navigation exposes the same destinations with keyboard and screen-reader semantics.
- Footer Product links include Features, Pricing, Coming Soon, and Changelog; Resources include Blog, Compare, FAQ, and Support.

The local mockups in `docs/planning/mockups/` are visual sources of truth for layout, spacing, typography, sage palette, release cards, filters, badges, and responsive translation.

### 15.2 `pvs-site`

- Add `Releases` to the existing Domani dashboard subnavigation.
- Use API DTOs and bearer auth; do not import the service-role key or query release tables.
- Preserve the loaded `rowVersion` and send it through `If-Match` for every mutation.
- On 409, preserve unsaved local edits, show a conflict state, and offer refresh/review instead of silently retrying.
- Reuse the existing dashboard session and never introduce a Domani or release-specific login.
- Use the release-list `capabilities` object to gate the New Release control, direct access to the create screen, and archived-release navigation; do not infer these permissions from local auth metadata or release contents.
- Use `allowedActions` from the current detail response instead of deriving state-sensitive permissions in the browser.
- Import shows file validation and raw Markdown preview before submission.
- Conversion review keeps source Markdown visible beside editable private note drafts.
- Publish actions require an explicit confirmation summarizing the public effect.

The four dashboard mockups in `docs/planning/mockups/dashboard/` are visual sources of truth for the release list, release detail/editor, Markdown import, and conversion review screens.

## 16. Verification and QA contract

### 16.1 Schema and backend

- Apply migrations to a disposable Supabase environment.
- Verify every constraint and partial unique index with positive and negative SQL cases.
- Test canonical version boundaries, leading-zero rejection, generated component values, and semantic-version uniqueness.
- Verify anon/authenticated clients cannot select private tables directly.
- Verify public serializers use allowlists and never emit forbidden field names.
- Test all state transitions, PVS-token boundaries, audit writes, row-version conflicts, and atomic reorder rollback.
- Verify every admin route accepts the existing PVS dashboard session, rejects missing or invalid PVS tokens, never queries Domani Auth, and performs all release persistence through the Domani service client.
- Test concurrent note create/edit/archive/reorder and source import/convert/approve operations against the aggregate release version, including complete rollback on a stale child or parent.
- Test JSON and multipart import, UTF-8 validation, NUL rejection, 1 MiB boundary, idempotency, and `convert=true` rejection.
- Test replacement-source supersession, exact-hash duplicates of current and historical sources, and preservation of prior runs and notes.
- Test deterministic conversion, rerun supersession, preservation of reviewed notes, and rollback on failure.
- Test the public Markdown allowlist and renderer against raw HTML, images, encoded unsafe schemes, malformed links, and allowed links without executable attributes.
- Test public ordering, filters, empty collections, timeline precedence, and cache headers.
- Test transactional outbox rollback, success receipts, dispatcher retries, idempotent delivery, and every public-affecting invalidation target.
- Test that stored audit entity values, API filters, and response DTOs use the same four-value vocabulary.
- Verify every canonical audit action's endpoint mapping, database check constraint, exact filter behavior, multi-event import/conversion cardinality, and the absence of an audit row for mutation-free duplicate imports.

### 16.2 Landing visual and logical QA

- Compare desktop and mobile pages to the full-resolution public mockups.
- Verify long titles, long note bodies, both platforms, one platform, TBD timing, multiple versions, and empty/error/loading states.
- Verify keyboard navigation, focus visibility, dropdown semantics, mobile menu behavior, reduced motion, and heading hierarchy.
- Verify metadata, canonical URLs, robots behavior, sitemap entries, and public-field exclusion in rendered HTML.

### 16.3 Dashboard visual and logical QA

- Compare all four screens at matching desktop dimensions and representative mobile widths to the full-resolution mockups.
- Verify list search/filter/sort, create/edit, note reorder, role-specific controls, publish confirmations, and archived records.
- Verify import paste/upload, invalid file feedback, duplicate import, source queue states, deterministic conversion, side-by-side review, approval, and retained raw source.
- Verify 401, 403, 404, 409, 413, 415, 422, 428, 500, and 503 presentation where reachable.
- Verify unsaved edits survive a 409 conflict until the user chooses refresh or discard.
- Verify audit filters/pagination and approval request/response handling use the documented DTOs without rendering excluded private fields.

## 17. Definition of done by downstream ticket

| Ticket   | Required evidence                                                                                                        |
| -------- | ------------------------------------------------------------------------------------------------------------------------ |
| DEV-1006 | Reviewed migration, schema verification, RLS/access evidence, role model, indexes, and public/private separation tests.  |
| DEV-1007 | Both public endpoints, allowlist tests, ordering/timeline tests, cache headers, and empty states.                        |
| DEV-1042 | Complete admin API, bearer validation, roles, audit, transitions, concurrency, reorder, archive, and invalidation tests. |
| DEV-1008 | JSON and multipart import with size/encoding/type/idempotency/security tests.                                            |
| DEV-1009 | Deterministic conversion, optional provider boundary, provenance, supersession, failure rollback, and review gating.     |
| DEV-1010 | Mockup-faithful public pages, responsive browser evidence, metadata/sitemap, and all data states.                        |
| DEV-1011 | Accessible desktop/mobile navigation and footer with analytics where existing conventions apply.                         |
| DEV-1012 | Mockup-faithful management screens using only admin APIs, role controls, conflicts, and responsive browser evidence.     |
| DEV-1013 | Mockup-faithful import/review screens, raw-source comparison, private drafts, and API error handling.                    |
| DEV-1014 | Executed cross-repository matrix proving every epic acceptance criterion and public/private boundary.                    |

No downstream ticket is complete until its verification passes, its ticket branch is committed and pushed, its pull request targets `dev-1004-changelog-coming-soon`, and its Linear status is In Review.
