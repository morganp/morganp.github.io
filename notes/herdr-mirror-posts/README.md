# Parked herdr-mirror posts

Two drafts pulled out of `content/posts/` on 2026-09-24, so that Pelican does
not build them at all. While they sat in the content tree as `Status: draft`,
they still rendered to `/drafts/<slug>.html` and deployed, which left them
publicly reachable.

- `2026-09-19_herdr-mirror-remote-sidebar.md`, slug `herdr-mirror-remote-sidebar`
- `2026-09-19_herdr-mirror-working-inside.md`, slug `herdr-mirror-working-inside`

Both were published on 2026-09-19 and unpublished on 2026-09-23. They covered
remote mirroring before anything had introduced herdr itself, which is the
reason they came down. The introduction now lives at
`content/posts/2026-09-23_herdr-introduction.md`.

To rewrite either one, move the file back into `content/posts/` and set
`Status: published` when it is ready. Images are still in place at
`content/images/Unix/HerdrMirror/`: `01-hero-*` is used by the introduction,
and `02-hero-*` belongs to the working-inside draft and is otherwise unused.

Source material is in the vault: `reference/herdr-setup.md` for the live pve
topology and recovery commands, and the `projects/dotfiles.md` entries for
2026-08-14, 2026-08-16, 2026-09-17, 2026-09-18 and 2026-09-19.
