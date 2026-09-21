# GitHub Profile Page — UptimeAI UI Assignment

A responsive recreation of the GitHub profile page for
[`shreeramk`](https://github.com/shreeramk), built with React and TypeScript.

## Stack

- React 19 + TypeScript
- Vite
- CSS Modules
- Apache ECharts (contribution heatmap)
- Lucide React (icons)
- Native `fetch` against the public GitHub REST API

## Getting started

```bash
npm install
npm run dev      # start dev server at http://localhost:5173
npm run build    # type-check and create a production build
npm run preview  # serve the production build locally
npm run lint     # run oxlint
```

## Project structure

```
src/
├── components/   UI components (one folder per component)
├── pages/        Page-level layouts
├── services/     API clients
├── hooks/        Data-fetching hooks
├── types/        Shared TypeScript interfaces
└── data/         Static / mock data
```
