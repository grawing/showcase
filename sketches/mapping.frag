precision mediump float;

varying vec2 vTexCoord;

varying vec3 vNoise;

void main() {
  
  vec3 color = vNoise;

  gl_FragColor = vec4(color ,1.0);
}
