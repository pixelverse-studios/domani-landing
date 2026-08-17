# Domani Release Communication SOP

**Audience:** Anyone responsible for preparing, reviewing, or publishing Domani product updates  
**Owner:** Domani / Pixelverse Studios  
**Last updated:** August 17, 2026  

## Purpose

This guide explains how to turn completed or upcoming Domani work into clear customer-facing release updates. It is written for release coordinators, product owners, and other team members—not developers.

The goal is simple: customers should be able to understand what is coming, what has shipped, and why it matters.

## The system at a glance

There is one place where the team manages releases:

- **PVS Dashboard:** Create, edit, review, and publish releases at [pixelversestudios.io/dashboard/domani/releases](https://pixelversestudios.io/dashboard/domani/releases).
- **Coming Soon:** Customers see published future releases at [domani-app.com/coming-soon](https://www.domani-app.com/coming-soon).
- **Changelog:** Customers see published released updates at [domani-app.com/changelog](https://www.domani-app.com/changelog).

You do not need a separate Domani admin account. Sign in through the normal Pixelverse Studios dashboard.

The system automatically decides which public page a published release belongs on:

- A future date or month appears on **Coming Soon**.
- A release dated today or earlier appears on the **Changelog**.
- At the appropriate date, a release moves from Coming Soon to the Changelog automatically. Dates use New York time.

## Roles

One person may perform more than one role, but every release should have these responsibilities covered:

- **Release owner:** Collects the information and prepares the release.
- **Reviewer:** Checks clarity, accuracy, timing, and what is safe to share publicly.
- **Publisher:** Gives final approval and changes the release from Draft to Published.
- **Technical contact:** Helps only when access, data, or website delivery is not working as expected.

Whenever practical, the release owner and reviewer should be different people.

## Plain-language glossary

| Term | What it means |
|---|---|
| **Draft** | Visible only to the team. Safe to edit and incomplete. |
| **Published** | Approved for customers to see. Its date determines whether it appears on Coming Soon or the Changelog. |
| **Quick description** | A short introduction that explains the overall value of the release. |
| **Release highlight** | One customer-facing feature, improvement, fix, or important change within a release. |
| **Team notes** | Private context for the team, such as QA reminders, technical details, support notes, or open questions. These never appear publicly. |
| **Markdown source** | A text file that some release workflows can import as a starting point. Importing or converting it does not publish anything. |

## Before creating a release

Gather the following:

- The version number in `X.Y.Z` format, such as `1.4.2`.
- A working title customers will understand.
- The expected release date or month, if known.
- A short explanation of the overall customer benefit.
- The customer-facing changes included in the release.
- The affected platforms: iOS, Android, or both.
- Any private context the team may need later.

### Understanding the version number

The release type is calculated automatically from the version number:

- **Major — X.0.0:** A large release that may significantly change the product.
- **Minor — X.Y.0, where Y is greater than zero:** New features or meaningful improvements that remain compatible with the current major version.
- **Patch — X.Y.Z, where Z is greater than zero:** Bug fixes and small improvements.

Do not choose a release type manually. Enter the correct version and let the dashboard derive it.

## Standard release workflow

### 1. Create the release as a Draft

Open the Domani Releases area in the PVS Dashboard and create a new release.

Enter:

- **Version:** Use the complete `X.Y.Z` format.
- **Release title:** Describe the main customer benefit, not an internal project name.
- **Quick description:** Keep this concise—usually one short paragraph.
- **Timing:** Enter the best known date or month. Update it later if plans change.
- **Platforms:** Select every platform affected.

Save the release as **Draft** while it is being prepared.

### 2. Add release highlights

The highlights should carry most of the release story. Add one highlight for each distinct customer-facing change.

For every highlight:

1. Choose the most accurate category:
   - **Feature:** A new capability.
   - **Improvement:** A better version of something that already exists.
   - **Fix:** A corrected problem.
   - **Breaking change:** A change that may require customers to adjust how they use the product.
2. Write a clear title.
3. Explain what changed and why it matters to the customer.
4. Use headings, bold text, links, and bullet or numbered lists when they make longer information easier to scan.
5. Confirm the correct platform or platforms.
6. Reorder the highlights so the most important information appears first.

New highlights are public by default. Mark a highlight **team-only/private** only when customers should not see it.

Good customer-facing wording:

> Plan recurring routines faster with reusable task templates.

Avoid internal wording:

> Added template CRUD endpoints and refactored task creation.

### 3. Add private team notes when useful

Use Team Notes for information that helps the internal team but does not belong in public copy, such as:

- QA steps or known limitations.
- Support guidance.
- Internal launch coordination.
- Technical or database details.
- Questions that must be resolved before publishing.

Do not place passwords, API keys, or other secrets in Team Notes.

### 4. Review the complete release

Before publishing, ask a reviewer to complete the checklist below.

#### Content check

- [ ] The version follows `X.Y.Z` and matches the product build.
- [ ] The title and quick description are understandable without technical knowledge.
- [ ] Every public claim is accurate and approved.
- [ ] Highlights are ordered by customer importance.
- [ ] Each highlight has the correct category and platform.
- [ ] Internal details are marked team-only or placed in Team Notes.
- [ ] Dates and timing are still realistic.
- [ ] Spelling, links, lists, and formatting have been checked.

#### Visual check

- [ ] Longer paragraphs and lists are easy to scan.
- [ ] Headings are used consistently.
- [ ] The release looks good in the dashboard preview.
- [ ] Nothing private appears in the public preview.

### 5. Publish

When the release is approved:

1. Change its status from **Draft** to **Published**.
2. Save the release.
3. Confirm the save succeeds before leaving the page.

Publishing makes the release eligible to appear publicly. Its timing controls where it appears:

- Future timing → **Coming Soon**
- Today or earlier → **Changelog**

### 6. Verify the public result

Open the appropriate public page and check the release:

- [Coming Soon](https://www.domani-app.com/coming-soon)
- [Changelog](https://www.domani-app.com/changelog)

Verify:

- [ ] The release appears on the correct page.
- [ ] The version, date, title, and platforms are correct.
- [ ] The quick description is readable.
- [ ] Public highlights appear in the intended order.
- [ ] Team-only highlights and Team Notes are not visible.
- [ ] Links work.
- [ ] The page is readable on both a computer and a phone.

If the release does not appear immediately, wait about one minute and refresh once before troubleshooting.

## Starting from a Markdown file, when available

If the dashboard shows a Markdown import option, it can provide a useful starting point when release information already exists in a document or has been generated from project work. If the option is not visible, prepare the release manually using the standard workflow.

1. Create or open a Draft release.
2. Upload the Markdown source.
3. Confirm that the correct source was attached.
4. Convert it into a release draft.
5. Review every generated field and highlight.
6. Rewrite technical or awkward wording for customers.
7. Remove duplicates and move private details into Team Notes.
8. Complete the normal review and publishing steps above.

Important safeguards:

- Importing and converting are preparation steps; they do **not** publish the release.
- Generated content is not automatically approved.
- The original source remains available for comparison and recordkeeping.
- Never upload a file containing passwords, keys, customer personal data, or other secrets.

## Editing a published release

Published releases can be corrected when necessary.

1. Open the release in the PVS Dashboard.
2. Make the smallest necessary correction.
3. Review the public content again.
4. Save.
5. Recheck the appropriate public page.

For a substantial wording or scope change, ask another person to review it before saving.

To remove a release from public view temporarily, change it back to **Draft** and save. Use archive only when the record is no longer part of the active release history and the team has agreed to retire it.

## Troubleshooting

### I cannot access the release dashboard

- Confirm you are using the Pixelverse Studios dashboard, not a Domani admin login.
- Sign out and back in through the normal PVS login.
- Confirm your PVS account has the required dashboard access.
- If access still fails, contact the dashboard administrator.

### My changes will not save

- Look for a message explaining which field needs attention.
- Confirm the version uses the complete `X.Y.Z` format.
- Confirm required titles and content are present.
- Refresh only after copying any unsaved text somewhere safe.
- If another person edited the same release, compare their newer version before reapplying your changes.

### A published release is not visible

Check these items in order:

1. The status is **Published**, not Draft.
2. The release has valid timing information.
3. You are checking the correct page for its date.
4. At least one highlight intended for customers is public.
5. You waited about one minute and refreshed the page.

If all five are correct, contact the technical owner with the release version, dashboard link, expected page, and a screenshot.

### A release is on the wrong public page

Check its date or target month. Future releases belong on Coming Soon; releases dated today or earlier belong on the Changelog. The changeover follows New York time.

### A Markdown file is rejected or converts poorly

- Confirm it is a Markdown (`.md`) text file and not unusually large.
- Remove unsupported attachments or embedded media.
- Use clear headings and lists before trying again.
- If conversion succeeds but the copy is poor, edit it manually; conversion is only a starting point.

### Private information appears publicly

Treat this as urgent:

1. Change the release to Draft and save, or mark the affected highlight team-only.
2. Confirm it has disappeared from the public page.
3. Notify the release owner and technical contact.
4. If a secret or personal data was exposed, begin the appropriate security response immediately.

## New team member onboarding

Before a new teammate manages releases, complete the following:

- [ ] Give them their own PVS Dashboard account. Never share logins.
- [ ] Confirm they can open Domani Releases.
- [ ] Walk through one existing Draft together.
- [ ] Explain Draft versus Published and Coming Soon versus Changelog.
- [ ] Show the difference between public highlights and Team Notes.
- [ ] Have them create a practice Draft without publishing it.
- [ ] Review the practice release together.
- [ ] Identify who can approve publishing and who handles technical issues.

## System ownership and support

Release managers should not need to configure servers, databases, website hosting, or secret values. Those belong to the technical owner.

The release system has three parts:

1. **PVS server:** Stores and delivers release data.
2. **PVS dashboard:** Where the team signs in and manages releases.
3. **Domani website:** Displays Coming Soon and Changelog content to customers.

When the release system itself is updated, the technical owner should normally update it in this order:

1. PVS server
2. PVS dashboard
3. Domani website

The technical owner is responsible for:

- Keeping private configuration values in the approved hosting or secrets manager, never in this document or a team chat.
- Keeping the server and Domani website connected so published changes refresh correctly.
- Maintaining PVS Dashboard sign-in as the only admin sign-in system. A separate Domani admin account should not be added.
- Keeping PVS account information separate from the Domani release database.
- Verifying the dashboard login, one Draft save, one safe publish/unpublish test, Coming Soon, Changelog, and desktop/mobile display after a system update.

When asking for technical help, provide the release version, dashboard link, expected result, actual result, time of the problem, and a screenshot. Never send passwords or secret values.

## One-minute publishing checklist

- [ ] Correct `X.Y.Z` version
- [ ] Clear title and short description
- [ ] Accurate date or month
- [ ] Correct platforms
- [ ] Highlights ordered and understandable
- [ ] Private information kept out of public fields
- [ ] Second-person review complete
- [ ] Status changed to Published and saved successfully
- [ ] Correct public page verified on desktop and mobile
