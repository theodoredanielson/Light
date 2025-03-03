// triangle class definition
class Triangle {
  constructor() {
    this.type = 'triangle'; // type of shape
    this.position = [0.0, 0.0, 0.0]; // initial position
    this.color = [1.0, 1.0, 1.0, 1.0]; // color with alpha
    this.size = 5.0; // size of the triangle
    this.rotation = 0; // rotation angle
  }

  // render the triangle
  render() {
    var xy = this.position; // get position
    var rgba = this.color; // get color
    var size = this.size; // get size
    const angle = this.rotation; // get rotation angle

    // set color and size
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.uniform1f(u_Size, size);

    var d = this.size / 200.0; // calculate dimension
    // draw triangle
    drawTriangle([xy[0], xy[1], xy[0] + d, xy[1], xy[0], xy[1] + d], xy, angle);
  }
}

// function to draw a triangle
function drawTriangle(vertices) {
  var n = 3; // number of vertices

  // rotate vertices
  const cosTheta = Math.cos(angle); // calculate cosine
  const sinTheta = Math.sin(angle); // calculate sine
  for (let i = 0; i < vertices.length; i += 2) {
    const x = vertices[i] - center[0]; // translate x
    const y = vertices[i + 1] - center[1]; // translate y

    const rotatedX = x * cosTheta - y * sinTheta; // rotate x
    const rotatedY = x * sinTheta + y * cosTheta; // rotate y

    vertices[i] = rotatedX + center[0]; // update x
    vertices[i + 1] = rotatedY + center[1]; // update y
  }

  // create buffer
  var vertexBuffer = gl.createBuffer(); // create vertex buffer
  if (!vertexBuffer) {
    console.log('failed to create the buffer object'); // log error
    return -1; // return error
  }

  // bind buffer and set data
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); // bind buffer
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW); // set buffer data
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0); // set attribute pointer
  gl.enableVertexAttribArray(a_Position); // enable attribute

  // draw triangle
  gl.drawArrays(gl.TRIANGLES, 0, n); // draw triangles

  return n; // return number of vertices
}

// global vertex buffer
var g_vertexBuffer = null;

// function to initialize triangle buffers
function initTriangleBuffers() {
  g_vertexBuffer = gl.createBuffer(); // create vertex buffer
  if (!g_vertexBuffer) {
    console.error('failed to create vertex buffer'); // log error
    return -1; // return error
  }

  // bind buffer and set data
  gl.bindBuffer(gl.ARRAY_BUFFER, g_vertexBuffer); // bind buffer
  // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW); // set buffer data

  const bufferStatus = gl.getError(); // check for errors
  if (bufferStatus !== gl.NO_ERROR) {
    console.error('webgl error after buffer operations:', bufferStatus); // log error
    return -1; // return error
  }

  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0); // set attribute pointer
  gl.enableVertexAttribArray(a_Position); // enable attribute

  const attribStatus = gl.getError(); // check for errors
  if (attribStatus !== gl.NO_ERROR) {
    console.error('webgl error after attribute setup:', attribStatus); // log error
    return -1; // return error
  }
}

// function to draw a 3d triangle
function drawTriangle3D(vertices) {
  var n = vertices.length / 3; // number of vertices

  if (g_vertexBuffer == null) {
    initTriangleBuffers(); // initialize buffers
  }

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW); // set buffer data

  // draw triangle
  gl.drawArrays(gl.TRIANGLES, 0, n); // draw triangles

  const drawStatus = gl.getError(); // check for errors
  if (drawStatus !== gl.NO_ERROR) {
    console.error('webgl error after drawing:', drawStatus); // log error
    return -1; // return error
  }

  // return n; // return number of vertices
}

// global buffers
var g_vertexBufferUV = null; // uv vertex buffer
var g_uvBuffer = null; // uv buffer
var g_normalBuffer = null; // normal buffer

// function to initialize triangle buffers for uv
function initTriangleBuffersUV() {
  // create vertex buffer if not already initialized
  if (!g_vertexBufferUV) {
    g_vertexBufferUV = gl.createBuffer(); // create vertex buffer
    if (!g_vertexBufferUV) {
      console.error("failed to create vertex buffer"); // log error
      return -1; // return error
    }
  }

  // create uv buffer if not already initialized
  if (!g_uvBuffer) {
    g_uvBuffer = gl.createBuffer(); // create uv buffer
    if (!g_uvBuffer) {
      console.error("failed to create uv buffer"); // log error
      return -1; // return error
    }
  }

  return 0; // return success
}

function initTriangleBuffersUVNormal() {
  // create vertex buffer if not already initialized
  if (!g_vertexBufferUV) {
    g_vertexBufferUV = gl.createBuffer(); // create vertex buffer
    if (!g_vertexBufferUV) {
      console.error("failed to create vertex buffer"); // log error
      return -1; // return error
    }
  }

  // create uv buffer if not already initialized
  if (!g_uvBuffer) {
    g_uvBuffer = gl.createBuffer(); // create uv buffer
    if (!g_uvBuffer) {
      console.error("failed to create uv buffer"); // log error
      return -1; // return error
    }
  }

  if (!g_normalBuffer) {
    g_normalBuffer = gl.createBuffer(); // create normal buffer
    if (!g_normalBuffer) {
      console.error("failed to create normal buffer"); // log error
      return -1; // return error
    }
  }

  return 0; // return success
}

// function to draw a 3d triangle with uv
function drawTriangle3DUV(vertices, uv) {
  var n = vertices.length / 3; // number of vertices

  // initialize buffers if not done already
  if (!g_vertexBufferUV || !g_uvBuffer) {
    initTriangleBuffersUV(); // initialize buffers
  }

  // bind vertex buffer and update data
  gl.bindBuffer(gl.ARRAY_BUFFER, g_vertexBufferUV); // bind vertex buffer
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW); // set buffer data
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0); // set attribute pointer
  gl.enableVertexAttribArray(a_Position); // enable attribute

  // bind uv buffer and update data
  gl.bindBuffer(gl.ARRAY_BUFFER, g_uvBuffer); // bind uv buffer
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW); // set buffer data
  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0); // set attribute pointer
  gl.enableVertexAttribArray(a_UV); // enable attribute

  // draw the triangle
  gl.drawArrays(gl.TRIANGLES, 0, n); // draw triangles

  // cleanup: disable attributes but do not delete buffers (reuse them)
  gl.disableVertexAttribArray(a_Position); // disable position attribute
  gl.disableVertexAttribArray(a_UV); // disable uv attribute
  gl.bindBuffer(gl.ARRAY_BUFFER, null); // unbind buffer

  return n; // return number of vertices
}

// function to draw a 3d triangle with uv and normals
function drawTriangle3DUVNormal(vertices, uv, normals) {
  var n = vertices.length / 3; // number of vertices

  // initialize buffers if not done already
  if (!g_vertexBufferUV || !g_uvBuffer || !g_normalBuffer) {
    console.log("initializing buffers");
    initTriangleBuffersUVNormal(); // initialize buffers
  }

  if (a_Position === -1 || a_UV === -1 || a_Normal === -1) {
    console.error("Attribute locations are not set correctly.");
    return -1;
  }


  // bind vertex buffer and update data
  gl.bindBuffer(gl.ARRAY_BUFFER, g_vertexBufferUV); // bind vertex buffer
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW); // set buffer data
  
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0); // set attribute pointer
  gl.enableVertexAttribArray(a_Position); // enable attribute

  // bind uv buffer and update data
  gl.bindBuffer(gl.ARRAY_BUFFER, g_uvBuffer); // bind uv buffer
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW); // set buffer data
  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0); // set attribute pointer
  gl.enableVertexAttribArray(a_UV); // enable attribute

  // bind normal buffer and update data
  gl.bindBuffer(gl.ARRAY_BUFFER, g_normalBuffer); // bind normal buffer
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.DYNAMIC_DRAW); // set buffer data
  gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0); // set attribute pointer
  gl.enableVertexAttribArray(a_Normal); // enable attribute

  // console.log("Number of vertices:", n);
  if (n % 3 !== 0) {
    console.error("Incorrect number of vertices: must be a multiple of 3.");
    return -1;
  }

  // draw the triangle
  gl.drawArrays(gl.TRIANGLES, 0, n); // draw triangles

  // cleanup: disable attributes but do not delete buffers (reuse them)
  gl.disableVertexAttribArray(a_Position); // disable position attribute
  gl.disableVertexAttribArray(a_UV); // disable uv attribute
  gl.disableVertexAttribArray(a_Normal); // disable normal attribute
  gl.bindBuffer(gl.ARRAY_BUFFER, null); // unbind buffer

  return n; // return number of vertices
}
