class Cube {
    constructor() {
        this.type = 'cube';
        this.matrix = new Matrix4();
        this.color = [1.0, 1.0, 1.0, 1.0];
        // this.buffer = null;
        this.normalMatrix = new Matrix4();
        this.textureNum = -0;
        this.vertices = new Float32Array([
            0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0,
        ]);
        this.verts = [
            // Front face
            0, 0, 0, 1, 1, 0, 1, 0, 0,
            0, 0, 0, 0, 1, 0, 1, 1, 0,

            // Top face
            0, 1, 0, 0, 1, 1, 1, 1, 1,
            0, 1, 0, 1, 1, 1, 1, 1, 0,

            // Right face
            1, 0, 0, 1, 1, 1, 1, 1, 0,
            1, 0, 0, 1, 1, 1, 1, 0, 1,

            // Left face
            0, 0, 0, 0, 1, 1, 0, 1, 0,
            0, 0, 0, 0, 1, 1, 0, 0, 1,

            // Bottom face
            0, 0, 0, 0, 0, 1, 1, 0, 1,
            0, 0, 0, 1, 0, 1, 1, 0, 0,

            // Back face
            0, 0, 1, 1, 1, 1, 1, 0, 1,
            0, 0, 1, 0, 1, 1, 1, 1, 1
        ];

        this.uvs = [
            // Front face
            0, 0, 1, 1, 1, 0,
            0, 0, 0, 1, 1, 1,

            // Top face
            0, 0, 0, 1, 1, 1,
            0, 0, 1, 1, 1, 0,

            // Right face
            0, 0, 1, 1, 1, 0,
            0, 0, 1, 1, 1, 0,

            // Left face
            0, 0, 1, 1, 1, 0,
            0, 0, 1, 1, 1, 0,

            // Bottom face
            0, 0, 0, 1, 1, 1,
            0, 0, 1, 1, 1, 0,

            // Back face
            0, 0, 1, 1, 1, 0,
            0, 0, 0, 1, 1, 1
        ];

                this.normal = [
                    // Front face
                    0, 0, -1, 0, 0, -1, 0, 0, -1,
                    0, 0, -1, 0, 0, -1, 0, 0, -1,

                    // Top face
                    0, 1, 0, 0, 1, 0, 0, 1, 0,
                    0, 1, 0, 0, 1, 0, 0, 1, 0,

                    // Right face
                    1, 0, 0, 1, 0, 0, 1, 0, 0,
                    1, 0, 0, 1, 0, 0, 1, 0, 0,

                    // Left face
                    -1, 0, 0, -1, 0, 0, -1, 0, 0,
                    -1, 0, 0, -1, 0, 0, -1, 0, 0,

                    // Bottom face
                    0, -1, 0, 0, -1, 0, 0, -1, 0,
                    0, -1, 0, 0, -1, 0, 0, -1, 0,

                    // Back face
                    0, 0, 1, 0, 0, 1, 0, 0, 1,
                    0, 0, 1, 0, 0, 1, 0, 0, 1
                ]
            }
    initBuffer() {
        if (this.buffer === null) {
            this.buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
        }
    }

    render() {
        gl.uniform1i(u_whichTexture, this.textureNum);
        gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // front face
        drawTriangle3DUV([0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0], [0, 0, 1, 1, 1, 0]);
        drawTriangle3DUV([0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0], [0, 0, 0, 1, 1, 1]);

        gl.uniform4f(u_FragColor, this.color[0] * .9, this.color[1] * .9, this.color[2] * .9, this.color[3]);

        // back face
        drawTriangle3DUV([0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0], [0, 0, 1, 0, 1, 1]);
        drawTriangle3DUV([0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0], [0, 0, 1, 1, 0, 1]);

        // left face
        drawTriangle3DUV([0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0], [0, 0, 1, 0, 1, 1]);
        drawTriangle3DUV([0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0], [0, 0, 1, 1, 0, 1]);

        // right face
        drawTriangle3DUV([1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0], [0, 0, 1, 0, 1, 1]);
        drawTriangle3DUV([1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0], [0, 0, 1, 1, 0, 1]);

        // top face
        drawTriangle3DUV([0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0], [0, 0, 1, 0, 1, 1]);
        drawTriangle3DUV([0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0], [0, 0, 1, 1, 0, 1]);

        // bottom face
        drawTriangle3DUV([0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0], [0, 0, 1, 0, 1, 1]);
        drawTriangle3DUV([0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0], [0, 0, 1, 1, 0, 1]);
    }

    renderfast() {
        var rgba = this.color;

        gl.uniform1i(u_whichTexture, this.textureNum);
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        var allverts = [];
        var allUVs = [];  // Add UV array

        // Front face
        allverts = allverts.concat([0, 0, 0, 1, 1, 0, 1, 0, 0]);
        allUVs = allUVs.concat([0, 0, 1, 1, 1, 0]);
        allverts = allverts.concat([0, 0, 0, 0, 1, 0, 1, 1, 0]);
        allUVs = allUVs.concat([0, 0, 0, 1, 1, 1]);

        // Top face
        allverts = allverts.concat([0, 1, 0, 0, 1, 1, 1, 1, 1]);
        allUVs = allUVs.concat([0, 0, 0, 1, 1, 1]);
        allverts = allverts.concat([0, 1, 0, 1, 1, 1, 1, 1, 0]);
        allUVs = allUVs.concat([0, 0, 1, 1, 1, 0]);

        // Right face
        allverts = allverts.concat([1, 0, 0, 1, 1, 1, 1, 1, 0]);
        allUVs = allUVs.concat([0, 0, 1, 1, 1, 0]);
        allverts = allverts.concat([1, 0, 0, 1, 1, 1, 1, 0, 1]);
        allUVs = allUVs.concat([0, 0, 1, 1, 1, 0]);

        // Left face
        allverts = allverts.concat([0, 0, 0, 0, 1, 1, 0, 1, 0]);
        allUVs = allUVs.concat([0, 0, 1, 1, 1, 0]);
        allverts = allverts.concat([0, 0, 0, 0, 1, 1, 0, 0, 1]);
        allUVs = allUVs.concat([0, 0, 1, 1, 1, 0]);

        // Bottom face
        allverts = allverts.concat([0, 0, 0, 0, 0, 1, 1, 0, 1]);
        allUVs = allUVs.concat([0, 0, 0, 1, 1, 1]);
        allverts = allverts.concat([0, 0, 0, 1, 0, 1, 1, 0, 0]);
        allUVs = allUVs.concat([0, 0, 1, 1, 1, 0]);

        // Back face
        allverts = allverts.concat([0, 0, 1, 1, 1, 1, 1, 0, 1]);
        allUVs = allUVs.concat([0, 0, 1, 1, 1, 0]);
        allverts = allverts.concat([0, 0, 1, 0, 1, 1, 1, 1, 1]);
        allUVs = allUVs.concat([0, 0, 0, 1, 1, 1]);

        drawTriangle3DUV(allverts, allUVs);
    }

    renderfaster() {
        var rgba = this.color;

        gl.uniform1i(u_whichTexture, this.textureNum);
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);

        // drawTriangle3DUV(this.verts, this.uvs);
        drawTriangle3DUVNormal(this.verts, this.uvs, this.normal);
    }
}


function drawCube(M, color) {

    let textureNum = -2;

    gl.uniform1i(u_whichTexture, this.textureNum);
    gl.uniform4f(u_FragColor, color[0], color[1], color[2], color[3]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, M.elements);

    // front face
    drawTriangle3DUV([0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0], [0, 0, 1, 1, 1, 0]);
    drawTriangle3DUV([0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0], [0, 0, 0, 1, 1, 1]);

    gl.uniform4f(u_FragColor, color[0] * .9, color[1] * .9, color[2] * .9, color[3]);

    // back face
    drawTriangle3DUV([0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0], [0, 0, 1, 0, 1, 1]);
    drawTriangle3DUV([0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0], [0, 0, 1, 1, 0, 1]);

    // left face
    drawTriangle3DUV([0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0], [0, 0, 1, 0, 1, 1]);
    drawTriangle3DUV([0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0], [0, 0, 1, 1, 0, 1]);

    // right face
    drawTriangle3DUV([1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0], [0, 0, 1, 0, 1, 1]);
    drawTriangle3DUV([1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0], [0, 0, 1, 1, 0, 1]);

    // top face
    drawTriangle3DUV([0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0], [0, 0, 1, 0, 1, 1]);
    drawTriangle3DUV([0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0], [0, 0, 1, 1, 0, 1]);

    // bottom face
    drawTriangle3DUV([0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0], [0, 0, 1, 0, 1, 1]);
    drawTriangle3DUV([0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0], [0, 0, 1, 1, 0, 1]);
}  
