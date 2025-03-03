

// define global eye position
var g_eye = new Vector3([0, 0, 2]);
// define global look-at position
var g_at = new Vector3([0, 0, -100]);
// define global up vector
var g_up = new Vector3([0, 1, 0]);

var g_map = [
  ['.', '.', '.', '.', '.', '.', '.', '.',],
  ['.', '.', '.', '.', '.', '.', '.', '.',],
  ['.', '.', '.', '.', '.', '%', '.', '.',],
  ['.', '.', '.', '.', '.', '.', '.', '.',],
  ['.', '.', '.', '.', '.', '.', '.', '.',],
  ['.', '.', '.', '.', '.', '.', '.', '.',],
  ['.', '.', '.', '.', '.', '.', '.', '.',],
  ['.', '.', '.', '.', '.', '.', '.', '.',]
];

// function to render all shapes
/**
 * Renders all shapes in the scene, including lights, walls, ground, sky, and various body parts.
 * 
 * This function sets up the global rotation matrix, projection matrix, and view matrix,
 * uploads them to the shader, and then renders various objects in the scene.
 * It also handles the rendering of lights, walls based on a map, ground, sky, and a body with legs.
 * 
 * The function also calculates and updates performance information such as duration and frames per second (FPS).
 * 
 * @global {Matrix4} globalRotMat - The global rotation matrix.
 * @global {WebGLUniformLocation} u_lightOn - The uniform location for light on/off.
 * @global {WebGLUniformLocation} u_spotLightOn - The uniform location for spotlight on/off.
 * @global {WebGLUniformLocation} u_GlobalRotateMatrix - The uniform location for the global rotation matrix.
 * @global {WebGLUniformLocation} u_ProjectionMatrix - The uniform location for the projection matrix.
 * @global {WebGLUniformLocation} u_ViewMatrix - The uniform location for the view matrix.
 * @global {WebGLUniformLocation} u_spotLightPos - The uniform location for the spotlight position.
 * @global {WebGLUniformLocation} u_spotLightDir - The uniform location for the spotlight direction.
 * @global {WebGLUniformLocation} u_spotLightCutoff - The uniform location for the spotlight cutoff.
 * @global {WebGLUniformLocation} u_spotLightExp - The uniform location for the spotlight exponent.
 * @global {WebGLUniformLocation} u_lightPos - The uniform location for the light position.
 * @global {WebGLUniformLocation} u_cameraPos - The uniform location for the camera position.
 * @global {Array} g_lightPos - The position of the light.
 * @global {Array} g_spotlightPos - The position of the spotlight.
 * @global {Array} g_spotlightDir - The direction of the spotlight.
 * @global {number} g_spotlightCutoff - The cutoff angle for the spotlight.
 * @global {number} g_spotlightExp - The exponent for the spotlight.
 * @global {boolean} g_lightOn - Flag indicating if the light is on.
 * @global {boolean} g_spotLightOn - Flag indicating if the spotlight is on.
 * @global {boolean} g_normalOn - Flag indicating if normal mapping is on.
 * @global {Object} camera - The camera object containing eye, at, and up vectors.
 * @global {Array} g_map - The map array defining the height of walls.
 * @global {Object} ground - The ground object.
 * @global {Object} room - The room object.
 * @global {Object} sphere - The sphere object.
 * @global {Object} bodyCube - The body cube object.
 * @global {Object} headCube - The head cube object.
 * @global {Object} mouthCube - The mouth cube object.
 * @global {Object} antenna1 - The first antenna object.
 * @global {Object} antenna2 - The second antenna object.
 * @global {Object} upperLeg - The upper leg object.
 * @global {Object} lowerLeg - The lower leg object.
 * @global {Object} foot - The foot object.
 * @global {Object} upperLegR - The upper leg object for the right side.
 * @global {Object} lowerLegR - The lower leg object for the right side.
 * @global {Object} footR - The foot object for the right side.
 * @global {Object} kneeJoint - The knee joint matrix.
 * @global {Object} kneeJointR - The knee joint matrix for the right side.
 * @global {number} g_upperLegAngle - The angle of the upper leg.
 * @global {number} g_lowerLegAngle - The angle of the lower leg.
 * @global {number} g_ankleAngle - The angle of the ankle.
 * @global {number} g_upperLegAngle_2 - The angle of the second upper leg.
 * @global {number} g_lowerLegAngle_2 - The angle of the second lower leg.
 * @global {Object} waveVal - The wave value for animations.
 * @global {Object} g_animations - The animations object containing animation flags.
 * @global {Array} walls - The array of wall objects.
 * @global {function} updatePerformanceInfo - Function to update performance information.
 */
function renderAllShapes() {
  // start performance timer
  var startTime = performance.now();

  // set global rotation matrix to identity
  globalRotMat.setIdentity();

  gl.uniform1i(u_lightOn, g_lightOn);

  gl.uniform1i(u_spotLightOn, g_spotLightOn);

  // upload global rotation matrix to shader
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // create projection matrix
  var projMat = new Matrix4();
  projMat.setPerspective(60, canvas.width / canvas.height, 0.1, 100);
  // upload projection matrix to shader
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  // set view matrix based on camera position
  viewMatrix.setLookAt(
    camera.eye.elements[0], camera.eye.elements[1], camera.eye.elements[2],
    camera.at.elements[0], camera.at.elements[1], camera.at.elements[2],
    camera.up.elements[0], camera.up.elements[1], camera.up.elements[2]
  );

  // upload view matrix to shader
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

  // clear color and depth buffers
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.uniform3f(u_spotLightPos, g_spotlightPos[0], g_spotlightPos[1], g_spotlightPos[2]);
  gl.uniform3f(u_spotLightDir, g_spotlightDir[0], g_spotlightDir[1], g_spotlightDir[2]);
  gl.uniform1f(u_spotLightCutoff, g_spotlightCutoff);
  gl.uniform1f(u_spotLightExp, g_spotlightExp);

  gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);

  gl.uniform3f(u_cameraPos, camera.eye.elements[0], camera.eye.elements[1], camera.eye.elements[2]);

  var light = new Cube();
  light.color = [2, 2, 0, 1];
  light.textureNum = -2;
  // if (g_normalOn) {light.textureNum = -3;}
  light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  light.matrix.scale(-0.1, -0.1, -0.1);

  light.matrix.translate(-0.5, -0.5, -0.5);
  // light.normalMatrix.setInverseOf(light.matrix).transpose();
  light.render();

  var spotLight = new Cube();
  spotLight.color = [0.05, 0.05, 0.05, 1];
  spotLight.textureNum = -2;
  // if (g_normalOn) {spotLight.textureNum = -3;}
  spotLight.matrix.translate(g_spotlightPos[0], g_spotlightPos[1], g_spotlightPos[2]);
  spotLight.matrix.scale(-0.2, -0.2, -0.2);

  spotLight.matrix.translate(-0.5, -0.5, -0.5);
  spotLight.renderfaster();

  // define constants for map size and block size
  const MAP_SIZE = 8;
  const BLOCK_SIZE = 1;  // each block is 1x1x1
  const CENTER_OFFSET = Math.floor(MAP_SIZE / 2); // ensures centering

  // generate walls based on the map
  for (let x = 0; x < MAP_SIZE; x++) {
    for (let z = 0; z < MAP_SIZE; z++) {
      let room = false;
      let height = g_map[x][z]; // get height from the map
      w.color = [79 / 255, 107 / 255, 49 / 255, 1.0];
      if (typeof height === 'number') {
        height = height;
        w.textureNum = 0; // set texture number for solid blocks
        if (g_normalOn) { w.textureNum = -3; }
      } else if (height == '.') {
        height = 0; // set height to 0 for empty spaces
      } else if (height == '%') {
        height = 1; // set height for special blocks
        w.textureNum = 2; // set texture number for special blocks
        if (g_normalOn) { w.textureNum = -3; }
      } else if (height == '8') {
        room = true;
        height = 1; // set height for wall blocks
        w.textureNum = -3; // set texture number for wall blocks
        if (g_normalOn) { w.textureNum = -3; }
      }

      if (g_normalOn) { w.textureNum = -3; }

      // stack cubes to create walls
      for (let y = 0; y < height; y++) {
        w.matrix.setTranslate(
          (x - CENTER_OFFSET) * BLOCK_SIZE, // center the map
          y * BLOCK_SIZE + .75,// - 0.75, // align with the ground
          (z - CENTER_OFFSET) * BLOCK_SIZE
        );
        w.matrix.scale(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        w.renderfaster(); // render the wall
        walls.push(w); // add wall to the walls array
      }
    }
  }

  // render ground and sky
  ground.textureNum = 3;
  if (g_normalOn) { ground.textureNum = -3; }
  ground.matrix.translate(0, .5, 0);
  ground.renderfaster();

  room.textureNum = -4;
  if (g_normalOn) { room.textureNum = -3; }
  room.renderfaster();


  // sphere.textureNum = -3;
  sphere.matrix.setIdentity();
  sphere.textureNum = 4;
  if (g_normalOn) { sphere.textureNum = -3; }
  sphere.matrix.translate(2, 1.5, 1.5);
  sphere.matrix.scale(0.75, 0.75, 0.75);
  sphere.render();

  // render body
  bodyCube.matrix.setIdentity();
  bodyCube.matrix.translate(-0.25, -0.65, 0.0)
    .rotate(5, 1, 0, 0)
    .scale(0.5, 0.3, 0.5);
  bodyCube.color = [0.25, 0.15, 0.1, 1.0];
  bodyCube.textureNum = -2;
  if (g_normalOn) { bodyCube.textureNum = -3; }
  bodyCube.renderfaster();

  // render head
  headCube.matrix.setIdentity();
  headCube.matrix.translate(-0.2, -0.625, -0.18)
    .rotate(0, 1, 0, 0)
    .scale(0.4, 0.2, 0.2);
  headCube.color = [0.4, 0.266666, 0.13333, 1.0];
  headCube.textureNum = -2;
  if (g_normalOn) { headCube.textureNum = -3; }
  headCube.renderfaster();

  // render mouth
  mouthCube.matrix.setIdentity();
  mouthCube.matrix.translate(-.1, -0.6, -.2)
    .rotate(0, 1, 0, 0)
    .scale(0.2, 0.02, 0.1);
  mouthCube.color = [0, 0, 0, 1.0];
  mouthCube.textureNum = -2;
  if (g_normalOn) { mouthCube.textureNum = -3; }
  mouthCube.renderfaster();

  // render antenna 1
  antenna1.matrix.setIdentity();
  antenna1.matrix.translate(-0.1, -0.43, -0.1) // position antenna 1
  if (g_animations.legSwing) {
    antenna1.matrix.rotate(waveVal, 0, 0, 1); // apply rotation if leg is swinging
  }
  antenna1.matrix.scale(0.02, 0.45, 0.02);
  antenna1.color = [0.25, 0.18, 0.0, 1.0];
  antenna1.textureNum = -2;
  if (g_normalOn) { antenna1.textureNum = -3; }
  antenna1.renderfaster();

  // render antenna 2
  antenna2.matrix.setIdentity();
  antenna2.matrix.translate(0.1, -0.43, -0.1) // position antenna 2
  if (g_animations.legSwing) {
    antenna2.matrix.rotate(-waveVal, 0, 0, 1); // apply rotation if leg is swinging
  }
  antenna2.matrix.scale(0.02, 0.45, 0.02);
  antenna2.color = [0.25, 0.18, 0.0, 1.0];
  antenna2.textureNum = -2;
  if (g_normalOn) { antenna2.textureNum = -3; }
  // antenna1.normalMatrix.setInverseOf(.matrix).transpose();
  antenna2.renderfaster();

  // render eyes using sphere objects
  var leftEye = new Sphere();
  leftEye.matrix.setIdentity();
  leftEye.matrix.translate(-0.08, -0.5, -0.17)
    .scale(0.04, 0.04, 0.04);
  leftEye.color = [0.09, 0.09, 0.09, 1.0];
  leftEye.textureNum = -2;
  if (g_normalOn) { leftEye.textureNum = -3; }
  leftEye.render();

  var rightEye = new Sphere();
  rightEye.matrix.setIdentity();
  rightEye.matrix.translate(0.08, -0.5, -0.17)
    .scale(0.04, 0.04, 0.04);
  rightEye.color = [0.09, 0.09, 0.09, 1.0];
  rightEye.textureNum = -2;
  if (g_normalOn) { rightEye.textureNum = -3; }
  rightEye.render();

  // define leg dimensions
  const UL = 0.3; // upper leg length
  const LL = 0.3; // lower leg length
  const FL = 0.2; // foot length
  const legWidth = 0.05; // leg width

  // render left front leg
  upperLeg.matrix.setIdentity();
  upperLeg.matrix.setTranslate(-0.2, -0.59, 0.05)
    .rotate(-g_upperLegAngle, 0, 0, 1);
  kneeJoint.set(upperLeg.matrix);
  upperLeg.matrix.scale(legWidth, UL, legWidth);
  upperLeg.color = [0.3, 0.2, 0.13, 1.0];
  upperLeg.textureNum = -2;
  if (g_normalOn) { upperLeg.textureNum = -3; }
  upperLeg.normalMatrix.setInverseOf(upperLeg.matrix).transpose();
  upperLeg.renderfaster();

  lowerLeg.matrix.setIdentity();
  lowerLeg.matrix.set(kneeJoint);
  lowerLeg.matrix.translate(0, UL, 0.001)
    .rotate(-g_lowerLegAngle, 0, 0, 1)
    .scale(legWidth, LL, legWidth);
  lowerLeg.color = [0.4, 0.266666, 0.13333, 1.0];
  lowerLeg.textureNum = -2;
  if (g_normalOn) { lowerLeg.textureNum = -3; }
  lowerLeg.normalMatrix.setInverseOf(lowerLeg.matrix).transpose();
  lowerLeg.renderfaster();

  foot.matrix.setIdentity();
  foot.matrix.set(kneeJoint);
  foot.matrix.translate(0, UL, 0.001)
    .rotate(-g_lowerLegAngle, 0, 0, 1)
    .translate(0, LL, 0)
    .rotate(g_lowerLegAngle + g_ankleAngle, 0, 0, 1)
    .scale(legWidth, FL, legWidth);
  foot.color = [0.3, 0.2, 0.13, 1.0];
  foot.textureNum = -2;
  if (g_normalOn) { foot.textureNum = -3; }
  foot.normalMatrix.setInverseOf(foot.matrix).transpose();
  foot.renderfaster();

  // render left middle leg
  upperLeg.matrix.setIdentity();
  upperLeg.matrix.setTranslate(-0.2, -0.59, 0.17333) // position left middle upper leg
    .rotate(-g_upperLegAngle_2, 0, 0, 1); // rotate left middle upper leg
  kneeJoint.set(upperLeg.matrix); // set knee joint position
  upperLeg.matrix.scale(legWidth, UL, legWidth); // scale left middle upper leg
  upperLeg.color = [0.3, 0.2, 0.13, 1.0]; // set left middle upper leg color
  upperLeg.textureNum = -2; // set texture number for left middle upper leg
  if (g_normalOn) { upperLeg.textureNum = -3; }
  upperLeg.renderfaster(); // render left middle upper leg

  lowerLeg.matrix.setIdentity();
  lowerLeg.matrix.set(kneeJoint); // set lower leg position based on knee joint
  lowerLeg.matrix.translate(0, UL, 0.001) // position lower leg
    .rotate(-g_lowerLegAngle_2, 0, 0, 1) // rotate lower leg
    .scale(legWidth, LL, legWidth); // scale lower leg
  lowerLeg.color = [0.4, 0.266666, 0.13333, 1.0]; // set lower leg color
  lowerLeg.textureNum = -2; // set texture number for lower leg
  if (g_normalOn) { lowerLeg.textureNum = -3; }
  lowerLeg.renderfaster(); // render lower leg

  foot.matrix.setIdentity();
  foot.matrix.set(kneeJoint); // set foot position based on knee joint
  foot.matrix.translate(0, UL, 0.001) // position foot
    .rotate(-g_lowerLegAngle_2, 0, 0, 1) // rotate foot
    .translate(0, LL, 0) // translate foot
    .rotate(g_lowerLegAngle_2 + g_ankleAngle, 0, 0, 1) // rotate foot based on angles
    .scale(legWidth, FL, legWidth); // scale foot
  foot.color = [0.3, 0.2, 0.13, 1.0]; // set foot color
  foot.textureNum = -2; // set texture number for foot
  if (g_normalOn) { foot.textureNum = -3; }
  foot.renderfaster(); // render foot

  // render left back leg
  upperLeg.matrix.setIdentity();
  upperLeg.matrix.setTranslate(-0.2, -0.59, 0.2966666) // position left back upper leg
    .rotate(-g_upperLegAngle, 0, 0, 1); // rotate left back upper leg
  kneeJoint.set(upperLeg.matrix); // set knee joint position
  upperLeg.matrix.scale(legWidth, UL, legWidth); // scale left back upper leg
  upperLeg.color = [0.3, 0.2, 0.13, 1.0]; // set left back upper leg color
  upperLeg.textureNum = -2; // set texture number for left back upper leg
  if (g_normalOn) { upperLeg.textureNum = -3; }
  upperLeg.renderfaster(); // render left back upper leg

  lowerLeg.matrix.setIdentity();
  lowerLeg.matrix.set(kneeJoint); // set lower leg position based on knee joint
  lowerLeg.matrix.translate(0, UL, 0.001) // position lower leg
    .rotate(-g_lowerLegAngle, 0, 0, 1) // rotate lower leg
    .scale(legWidth, LL, legWidth); // scale lower leg
  lowerLeg.color = [0.4, 0.266666, 0.13333, 1.0]; // set lower leg color
  lowerLeg.textureNum = -2; // set texture number for lower leg
  if (g_normalOn) { lowerLeg.textureNum = -3; }
  lowerLeg.renderfaster(); // render lower leg

  foot.matrix.setIdentity();
  foot.matrix.set(kneeJoint); // set foot position based on knee joint
  foot.matrix.translate(0, UL, 0.001) // position foot
    .rotate(-g_lowerLegAngle, 0, 0, 1) // rotate foot
    .translate(0, LL, 0) // translate foot
    .rotate(g_lowerLegAngle + g_ankleAngle, 0, 0, 1) // rotate foot based on angles
    .scale(legWidth, FL, legWidth); // scale foot
  foot.color = [0.3, 0.2, 0.13, 1.0]; // set foot color
  foot.textureNum = -2; // set texture number for foot
  if (g_normalOn) { foot.textureNum = -3; }
  foot.renderfaster(); // render foot

  // render left backmost leg
  upperLeg.matrix.setIdentity();
  // upperLeg.matrix.scale(-1, -1, 1);
  // upperLeg.matrix.rotate(-90, 0, 0, 1);
  upperLeg.matrix.translate(-0.2, -0.59, 0.42) // position left backmost upper leg
    .rotate(-g_upperLegAngle_2, 0, 0, 1); // rotate left backmost upper leg
  kneeJoint.set(upperLeg.matrix); // set knee joint position
  upperLeg.matrix.scale(legWidth, UL, legWidth); // scale left backmost upper leg
  upperLeg.color = [0.3, 0.2, 0.13, 1.0]; // set left backmost upper leg color
  upperLeg.textureNum = -2; // set texture number for left backmost upper leg
  if (g_normalOn) { upperLeg.textureNum = -3; }
  upperLeg.renderfaster(); // render left backmost upper leg

  lowerLeg.matrix.setIdentity();
  // lowerLeg.matrix.rotate(180, 180, 0, 1); // rotate lower leg
  // lowerLeg.matrix.scale(-1, 1,-1);
  lowerLeg.matrix.set(kneeJoint); // set lower leg position based on knee joint
  lowerLeg.matrix.translate(0, UL, 0.001) // position lower leg
    .rotate(-g_lowerLegAngle_2, 0, 0, 1) // rotate lower leg
    .scale(legWidth, LL, legWidth); // scale lower leg
  lowerLeg.color = [0.4, 0.266666, 0.13333, 1.0]; // set lower leg color
  lowerLeg.textureNum = -2; // set texture number for lower leg
  if (g_normalOn) { lowerLeg.textureNum = -3; }
  lowerLeg.renderfaster(); // render lower leg

  foot.matrix.setIdentity();
  foot.matrix.set(kneeJoint); // set foot position based on knee joint
  foot.matrix.translate(0, UL, 0.001) // position foot
    .rotate(-g_lowerLegAngle_2, 0, 0, 1) // rotate foot
    .translate(0, LL, 0) // translate foot
    .rotate(g_lowerLegAngle_2 + g_ankleAngle, 0, 0, 1) // rotate foot based on angles
    .scale(legWidth, FL, legWidth); // scale foot
  foot.color = [0.3, 0.2, 0.13, 1.0]; // set foot color
  foot.textureNum = -2; // set texture number for foot
  if (g_normalOn) { foot.textureNum = -3; }
  foot.renderfaster(); // render foot

  // render right front leg
  upperLegR.matrix.setIdentity();
  upperLegR.matrix.setTranslate(0.2, -0.55, 0.05) // position right front upper leg
    .rotate(g_upperLegAngle, 0, 0, 1); // rotate right front upper leg
  kneeJointR.set(upperLegR.matrix); // set knee joint position
  upperLegR.matrix.scale(legWidth, UL, legWidth); // scale right front upper leg
  upperLegR.color = [0.3, 0.2, 0.13, 1.0]; // set right front upper leg color
  upperLegR.textureNum = -2; // set texture number for right front upper leg
  if (g_normalOn) { upperLegR.textureNum = -3; }
  upperLegR.normalMatrix.setInverseOf(upperLegR.matrix).transpose();
  upperLegR.renderfaster(); // render right front upper leg

  lowerLegR.matrix.setIdentity();
  lowerLegR.matrix.set(kneeJointR); // set lower leg position based on knee joint
  lowerLegR.matrix.translate(0, UL, 0) // position lower leg
    .rotate(g_lowerLegAngle, 0, 0, 1) // rotate lower leg
    .scale(legWidth, LL, legWidth); // scale lower leg
  lowerLegR.color = [0.4, 0.266666, 0.13333, 1.0]; // set lower leg color
  lowerLegR.textureNum = -2; // set texture number for lower leg
  if (g_normalOn) { lowerLegR.textureNum = -3; }
  lowerLegR.normalMatrix.setInverseOf(lowerLegR.matrix).transpose();
  lowerLegR.renderfaster(); // render lower leg

  footR.matrix.setIdentity();
  footR.matrix.set(kneeJointR); // set foot position based on knee joint
  footR.matrix.translate(0, UL, 0) // position foot
    .rotate(g_lowerLegAngle, 0, 0, 1) // rotate foot
    .translate(0, LL, 0) // translate foot
    .rotate(-g_lowerLegAngle - g_ankleAngle, 0, 0, 1) // rotate foot based on angles
    .scale(legWidth, FL, legWidth); // scale foot
  footR.color = [0.3, 0.2, 0.13, 1.0]; // set foot color
  footR.textureNum = -2; // set texture number for foot
  if (g_normalOn) { footR.textureNum = -3; }
  footR.normalMatrix.setInverseOf(footR.matrix).transpose();
  footR.renderfaster(); // render foot

  // render right middle leg
  upperLegR.matrix.setIdentity();
  upperLegR.matrix.setTranslate(0.2, -0.55, 0.17333) // position right middle upper leg
    .rotate(g_upperLegAngle_2, 0, 0, 1); // rotate right middle upper leg
  kneeJointR.set(upperLegR.matrix); // set knee joint position
  upperLegR.matrix.scale(legWidth, UL, legWidth); // scale right middle upper leg
  upperLegR.color = [0.3, 0.2, 0.13, 1.0]; // set right middle upper leg color
  upperLegR.textureNum = -2; // set texture number for right middle upper leg
  if (g_normalOn) { upperLegR.textureNum = -3; }
  upperLegR.renderfaster(); // render right middle upper leg

  lowerLegR.matrix.setIdentity();
  lowerLegR.matrix.set(kneeJointR); // set lower leg position based on knee joint
  lowerLegR.matrix.translate(0, UL, 0) // position lower leg
    .rotate(g_lowerLegAngle_2, 0, 0, 1) // rotate lower leg
    .scale(legWidth, LL, legWidth); // scale lower leg
  lowerLegR.color = [0.4, 0.266666, 0.13333, 1.0]; // set lower leg color
  lowerLegR.textureNum = -2; // set texture number for lower leg
  if (g_normalOn) { lowerLegR.textureNum = -3; }
  lowerLegR.renderfaster(); // render lower leg

  footR.matrix.setIdentity();
  footR.matrix.set(kneeJointR); // set foot position based on knee joint
  footR.matrix.translate(0, UL, 0) // position foot
    .rotate(g_lowerLegAngle_2, 0, 0, 1) // rotate foot
    .translate(0, LL, 0) // translate foot
    .rotate(-g_lowerLegAngle_2 - g_ankleAngle, 0, 0, 1) // rotate foot based on angles
    .scale(legWidth, FL, legWidth); // scale foot
  footR.color = [0.3, 0.2, 0.13, 1.0]; // set foot color
  footR.textureNum = -2; // set texture number for foot
  if (g_normalOn) { footR.textureNum = -3; }
  footR.renderfaster(); // render foot

  // render right back leg
  upperLegR.matrix.setIdentity();
  upperLegR.matrix.setTranslate(0.2, -0.55, 0.2966666) // position right back upper leg
    .rotate(g_upperLegAngle, 0, 0, 1); // rotate right back upper leg
  kneeJointR.set(upperLegR.matrix); // set knee joint position
  upperLegR.matrix.scale(legWidth, UL, legWidth); // scale right back upper leg
  upperLegR.color = [0.3, 0.2, 0.13, 1.0]; // set right back upper leg color
  upperLegR.textureNum = -2; // set texture number for right back upper leg
  if (g_normalOn) { upperLegR.textureNum = -3; }
  upperLegR.renderfaster(); // render right back upper leg

  lowerLegR.matrix.setIdentity();
  lowerLegR.matrix.set(kneeJointR); // set lower leg position based on knee joint
  lowerLegR.matrix.translate(0, UL, 0) // position lower leg
    .rotate(g_lowerLegAngle, 0, 0, 1) // rotate lower leg
    .scale(legWidth, LL, legWidth); // scale lower leg
  lowerLegR.color = [0.4, 0.266666, 0.13333, 1.0]; // set lower leg color
  lowerLegR.textureNum = -2; // set texture number for lower leg
  if (g_normalOn) { lowerLegR.textureNum = -3; }
  lowerLegR.renderfaster(); // render lower leg

  footR.matrix.setIdentity();
  footR.matrix.set(kneeJointR); // set foot position based on knee joint
  footR.matrix.translate(0, UL, 0) // position foot
    .rotate(g_lowerLegAngle, 0, 0, 1) // rotate foot
    .translate(0, LL, 0) // translate foot
    .rotate(-g_lowerLegAngle - g_ankleAngle, 0, 0, 1) // rotate foot based on angles
    .scale(legWidth, FL, legWidth); // scale foot
  footR.color = [0.3, 0.2, 0.13, 1.0]; // set foot color
  footR.textureNum = -2; // set texture number for foot
  if (g_normalOn) { footR.textureNum = -3; }
  footR.renderfaster(); // render foot

  // render right backmost leg
  upperLegR.matrix.setIdentity();
  upperLegR.matrix.setTranslate(0.2, -0.55, 0.42) // position right backmost upper leg
    .rotate(g_upperLegAngle_2, 0, 0, 1); // rotate right backmost upper leg
  kneeJointR.set(upperLegR.matrix); // set knee joint position
  upperLegR.matrix.scale(legWidth, UL, legWidth); // scale right backmost upper leg
  upperLegR.color = [0.3, 0.2, 0.13, 1.0]; // set right backmost upper leg color
  upperLegR.textureNum = -2; // set texture number for right backmost upper leg
  if (g_normalOn) { upperLegR.textureNum = -3; }
  upperLegR.renderfaster(); // render right backmost upper leg

  lowerLegR.matrix.setIdentity();
  lowerLegR.matrix.set(kneeJointR); // set lower leg position based on knee joint
  lowerLegR.matrix.translate(0, UL, 0) // position lower leg
    .rotate(g_lowerLegAngle_2, 0, 0, 1) // rotate lower leg
    .scale(legWidth, LL, legWidth); // scale lower leg
  lowerLegR.color = [0.4, 0.266666, 0.13333, 1.0]; // set lower leg color
  lowerLegR.textureNum = -2; // set texture number for lower leg
  if (g_normalOn) { lowerLegR.textureNum = -3; }
  lowerLegR.renderfaster(); // render lower leg

  footR.matrix.setIdentity();
  footR.matrix.set(kneeJointR); // set foot position based on knee joint
  footR.matrix.translate(0, UL, 0) // position foot
    .rotate(g_lowerLegAngle_2, 0, 0, 1) // rotate foot
    .translate(0, LL, 0) // translate foot
    .rotate(-g_lowerLegAngle_2 - g_ankleAngle, 0, 0, 1) // rotate foot based on angles
    .scale(legWidth, FL, legWidth); // scale foot
  footR.color = [0.3, 0.2, 0.13, 1.0]; // set foot color
  footR.textureNum = -2; // set texture number for foot
  if (g_normalOn) { footR.textureNum = -3; }
  footR.renderfaster(); // render foot
  // calculate performance
  var endTime = performance.now();
  var duration = endTime - startTime; // calculate duration
  var fps = 1000 / duration; // calculate frames per second
  updatePerformanceInfo(duration, fps); // update performance info
}
