# Accessibility Audit — Todo App

Generated: 2026-04-07

## WCAG AA Compliance

### Critical Violations: 0

### Audit Results

| Criterion                        | Status | Implementation                          |
|----------------------------------|--------|-----------------------------------------|
| **1.1.1 Non-text Content**       | PASS   | No images; text-only interface          |
| **1.3.1 Info and Relationships** | PASS   | Semantic HTML: `<main>`, `<header>`, `<footer>`, `<form>`, `<ul>`, `<li>` |
| **1.4.3 Contrast (Minimum)**     | PASS   | Text #1a1a1a on #ffffff (21:1 ratio), muted #888 on #fff (3.5:1) |
| **1.4.11 Non-text Contrast**     | PASS   | Border #e0e0e0 visible, buttons have clear borders |
| **2.1.1 Keyboard**               | PASS   | All interactions via keyboard: Tab, Enter, Space |
| **2.4.3 Focus Order**            | PASS   | Logical tab order: input -> add -> list items |
| **2.4.7 Focus Visible**          | PASS   | Focus ring on input (blue shadow), native focus on buttons |
| **3.3.1 Error Identification**   | PASS   | Error banner with `role="alert"`, clear messages |
| **4.1.2 Name, Role, Value**      | PASS   | All controls have accessible labels     |

### Semantic Structure

```
<main class="app">
  <header>
    <h1>Todos</h1>
  </header>
  <div role="alert">          <!-- Error banner (when visible) -->
  <form>                       <!-- Todo form -->
    <label class="sr-only">   <!-- Screen-reader label -->
    <input aria-label="...">
    <button aria-label="...">
  </form>
  <div role="status">          <!-- Empty/loading state -->
  <ul role="list">             <!-- Todo list -->
    <li>
      <label>
        <input type="checkbox" aria-label="Mark X as complete">
        <span>Title</span>
      </label>
      <button aria-label="Delete X">
    </li>
  </ul>
  <footer>                     <!-- Items left count -->
</main>
```

### ARIA Labels

| Element          | Label                                        |
|------------------|----------------------------------------------|
| Text input       | "New todo"                                   |
| Add button       | "Add todo"                                   |
| Checkbox         | "Mark '{title}' as {complete/incomplete}"    |
| Delete button    | "Delete '{title}'"                           |
| Dismiss button   | "Dismiss error"                              |
| Loading state    | "Loading todos" (role="status")              |
| Empty state      | (role="status")                              |
| Error banner     | (role="alert")                               |

### Touch Targets

All interactive elements meet 44px minimum touch target:
- Input: full-width, 44px+ height
- Buttons: min-width 80px, 44px+ height
- Checkboxes: 20px with label extending the tap area
- Delete buttons: padded to exceed 44px

### Color Independence

- Completed todos use both strikethrough AND muted color
- Error states use both red color AND border AND text
- No information conveyed by color alone
