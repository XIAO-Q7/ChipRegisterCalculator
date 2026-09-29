# Chip Register Calculator

**English** | [简体中文](README.zh-CN.md)

A visual register management tool for embedded and hardware engineers, featuring multi-radix value calculation, bit-field grouping, and project-level organization.

Live demo: <https://chip.xiaoq7.com>

## Tech Stack

- **Vue 3** — Composition API + `<script setup>` SFCs
- **TypeScript** — fully typed
- **Vite 8** — build tool
- **Pinia 3** — global state management
- **Tailwind CSS 4** — utility-first styling with dark mode support

## Features

### Bit Grid Visualization (BitGrid)

- Displays the register as a 16-column bit grid, showing the state of every bit at a glance
- **Left-click** a bit to toggle it between 0 and 1
- **Left-drag** across a range to flip multiple contiguous bits at once
- **Right-drag** across a range to create a bit group
- **Clear** button resets all bits to 0
- Supports 8/16/32/64-bit and custom register widths

### Multi-Radix Display and Editing

- Shows **HEX**, **DEC**, **BIN**, and **OCT** values simultaneously
- Editing any radix instantly syncs all other radixes and the bit grid
- Switch between **Little Endian** and **Big Endian** bit ordering

### Bit Groups

- Split a register into named bit fields
- Each group is color-coded, with its boundary highlighted in the bit grid
- Edit a group's value directly in HEX or DEC
- **Mapping rules**: define "value equals" or "bit set" rules, then click to apply or remove them (toggle behavior)
- Group ranges cannot overlap; selecting the exact same range again removes that group

### Project Mode

- **Simple mode**: quickly work with a single default register
- **Project mode**: organize registers hierarchically as `Chip → Register`, ideal for multi-chip, multi-register work
- The project navigator supports collapsing/expanding and adding chips and registers on the fly

### Config Import / Export

- Export as JSON, either copied to the clipboard or saved as a file
- Import by pasting JSON or uploading a file to fully restore your workspace

### Internationalization

- The UI is available in **English** and **Simplified Chinese**; switch with the buttons in the top-right corner
- The language is auto-detected from the browser on first visit, and your choice is remembered afterwards
- All UI strings live in `src/i18n.ts`, making it easy to edit text or add a new language

## Project Structure

```
ChipRegisterCalculator/
├── index.html                  # Entry HTML
├── vite.config.ts              # Vite config (Vue + Tailwind plugins)
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── public/
│   └── favicon.svg             # Site icon
└── src/
    ├── main.ts                 # App entry, mounts Pinia + Vue
    ├── App.vue                 # Root component, three-column layout + language switcher
    ├── i18n.ts                 # UI strings and locale switching (en/zh)
    ├── style.css               # Global styles + Tailwind import
    ├── stores/
    │   └── register.ts         # Pinia store: core state and business logic
    └── components/
        ├── BitGrid.vue         # Bit grid visualization
        ├── ValueDisplay.vue    # Multi-radix display and editing
        ├── GroupList.vue       # Bit group management
        ├── ProjectNavigator.vue # Project / chip / register navigation
        ├── ConfigManager.vue   # Config import / export
        └── Notification.vue    # Global error toast
```

## Getting Started

### Install dependencies

```bash
npm install
```

### Start the dev server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Usage

| Action | How |
|--------|-----|
| Toggle a bit | **Left-click** a bit in the grid |
| Flip a range of bits | **Left-drag** across contiguous bits in the grid |
| Create a group | **Right-drag** across contiguous bits in the grid |
| Delete a group | Right-drag the same range again, or click the delete button on the group card |
| Clear all bits | Click the **Clear** button at the top-right of the bit grid |
| Change bit width | Pick 8/16/32/64 or enter a custom value in the Attributes panel |
| Edit the value | Type into the HEX/DEC fields; everything syncs automatically |
| Edit a group value | Enter a HEX/DEC value in the group card |
| Apply a mapping | Click a rule button inside a group to toggle its value |
| Add chips/registers | Switch to Project mode and use the navigator |
| Import / export | Use the Config panel at the bottom |
| Switch language | Click the "中文 / English" buttons in the top-right corner |

## License

MIT
