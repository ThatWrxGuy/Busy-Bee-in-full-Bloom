# Busy Bee Design System

## Single Source of Truth

This document defines the **Busy Bee Design System** - the authoritative source for all UI/UX decisions across the application. All frontend development should follow these guidelines to ensure a consistent, professional aesthetic.

---

## Design Philosophy

### Core Principles (Inspired by Modern CRM/SAAS)

1. **Clean & Minimal** - Ample whitespace, no visual clutter
2. **Professional** - Trustworthy, enterprise-ready appearance
3. **Consistent** - Same patterns everywhere
4. **Fast** - Smooth animations, no jank
5. **Accessible** - Works for everyone

### The Aesthetic

- **Subtle borders** over heavy shadows
- **Muted grays** for secondary text (`text-foreground-muted`)
- **Skeleton loaders** instead of spinners
- **Consistent border radius** (8px default)
- **Professional color palette** - Not too bright, not too dark

---

## Color Palette

### Primary (Amber/Honey - Brand)
```
--primary: 38 92% 50%        /* Amber #F59E0B */
--primary-hover: 37 91% 45%
--primary-foreground: 0 0% 100%
```

### Neutrals (Warm Grays)
```
--background: 0 0% 98%        /* Very light gray */
--foreground: 222 47% 11%    /* Near black */
--foreground-muted: 215 20% 65%  /* Muted gray text */
```

### Semantic Colors
```
--success: 142 71% 45%       /* Green */
--warning: 38 92% 50%        /* Amber */
--info: 199 89% 48%          /* Blue */
--destructive: 0 84% 60%     /* Red */
```

---

## Typography

### Font Family
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Scale
- **Page Title**: 2xl, Bold, tracking-tight
- **Section Title**: lg/xl, Semibold
- **Body**: sm/base, Regular
- **Caption/Meta**: xs/sm, Regular, muted color

---

## Spacing System

- Base unit: 4px
- Common spacings: 2 (8px), 3 (12px), 4 (16px), 6 (24px)
- Page padding: 4-6 (16px-24px)
- Card padding: 4-6 (16px-24px)
- Gap between cards: 4-6 (16px-24px)

---

## Component Patterns

### Cards
```jsx
<Card>
  <CardHeader title="Title" description="Optional" />
  <CardContent>Content here</CardContent>
</Card>
```

### Forms
```jsx
<FormField label="Email" error={errors.email} required>
  <Input placeholder="Enter email" />
</FormField>
```

### Buttons
```jsx
<Button variant="default">Primary</Button>
<Button variant="outline">Secondary</Button>
<Button variant="ghost">Tertiary</Button>
<Button variant="destructive">Danger</Button>
```

### Stats
```jsx
<StatCard 
  label="Total Users" 
  value="1,234" 
  trend={12} 
  changeType="positive"
  icon={FiUsers}
/>
```

---

## Layout Patterns

### Page Container
```jsx
<PageContainer 
  title="Page Title"
  subtitle="Optional description"
  actions={<Button>Action</Button>}
>
  {/* Content */}
</PageContainer>
```

### Grid
```jsx
<Grid cols={{ default: 1, sm: 2, lg: 3 }}>
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</Grid>
```

---

## Importing Components

All components are exported from the main index:

```jsx
// Basic UI
import { Button, Card, Input, Badge } from './components'

// Layout
import { PageContainer, Section, Grid, StatCard } from './components'

// Forms
import { FormField, Select, Checkbox, Label } from './components'

// Data Display
import { Table, Tabs, Badge } from './components'

// Feedback
import { LoadingOverlay, Spinner, Alert } from './components'

// Design System Layout
import { Layout, Sidebar, Header } from './components'
```

---

## File Structure

```
src/
├── components/
│   ├── index.js              # All exports
│   ├── DesignSystem.jsx      # Layout components (Sidebar, Header)
│   ├── lib/
│   │   └── utils.js          # cn() utility
│   └── ui/
│       ├── button.jsx        # Button with variants
│       ├── card.jsx          # Card components
│       ├── avatar.jsx        # Avatar
│       ├── badge.jsx         # Status badges
│       ├── input.jsx         # Input
│       ├── skeleton.jsx      # Loading skeleton
│       ├── progress.jsx      # Progress bar
│       ├── FormComponents.jsx
│       ├── DataDisplay.jsx
│       ├── FeedbackComponents.jsx
│       └── PageComponents.jsx
├── globals.css               # CSS variables (SINGLE SOURCE OF TRUTH)
└── tailwind.config.js        # Tailwind configuration
```

---

## Migration Guide

### Old → New Class Mappings

| Old (Chakra) | New (Design System) |
|--------------|-------------------|
| `bg="white"` | `bg-card` |
| `color="gray.500"` | `text-foreground-muted` |
| `borderRadius="lg"` | `rounded-lg` or `rounded-xl` |
| `boxShadow="sm"` | `shadow-sm` or just rely on border |
| `<Spinner />` | `<Skeleton />` or `<LoadingOverlay />` |
| `bg="brand.50"` | `bg-primary/10` |
| `<Badge colorScheme="green">` | `<Badge variant="success">` |

### Converting a Page

1. Replace Chakra imports with design system imports
2. Wrap content in `<PageContainer>`
3. Use `<Card>` for card-like sections
4. Replace `<Skeleton>` components
5. Update colors to use design tokens

---

## Dark Mode

Dark mode is supported via the `dark` class on the root element. All components automatically adapt.

To toggle:
```jsx
document.documentElement.classList.toggle('dark')
```

---

## Best Practices

1. **Always use design system components** - Don't create custom styled divs
2. **Use semantic colors** - Don't hardcode hex values
3. **Be consistent** - Same patterns for same situations
4. **Keep it clean** - Less is more
5. **Test in both modes** - Light and dark

---

## Questions?

If you're unsure about styling or component usage, refer to:
1. This document
2. `src/globals.css` for exact values
3. `src/components/ui/` for component implementations
4. `Dashboard.new.jsx` for a complete example
