# MuLearn Home

A modern, scalable web application for the MuLearn community built with Next.js, TypeScript, and Tailwind CSS

---

## 🚀 Features

- **Next.js App Router:** File-based routing for easy page management
- **TypeScript:** Type safety across the codebase
- **Tailwind CSS:** Rapid UI development
- **Modular Structure:** Organized folders for components, services, and data
- **Path Aliases:** Clean and maintainable imports
- **Centralized Data:** All static data in `src/data` folder
- **CDN Service:** Centralized asset URL management via `src/services/cdn.ts`
- **Brand Guide:** All UI and assets follow the [MuLearn Brand Guide](https://mulearn.org/r/brandguide)

---

## 📁 Folder Structure

```
mulearnhome/
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Main layout (global styles, Navbar)
│   │   ├── page.tsx          # Home page (/)
│   │   ├── team/page.tsx     # /team route
│   │   ├── about/page.tsx    # /about route
│   │   ├── donation/page.tsx # /donation route
│   ├── components/           # Common UI components (Navbar, Footer, etc.)
│   ├── data/                 # All static/mock data (nav, team, values, etc.)
│   ├── services/             # API, business logic, CDN service
│   │   ├── cdn.ts            # CDN service for asset URLs
│   └── globals.d.ts          # TypeScript CSS module declaration
├── public/                   # Static assets (images, fonts, etc.)
├── package.json              # Project metadata and dependencies
├── tsconfig.json             # TypeScript config (path aliases)
├── next.config.ts            # Next.js config
├── postcss.config.mjs        # Tailwind/PostCSS config
├── eslint.config.mjs         # ESLint config
├── README.md                 # Project documentation
└── CONTRIBUTION.md           # Contribution guidelines
```

---

## 🏁 Getting Started

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd mulearnhome
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000)

---

## ➕ Adding a New Page

- Create a folder under `src/app` (e.g., `src/app/about`)
- Add a `page.tsx` file inside it
- The route will be available at `/about`

---

## 📊 Centralized Data

- All static data (navigation, team, values, etc.) should be stored and exported from `src/data` folder.
- Import data from this file wherever needed in your components/pages.

---

## 🌐 CDN Service

- The CDN service (`src/services/cdn.ts`) centralizes asset URL management.
- Use it to fetch or construct URLs for images, files, or other static resources.

**Example usage:**

```ts
import { cdnUrl } from "@/services/cdn";
const logoUrl = cdnUrl("images/logo.png");
```

---

## 🎨 MuLearn UI System

All UI in this project uses the MuLearn brand color palette and font system:

### Colors

Defined as CSS variables in `src/app/globals.css`:

- `--mulearn-trusty`: linear-gradient(135deg, #2E85FE 0%, #AF2EE6 100%)
- `--mulearn-trusty-blue`: #2E85FE
- `--mulearn-duke-purple`: #AF2EE6
- `--mulearn-greyish`: #c4c4c4
- `--mulearn-blackish`: #1a1a1a
- `--mulearn-whitish`: #fefefe

### Extended Colors

Defined as CSS variables in `src/app/globals.css`:

- `--mulearn-gray-600`: #666771 (used for navigation and muted text)

**Note:**

- Do not use hardcoded color values (e.g., #2E85FE, #AF2EE6, #666771) in components. Always use the root CSS variables for colors.

### Fonts

- **Plus Jakarta Sans** (`font-sans`): Body and UI text
- **Circe Rounded** (`font-display`): Headings and display text

### Components

- All UI components use [shadcn/ui](https://ui.shadcn.com/) with custom MuLearn variants
- See `src/components/ui/mulearn-shadcn-doc.md` for usage and extension guidelines

### Usage Example

```tsx
<Button variant="mulearn">MuLearn Gradient Button</Button>
<Card className="bg-mulearn-trusty text-mulearn-whitish">...</Card>
<h1 className="font-display text-mulearn-trusty">Gradient Heading</h1>
```

---

## 🤝 Contribution Guidelines

See [CONTRIBUTION.md](CONTRIBUTION.md) for details.

---

## 📄 License

MIT
