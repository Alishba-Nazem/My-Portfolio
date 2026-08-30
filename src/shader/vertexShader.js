// Fullscreen triangle: each vertex is already in clip space (-1 to 1).
// The fragment shader does all the visual work.

export const VERTEX_SHADER = `
attribute vec2 a_position;

void main() {
  // Pass the vertex straight through. No camera, no 3D transform.
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;
