# visual-workspace

A visual workspace for creating diagrams, figures, and documents with coding agents.

**Under development.** The first studio ticket provides a neutral standalone
draft, isolated light/dark previews, and portable single-file HTML delivery.

## Development

Follow the [setup guide](docs/development.md) for installation and prerequisites,
then start the local development server:

```sh
npm run dev
```

Find and export saved work with the gallery stopped using
`npm run studio -- list` and `npm run studio -- export source-to-delivery dark artifacts/exports`.
See the [public contract](docs/studio-contract.md) for owner extensions.

See [AGENTS.md](AGENTS.md) for contribution guidance and the
[project charter](Project-Charter.md) for scope.

## Attribution

Agent skills come from [Matt Pocock](https://github.com/mattpocock)'s
[skills repository](https://github.com/mattpocock/skills), used under the
[MIT license](third_party/mattpocock-skills/LICENSE).
