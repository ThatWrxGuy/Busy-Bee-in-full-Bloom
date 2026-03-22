# Modern UI Example (shadcn/ui Style)

A complete shadcn/ui style modern UI example demonstrating the "less is more" aesthetic used by Linear, Vercel, and modern SaaS apps.

## 📁 What's Included

```
modern-ui-example/
├── components/
│   └── ui/
│       ├── button.jsx      # Button with variants (default, outline, ghost, etc.)
│       ├── card.jsx        # Card, CardHeader, CardContent, etc.
│       ├── avatar.jsx      # Avatar with image + fallback
│       ├── input.jsx       # Styled input field
│       ├── badge.jsx       # Status badges (success, warning, etc.)
│       ├── skeleton.jsx    # Loading skeleton
│       └── progress.jsx    # Progress bar
├── src/
│   ├── globals.css         # CSS variables (light/dark theme)
│   └── lib/utils.js        # cn() helper function
├── tailwind.config.js      # Custom theme config
├── ModernDashboard.jsx     # Complete dashboard example
├── package.json
└── README.md
```

## 🎨 The Key Differences

| Aspect | Old (Chakra) | New (shadcn) |
|--------|--------------|--------------|
| **Cards** | White with boxShadow | Border + subtle background |
| **Colors** | brand.500 = amber | CSS variables with muted tones |
| **Text** | gray.500 | text-muted-foreground |
| **Loading** | Spinner | Skeleton (pulse animation) |
| **Radius** | lg, xl | Consistent var(--radius) |
| **Borders** | None/rare | 1px borders, subtle |

## 🔑 The Modern Aesthetic Formula

```jsx
// Section Header - small, uppercase, muted
<h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
  Life Domains
</h2>

// Card - minimal, subtle border
<Card>
  <CardContent className="p-4">
    {/* content */}
  </CardContent>
</Card>

// Stat - large number, small label
<p className="text-sm text-muted-foreground">{label}</p>
<p className="text-3xl font-bold">{value}</p>
```

## 🚀 To Use in Your Project

```bash
# Install dependencies
npm install

# Run the example
npm run dev
```

### Copy to Your Project

```bash
# Copy these files:
# - tailwind.config.js
# - src/globals.css
# - components/ui/* (the components)
# - src/lib/utils.js

# Install additional dependencies:
npm install tailwindcss postcss autoprefixer clsx tailwind-merge class-variance-authority
npm install @radix-ui/react-avatar @radix-ui/react-slot
npm install tailwindcss-animate

# Use the components like in ModernDashboard.jsx
```

## 💡 The Secret

**Modern UI = Less is More**

- Remove shadows → use borders
- Remove bright colors → use muted grays
- Remove large headings → use uppercase labels
- Remove spinners → use skeletons
- Add more whitespace

This is exactly what Linear, Vercel, and modern SaaS apps do! 🐝

## 🎯 Component Variants

### Button
- `default` - Primary action (amber/yellow)
- `destructive` - Danger actions (red)
- `outline` - Secondary actions
- `secondary` - Background variant
- `ghost` - Minimal/hover effect
- `link` - Text link style

### Badge
- `default` - Primary color
- `secondary` - Muted background
- `destructive` - Red for warnings
- `outline` - Border only
- `success` - Green (custom)
- `warning` - Amber (custom)
- `info` - Blue (custom)

### Card
- Standard bordered cards with subtle backgrounds
- Consistent padding (p-6 for header/content)
- Uses CSS variables for theming
