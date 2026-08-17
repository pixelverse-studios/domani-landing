# How to Publish Domani Product Updates

**For:** Anyone preparing or publishing Domani release updates

**Last updated:** August 17, 2026

Use this guide whenever you need to tell customers about something that is coming to Domani or has already been released.

You do not need to be a developer to use these tools. You only need accurate information about the release and access to the Pixelverse Studios dashboard.

## Where everything happens

Create and manage releases here:

**[Open Domani Releases in the PVS Dashboard](https://pixelversestudios.io/dashboard/domani/releases)**

This is the only admin area you need. Sign in with your normal Pixelverse Studios account. There is no separate Domani admin login.

Customers see published updates on two pages:

- **[Coming Soon](https://www.domani-app.com/coming-soon):** Updates planned for the future
- **[Changelog](https://www.domani-app.com/changelog):** Updates that have already been released

You do not choose the public page yourself. The release date handles that automatically.

| If the release has... | Customers will see it on... |
|---|---|
| A future date, future month, or no confirmed date yet | Coming Soon |
| A confirmed release date of today or earlier | Changelog |

When the release date arrives, the update moves from Coming Soon to the Changelog automatically. The system uses New York time.

## Before you start

Try to have these details ready:

- The app version, such as `1.4.2`
- A plain-English title
- The expected release date or month, if known
- A short explanation of why the update matters
- A list of the customer-facing changes
- Whether each change affects iOS, Android, or both
- Any private notes the team may need

It is fine if some details are still being worked out. Start with a Draft and update it as plans become clearer.

## Create and publish a release

### 1. Start a Draft

Open Domani Releases in the PVS Dashboard and create a new release. Keep the status set to **Draft** while you are working.

A Draft is private. Customers cannot see it.

### 2. Fill in the release details

| Field | What to enter |
|---|---|
| **Version** | The full app version in `X.Y.Z` format, such as `1.4.2` |
| **Release title** | A short title that describes the main benefit to the customer |
| **Quick description** | One short paragraph explaining what the release is about |
| **Date or month** | The best timing information you have today |
| **Platforms** | iOS, Android, or both |

Write the title for customers, not for the internal team.

**Good:** “Faster evening planning”

**Avoid:** “Planning flow phase two”

The dashboard works out the release type from the version:

- `2.0.0` is a **major** release
- `1.3.0` is a **minor** release
- `1.3.1` is a **patch** release

You do not need to select the type yourself.

### 3. Add the release highlights

Release highlights are the main part of the public update. Add one highlight for each feature, improvement, or fix customers should know about.

For each highlight:

1. Give it a clear title.
2. Explain what changed and why it is useful.
3. Choose the category that fits best:
   - **Feature:** Something new
   - **Improvement:** Something existing that now works better
   - **Fix:** A problem that has been corrected
   - **Breaking change:** A change that may require customers to do something differently
4. Choose the affected platform or platforms.
5. Use headings, bold text, links, bullets, or numbered lists when they make the information easier to scan.
6. Put the most important highlights first.

Highlights are public by default. If a highlight is only for the team, intentionally mark it **private** or **team-only**.

Write about the result for the customer:

**Good:** “Save routines you use often as templates, so tomorrow’s plan takes less time to build.”

**Avoid:** “Added template CRUD endpoints and refactored task creation.”

### 4. Add Team Notes, if needed

Team Notes are always private. Use them for information such as:

- QA reminders
- Known limitations
- Support instructions
- Launch coordination
- Technical context
- Questions that still need an answer

Team Notes never appear on the public website. Even so, do not put passwords, security keys, or sensitive customer information in them.

### 5. Review before publishing

Read the release once as if you were a customer seeing it for the first time.

Check that:

- [ ] The version matches the app release.
- [ ] The title and description make sense without internal context.
- [ ] Every public statement is accurate.
- [ ] The most important highlights come first.
- [ ] Categories and platforms are correct.
- [ ] Private information is in Team Notes or marked team-only.
- [ ] Dates are still realistic.
- [ ] Links, lists, spelling, and formatting look right.

For a major release or a sensitive announcement, have someone else review it before publishing. For a small typo correction, a second review is usually unnecessary.

### 6. Publish

When the release is ready for customers:

1. Change the status from **Draft** to **Published**.
2. Save the release.
3. Wait for the success message before leaving the page.

Published means public. The date determines whether it appears on Coming Soon or the Changelog.

### 7. Check the live page

Open the page where the release should appear:

- [Coming Soon](https://www.domani-app.com/coming-soon)
- [Changelog](https://www.domani-app.com/changelog)

Confirm that:

- [ ] The release is on the correct page.
- [ ] The version, date, title, and platforms are correct.
- [ ] The description and highlights are easy to read.
- [ ] Highlights appear in the right order.
- [ ] Team Notes and team-only highlights are not visible.
- [ ] Links work.
- [ ] The page looks good on both a computer and a phone.

It can take up to a minute for a newly published change to appear. Wait briefly and refresh once before assuming something is wrong.

## If you see an Import Markdown option

Markdown import can save time when the release information already exists in a `.md` file. It gives you a starting draft; it does not create finished customer copy.

1. Create or open a Draft release.
2. Upload the Markdown file.
3. Check that you selected the right file.
4. Convert it into a release draft.
5. Review every field and highlight.
6. Rewrite technical or awkward wording.
7. Remove duplicates.
8. Move private details into Team Notes.
9. Follow the normal review and publishing steps above.

Uploading or converting a file never publishes the release. You must still review it and intentionally change the status to Published.

Never upload a file containing passwords, security keys, or sensitive customer information.

If you do not see the import option, create the release manually. Nothing is wrong with your account.

## Making changes after publishing

You can correct a published release:

1. Open it in the PVS Dashboard.
2. Make the correction.
3. Save.
4. Check the public page again.

If you need to remove a release from the website temporarily, change it back to **Draft** and save it.

Only archive a release when the team has agreed that it should be retired from the active release history. Do not archive something just because it needs more editing.

## If something goes wrong

### I cannot open the release dashboard

1. Make sure you are signing in through the Pixelverse Studios dashboard, not a Domani admin page.
2. Sign out and back in with your normal PVS account.
3. If you still cannot get in, ask the dashboard owner to check your access.

### My changes will not save

1. Read the message on the page; it may name the field that needs attention.
2. Make sure the version includes all three numbers, such as `1.4.2`.
3. Check that required titles and descriptions are filled in.
4. Copy any unsaved writing somewhere safe before refreshing.
5. If someone else edited the release, compare their newer version before entering your changes again.

### I published a release, but it is not on the website

Check these in order:

1. Is the status **Published**?
2. Does it have a date, month, or “not confirmed” timing?
3. Are you looking at the correct public page for that timing?
4. Is at least one highlight public?
5. Have you waited one minute and refreshed?

If the answer to all five is yes, send the technical owner:

- The release version
- A link to the release in the dashboard
- The page where you expected it to appear
- What happened instead
- The time you noticed the problem
- A screenshot

### The release is on the wrong public page

Check its timing. A future date, future month, or unconfirmed date belongs on Coming Soon. A confirmed date of today or earlier belongs on the Changelog.

### Markdown import did not work

- Make sure the file ends in `.md`.
- Remove images, attachments, or unusual embedded content.
- Use simple headings and lists, then try again.
- If the conversion is messy, edit the result manually or create the release without importing.

### Private information is showing publicly

Act immediately:

1. Change the release back to Draft and save it. If only one highlight is affected, mark that highlight team-only instead.
2. Check the public page and make sure the information is gone.
3. Tell the release owner and technical owner what happened.
4. If a password, security key, or personal information was exposed, begin the company’s security response right away.

## Training a new teammate

Use this short hands-on process instead of asking them to learn everything at once:

1. Give them their own PVS Dashboard account. Never share a login.
2. Open an existing Draft together and explain each section.
3. Show them the difference between Draft and Published.
4. Show them Coming Soon and the Changelog.
5. Point out which content is public and which content is only for the team.
6. Have them create a practice Draft without publishing it.
7. Review the practice release together.
8. Make sure they know who approves publishing and who handles technical problems.

## Who handles what

The person managing a release is responsible for the content, timing, review, publishing, and checking the live result.

The technical owner is responsible for keeping these three parts connected and working:

1. The PVS server, which stores release information
2. The PVS dashboard, where the team manages releases
3. The Domani website, where customers read them

Release managers should never need to change server settings, database settings, website hosting, or secret values.

When asking for technical help, send the information listed in the troubleshooting section. Never send passwords or secret values.

## Quick publishing checklist

Use this every time:

- [ ] Correct version
- [ ] Clear title and short description
- [ ] Accurate date or month
- [ ] Correct platforms
- [ ] Highlights are clear and in the right order
- [ ] Private information is not in public fields
- [ ] Important or sensitive releases have a second review
- [ ] Status changed to Published and saved successfully
- [ ] Correct public page checked on a computer and phone
