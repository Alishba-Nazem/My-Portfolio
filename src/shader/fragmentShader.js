// Custom aurora: vertical light curtains, bent with layered noise (FBM),
// gently pulled toward the mouse. Written to be explainable, not copied.

export const FRAGMENT_SHADER = `
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

// Tiny random number from a 2D point (used for noise and grain).
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

// Smooth value noise: pick random values at grid corners, then blend them.
float noise(vec2 p) {
  vec2 cell = floor(p);
  vec2 local = fract(p);
  // Smooth the blend so it does not look like hard squares.
  vec2 fade = local * local * (3.0 - 2.0 * local);

  float n00 = hash(cell);
  float n10 = hash(cell + vec2(1.0, 0.0));
  float n01 = hash(cell + vec2(0.0, 1.0));
  float n11 = hash(cell + vec2(1.0, 1.0));

  float bottom = mix(n00, n10, fade.x);
  float top = mix(n01, n11, fade.x);
  return mix(bottom, top, fade.y);
}

// FBM = "fractal brownian motion": stack several noise layers at different sizes.
// Big layers make large waves. Small layers add fine wiggles.
float fbm(vec2 p) {
  float sum = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++) {
    sum += amp * noise(p);
    p *= 2.03;
    amp *= 0.5;
  }
  return sum;
}

// Map a 0–1 value onto the aurora palette: navy → cyan → blue → violet.
vec3 auroraPalette(float t) {
  vec3 deepNavy = vec3(0.015, 0.03, 0.08);
  vec3 cyan = vec3(0.12, 0.78, 0.92);
  vec3 electricBlue = vec3(0.22, 0.38, 0.98);
  vec3 violet = vec3(0.62, 0.22, 0.92);

  float x = clamp(t, 0.0, 1.0);
  vec3 color = mix(deepNavy, cyan, smoothstep(0.0, 0.32, x));
  color = mix(color, electricBlue, smoothstep(0.28, 0.62, x));
  color = mix(color, violet, smoothstep(0.58, 1.0, x));
  return color;
}

// One vertical ribbon of light. Noise bends it sideways so it feels organic.
float curtain(vec2 p, float xCenter, float timeOffset) {
  float n = fbm(vec2(p.y * 1.35 + u_time * 0.11 + timeOffset, xCenter * 2.4));
  float bentX = p.x - xCenter - (n - 0.5) * 0.55;
  float core = exp(-bentX * bentX * 7.5);
  // Fade at the top and bottom so it reads like sky lights, not a full stripe.
  float heightMask = smoothstep(-1.25, -0.15, p.y) * (1.0 - smoothstep(0.2, 1.2, p.y));
  return core * heightMask;
}

void main() {
  // --- Coordinate / UV setup ---
  // uv is 0–1 across the screen. p is -1 to 1, nicer for shapes.
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv * 2.0 - 1.0;

  // --- Aspect-ratio correction ---
  // Without this, circles and curtains stretch on wide screens.
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  p.x *= aspect;

  // --- Mouse influence ---
  // Convert the cursor into the same space as p, then gently pull the field.
  vec2 mouse = (u_mouse / u_resolution.xy) * 2.0 - 1.0;
  mouse.x *= aspect;
  vec2 toMouse = mouse - p;
  float mouseFalloff = 0.38 / (length(toMouse) + 0.38);
  p += toMouse * 0.10 * mouseFalloff;

  // --- Flowing noise / FBM (domain warp) ---
  // First we bend the coordinates with noise. Then we sample noise again
  // on those bent coordinates. That "warp" is what makes the flow look liquid.
  vec2 travel = p;
  travel.y += u_time * 0.045;
  travel.x -= u_time * 0.02;

  vec2 warp = vec2(
    fbm(travel + vec2(0.0, u_time * 0.05)),
    fbm(travel + vec2(5.2, 1.3))
  );
  vec2 warped = travel + (warp - 0.5) * 0.9;

  vec2 warp2 = vec2(
    fbm(warped * 1.15 + vec2(1.7, u_time * 0.03)),
    fbm(warped * 1.15 + vec2(8.3, 2.8))
  );
  vec2 flow = warped + (warp2 - 0.5) * 0.45;

  float field = fbm(flow * 1.25);

  // Three curtains, each on its own slow clock, so they do not move as one slab.
  float c1 = curtain(flow, -0.55, 0.0);
  float c2 = curtain(flow, 0.02, 1.7);
  float c3 = curtain(flow, 0.58, 3.4);

  // --- Aurora color palette ---
  vec3 color = vec3(0.02, 0.03, 0.07); // dark night sky
  color += auroraPalette(0.35 + field * 0.4) * field * 0.42;
  color += auroraPalette(0.45) * c1 * 1.15;
  color += auroraPalette(0.70) * c2 * 1.25;
  color += auroraPalette(0.92) * c3 * 1.1;

  // Extra violet haze so the gaps between curtains are not empty black.
  color += vec3(0.32, 0.12, 0.55) * pow(field, 1.6) * 0.45;

  // --- Glow ---
  // Raise the bright parts so the cores bloom a little, like real aurora.
  float glow = pow(c1 + c2 + c3, 1.2) + pow(field, 2.0);
  color += vec3(0.22, 0.62, 0.92) * glow * 0.28;
  color += vec3(0.62, 0.24, 0.95) * pow(c3 + c2, 1.6) * 0.32;

  // --- Grain ---
  // Film-like speckles. Time is included so the grain shimmers instead of sticking.
  float grain = hash(gl_FragCoord.xy + fract(u_time * 0.15) * 40.0);
  color += (grain - 0.5) * 0.045;

  // --- Final color / vignette ---
  // Darken the edges so the HTML text in the centre-left stays readable.
  vec2 vig = uv * (1.0 - uv.yx);
  float vignette = pow(vig.x * vig.y * 15.0, 0.32);
  color *= mix(0.28, 1.0, clamp(vignette, 0.0, 1.0));

  gl_FragColor = vec4(color, 1.0);
}
`;
