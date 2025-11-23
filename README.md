# 🔐 Matrix Password Canvas

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/d81db3773bc0428282a26a7f2b82f71d)](https://app.codacy.com/gh/R0mb0/Matrix_password_canvas/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![pages-build-deployment](https://github.com/R0mb0/Matrix_password_canvas/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/R0mb0/Matrix_password_canvas/actions/workflows/pages/pages-build-deployment)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/R0mb0/Matrix_password_canvas)
[![Open Source Love svg3](https://badges.frapsoft.com/os/v3/open-source.svg?v=103)](https://github.com/R0mb0/Matrix_password_canvas)
[![MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/license/mit)
[![Donate](https://img.shields.io/badge/PayPal-Donate%20to%20Author-blue.svg)](http://paypal.me/R0mb0)

Generate animated random character matrices tailored to your chosen character pool (letters, numbers, specials, case rules). Use positional memorization: keep the printed grid, remember only where your password lives inside it.

---

## ✨ Features

- Define rows and columns
- Select sources: letters, numbers, special characters
- Independent uppercase / lowercase toggles
- Animated scramble effect before each final matrix
- Multiple generations stack (latest first)
- Copy button for plain text export
- Auto light/dark theme via `prefers-color-scheme`
- Modern rounded interface, responsive layout
- Pure front-end (ideal for GitHub Pages deployment)

---

## 🧠 Concept

Instead of memorizing a complex password directly, you store a grid and memorize its coordinates.  
If someone sees the sheet without knowing the position logic, the password remains obscured within noise.

Example:
- You remember coordinates (Row 3, Col 12) + (R7,C4) + (R9,C19) + ...
- Grid acts like a one-time pad pattern under your personal mapping.

---

## 🚀 Getting Started

1. Open `index.html` locally OR deploy to GitHub Pages.
2. Enter desired rows & columns.
3. Check desired character sources.
4. Press Generate!
5. Copy a matrix (optional), print it, or save it.

---

## ⚙️ Configuration Logic

Character pool is built from your choices:
- Letters + Uppercase → A–Z
- Letters + Lowercase → a–z
- Numbers → 0–9
- Specials → `!@#$%^&*()-_=+[]{};:,.<>/?|~`
If Letters is checked but neither Uppercase nor Lowercase is selected, both sets are used as fallback.

---

## 🧪 Animation

Each generation shows a brief scramble (default 650ms) updating every 40ms, then locks the final matrix.  
Adjust in `script.js`:
```js
const ANIMATION_DURATION_MS = 650;
const TICK_INTERVAL_MS = 40;
```

---

## 📋 Copy Format

Copied matrix is plain text:
```
X6f#Z...
Ab$1...
...
```
Each row separated by newline. No metadata included (easy to paste into a text file).

---

## 🔒 Security Notes

- This does NOT replace cryptographic password managers.
- Printed grids must be physically protected.
- Avoid reusing the same grid across unrelated accounts.
- Consider regenerating matrices periodically.
- Someone with the matrix plus your memorized positions could brute force with repeated usage—rotate patterns.

---

## 📱 Responsive Behavior

- Inputs stack on narrow screens
- Monospace grid shrinks slightly using `clamp()`
- Scrollbars appear for large matrices (max-height ~60vh)
