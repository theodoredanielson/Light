var VSHADER_SOURCE =
  'precision mediump float;\n' +
  'attribute vec4 a_Position;\n' +
  'attribute vec2 a_UV;\n' +
  'varying vec2 v_UV;\n' +
  'attribute vec3 a_Normal;\n' +
  'varying vec3 v_Normal;\n' +
  'varying vec4 v_VertPos;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform mat4 u_ProjectionMatrix;\n' +
  'uniform mat4 u_GlobalRotateMatrix;\n' +
  'uniform mat4 u_NormalMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;\n' +
  '  v_UV = a_UV;\n' +
  '  v_Normal = normalize(vec3(u_NormalMatrix * vec4(a_Normal,1) ));\n' +
  '  v_VertPos = u_ModelMatrix * a_Position;\n' +
  '}\n';

var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'varying vec2 v_UV;\n' +
  'varying vec3 v_Normal;\n' +
  'uniform vec4 u_FragColor;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform sampler2D u_Sampler0;\n' +
  'uniform sampler2D u_Sampler1;\n' +
  'uniform sampler2D u_Sampler2;\n' +
  'uniform sampler2D u_Sampler3;\n' +
  'uniform sampler2D u_Sampler4;\n' +
  'uniform sampler2D u_Sampler5;\n' +
  'uniform int u_whichTexture;\n' +
  'uniform vec3 u_lightPos;\n' +
  'uniform bool u_lightOn;\n' +
  'uniform bool u_spotLightOn;\n' +
  'uniform vec3 u_cameraPos;\n' +
  'varying vec4 v_VertPos;\n' +
  'uniform vec3 u_lightColor;\n' +
  'uniform vec3 u_spotLightPos;\n' +
  'uniform vec3 u_spotLightDir;\n' +
  'uniform float u_spotLightCutoff;\n' +
  'uniform float u_spotLightExp;\n' +
  'void main() {\n' +
  '  if (u_whichTexture == -4) {\n' +
  '     gl_FragColor = u_FragColor;\n' +
  '  } else if (u_whichTexture == -3) {\n' +
  '     gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0);\n' +
  '  } else if (u_whichTexture == -2) {\n' +
  '     gl_FragColor = u_FragColor;\n' +
  '  } else if (u_whichTexture == -1) {\n' +
  '     gl_FragColor = vec4(v_UV, 1.0, 1.0);\n' +
  '  } else if (u_whichTexture == 0) {\n' +
  '     gl_FragColor = texture2D(u_Sampler0, v_UV);\n' +
  '  } else if (u_whichTexture == 1) {\n' +
  '     gl_FragColor = texture2D(u_Sampler1, v_UV);\n' +
  '  } else if (u_whichTexture == 2) {\n' +
  '     gl_FragColor = texture2D(u_Sampler2, v_UV);\n' +
  '  } else if (u_whichTexture == 3) {\n' +
  '     gl_FragColor = texture2D(u_Sampler3, v_UV);\n' +
  '  } else if (u_whichTexture == 4) {\n' +
  '     gl_FragColor = texture2D(u_Sampler4, v_UV);\n' +
  '  } else if (u_whichTexture == 5) {\n' +
  '     gl_FragColor = texture2D(u_Sampler5, v_UV);\n' +
  '  } else { \n' +
  '     gl_FragColor = vec4(1.0, 0.2, 0.2, 1.0);\n' +
  '  }\n' +

  // Regular Light
  '  vec3 lightVector = u_lightPos-vec3(v_VertPos);\n' +
  '  float r=length(lightVector);\n' +
  '  vec3 L = normalize(lightVector);\n' +
  '  vec3 N = normalize(v_Normal);\n' +
  '  float nDotL = max(dot(N, L), 0.0);\n' +
  '  vec3 R = reflect(-L, N);\n' +
  '  vec3 E = normalize(u_cameraPos-vec3(v_VertPos));\n' +
  '  vec3 specular = vec3(pow(max(dot(E,R), 0.0), 10.0)) * u_lightColor;\n' +
  '  vec3 diffuse = vec3(gl_FragColor) * nDotL * u_lightColor;\n' +
  '  vec3 ambient = vec3(gl_FragColor) * 0.3;\n' +

  // Spot Light
  '  vec3 L_spot = normalize(u_spotLightPos-vec3(v_VertPos));\n' +
  '  float nDotL_spot = max(dot(N, L_spot), 0.0);\n' +
  '  vec3 R_spot = reflect(-L_spot, N);\n' +
  '  vec3 specular_spot = vec3(pow(max(dot(E,R_spot), 0.0), 10.0));\n' +

  '  vec3 spotDir = normalize(u_spotLightDir);\n' +
  '  float spotFactor = dot(-L_spot, spotDir);\n' +
  '  float spotIntensity = 0.0;\n' +
  '  if (spotFactor > u_spotLightCutoff) {\n' +
  '     spotIntensity = pow(spotFactor, u_spotLightExp);\n' +
  '  }\n' +

  '  vec3 diffuse_spot = vec3(gl_FragColor) * nDotL_spot * spotIntensity* u_lightColor;\n' +
  '  specular_spot = specular_spot * spotIntensity* u_lightColor;\n' +

  // I don't want the floor to shine
  '  if (u_whichTexture == -4) {\n' +
  '     specular = vec3(0);\n' +
  '  } else if (u_whichTexture == 3) {\n' +
  '     specular = vec3(0);\n' +
  '  }\n' +

  // Light control
  '  if (u_lightOn) {\n' +
  '     if (u_spotLightOn) {\n' +
  '          diffuse = diffuse + diffuse_spot;\n' +
  '          specular = specular + specular_spot;\n' +
  '     }\n' +
  '     gl_FragColor = vec4(specular + ambient + diffuse, 1.0);\n' +
  '  }\n' +
  '  else {\n' +
  '     if (u_spotLightOn) {\n' +
  '         gl_FragColor = vec4(specular_spot + ambient + diffuse_spot, 1.0);\n' +
  '     }\n' +
  '  }\n' +
  '}\n';

// global variables
let canvas; // canvas element
let gl; // webgl context
let a_Position; // attribute location for position
let u_FragColor; // uniform location for fragment color
let u_ModelMatrix; // uniform location for model matrix
let u_whichTexture; // uniform location for texture selection
let u_lightPos; // uniform location for light position
let u_cameraPos; // uniform location for camera position
let u_GlobalRotateMatrix; // uniform location for global rotation matrix
let u_ViewMatrix; // uniform location for view matrix
let u_ProjectionMatrix; // uniform location for projection matrix
let u_NormalMatrix; // uniform location for normal matrix
let u_lightOn; // uniform location for light on/off
let u_spotLightOn;
let u_lightColor; // uniform location for light color
let a_UV; // attribute location for UV coordinates
let v_UV; // varying UV coordinates
let a_Normal; // attribute location for normal
let u_Sampler0; // uniform location for texture sampler 0
let u_Sampler1; // uniform location for texture sampler 1
let u_Sampler2; // uniform location for texture sampler 2
let u_Sampler3; // uniform location for texture sampler 3
let u_Sampler4; // uniform location for texture sampler 4
let u_Sampler5; // uniform location for texture sampler 5
let viewMatrix = new Matrix4(); // view matrix
const camera = new Camera(); // camera instance
console.log(camera.eye.elements); // log camera eye position
console.log(camera.at.elements); // log camera target position
console.log(camera.up.elements); // log camera up vector

// setup webgl context
function setupWebGL() {
  canvas = document.getElementById('webgl'); // get canvas element
  gl = canvas.getContext("webgl"); // get webgl context
  if (!gl) {
    console.log('failed to get the rendering context for webgl'); // log error
    return;
  }
  gl.enable(gl.DEPTH_TEST); // enable depth test


  // ensure pointer lock API works across all browsers
  canvas.requestPointerLock = canvas.requestPointerLock ||
    canvas.mozRequestPointerLock ||
    canvas.webkitRequestPointerLock;

  document.exitPointerLock = document.exitPointerLock ||
    document.mozExitPointerLock ||
    document.webkitExitPointerLock;

  // when the user clicks the canvas, request pointer lock
  canvas.onclick = function () {
    canvas.requestPointerLock(); // request pointer lock
  };

  // listen for pointer lock changes
  document.addEventListener("pointerlockchange", pointerLockChange, false);
  document.addEventListener("mozpointerlockchange", pointerLockChange, false);
  document.addEventListener("webkitpointerlockchange", pointerLockChange, false);

  function pointerLockChange() {
    if (document.pointerLockElement === canvas ||
      document.mozPointerLockElement === canvas ||
      document.webkitPointerLockElement === canvas) {
      console.log("pointer locked"); // log pointer lock status
      document.addEventListener("mousemove", updateCameraFromMouse, false); // update camera on mouse move
    } else {
      console.log("pointer unlocked"); // log pointer unlock status
      document.removeEventListener("mousemove", updateCameraFromMouse, false); // remove mouse move listener
    }
  }

  // listen for "tab" key to unlock pointer
  document.addEventListener("keydown", function (e) {
    if (e.key === "Tab") {
      document.exitPointerLock(); // exit pointer lock
      e.preventDefault(); // prevent default browser tab switching
    }
  });

}

// connect variables to glsl
/**
 * Connects JavaScript variables to GLSL shader variables.
 * Initializes shaders and retrieves the storage locations of various attributes and uniforms.
 * Logs errors if any of the storage locations cannot be retrieved.
 * Sets the model matrix to the identity matrix.
 *
 * @returns {void|boolean} Returns false if any of the texture sampler locations cannot be retrieved.
 */
function connectVariablesToGLSL() {
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('failed to initialize shaders.'); // log shader initialization error
    return;
  }

  a_Position = gl.getAttribLocation(gl.program, 'a_Position'); // get attribute location for position
  if (a_Position < 0) {
    console.log('failed to get the storage location of a_Position'); // log error
    return;
  }

  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor'); // get uniform location for fragment color
  if (!u_FragColor) {
    console.log('failed to get the storage location of u_FragColor'); // log error
    return;
  }

  u_spotLightPos = gl.getUniformLocation(gl.program, 'u_spotLightPos'); // get uniform location for spot light position
  if (!u_spotLightPos) {
    console.log('failed to get the storage location of u_spotLightPos'); // log error
    return;
  }

  u_spotLightDir = gl.getUniformLocation(gl.program, 'u_spotLightDir'); // get uniform location for spot light direction
  if (!u_spotLightDir) {
    console.log('failed to get the storage location of u_spotLightDir'); // log error
    return;
  }

  u_spotLightCutoff = gl.getUniformLocation(gl.program, 'u_spotLightCutoff'); // get uniform location for spot light cutoff
  if (!u_spotLightCutoff) {
    console.log('failed to get the storage location of u_spotLightCutoff'); // log error
    return;
  }

  u_spotLightExp = gl.getUniformLocation(gl.program, 'u_spotLightExp'); // get uniform location for spot light exponent
  if (!u_spotLightExp) {
    console.log('failed to get the storage location of u_spotLightExp'); // log error
    return;
  }

  u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix'); // get uniform location for normal matrix
  if (!u_NormalMatrix) {
    console.log('failed to get the storage location of u_NormalMatrix'); // log error
    return;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture'); // get uniform location for texture selection
  if (!u_whichTexture) {
    console.log('failed to get the storage location of u_whichTexture'); // log error
    return;
  }

  u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn'); // get uniform location for light on/off
  if (!u_lightOn) {
    console.log('failed to get the storage location of u_lightOn'); // log error
    return;
  }

  u_spotLightOn = gl.getUniformLocation(gl.program, 'u_spotLightOn'); // get uniform location for spot light on/off
  if (!u_spotLightOn) {
    console.log('failed to get the storage location of u_spotLightOn'); // log error
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix'); // get uniform location for model matrix
  if (!u_ModelMatrix) {
    console.log('failed to get the storage location of u_ModelMatrix'); // log error
    return;
  }

  u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos'); // get uniform location for light position
  if (!u_lightPos) {
    console.log('failed to get the storage location of u_lightPos'); // log error
    return;
  }

  u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos'); // get uniform location for camera position
  if (!u_cameraPos) {
    console.log('failed to get the storage location of u_cameraPos'); // log error
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix'); // get uniform location for global rotation matrix
  if (!u_GlobalRotateMatrix) {
    console.log('failed to get the storage location of u_GlobalRotateMatrix'); // log error
    return;
  }

  u_lightColor = gl.getUniformLocation(gl.program, 'u_lightColor'); // get uniform location for light color
  if (!u_lightColor) {
    console.log('failed to get the storage location of u_lightColor'); // log error
    return;
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix'); // get uniform location for view matrix
  if (!u_ViewMatrix) {
    console.log('failed to get the storage location of u_ViewMatrix'); // log error
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix'); // get uniform location for projection matrix
  if (!u_ProjectionMatrix) {
    console.log('failed to get the storage location of u_ProjectionMatrix'); // log error
    return;
  }

  a_UV = gl.getAttribLocation(gl.program, 'a_UV'); // get attribute location for UV coordinates
  if (a_UV < 0) {
    console.log('failed to get the storage location of a_UV'); // log error
    return;
  }

  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal'); // get attribute location for normal vector
  if (a_Normal < 0) {
    console.log('failed to get the storage location of a_Normal'); // log error
    return;
  }

  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0'); // get uniform location for texture sampler 0
  if (!u_Sampler0) {
    console.log('failed to get the storage location of u_Sampler0'); // log error
    return false;
  }

  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1'); // get uniform location for texture sampler 1
  if (!u_Sampler1) {
    console.log('failed to get the storage location of u_Sampler1'); // log error
    return false;
  }

  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2'); // get uniform location for texture sampler 2
  if (!u_Sampler2) {
    console.log('failed to get the storage location of u_Sampler2'); // log error
    return false;
  }

  u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3'); // get uniform location for texture sampler 3
  if (!u_Sampler3) {
    console.log('failed to get the storage location of u_Sampler3'); // log error
    return false;
  }

  u_Sampler4 = gl.getUniformLocation(gl.program, 'u_Sampler4'); // get uniform location for texture sampler 4
  if (!u_Sampler4) {
    console.log('failed to get the storage location of u_Sampler4'); // log error
    return false;
  }

  u_Sampler5 = gl.getUniformLocation(gl.program, 'u_Sampler5'); // get uniform location for texture sampler 5
  if (!u_Sampler5) {
    console.log('failed to get the storage location of u_Sampler5'); // log error
    return false;
  }

  var identityM = new Matrix4(); // create identity matrix
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements); // set model matrix to identity

  // initialize view matrix
  var viewMatrix = new Matrix4();

  // initialize projection matrix
  var projMatrix = new Matrix4();
}

// shape types
const POINT = 0; // point shape type
const TRIANGLE = 1; // triangle shape type
const CIRCLE = 2; // circle shape type
const RAINBOW = 3; // rainbow shape type

// global settings
let g_selectedColor = [1.0, 1.0, 1.0, 1.0]; // selected color
let g_selectedSize = 5; // selected size
let g_selectedType = POINT; // selected shape type
let g_globalAngle = 0; // global angle
let g_yellowAngle = 0; // yellow angle
let g_magAngle = 0; // magnitude angle
let g_magAnimation = false; // magnitude animation flag
let g_yellowAnimation = false; // yellow animation flag
let g_normalOn = false; // normal on flag
let g_lightPos = [0, 1, -1]; // light position
let g_lightColor = [1, 1, 1]; // light color

// Spotlight parameters
let g_spotlightPos = [0, 6, 0];
let g_spotlightDir = [0, -.5, 0];  // pointing straight down
let g_spotlightCutoff = 0.7;      // dot angle threshold (cosine of cutoff angle)
let g_spotlightExp = 120.0;        // makes the cutoff sharper at edges

let g_upperLegAngle = -90; // upper leg angle
let g_lowerLegAngle = -30; // lower leg angle
let g_upperLegAngle_2 = -90; // second upper leg angle
let g_lowerLegAngle_2 = -30; // second lower leg angle
let g_ankleAngle = 0; // ankle angle
let g_bodyAngle = 0; // body angle

let g_upperLegBaseAngle = 0; // upper leg base angle
let g_lowerLegBaseAngle = 30; // lower leg base angle
let g_upperLegAnimOffset = 0; // upper leg animation offset
let g_lowerLegAnimOffset = 0; // lower leg animation offset
let g_animations = {
  legSwing: false // leg swing animation flag
};
let g_isDragging = false; // dragging flag
let g_mouseXAngle = 180;  // reset to 0
let g_mouseYAngle = 0; // mouse Y angle
let g_lastMouseX = 0; // last mouse X position
let g_lastMouseY = 0; // last mouse Y position

let g_pokeAnimation = false; // poke animation flag
let g_pokeFinal = false; // poke final flag
let g_pokeStartTime = 0; // poke start time
const pokeGlobalDuration = 1.0; // global duration for poke
const pokeLegDuration = 2.0; // leg duration for poke

let g_startMouseXAngle = 0; // starting mouse X angle
let g_startMouseYAngle = 0; // starting mouse Y angle
let g_start_upperLegAngle = 0; // starting upper leg angle
let g_start_lowerLegAngle = 0; // starting lower leg angle
let g_start_upperLegAngle_2 = 0; // starting second upper leg angle
let g_start_lowerLegAngle_2 = 0; // starting second lower leg angle

let g_lightOn = true; // light on flag 
let g_spotLightOn = true; // spot light on flag

function initTextures() {
  const texturePaths = [
    'Textures/sky.jpg', // sky texture
    'Textures/cartoonSky.jpg', // cartoon sky texture
    'Textures/cobbleStone.jpg', // cobblestone texture
    'Textures/grass.jpg', // grass texture
    'Textures/dirt.jpg', // dirt texture
    'Textures/cartoonSky.jpg' // cartoon sky texture
  ];

  texturePaths.forEach((path, index) => {
    const image = new Image(); // create new image
    if (!image) {
      console.log('failed to create image'); // log error
      return false;
    }
    image.onload = function () { sendTextureToTEXTURE(image, index); } // send texture on load
    image.onerror = function () {
      console.error(`failed to load texture: ${path}`); // log texture load error
    };
    image.src = path; // set image source
  });

  return true; // return success
}

function isPowerOf2(value) {
  return (value & (value - 1)) === 0; // check if value is power of 2
}

function hsvToRgb(h, s, v) {
  let c = v * s;
  let x = c * (1 - Math.abs((h / 60) % 2 - 1));
  let m = v - c;
  let r, g, b;
  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }
  return [r + m, g + m, b + m];
}

function sendTextureToTEXTURE(image, index) {
  const texture = gl.createTexture(); // create texture object
  if (!texture) {
    console.log('failed to create the texture object'); // log error
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // flip texture vertically
  gl.activeTexture(gl[`TEXTURE${index}`]); // activate texture unit
  gl.bindTexture(gl.TEXTURE_2D, texture); // bind texture

  // check if the image has power-of-two dimensions
  if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
    // enable mipmapping and set wrap mode to repeat
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image); // set texture image
    gl.generateMipmap(gl.TEXTURE_2D); // generate mipmaps
  } else {
    // for non power-of-two images, use clamp to edge and no mipmapping
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image); // set texture image
  }

  gl.uniform1i(gl.getUniformLocation(gl.program, `u_Sampler${index}`), index); // set sampler uniform
  console.log(`finished loading texture ${index}`); // log texture load completion
}

// add actions for html ui
/**
 * Adds event listeners and actions for HTML UI elements.
 * 
 * This function sets up various event listeners on the canvas and HTML elements
 * to handle user interactions such as mouse events and button clicks.
 * 
 * Mouse Events:
 * - `mousedown` on canvas: Handles block placement/removal and starts dragging.
 * - `mouseup` on canvas: Stops dragging.
 * - `mousemove` on canvas: Handles camera rotation based on dragging.
 * 
 * Button Click Events:
 * - `normalOn`: Sets `g_normalOn` to true.
 * - `normalOff`: Sets `g_normalOn` to false.
 * - `lightOn`: Sets `g_lightOn` to true.
 * - `lightOff`: Sets `g_lightOn` to false.
 * - `spotLightOn`: Sets `g_spotLightOn` to true.
 * - `spotLightOff`: Sets `g_spotLightOn` to false.
 * 
 * Slider Events:
 * - `lightSlideX`: Adjusts `g_lightPos[0]` based on slider value.
 * - `lightSlideY`: Adjusts `g_lightPos[1]` based on slider value.
 * - `lightSlideZ`: Adjusts `g_lightPos[2]` based on slider value.
 * - `spotSlideX`: Adjusts `g_spotlightPos[0]` and `g_spotlightDir[0]` based on slider value.
 * - `spotSlideY`: Adjusts `g_spotlightPos[1]` based on slider value.
 * - `spotSlideZ`: Adjusts `g_spotlightPos[2]` and `g_spotlightDir[2]` based on slider value.
 * 
 * Animation Control:
 * - `animationLegOnButton`: Enables leg swing animation.
 * - `animationLegOffButton`: Disables leg swing animation.
 */
function addActionsForHtmlUI() {
  canvas.addEventListener("mousedown", function (event) {
    // prevent the browser's default context menu
    event.preventDefault();

    // check if shift is pressed
    if (event.shiftKey) {
      // call your block placement function; pass true to add a block.
      placeBlock(true); // add block
    } else if (event.ctrlKey) {
      placeBlock(false); // remove block
    }
  });

  canvas.addEventListener('mousedown', function (ev) {
    g_isDragging = true; // set dragging flag
    g_lastMouseX = ev.clientX; // update last mouse X position
    g_lastMouseY = ev.clientY; // update last mouse Y position
  });

  canvas.addEventListener('mouseup', function (ev) {
    g_isDragging = false; // reset dragging flag
  });

  canvas.addEventListener('mousemove', function (ev) {
    if (!g_isDragging) return; // return if not dragging

    const dx = ev.clientX - g_lastMouseX; // calculate change in X
    const dy = ev.clientY - g_lastMouseY; // calculate change in Y

    g_lastMouseX = ev.clientX; // update last mouse X position
    g_lastMouseY = ev.clientY; // update last mouse Y position

    // camera rotation logic
    const rotationSpeed = 0.3; // rotation speed

    // horizontal drag => pan
    if (dx !== 0) {
      const angle = dx * rotationSpeed; // calculate angle
      if (angle > 0) {
        camera.panRight(angle); // pan right
      } else {
        camera.panLeft(-angle); // pan left
      }
    }

    // vertical drag => pitch
    if (dy !== 0) {
      const angle = dy * rotationSpeed; // calculate angle
      if (angle > 0) {
        camera.pitchDown(angle); // pitch down
      } else {
        camera.pitchUp(-angle); // pitch up
      }
    }


  });

  document.getElementById('normalOn').onclick = function () {
    g_normalOn = true;
    console.log("Normal On set:", g_normalOn);
  };
  document.getElementById('normalOff').onclick = function () {
    g_normalOn = false;
    console.log("Normal Off set:", g_normalOn);
  };

  document.getElementById('lightOn').onclick = function () {
    g_lightOn = true;
    console.log("Light On set:", g_lightOn);
  };
  document.getElementById('lightOff').onclick = function () {
    g_lightOn = false;
    console.log("Light On set:", g_lightOn);
  };
  document.getElementById('spotLightOn').onclick = function () {
    g_spotLightOn = true;
    console.log("Spot Light On set:", g_spotLightOn);
  };
  document.getElementById('spotLightOff').onclick = function () {
    g_spotLightOn = false;
    console.log("Spot Light On set:", g_spotLightOn);
  };
  document.getElementById('lightSlideX').addEventListener('mousemove', function (ev) {
    if (ev.buttons == 1) { g_lightPos[0] = this.value / 100; }
  });
  document.getElementById('lightSlideY').addEventListener('mousemove', function (ev) {
    if (ev.buttons == 1) { g_lightPos[1] = this.value / 100 + 1; }
  });
  document.getElementById('lightSlideZ').addEventListener('mousemove', function (ev) {
    if (ev.buttons == 1) { g_lightPos[2] = this.value / 100 - 1; }
  });

  document.getElementById('spotSlideX').addEventListener('mousemove', function (ev) {
    if (ev.buttons == 1) { g_spotlightPos[0] = this.value / 100; g_spotlightDir[0] = this.value / 10000; }
  });
  document.getElementById('spotSlideY').addEventListener('mousemove', function (ev) {
    if (ev.buttons == 1) { g_spotlightPos[1] = this.value / 100; }
  });
  document.getElementById('spotSlideZ').addEventListener('mousemove', function (ev) {
    if (ev.buttons == 1) { g_spotlightPos[2] = this.value / 100; g_spotlightDir[2] = this.value / 10000; }
  });

  document.getElementById('lightColorHue').addEventListener('mousemove', function (ev) {
    if (ev.buttons == 1) {
      let hue = parseFloat(this.value);
      let rgb;
      if (hue === 0) {
        // When hue is 0, set to white.
        g_lightColor = [1.0, 1.0, 1.0];
        rgb = [255, 255, 255];
      } else {
        g_lightColor = hsvToRgb(hue, 1, 1);
        // Convert each channel from [0,1] to [0,255]
        rgb = g_lightColor.map(c => Math.floor(c * 255));
      }
      // Update the preview box background color
      document.getElementById('lightColorDisplay').style.backgroundColor = `rgb(${rgb.join(',')})`;
    }
  });
  
  


  document.getElementById('animationLegOnButton').onclick = function () {
    if (g_pokeAnimation) cancelPokeAnimation();
    g_animations.legSwing = true;
  };
  document.getElementById('animationLegOffButton').onclick = function () {
    if (g_pokeAnimation) cancelPokeAnimation();
    g_animations.legSwing = false;
  };
}

// main function
function main() {
  setupWebGL(); // setup webgl context
  if (!gl) {
    console.error('failed to get webgl context'); // log error
    return;
  }

  connectVariablesToGLSL(); // connect variables to glsl
  if (!gl.program) {
    console.error('failed to initialize shaders'); // log error
    return;
  }

  initStaticTransforms(); // initialize static transforms

  addActionsForHtmlUI(); // add actions for html ui

  document.onkeydown = keydown; // set keydown event

  gl.enable(gl.DEPTH_TEST); // enable depth test
  initTextures(); // initialize textures
  gl.clearColor(0.0, 0.0, 0.0, 1.0); // set clear color
  requestAnimationFrame(tick); // start animation loop
}

function checkWinCondition() {
  const winRadius = 3; // win radius
  const headX = 10; // set the actual x-coordinate of the roach head block
  const headZ = 4; // set the actual z-coordinate of the roach head block

  let distX = camera.eye.elements[0] - headX; // calculate distance in X
  let distZ = camera.eye.elements[2] - headZ; // calculate distance in Z
  let distance = Math.sqrt(distX * distX + distZ * distZ); // calculate distance

  if (distance < winRadius) {
    // console.log("YOU WIN!");
    g_animations.legSwing = true; // start animation
    disableMovement(); // disable movement
    displayWinMessage(); // display win message
  }
}

function disableMovement() {
  document.onkeydown = null; // disable keyboard input
}

// animation timing
var g_startTime = performance.now() / 1000; // start time
var g_seconds = performance.now() / 1000 - g_startTime; // elapsed time

function showGameOverMessage() {
  let message = document.createElement("p"); // create message element
  message.innerText = "no cheating! peaking over walls is against the rules. refresh to start again"; // set message text

  // style the text
  message.style.color = "red"; // set text color
  message.style.fontSize = "20px"; // set font size
  message.style.fontWeight = "bold"; // set font weight
  message.style.textAlign = "center"; // set text alignment

  // style the background for readability
  message.style.backgroundColor = "black"; // set background color
  message.style.padding = "10px 20px"; // set padding
  message.style.borderRadius = "5px"; // set border radius

  // positioning
  message.style.position = "absolute"; // set position
  message.style.top = "10px"; // set top position
  message.style.left = "50%"; // set left position
  message.style.transform = "translateX(-50%)"; // center horizontally

  // ensure it's visible
  message.style.display = "block"; // set display

  // add to the document
  document.body.appendChild(message); // append message to body
}

function displayWinMessage() {
  let message = document.createElement("p"); // create message element
  if (quit) {
    message.innerText = "i saw you quit....whatever, we'll count that as a win! refresh to play again"; // set message text
  } else {
    message.innerText = "you win! refresh to play again"; // set message text
  }

  // style the text
  message.style.color = "green"; // set text color
  message.style.fontSize = "20px"; // set font size
  message.style.fontWeight = "bold"; // set font weight
  message.style.textAlign = "center"; // set text alignment

  // style the background for readability
  message.style.backgroundColor = "black"; // set background color
  message.style.padding = "10px 20px"; // set padding
  message.style.borderRadius = "5px"; // set border radius

  // positioning
  message.style.position = "absolute"; // set position
  message.style.top = "10px"; // set top position
  message.style.left = "50%"; // set left position
  message.style.transform = "translateX(-50%)"; // center horizontally

  // ensure it's visible
  message.style.display = "block"; // set display

  // add to the document
  document.body.appendChild(message); // append message to body
}

// animation loop
function tick() {
  g_seconds = performance.now() / 1000 - g_startTime; // update elapsed time
  checkWinCondition(); // check win condition
  updateAnimationAngles(); // update animation angles
  renderAllShapes(); // render all shapes
  requestAnimationFrame(tick); // request next animation frame
}

// convert mouse event to gl coordinates
function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // get mouse X
  var y = ev.clientY; // get mouse Y
  var rect = ev.target.getBoundingClientRect(); // get bounding rect

  x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2); // convert to gl coordinates
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2); // convert to gl coordinates

  return [x, y]; // return gl coordinates
}

function keydown(ev) {
  if (ev.keyCode === 39 || ev.keyCode === 68) {
    camera.right(); // move camera right
  } else if (ev.keyCode === 37 || ev.keyCode === 65) {
    camera.left(); // move camera left
  } else if (ev.keyCode === 40 || ev.keyCode === 83) {
    camera.back(); // move camera back
  } else if (ev.keyCode === 38 || ev.keyCode === 87) {
    camera.forward(); // move camera forward
  } else if (ev.keyCode === 81) { // Q key
    camera.panLeft(); // adjust the global angle matrix for left rotation
  } else if (ev.keyCode === 69) { // E key
    camera.panRight(); // adjust the global angle matrix for right rotation
  }

  renderAllShapes(); // render all shapes
  console.log("Eye X: " + camera.eye.elements[0]); // log camera eye X
  console.log("Eye Y: " + camera.eye.elements[1]); // log camera eye Y
}

// list of shapes
var g_shapesList = []; // shapes list
let lastLegSwingUpdate = 0; // last leg swing update time
let waveVal = 0; // wave value

// update animation angles
function updateAnimationAngles() {
  if (g_pokeAnimation) {
    let currentTime = performance.now() / 1000; // get current time
    let elapsed = currentTime - g_pokeStartTime; // calculate elapsed time

    if (elapsed < pokeGlobalDuration) {
      let t = elapsed / pokeGlobalDuration; // calculate t
      g_mouseXAngle = g_startMouseXAngle + t * (0 - g_startMouseXAngle); // update mouse X angle
      g_mouseYAngle = g_startMouseYAngle + t * (-180 - g_startMouseYAngle); // update mouse Y angle
    } else if (elapsed < pokeGlobalDuration + pokeLegDuration) {
      g_animations.legSwing = false; // disable leg swing animation
      let t = (elapsed - pokeGlobalDuration) / pokeLegDuration; // calculate t
      g_upperLegAngle = g_start_upperLegAngle + t * (-100 - g_start_upperLegAngle); // update upper leg angle
      g_lowerLegAngle = g_start_lowerLegAngle + t * (-60 - g_start_lowerLegAngle); // update lower leg angle
      g_upperLegAngle_2 = g_start_upperLegAngle_2 + t * (-130 - g_start_upperLegAngle_2); // update second upper leg angle
      g_lowerLegAngle_2 = g_start_lowerLegAngle_2 + t * (-75 - g_start_lowerLegAngle_2); // update second lower leg angle
    } else {
      g_pokeFinal = true; // set poke final flag
    }
  }
  if (g_animations.legSwing) {
    const now = performance.now(); // get current time
    // update at most every 16ms (about 60 updates per second)
    if (now - lastLegSwingUpdate < 16) return; // return if not enough time has passed
    lastLegSwingUpdate = now; // update last leg swing update time

    let period = (2 * Math.PI) / 25; // calculate period
    let phase = (g_seconds % period) / period; // calculate phase
    waveVal = phase < 0.5 ? 4 * phase - 1 : 3 - 4 * phase; // calculate wave value
    waveVal = .5 * waveVal; // scale wave value
    g_upperLegAngle = -8 * waveVal - 90; // update upper leg angle
    g_lowerLegAngle = -18 * waveVal - 10; // update lower leg angle
    g_upperLegAngle_2 = -5 * -waveVal - 90; // update second upper leg angle
    g_lowerLegAngle_2 = -15 * -waveVal - 10; // update second lower leg angle
    g_lightPos[0] = 1.5 * Math.cos(g_seconds); // update light position
  } else {
    g_upperLegAnimOffset = 0; // reset upper leg animation offset
    g_lowerLegAnimOffset = 0; // reset lower leg animation offset
  }
}

var lastPerfUpdateTime = 0; // last performance update time
// update performance info
function updatePerformanceInfo(duration, fps) {
  const now = performance.now(); // get current time
  if (now - lastPerfUpdateTime > 250) { // update only every 500 ms
    sendTextToHTML("ms: " + Math.floor(duration) + " || fps: " + Math.floor(fps), "numdot"); // send performance info to html
    lastPerfUpdateTime = now; // update last performance update time
  }
}

let quit = false; // quit flag

// send text to html element
function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID); // get html element
  if (!htmlElm) {
    console.log("failed to get " + htmlID + " from html"); // log error
    return;
  }
  htmlElm.innerHTML = text; // set inner html
}