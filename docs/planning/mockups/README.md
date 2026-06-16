# Domani Release Page Mockups

Static visual mockups for the public release communication pages:

- `coming-soon-public.html`
- `changelog-public.html`
- `release-pages.css`

These files are planning artifacts only. They are not wired into Next.js routes.

## Design Notes

- Extends the current Domani landing page visual language: warm white background, sage accents, soft borders, rounded panels, and restrained gradients.
- Keeps `Coming Soon` as a primary nav item.
- Keeps `Changelog` inside Resources and footer placement.
- Uses version-first release cards to match the planned Supabase model.
- Shows iOS/Android platform tags, with no public web platform label.
- Keeps public-facing copy focused on release value, timing, and platform support.

## Implementation Translation

The production implementation should convert the static structures into reusable components:

- `ReleaseHero`
- `ReleaseFilterBar`
- `ReleaseVersionCard`
- `ReleaseNoteList`
- `PlatformTag`
- `ReleaseInfoPanel`

Public data should come from public-safe server helpers or APIs that select only approved fields.
