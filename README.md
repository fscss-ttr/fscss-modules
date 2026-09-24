# FSCSS Import System Guide 

FSCSS introduces a powerful, JavaScript-like import system for CSS functions. Import specific utilities, rename them, or load entire libraries - all while keeping your styles modular and maintainable.

https://github.com/fscss-ttr/fscss-modules/blob/main/Modular.md

> import FSCSS initial libraries without quotes, example @import((*) from circle-progress)
> 
## Import Types

1. Named Imports

Import specific functions from a module:

```scss
@import((flex-x, flex-center, flex-wrap-center) from flex-control)

.container {
  @flex-wrap-center()
}
```

2. Alias Imports

Rename imports to avoid conflicts or create shorter names:

```scss
@import((circle-progress as cp, progress-range as pr) from circle-progress)

@cp(.progress-circle)
.p75 {
  @pr(75)
}
```

3. Import Everything

Load all exported functions from a module:

```scss
@import((*) from "animations.fscss")

.card {
  @fade-in()
  @slide-up()
  @zoom(1.1)
}
```

4. Remote Imports

Import directly from URLs (works in browser and CLI):

```scss
@import((btn, btn-primary) from "https://cdn.example/...-buttons@1.0/buttons.fscss")

.button {
  @btn()
  @btn-primary()
}
```

5. Library Imports 

**Import from community libraries by its name, no 'quotes':** (https://fscss.devtem.org/libraries) 

```scss
@import((
  circle-progress as cp,
  progress-range as pr,
  progress-root as root
) from circle-progress)

@import((*) from counterx)
```

## Practical Examples

> From local folders 

**Basic Usage**

```html
<style>
@import((flex-x, flex-center) from "flex.fscss")
@import((card, card-body) from "mycomponents/card.fscss")

.app {
  @flex-center()
}

.user-card {
  @card()
  @card-body()
}
</style>
```

**Progress Circle Component**

> From published lib

```html
<style>
@import((
  circle-progress as cp,
  progress-range as pr,
  progress-root as root
) from circle-progress)

@root()
body {
  background: #131213;
}

@cp(.progress-circle)

.p85 {
  @pr(85)
}
</style>

<div class="progress-circle p85">85%</div>

<script src="https://cdn.jsdelivr.net/npm/fscss@1.2.4/runtime.min.js" async></script>
```

**Remote Styling Library**

```scss
@import((flex-center, flex-between) from "https://styles.example/base/flex.fscss")
@import((shadow-lg, shadow-sm) from "https://styles.example/effects/shadow.fscss")
@import((btn, btn-large) from "https://styles.example/ui/buttons.fscss")

.navbar {
  @flex-between()
  @shadow-sm()
}

.cta-button {
  @btn()
  @btn-large()
}
```

## Error Handling

FSCSS provides clear error messages for common mistakes:

Invalid Alias

```scss
@import((* as all) from "style.fscss")
// Warning: Cannot assign "*" to alias
```

Empty Alias

```scss
@import((flex-x as) from "style.fscss")
// Warning: Can't assign flex-x to invalid or empty value
```

Undefined Import

```scss
@import((nonexistent) from "style.fscss")
// Error: "nonexistent" is not defined with @define in style.fscss
```

### Examples

Local Module

```scss
// flex.fscss
@define flex-x(){
  display: flex
  flex-direction: row
}

@define flex-center(){
  display: flex
  justify-content: center
  align-items: center
}

@define flex-wrap(){
  flex-wrap: wrap
} 
```
https://fscss.devtem.org/define

## Backward Compatibility

**Old import syntax still works:**

```scss
@import(exec(location))
@import(exec(_init library/extension))
```

This ensures:

· Existing projects won't break
· Gradual migration possible
· Legacy code support

## Browser & CLI Support

All import types work in both environments:

· Browser: Processed at runtime by FSCSS js scripts
· CLI: Compiled during build process
· Remote: Fetch and process from any URL
· Local: Import from file system

## Best Practices

1. Use Aliases for Long Names
   ```scss
   @import((circle-progress as cp) from "progress.fscss")
   ```
2. Group Related Imports
   ```scss
   @import((flex-x, flex-y, flex-center) from "flex.fscss")
   @import((grid-12, grid-gap) from "grid.fscss")
   ```
3. Library Imports for Projects
   ```scss
   @import((*) from "my-design-system")
   ```

### Comparison With Other Systems

Technology Feature FSCSS Equivalent
JavaScript Named imports @import((name) from ...)
Sass Partials Local .fscss files
Tailwind Plugins Library imports
CSS Modules Scoped styles Aliased imports

### Quick Reference

```scss
// Named import
@import((function1, function2) from "path")

// With alias
@import((original as alias) from "path")

// Everything
@import((*) from "path")

// Remote
@import((name) from "https://url/file.fscss")

// Library
@import((*) from library-name)
```

## Getting Started

1. Include FSCSS executor:

```html
<script src="https://cdn.jsdelivr.net/npm/fscss@1.2.4/runtime.min.js" async></script>
```

1. Start importing:

```html
<style>
@import((flex-center) from "https://cdn.example/flex.fscss")

.container {
  @flex-center()
}
</style>
```

The new FSCSS import system brings modular, maintainable, and scalable CSS function management to your projects - with the familiar syntax of JavaScript imports!


# How `@import` and `@define` communicate in FSCSS

FSCSS modules work like a **publisher–subscriber** contract. A module **registers** mixins with `@define`; a stylesheet **extracts** them with `@import`, then **substitutes** parameters when you call them. Nothing is emitted as CSS until that last step.

---

## Three compiler phases

```text
┌────────────────────────┐
│  Module file (source)  │
│  @define mixin(param)  │  ← 1. REGISTRATION (blueprint in memory)
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│  Your stylesheet       │
│  @import((mixin)…)     │  ← 2. EXTRACTION (name → local scope)
│  @mixin(value)         │  ← 3. SUBSTITUTION (@use → real tokens → CSS)
└────────────────────────┘
```

### 1. Registration (`@define`)

When the compiler sees `@define` in a module, it does **not** output CSS. It stores:

- the body (template string / block)
- formal parameters and defaults

That entry is a reusable blueprint.

### 2. Extraction (`@import`)

`@import` opens the module, finds the named defines, and exposes them in the **importing file’s** scope.

- Selective: `@import((elevate, badge) from theme-pack)`
- Wildcard: `@import((*) from theme-pack)`
- Alias: `@import((elevate as shadow) from theme-pack)`

With `as`, the **alias** is what gets registered locally.

### 3. Substitution (call site)

Calling the mixin passes arguments into the blueprint. Inside the define, `@use(paramName)` is replaced by those values, then the result is compiled to normal CSS.

---

## Rename with `as`

Yes — **`as` fully renames the define for the current stylesheet**.

After aliasing, the **original name is not available** in that file. The change is **local only**: other files and the source module are unchanged.

```fscss
/* 1. Import and rename */
@import((circle-progress as clp) from circle-progress);

/* 2. New name works */
.radial-bar {
  @clp();
}

/* 3. Original name fails in this file */
.loader {
  @circle-progress(); /* Error: @circle-progress is not defined */
}
```

Typical reasons to alias: short names, avoiding clashes between modules, or matching local naming conventions.

---

## End-to-end trace

**Module (`theme-pack.fscss`)**

```fscss
@define elevate(space: 12px) {
  box-shadow: 0 @use(space) 20px rgba(0, 0, 0, 0.1);
  padding: @use(space);
}
```

**Consumer (`app.fscss`)**

```fscss
@import((elevate as shadow) from "theme-pack.fscss");

.card {
  @shadow(16px);
}
```

**Output CSS**

```css
.card {
  box-shadow: 0 16px 20px rgba(0, 0, 0, 0.1);
  padding: 16px;
}
```

1. Compiler stores blueprint `elevate` with default `space: 12px`  
2. Import maps that blueprint to local name `shadow`  
3. `@shadow(16px)` substitutes `@use(space)` -> `16px` and emits CSS  

---

## Mental model

| Piece | Role |
|--------|------|
| `@define` | Publish a parameterized blueprint |
| `@import` | Subscribe / extract into this file |
| `as` | Local rename (original name gone here) |
| `@use(name)` | Insert the argument at compile time |
| Call `@name(...)` | Run substitution -> CSS |

`@import` does not “run” the module. It only bridges registered defines into your file. Communication completes when you **invoke** the mixin and `@use` is filled in.

---

## Related

- Naming conflicts >> alias with `as`  
- Selective imports >> only pull the helpers you need  
- Nested `@arr` / `rpt` inside defines >> same substitution rules; parameters and array indexes expand when the mixin runs  

That’s the whole pipeline: **register -> extract (optional rename) -> substitute -> CSS**.
