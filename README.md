# FSCSS Import System Guide

FSCSS has a JavaScript-like import system for **`@define` mixins**: pull specific utilities, rename them, load a whole library, or fetch a remote `.fscss` file — while keeping styles modular.

**Registry libraries** (no quotes):

```scss
@import((*) from circle-progress)
@import((*) from st-core@v2)
@import((mirror as mirror-array) from fscss:micros)
```

Catalog: [fscss.devtem.org/libraries](https://fscss.devtem.org/libraries)  
**Recommended:** FSCSS **1.2.6+** — [release notes](https://github.com/Figsh/xfscss/releases/tag/v1.2.6)


---

## How `@import` and `@define` communicate

Modules follow a **publisher → subscriber** contract. `@define` **registers** a blueprint; `@import` **extracts** it into the current file; a **call** runs **substitution** and emits CSS.

```text
┌────────────────────────┐
│  Module file (source)  │
│  @define mixin(param)  │  ← 1. REGISTRATION (blueprint only — no CSS yet)
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│  Your stylesheet       │
│  @import((mixin)…)     │  ← 2. EXTRACTION (into this file’s scope)
│  @mixin(value)         │  ← 3. SUBSTITUTION (@use → tokens → CSS)
└────────────────────────┘
```

| Phase | What happens |
|--------|----------------|
| **Registration** | `@define` stores body + parameters; nothing is printed as CSS |
| **Extraction** | `@import` binds those names (or aliases) **in this file only** |
| **Substitution** | `@name(args)` fills `@use(param)` and compiles to normal CSS |

`@import` does not “run” the module. CSS appears only when you **invoke** the mixin.

---

## Rename with `as` (v1.2.6 rules)

- `as` **fully renames** the binding for the **current file**.
- The **original name is undefined** in that file.
- Other files and the source module are unchanged.
- **No re-`@define` wrapper** is required to pass a name along.
- A file **owns** the names it imported (including aliases). Another file can import **those owned names** from it.

```scss
/* style.fscss — owns m, not mirror */
@import((mirror as m) from fscss:micros)

/* app.fscss — owns mirr; m and mirror are undefined here */
@import((m as mirr) from "style.fscss")
@import((
  ou-root,
  avatar-overlap,
  circle-overlap,
  ou-reduced-motion
) from overlapui)

@arr colors[#1E2783, #8C29B2, #C41348]
@mirr(colors, indices)
exec(_log, "@arr.indices")

@ou-root()
@avatar-overlap(.team-faces)
@circle-overlap(.fab-menu)
@ou-reduced-motion()
```

```text
fscss:micros   defines  mirror
      │
style.fscss    import mirror as m     → owns m
      │
app.fscss      import m as mirr       → owns mirr
               @mirr(...)             ✅
               @m / @mirror           ❌ in app
```

Typical uses for `as`: shorter names, avoiding clashes, local naming style.

---

## Import types

### 1. Named imports

```scss
@import((flex-x, flex-center, flex-wrap-center) from flex-control)

.container {
  @flex-wrap-center()
}
```

### 2. Alias imports

```scss
@import((circle-progress as cp, progress-range as pr) from circle-progress)

@cp(.progress-circle)
.p75 {
  @pr(75)
}
```

### 3. Import everything

```scss
@import((*) from "animations.fscss")

.card {
  @fade-in()
  @slide-up()
  @zoom(1.1)
}
```

### 4. Remote imports

Quoted URL — browser runtime and CLI (network required):

```scss
@import((btn, btn-primary) from "https://cdn.example/buttons@1.0/buttons.fscss")

.button {
  @btn()
  @btn-primary()
}
```

### 5. Library / registry imports (no quotes)

```scss
@import((
  circle-progress as cp,
  progress-range as pr,
  progress-root as root
) from circle-progress)

@import((*) from st-core@v2)
@import((mirror as m) from fscss:micros)
```

### 6. Local paths

```scss
@import((flex-x, flex-center) from "flex.fscss")
@import((card, card-body) from "mycomponents/card.fscss")
```

---

## End-to-end trace

**Module (`theme-pack.fscss`)**

```scss
@define elevate(space: 12px) {
  box-shadow: 0 @use(space) 20px rgba(0, 0, 0, 0.1);
  padding: @use(space);
}
```

**Consumer (`app.fscss`)**

```scss
@import((elevate as shadow) from "theme-pack.fscss")

.card {
  @shadow(16px)
}
```

**CSS output**

```css
.card {
  box-shadow: 0 16px 20px rgba(0, 0, 0, 0.1);
  padding: 16px;
}
```

1. Store blueprint `elevate` (default `space: 12px`)  
2. Map to local name `shadow`  
3. `@shadow(16px)` → substitute → CSS  

---

## Practical examples

### Progress circle (published lib)

```html
<style>
@import((
  circle-progress as cp,
  progress-range as pr,
  progress-root as root
) from circle-progress)

@root()
body { background: #131213; }

@cp(.progress-circle)
.p85 { @pr(85) }
</style>

<div class="progress-circle p85">85%</div>
<script src="https://cdn.jsdelivr.net/npm/fscss@1.2.6/runtime.min.js" defer></script>
```

### Local flex module

```scss
/* flex.fscss */
@define flex-x() {
  display: flex;
  flex-direction: row;
}

@define flex-center() {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

```scss
@import((flex-center) from "flex.fscss")

.app {
  @flex-center()
}
```

More on defines: [fscss.devtem.org/define](https://fscss.devtem.org/define)

### Micros via intermediate file (1.2.6)

```scss
/* style.fscss */
@import((mirror as m) from fscss:micros)
```

```scss
/* main.fscss */
@import((m as mirr) from "style.fscss")
@mirr(colors, indices)
```

If `fscss:micros` does not resolve in your environment:

```scss
@import((mirror as m) from "https://cdn.jsdelivr.net/gh/fscss-ttr/FSCSS@main/xf/styles/fscss/micros.fscss")
```

---

## Error handling

| Case | Example | Result |
|------|---------|--------|
| Invalid alias | `@import((* as all) from "style.fscss")` | Warning: cannot assign `*` to alias |
| Empty alias | `@import((flex-x as) from "style.fscss")` | Warning: invalid / empty alias |
| Missing define | `@import((nonexistent) from "style.fscss")` | Error: not defined with `@define` |
| Wrong name after `as` | Import as `cp`, call `@circle-progress()` | Error: not defined **in this file** |

---

## Backward compatibility

Older forms still work:

```scss
@import(exec(location))
@import(exec(_init library/extension))
```

Existing projects can migrate gradually.

---

## Browser & CLI

| Environment | Behavior |
|-------------|----------|
| **Browser** | Runtime (`runtime.js` / `esm.js`) processes imports |
| **CLI** | `fscss in.fscss out.css` resolves local paths; URLs need network |
| **Production** | Prefer CLI → ship CSS only |

---

## Best practices

1. **Alias long names:** `@import((circle-progress as cp) from circle-progress)`  
2. **Selective imports:** only the defines you call  
3. **Group related names** in one `@import`  
4. **Registry names without quotes;** paths and URLs **with quotes**  
5. **Remember file-local renames** — call the alias you own in *this* file  
6. **Pin a compiler version** in docs and CI (e.g. 1.2.6)

---

## Comparison

| Idea | FSCSS |
|------|--------|
| JS named imports | `@import((name) from …)` |
| JS `import as` | `name as alias` |
| Sass partials | Local `"path.fscss"` |
| Plugin / package | Registry: `from library-name` |

---

## Quick reference

```scss
// Named
@import((function1, function2) from "path.fscss")

// Alias
@import((original as alias) from "path.fscss")

// Everything
@import((*) from "path.fscss")

// Remote
@import((name) from "https://url/file.fscss")

// Registry (no quotes)
@import((*) from library-name)
@import((mirror as m) from fscss:micros)

// Chain rename across files (1.2.6 — no re-define)
// style.fscss:  @import((mirror as m) from fscss:micros)
// app.fscss:    @import((m as mirr) from "style.fscss")
```

---

## Mental model

| Piece | Role |
|--------|------|
| `@define` | Publish parameterized blueprint |
| `@import` | Extract into **this** file |
| `as` | Local rename; original undefined here |
| File ownership | Downstream imports **your** local names |
| `@use(name)` | Parameter hole in the blueprint |
| `@name(...)` | Substitute → CSS |

**Register → extract (optional rename) → substitute → CSS.**

---

## Related

- [Define](https://fscss.devtem.org/define) · [Libraries](https://fscss.devtem.org/libraries) · [API](https://fscss.devtem.org/api)  
- [v1.2.6](https://github.com/Figsh/xfscss/releases/tag/v1.2.6) · [Figsh/xfscss](https://github.com/Figsh/xfscss)
