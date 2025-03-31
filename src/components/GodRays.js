import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

const ShaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
`;

// Fragment shader for god rays
const fragmentShaderSource = `
  precision mediump float;
  
  uniform float time;
  uniform vec2 resolution;
  uniform float angle;
  uniform float position;
  uniform float spread;
  uniform float cutoff;
  uniform float falloff;
  uniform float edge_fade;
  uniform float speed;
  uniform float ray1_density;
  uniform float ray2_density;
  uniform float ray2_intensity;
  uniform vec4 color;
  uniform float seed;
  
  // Random and noise functions from Book of Shader's chapter on Noise.
  float random(vec2 _uv) {
    return fract(sin(dot(_uv.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }
  
  float noise(in vec2 uv) {
    vec2 i = floor(uv);
    vec2 f = fract(uv);
  
    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
  
    // Smooth Interpolation
    // Cubic Hermine Curve. Same as SmoothStep()
    vec2 u = f * f * (3.0-2.0 * f);
  
    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
  }
  
  mat2 rotate(float _angle){
    return mat2(vec2(cos(_angle), -sin(_angle)),
                vec2(sin(_angle), cos(_angle)));
  }
  
  vec4 screen(vec4 base, vec4 blend){
    return 1.0 - (1.0 - base) * (1.0 - blend);
  }
  
  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    
    // Rotate, skew and move the UVs
    vec2 transformed_uv = (rotate(angle) * (uv - vec2(position, 0.2))) / ((uv.y + spread) - (uv.y * spread));
    
    // Animate the ray according the the new transformed UVs
    vec2 ray1 = vec2(transformed_uv.x * ray1_density + sin(time * 0.1 * speed) * (ray1_density * 0.2) + seed, 1.0);
    vec2 ray2 = vec2(transformed_uv.x * ray2_density + sin(time * 0.2 * speed) * (ray1_density * 0.2) + seed, 1.0);
    
    // Cut off the ray's edges
    float cut = step(cutoff, transformed_uv.x) * step(cutoff, 1.0 - transformed_uv.x);
    ray1 *= cut;
    ray2 *= cut;
    
    // Apply the noise pattern (i.e. create the rays)
    float rays = clamp(noise(ray1) + (noise(ray2) * ray2_intensity), 0.0, 1.0);
    
    // Fade out edges
    rays *= smoothstep(0.0, falloff, (1.0 - uv.y)); // Bottom
    rays *= smoothstep(0.0 + cutoff, edge_fade + cutoff, transformed_uv.x); // Left
    rays *= smoothstep(0.0 + cutoff, edge_fade + cutoff, 1.0 - transformed_uv.x); // Right
    
    // Color to the rays
    vec3 shine = vec3(rays) * color.rgb;
    
    gl_FragColor = vec4(shine, rays * color.a);
  }
`;

// Vertex shader
const vertexShaderSource = `
  attribute vec2 a_position;
  
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

export const GodRays = ({
  angle = -0.3,
  position = -0.2,
  spread = 0.5,
  cutoff = 0.1,
  falloff = 0.2,
  edge_fade = 0.15,
  speed = 1.0,
  ray1_density = 8.0,
  ray2_density = 30.0,
  ray2_intensity = 0.3,
  color = [0.2, 0.3, 0.9, 0.8], // Blue god rays
  seed = 5.0
}) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl');
    
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }
    
    // Enable transparency blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
    // Handle canvas resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Create shaders
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error('Vertex shader compilation failed:', gl.getShaderInfoLog(vertexShader));
      return;
    }
    
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error('Fragment shader compilation failed:', gl.getShaderInfoLog(fragmentShader));
      return;
    }
    
    // Create program
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking failed:', gl.getProgramInfoLog(program));
      return;
    }
    
    gl.useProgram(program);
    
    // Create a buffer for the vertices
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    
    // Create a full-screen quad
    const positions = [
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0
    ];
    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    
    // Get attribute location
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    
    // Get uniform locations
    const timeLocation = gl.getUniformLocation(program, 'time');
    const resolutionLocation = gl.getUniformLocation(program, 'resolution');
    const angleLocation = gl.getUniformLocation(program, 'angle');
    const positionUniformLocation = gl.getUniformLocation(program, 'position');
    const spreadLocation = gl.getUniformLocation(program, 'spread');
    const cutoffLocation = gl.getUniformLocation(program, 'cutoff');
    const falloffLocation = gl.getUniformLocation(program, 'falloff');
    const edgeFadeLocation = gl.getUniformLocation(program, 'edge_fade');
    const speedLocation = gl.getUniformLocation(program, 'speed');
    const ray1DensityLocation = gl.getUniformLocation(program, 'ray1_density');
    const ray2DensityLocation = gl.getUniformLocation(program, 'ray2_density');
    const ray2IntensityLocation = gl.getUniformLocation(program, 'ray2_intensity');
    const colorLocation = gl.getUniformLocation(program, 'color');
    const seedLocation = gl.getUniformLocation(program, 'seed');
    
    // Set static uniforms
    gl.uniform1f(angleLocation, angle);
    gl.uniform1f(positionUniformLocation, position);
    gl.uniform1f(spreadLocation, spread);
    gl.uniform1f(cutoffLocation, cutoff);
    gl.uniform1f(falloffLocation, falloff);
    gl.uniform1f(edgeFadeLocation, edge_fade);
    gl.uniform1f(speedLocation, speed);
    gl.uniform1f(ray1DensityLocation, ray1_density);
    gl.uniform1f(ray2DensityLocation, ray2_density);
    gl.uniform1f(ray2IntensityLocation, ray2_intensity);
    gl.uniform4fv(colorLocation, color);
    gl.uniform1f(seedLocation, seed);
    
    // Animation loop
    let startTime = performance.now();
    
    const render = () => {
      const currentTime = performance.now();
      const elapsedTime = (currentTime - startTime) / 1000; // Convert to seconds
      
      gl.uniform1f(timeLocation, elapsedTime);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    let animationFrameId = requestAnimationFrame(render);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, [angle, position, spread, cutoff, falloff, edge_fade, speed, ray1_density, ray2_density, ray2_intensity, color, seed]);
  
  return (
    <ShaderContainer>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </ShaderContainer>
  );
}; 