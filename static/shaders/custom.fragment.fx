precision highp float;

varying vec2 vUv;

uniform sampler2D textureSampler;
uniform sampler2D textureSampler2;

void main(void) {

    if (vUv.x > 0.5) {
        gl_FragColor = texture2D(textureSampler2, vUv);
    } else {
        gl_FragColor = texture2D(textureSampler, vUv);
    }
  
}