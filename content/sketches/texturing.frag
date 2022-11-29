precision mediump float;

varying vec4 color4;
varying vec2 vTexCoord;

uniform sampler2D tex0;
uniform sampler2D vid0;

uniform bool inv;
uniform bool baw;
uniform bool cam;
uniform bool ten;
uniform bool elm;
uniform bool luz;
uniform bool hsl;
uniform vec2 mousePos;
uniform vec3 colT;
uniform float opc;

float luma(vec3 texel) {
  return 0.299 * texel.r + 0.587 * texel.g + 0.114 * texel.b;
}



vec3 hslCol(vec3 texel){
  float Cmin =  min(min(texel.r,texel.g),texel.b);
  float Cmax =  max(max(texel.r,texel.g),texel.b);
  float delta = Cmax - Cmin;
  float H = 0.0 ,S = 0.0 ,L = 0.0 ;
  
  if(delta == 0.0){
    H = 0.0;
    S = 0.0;
  }else if(texel.r == Cmax){
    H = 60.0 * (mod(((texel.g-texel.b)/delta), 6.0));
  }else if(texel.g==Cmax){
    H = 60.0 * (((texel.b-texel.r)/delta) + 2.0);
  }else{
    H = 60.0 * (((texel.r-texel.g)/delta) + 4.0);
  }
  L = (Cmax + Cmin)/2.0;
  
  if(delta!=0.0){
    S = delta/(1.0-(2.0*L - 1.0 > 0.0 ? 2.0*L-1.0 : -(2.0*L-1.0)));
  }

  return vec3(H,S,L);
}

void main() {
  
  vec2 uv = vTexCoord;
  uv = vec2(uv.x,1.0-uv.y);
  vec4 tex;
  if(!cam){
      tex = texture2D(tex0, uv);
  }else{
      tex = texture2D(vid0, uv);
  }
  
  float pct = 0.0;
  pct = distance(vTexCoord,vec2(mousePos.x,1.0-mousePos.y));

  if(baw){
    tex = vec4((vec3(luma(tex.rgb))), opc);
  }else if(inv){
    tex = vec4(vec3(1.0) - tex.rgb, opc);
  }else if(ten){
    tex = vec4((tex.rgb*colT.rgb), opc);
  }else if(elm){
    tex = vec4(tex.rgb-colT.rgb, opc);
  }else if(hsl){
    tex = vec4(tex.rgb*color4.rgb, opc);
  }else if(luz){
    tex = vec4((tex.rgb+(0.5-vec3(pct))), 1.0);
  }else{
    tex = vec4(tex.rgb, opc);
  }
  gl_FragColor = tex;
}
