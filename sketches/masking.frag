precision mediump float;

varying vec2 vTexCoord;

uniform sampler2D tex0;
uniform sampler2D vid0;

uniform vec2 texOffset;
uniform float mask[9];

uniform bool orig;
uniform bool bord;
uniform bool cam;
uniform bool roi;
uniform bool zoom;
uniform float posY;
uniform float posX;
uniform float roiSize;

float map2(float x, float in_min, float in_max, float out_min, float out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

void main() {
  vec4 convolution;
  vec4 texel;
  
  vec2 tc0 = vTexCoord + vec2(-texOffset.s, -texOffset.t);
  vec2 tc1 = vTexCoord + vec2(         0.0, -texOffset.t);
  vec2 tc2 = vTexCoord + vec2(+texOffset.s, -texOffset.t);
  vec2 tc3 = vTexCoord + vec2(-texOffset.s,          0.0);
  vec2 tc4 = vTexCoord + vec2(         0.0,          0.0);
  vec2 tc5 = vTexCoord + vec2(+texOffset.s,          0.0);
  vec2 tc6 = vTexCoord + vec2(-texOffset.s, +texOffset.t);
  vec2 tc7 = vTexCoord + vec2(         0.0, +texOffset.t);
  vec2 tc8 = vTexCoord + vec2(+texOffset.s, +texOffset.t);

  vec4 rgba[9];
  if(!cam){
    rgba[0] = texture2D(tex0, vec2(tc0.x,1.0-tc0.y));
    rgba[1] = texture2D(tex0, vec2(tc1.x,1.0-tc1.y));
    rgba[2] = texture2D(tex0, vec2(tc2.x,1.0-tc2.y));
    rgba[3] = texture2D(tex0, vec2(tc3.x,1.0-tc3.y));
    rgba[4] = texture2D(tex0, vec2(tc4.x,1.0-tc4.y));
    rgba[5] = texture2D(tex0, vec2(tc5.x,1.0-tc5.y));
    rgba[6] = texture2D(tex0, vec2(tc6.x,1.0-tc6.y));
    rgba[7] = texture2D(tex0, vec2(tc7.x,1.0-tc7.y));
    rgba[8] = texture2D(tex0, vec2(tc8.x,1.0-tc8.y));
    texel =  texture2D(tex0, vec2(vTexCoord.x,1.0-vTexCoord.y));
  }else{
    rgba[0] = texture2D(vid0, vec2(tc0.x,1.0-tc0.y));
    rgba[1] = texture2D(vid0, vec2(tc1.x,1.0-tc1.y));
    rgba[2] = texture2D(vid0, vec2(tc2.x,1.0-tc2.y));
    rgba[3] = texture2D(vid0, vec2(tc3.x,1.0-tc3.y));
    rgba[4] = texture2D(vid0, vec2(tc4.x,1.0-tc4.y));
    rgba[5] = texture2D(vid0, vec2(tc5.x,1.0-tc5.y));
    rgba[6] = texture2D(vid0, vec2(tc6.x,1.0-tc6.y));
    rgba[7] = texture2D(vid0, vec2(tc7.x,1.0-tc7.y));
    rgba[8] = texture2D(vid0, vec2(tc8.x,1.0-tc8.y));
    texel =  texture2D(vid0, 1.0 - vec2(vTexCoord.x,1.0-vTexCoord.y));
  }
  for (int i = 0; i < 9; i++) {
    convolution += rgba[i]*mask[i];
  }
  
  float pct = 0.0;
  pct = distance(vTexCoord,vec2(posX,1.0-posY)); 
  
  if(roi){
    if(pct<roiSize){
      gl_FragColor = vec4(convolution.rgb, 1.0); 
    }else{
      gl_FragColor = vec4(texel.rgb, 1.0); 
    }
  }else if(zoom){
    if(pct<roiSize){
      //vec2 coords2 = (vec2(map2(vTexCoord.x-posX, -roiSize/2.0, roiSize/2.0, -roiSize, roiSize),map2(vTexCoord.y-(1.0-posY), -roiSize/2.0, roiSize/2.0, -roiSize, roiSize)));
      
      vec4 xd = texture2D(tex0, vec2(vTexCoord.x + ((vTexCoord.x - posX) / 3.0), 1.0 - vTexCoord.y + (vTexCoord.y - 1.0 + posY) / 3.0));

      gl_FragColor = vec4(xd.rgb ,1.0);
    }else{
      gl_FragColor = vec4(texel.rgb, 1.0); 
    }
  }else{
    gl_FragColor = vec4(convolution.rgb, 1.0); 
  }
}
