# Understanding the Modular System in FSCSS

One of the concepts in FSCSS (Figured Shorthand Cascading Style Sheets) is its modular system.

Instead of writing large monolithic stylesheets, FSCSS allows developers to build reusable style modules that can be imported, initialized, and reused across projects.

This article explains:

- What FSCSS modules are)
- Why `@define` exists
- Why modules must be initialized
- Why importing `*` is sometimes discouraged
- Why FSCSS libraries are mostly remote
- How you can build your own modular system

---

## What Are FSCSS Modules?

An FSCSS module is simply a stylesheet that contains reusable style definitions.

Example module:
```css
@define radius-util(){`
@arr radius[count(200)]

.radius-@arr.radius[]{
  border-radius:@arr.radius[]px;
}
`}
```
This module defines a reusable utility called:

radius-util

It doesn't run automatically.

Instead, you import it and execute it when you want.

Example usage:

```css
@import((radius-util) from spacing-utils/fscss)

@radius-util()
```
This generates all the radius utilities.

---

## What is `@define`?

`@define` creates a reusable block of FSCSS code.

Think of it like:

- a function
- a macro
- or a code generator

Example:
```css
@define card(){`
.card{
  padding:20px;
  border-radius:10px;
}
`}
```
Then you run it:

`@card()`

Which outputs the CSS.

---

## Why FSCSS Requires `@define`

FSCSS does not automatically run imported code.

This design has several benefits.

### 1. Performance

If every import executed immediately, large libraries would generate thousands of unused styles.

With `@define`, nothing runs unless you call it.

@radius-util()

This keeps styles smaller and more efficient.

---

### 2. Control

Developers choose exactly which modules to run.

Example:
```
@import((radius-util, margin-util) from spacing-utils/fscss)

@radius-util()
```
Only radius utilities are generated.

---

### 3. Customization

You can overwrite the array used for the specific function

Example concept:
```
@arr radius[count(100)]
@radius-util()
```
Which might generate utilities only up to 100.

---

## Why Import by Name Instead of `*`

Example import:

`@import((radius-util) from spacing-utils/fscss)`

This imports only that definition.

You can also do:

`@import((*) from spacing-utils/fscss)`

But this imports everything.

---

## Disadvantages of `*`

Using `*` means:

- all utilities are loaded
- even if you don't use them
- larger compiled CSS
- slower compile time

Example problem:

`@import((*) from huge-library)`

This might generate 10,000+ classes.

---

## Advantages of Named Imports

```css
@import((radius-util, padding-util) from spacing-utils/fscss)
```
Benefits:

- smaller CSS
- faster compile
- better project organization
- predictable output

---

## Why FSCSS Libraries Are Usually Remote

Example:

`@import((icon-base, icon-home) from icon-mask_v2)`
then it's `https://cdn.jsdelivr.net/gh/fscss-ttr/FSCSS@main/xf/styles/icon-mask_v2.fscss`
FSCSS encourages remote modular libraries because:

1. Sharing

Libraries can be reused across projects.

2. Updates

When the library improves, users automatically get improvements.


---

## Why FSCSS Does NOT Allow

`@import(body from module)`

Without `@define`.

If raw styles were imported directly:

`@import(body from modules)`

It may create several problems:

1. No control over execution

Everything would load automatically.

2. Name collisions

Multiple modules could overwrite styles.

3. Large CSS output

Unused styles would still be generated.

---

## Advantages of `@define` in Your Own Stylesheet

You can build your own reusable components.

**Example:**

```css
@define button(color:#6366f1){`
.btn{
  background:@use(color);
  color:white;
  padding:10px 20px;
  border-radius:6px;
}
`}
```
Usage:

`@button()`

Or:

`@button(red)`

---

## Building Your Own Modular FSCSS System

You can organize file like this:

fscss-modules/utils.fscss
```css
@define spacing-utils(){/*... */} 
@define radius-utils(){/*... */}
@define flex-utils(){/*... */} 
@define grid-utils(){/*... */} 
@define typography-utils(){/*...*/} 
```
Then import them:

```css
@import((spacing-utils, flex-utils) from "fscss-modules/utils.fscss")
```
And run them:
```css
@spacing-utils()
@flex-utils()
```
---

## Is Initializing with `@name()` Necessary?

**Yes.**

This step executes the defined module.

Without it, nothing happens.

**Example:**

`@import((radius-util) from spacing-utils/fscss)`

If you do not run:

`@radius-util()`

Then no utilities are generated.

---

## Why This Design Matters

The FSCSS modular system provides:

- better control
- smaller CSS output
- reusable style generators
- scalable architecture

FSCSS allows developers to build CSS generators.

This makes it possible to create entire utility frameworks using just a few reusable definitions.

---


FSCSS modules allow you to treat styles like reusable building blocks.

By combining fscss methods. 

developers can create flexible style systems that scale from small projects to large design systems.

The modular approach keeps code organized, reusable, and efficient.
