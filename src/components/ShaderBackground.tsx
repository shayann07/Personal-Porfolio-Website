import { useEffect, useRef } from "react";

/**
 * Fullscreen WebGL shader — flowing violet aurora noise with mouse influence.
 * Falls back gracefully when WebGL is unavailable.
 */
export function ShaderBackground() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, antialias: false, powerPreference: "high-performance" });
    if (!gl) return;

    const vert = `attribute vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }`;
    const frag = `
      precision highp float;
      uniform vec2 u_res;
      uniform float u_t;
      uniform vec2 u_mouse;

      // hash / noise
      float hash(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
      float noise(vec2 p){
        vec2 i=floor(p), f=fract(p);
        float a=hash(i), b=hash(i+vec2(1.,0.)), c=hash(i+vec2(0.,1.)), d=hash(i+vec2(1.,1.));
        vec2 u=f*f*(3.-2.*f);
        return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;
      }
      float fbm(vec2 p){
        float v=0., a=0.5;
        for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.02; a*=0.5; }
        return v;
      }

      void main(){
        vec2 uv = (gl_FragCoord.xy - 0.5*u_res)/min(u_res.x,u_res.y);
        vec2 m = (u_mouse - 0.5*u_res)/min(u_res.x,u_res.y);

        float t = u_t*0.06;
        vec2 q = uv*1.6;
        q += 0.5*vec2(fbm(q + t), fbm(q - t + 3.1));
        float n = fbm(q + vec2(t, -t));

        // distance-from-mouse warp
        float md = exp(-2.2*length(uv - m));
        n += md*0.35;

        // palette: cosmic ink -> deep cosmic -> cool slate -> platinum bloom
        vec3 c0 = vec3(0.075, 0.071, 0.098);      // #131219 deep cosmic shadow
        vec3 c1 = vec3(0.137, 0.129, 0.173);      // #23212C cosmic
        vec3 c2 = vec3(0.290, 0.278, 0.353);      // #4a475a lifted cosmic slate
        vec3 c3 = vec3(0.949, 0.953, 0.965);      // #f2f3f6 platinum

        vec3 col = mix(c0, c1, smoothstep(0.34, 0.66, n));
        col = mix(col, c2, smoothstep(0.64, 0.88, n)*0.78);
        col = mix(col, c3, smoothstep(0.90, 1.00, n)*0.42);

        // deeper vignette for premium edge falloff
        float v = smoothstep(1.3, 0.15, length(uv));
        col *= mix(0.40, 1.0, v);

        // grain
        col += (hash(gl_FragCoord.xy + u_t) - 0.5)*0.03;

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src); gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog); gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uT = gl.getUniformLocation(prog, "u_t");
    const uM = gl.getUniformLocation(prog, "u_mouse");

    let mouse = [window.innerWidth * 0.5, window.innerHeight * 0.5];
    let target = [...mouse];
    const onMove = (e: PointerEvent) => { target = [e.clientX, window.innerHeight - e.clientY]; };
    window.addEventListener("pointermove", onMove);

    const resize = () => {
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    const start = performance.now();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const tick = () => {
      mouse[0] += (target[0] - mouse[0]) * 0.06;
      mouse[1] += (target[1] - mouse[1]) * 0.06;
      const t = reduced ? 0 : (performance.now() - start) / 1000;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uT, t);
      gl.uniform2f(uM, mouse[0] * (canvas.width / window.innerWidth), mouse[1] * (canvas.height / window.innerHeight));
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="fixed inset-0 -z-10 h-screen w-screen"
      style={{ background: "#0a0a12" }}
    />
  );
}
