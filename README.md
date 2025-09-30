# Welcome to your ZAMA tutorial

This repository contains the source for the "Hello fhEVM" tutorial. The React site walks you through creating a confidential Cookie Jar dApp step by step while keeping the code and the narrative in sync.

## Prerequisites
- Node.js 22 or newer (recommended via [`nvm`](https://github.com/nvm-sh/nvm#installing-and-updating))
- npm 10+ (bundled with Node 22)
- A browser wallet such as MetaMask for the frontend walkthrough

```sh
# make sure you're on the supported toolchain
nvm install 22
nvm use 22
```

## Run the documentation site locally

```sh
npm install
npm run dev
```

This starts Vite on http://localhost:5173 with hot module reloading so you can skim, edit, and preview the tutorial side by side.

## Additional scripts
- `npm run build` - generate a production build of the documentation
- `npm run preview` - run the production build locally for smoke testing
- `npm run lint` - check TypeScript, hooks, and formatting rules

## Contributing tweaks
The tutorial favours copy-pastable snippets and actionable callouts. When updating steps, keep the language concise and ensure any commands run cleanly on Node 22. If you introduce new environment variables or scripts, surface them both in the relevant step and here in the README.

## Need more context?
Head to [docs.zama.ai](https://docs.zama.ai) for the full fhEVM documentation or join the [Zama Discord](https://discord.gg/zama) to get help from the community.
