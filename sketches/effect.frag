precision mediump float;

varying vec2 vTexCoord;

uniform sampler2D tex0;
uniform sampler2D vid0;

uniform float tiles0;
uniform bool orig;
uniform bool pix;
uniform bool cam;

void main() {
  vec2 uv = vTexCoord;
  uv = 1.0 - uv;
  if(pix){
    uv = uv * tiles0;
    uv = floor(uv);
    uv = uv / tiles0;
  }
  vec4 tex;
  if(!cam){
      tex = texture2D(tex0, uv);
  }else{
      tex = texture2D(vid0, uv);
  }
  gl_FragColor = tex;
}
