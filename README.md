# FSCSS Import System Guide 

FSCSS introduces a powerful, JavaScript-like import system for CSS functions. Import specific utilities, rename them, or load entire libraries - all while keeping your styles modular and maintainable.

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
@import((circle-progress as cp, progress-range as pr) from circle-progress/fscss)

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
@import((btn, btn-primary) from "https://cdn.jsdelivr.net/npm/fscss-buttons@1.0/buttons.fscss")

.button {
  @btn()
  @btn-primary()
}
```

5. Library Imports

**Import from fscss initial libraries:**

```scss
@import((
  circle-progress as cp,
  progress-range as pr,
  progress-root as root
) from circle-progress)

@import((*) from counterx)
```

## Practical Examples

**Basic Usage**

```html
<style>
@import((flex-x, flex-center) from "flex.fscss")
@import((card, card-body) from "components/card.fscss")

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

```html
<style>
@import((
  circle-progress as cp,
  progress-range as pr,
  progress-root as root
) from circle-progress/fscss)

@root()
body {
  background: #f5f5f5;
}

@cp(.progress-circle)

.p85 {
  @pr(85)
}
</style>

<div class="progress-circle p85">85%</div>

<script src="https://cdn.jsdelivr.net/npm/fscss@1.1.16/exec.min.js" async></script>
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
<script src="https://cdn.jsdelivr.net/npm/fscss@1.1.16/exec.min.js" async></script>
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
