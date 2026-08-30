# Aurora Shader Hero — notes for the assignment

This page is a **standalone demo** at `/shader`. It does not replace the main portfolio or its background video.

The project uses **Vite + React**, not Next.js. Three.js was not already installed, so the demo uses a small **native WebGL canvas** instead of adding a large 3D library.

---

## 1. What the shader does

The fragment shader paints every pixel of a fullscreen background.

It builds a **night sky** and then draws **vertical aurora curtains** (ribbons of cyan, blue, and violet light). Those ribbons are bent with layered noise so they look like flowing northern lights, not hard stripes.

HTML text sits on top of that canvas. A dark overlay keeps the name and role readable.

---

## 2. What `u_time` does

`u_time` is the number of **seconds since the page started**.

The shader uses it to:

- slide the noise field slowly (so the aurora drifts)
- wiggle each curtain on its own clock
- refresh the grain so it shimmers instead of staying frozen

If time stopped, the picture would freeze. That is also how reduced-motion is handled: we simply **do not animate**.

---

## 3. What `u_resolution` does

`u_resolution` is the canvas size in pixels: `(width, height)`.

It is used to:

- turn the pixel position into **UV coordinates** from 0 to 1
- **correct aspect ratio**, so wide screens do not stretch the curtains

Without it, the same GLSL math would look different on a phone vs a desktop.

---

## 4. What `u_mouse` does

`u_mouse` is the cursor position in **pixels**, with the same origin as `gl_FragCoord` (bottom-left).

The shader converts that into the same coordinate space as the aurora, then **gently pulls** the field toward the cursor. Nearby pixels move more; far pixels barely move. The pull is small on purpose so it feels premium, not like a flashlight.

JavaScript also **smooths** the mouse with a lerp before sending it to the GPU, so the motion is not jittery.

---

## 5. How UV coordinates are calculated

For every pixel:

```glsl
vec2 uv = gl_FragCoord.xy / u_resolution.xy; // 0–1 across the screen
vec2 p  = uv * 2.0 - 1.0;                    // -1 to 1, centre is (0,0)
p.x *= u_resolution.x / u_resolution.y;      // keep shapes from stretching
```

- `uv` is useful for overlays like vignette and grain.
- `p` is useful for shapes (curtains sit along X, height sits along Y).

---

## 6. How the aurora effect is generated

Three simple ideas stacked together:

1. **Value noise + FBM**  
   Noise gives a random-looking cloud. FBM (fractal Brownian motion) stacks 5 octaves of that noise: large waves + smaller wiggles.

2. **Domain warp**  
   Instead of colouring the noise directly, we use noise to **bend the coordinates**, then sample noise again. That double-step is what makes the motion feel liquid.

3. **Vertical curtains**  
   Each ribbon is a soft Gaussian bump along X (`exp(-x*x)`), then FBM slides that bump sideways as Y and time change. Three curtains use different centres and colours from a navy → cyan → blue → violet palette. A small glow brightens the cores.

The mouse only shifts the warped field a little, so the curtains lean toward the cursor.

---

## 7. How the grain is added

A `hash` function turns the pixel position (plus a bit of time) into a tiny random number.

That number is centred around zero and added to the colour at a very low strength (~4.5%). It is meant to look like film grain, not TV static.

---

## 8. How text readability is maintained

Several layers protect the type:

- The shader itself **vignettes** (darkens) the edges.
- A CSS **left-to-right dark gradient** sits between the canvas and the text.
- The name uses a strong **text shadow**.
- Copy has a **max-width**, so it does not run into the brightest part of the lights.
- Type is large, light-on-dark, and not placed on top of the brightest cyan core.

---

## 9. Reduced-motion fallback

If the user has `prefers-reduced-motion: reduce`:

- the WebGL loop **never starts**
- a **static CSS gradient** uses the same navy / cyan / violet palette
- the hero copy stays fully readable
- hover motion on the button is also disabled

The setting is watched live, so it still updates if the OS preference changes while the page is open.

---

## 10. Performance optimizations

- **DPR cap:** `devicePixelRatio` is limited to **1.5**, so retina screens do not draw 2× or 3× more pixels than needed.
- **Page Visibility API:** when the tab is hidden, `requestAnimationFrame` is cancelled. It starts again when the tab is visible.
- **No React state per frame:** mouse, time, and draw calls live in refs / closures. React does not re-render 60 times a second.
- **Cheap WebGL context:** no antialiasing, no depth/stencil buffers, `low-power` preference.
- **Fullscreen triangle:** one triangle covers the screen (cheaper than a quad made of two triangles).
- **ResizeObserver** keeps the canvas sized to the viewport without polling.
- **Cleanup on unmount:** animation frame, observers, listeners, buffers, and the GL context are all released.
- **FBM is 5 octaves**, which is enough detail without a heavy inner loop.
- **First paint + last frame:** the canvas draws immediately on load (and again after resize) so it is never left blank. `preserveDrawingBuffer` keeps that frame visible for screenshots.

---

## How to view it

- Demo: `/shader`
- Main portfolio (unchanged): `/`
- CTA on the shader page links to `/#projects` on the real portfolio.
