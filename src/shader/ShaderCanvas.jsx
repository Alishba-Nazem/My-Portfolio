import { useEffect, useRef } from "react";
import { VERTEX_SHADER } from "./vertexShader";
import { FRAGMENT_SHADER } from "./fragmentShader";

const MAX_DPR = 1.5;

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(info || "Shader compile failed");
  }
  return shader;
}

function createProgram(gl, vertexSrc, fragmentSrc) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSrc);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(info || "Program link failed");
  }
  return program;
}

/**
 * Fullscreen WebGL canvas. Uniforms are updated from refs inside
 * requestAnimationFrame so React does not re-render every frame.
 */
export default function ShaderCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
      // Keep the last frame readable for screenshots and first-paint.
      preserveDrawingBuffer: true,
    });

    if (!gl) return undefined;

    let program;
    try {
      program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
    } catch (err) {
      console.error("Aurora shader failed to compile:", err);
      return undefined;
    }

    const positionLoc = gl.getAttribLocation(program, "a_position");
    const timeLoc = gl.getUniformLocation(program, "u_time");
    const resolutionLoc = gl.getUniformLocation(program, "u_resolution");
    const mouseLoc = gl.getUniformLocation(program, "u_mouse");

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // One oversized triangle that covers the whole clip space.
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );

    const bindState = () => {
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(positionLoc);
      gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    };

    bindState();

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let width = 1;
    let height = 1;
    let rafId = 0;
    let alive = true;
    const start = performance.now();

    let frames = 0;

    const paint = (timeMs) => {
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;

      bindState();
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(timeLoc, (timeMs - start) * 0.001);
      gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
      const dpr = canvas.width / Math.max(width, 1);
      gl.uniform2f(mouseLoc, mouse.x * dpr, mouse.y * dpr);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      frames += 1;
      canvas.dataset.frames = String(frames);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      width = Math.max(1, canvas.clientWidth);
      height = Math.max(1, canvas.clientHeight);
      const pixelsX = Math.round(width * dpr);
      const pixelsY = Math.round(height * dpr);
      if (canvas.width !== pixelsX || canvas.height !== pixelsY) {
        canvas.width = pixelsX;
        canvas.height = pixelsY;
        // Setting canvas.width/height resets WebGL bindings. Put them back.
        bindState();
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (mouse.tx === 0 && mouse.ty === 0) {
        mouse.tx = width * 0.5;
        mouse.ty = height * 0.5;
        mouse.x = mouse.tx;
        mouse.y = mouse.ty;
      }
      paint(performance.now());
    };

    const onPointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      mouse.tx = event.clientX - rect.left;
      // Flip Y so mouse space matches gl_FragCoord (origin at bottom-left).
      mouse.ty = rect.height - (event.clientY - rect.top);
    };

    const draw = (timeMs) => {
      if (!alive) return;

      paint(timeMs);

      if (document.hidden) {
        rafId = 0;
        return;
      }

      rafId = requestAnimationFrame(draw);
    };

    const startLoop = () => {
      if (!alive || rafId || document.hidden) return;
      rafId = requestAnimationFrame(draw);
    };

    const stopLoop = () => {
      if (!rafId) return;
      cancelAnimationFrame(rafId);
      rafId = 0;
    };

    const onVisibility = () => {
      if (document.hidden) {
        stopLoop();
        return;
      }
      paint(performance.now());
      startLoop();
    };

    resize();
    startLoop();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      alive = false;
      stopLoop();
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      const lose = gl.getExtension("WEBGL_lose_context");
      lose?.loseContext();
    };
  }, []);

  return <canvas ref={canvasRef} className="sh-canvas" aria-hidden="true" />;
}
