#ifdef GL_ES
precision mediump float;
#endif

float random(vec2 co) {
   return fract(sin(dot(co.xy,vec2(12.9898,78.233))) * 43758.5453);
}

uniform vec2 resolution;

void main() {
  vec2 st = gl_FragCoord.xy / resolution;
  st = floor(10.0 * st);
  gl_FragColor = vec4(st / 10.0, 1.0, 1.0);
}