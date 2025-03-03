const COLLISION_RADIUS = 0.2; // the radius used for collision detection
const GROUND_HEIGHT = -0.75; // the floor level
let gameOver = false; // indicates if the game is over; initially false, set to true when the player "cheats"
const sensitivity = 0.002; // sensitivity for smoother or faster camera movement

class Camera {
    constructor() {
        // initialize basic attributes
        this.fov = 60; // field of view
        this.eye = new Vector3([0, 0, -3.9]); // camera position
        this.at = new Vector3([0, 0, 10]); // point the camera is looking at
        this.up = new Vector3([0, 1, 0]); // up direction for the camera
        this.yaw = 0; // horizontal rotation
        this.pitch = 0; // vertical tilt, clamped between -89 and 89 degrees

        this.alwaysUp = new Vector3([0, 1, 0]); // constant up direction

        // set the view matrix
        viewMatrix.setLookAt(
            this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
            this.at.elements[0], this.at.elements[1], this.at.elements[2],
            this.up.elements[0], this.up.elements[1], this.up.elements[2]
        );
    }

    updateViewMatrix() {
        // update the view matrix based on current camera position and orientation
        viewMatrix.setLookAt(
            this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
            this.at.elements[0], this.at.elements[1], this.at.elements[2],
            this.up.elements[0], this.up.elements[1], this.up.elements[2]
        );
    }

    checkCollision(x, z, r) {
        const GROUND_HEIGHT = 0; // the lowest allowed y-value for the camera
        let hitGround = false; // flag to indicate if the camera is below ground
        let hitWall = false; // flag to indicate if the camera has hit a wall

        // check if the camera's Y value is below the ground
        if (this.eye.elements[1] < GROUND_HEIGHT) {
            hitGround = true; // camera is below ground
        }

        // check for wall collisions in the x/z plane
        let centerTileX = Math.floor(x + 4); // center tile in x direction
        let centerTileZ = Math.floor(z + 4); // center tile in z direction

        for (let tileX = centerTileX - 1; tileX <= centerTileX + 1; tileX++) {
            for (let tileZ = centerTileZ - 1; tileZ <= centerTileZ + 1; tileZ++) {
                // skip tiles that are out of bounds
                if (tileX < 0 || tileX >= 8 || tileZ < 0 || tileZ >= 8) continue;

                let height = g_map[tileX][tileZ]; // get the height of the tile
                if (height == '.') {
                    height = 0; // empty tile
                } else if (height == '%') {
                    height = 2; // wall tile
                } else if (height == '8') {
                    height = 3; // another type of wall tile
                }

                // check if the tile has height
                if (height > 0) {
                    let boxMinX = tileX - 4; // minimum x boundary of the tile
                    let boxMinZ = tileZ - 4; // minimum z boundary of the tile
                    let boxMaxX = boxMinX + 1; // maximum x boundary of the tile
                    let boxMaxZ = boxMinZ + 1; // maximum z boundary of the tile

                    // find the closest point on the tile to the camera
                    let closestX = this.clamp(x, boxMinX, boxMaxX);
                    let closestZ = this.clamp(z, boxMinZ, boxMaxZ);

                    let distX = x - closestX; // distance in x direction
                    let distZ = z - closestZ; // distance in z direction
                    let distSq = distX * distX + distZ * distZ; // squared distance
                    let radiusSq = r * r; // squared radius

                    // check for collision
                    if (distSq < radiusSq) {
                        hitWall = true; // camera has hit a wall
                    }
                }
            }
        }

        // 

        return { hitWall, hitGround }; // return collision results
    }

    // helper function to clamp values between min and max
    clamp(value, minVal, maxVal) {
        return Math.max(minVal, Math.min(maxVal, value)); // return clamped value
    }

    forward(speed = 0.2) {
        const GROUND_HEIGHT = 0; // ground height for collision
        const COLLISION_RADIUS = 0.2; // collision radius for movement

        // save current position
        let oldEye = new Vector3(this.eye.elements);
        let oldAt = new Vector3(this.at.elements);

        // compute forward direction (from eye to at)
        let direction = new Vector3();
        direction.set(this.at);
        direction.sub(this.eye);
        direction.normalize(); // normalize the direction
        direction.mul(speed); // scale by speed

        // compute candidate new positions
        let tempEye = new Vector3(oldEye.elements);
        let tempAt = new Vector3(oldAt.elements);

        tempEye.add(direction); // move eye position
        tempAt.add(direction); // move at position

        // get collision results
        let { hitWall, hitGround } = this.checkCollision(tempEye.elements[0], tempEye.elements[2], COLLISION_RADIUS);

        // if the camera collides with the ground, only adjust `eye.y`, not `at.y`
        if (hitGround) {
            tempEye.elements[1] = GROUND_HEIGHT; // keep the camera at ground level
            tempAt.elements[1] = .9 * oldAt.elements[1]; // adjust at position slightly
        }

        // if there's no wall collision, apply full movement
        if (!hitWall) {
            this.eye.set(tempEye); // update eye position
            this.at.set(tempAt); // update at position
        } else {
            // handle sliding when hitting a wall

            // try moving only along X (keeping Y and Z unchanged)
            let xOnlyEye = new Vector3(oldEye.elements);
            let xOnlyAt = new Vector3(oldAt.elements);
            xOnlyEye.elements[0] += direction.elements[0]; // move in x direction
            xOnlyAt.elements[0] += direction.elements[0]; // move at in x direction
            let xCollision = this.checkCollision(xOnlyEye.elements[0], xOnlyEye.elements[2], COLLISION_RADIUS).hitWall; // check for collision

            // try moving only along Z (keeping Y and X unchanged)
            let zOnlyEye = new Vector3(oldEye.elements);
            let zOnlyAt = new Vector3(oldAt.elements);
            zOnlyEye.elements[2] += direction.elements[2]; // move in z direction
            zOnlyAt.elements[2] += direction.elements[2]; // move at in z direction
            let zCollision = this.checkCollision(zOnlyEye.elements[0], zOnlyEye.elements[2], COLLISION_RADIUS).hitWall; // check for collision

            // decide movement based on collisions
            if (!xCollision && zCollision) {
                this.eye.set(xOnlyEye); // move along x if no collision
                this.at.set(xOnlyAt); // update at position
            } else if (xCollision && !zCollision) {
                this.eye.set(zOnlyEye); // move along z if no collision
                this.at.set(zOnlyAt); // update at position
            }
        }


        // finally, update the view matrix
        this.updateViewMatrix();
    }

    // move backwards
    back(speed = 0.2) {
        const GROUND_HEIGHT = 0; // ground height for collision
        const COLLISION_RADIUS = 0.2; // collision radius for movement

        // save current position
        let oldEye = new Vector3(this.eye.elements);
        let oldAt = new Vector3(this.at.elements);

        // compute backward direction = (eye - at)
        let direction = new Vector3();
        direction.set(this.eye);
        direction.sub(this.at); // calculate direction
        direction.normalize(); // normalize the direction
        direction.mul(speed); // scale by speed

        // compute candidate new positions
        let tempEye = new Vector3(oldEye.elements);
        let tempAt = new Vector3(oldAt.elements);

        tempEye.add(direction); // move eye position
        tempAt.add(direction); // move at position

        // get collision results
        let { hitWall, hitGround } = this.checkCollision(tempEye.elements[0], tempEye.elements[2], COLLISION_RADIUS);

        // if the camera collides with the ground, only adjust `eye.y`, not `at.y`
        if (hitGround) {
            tempEye.elements[1] = GROUND_HEIGHT; // keep the camera at ground level
        }

        // if there's no wall collision, apply full movement
        if (!hitWall) {
            this.eye.set(tempEye); // update eye position
            this.at.set(tempAt); // update at position
        } else {
            // handle sliding when hitting a wall

            // try moving only along X (keeping Y and Z unchanged)
            let xOnlyEye = new Vector3(oldEye.elements);
            let xOnlyAt = new Vector3(oldAt.elements);
            xOnlyEye.elements[0] += direction.elements[0]; // move in x direction
            xOnlyAt.elements[0] += direction.elements[0]; // move at in x direction
            let xCollision = this.checkCollision(xOnlyEye.elements[0], xOnlyEye.elements[2], COLLISION_RADIUS).hitWall; // check for collision

            // try moving only along Z (keeping Y and X unchanged)
            let zOnlyEye = new Vector3(oldEye.elements);
            let zOnlyAt = new Vector3(oldAt.elements);
            zOnlyEye.elements[2] += direction.elements[2]; // move in z direction
            zOnlyAt.elements[2] += direction.elements[2]; // move at in z direction
            let zCollision = this.checkCollision(zOnlyEye.elements[0], zOnlyEye.elements[2], COLLISION_RADIUS).hitWall; // check for collision

            // decide movement based on collisions
            if (!xCollision && zCollision) {
                this.eye.set(xOnlyEye); // move along x if no collision
                this.at.set(xOnlyAt); // update at position
            } else if (xCollision && !zCollision) {
                this.eye.set(zOnlyEye); // move along z if no collision
                this.at.set(zOnlyAt); // update at position
            }
        }

        // finally, update the view matrix
        this.updateViewMatrix();
    }

    // move left
    left(speed = 0.2) {
        const GROUND_HEIGHT = 0; // ground height for collision
        const COLLISION_RADIUS = 0.2; // collision radius for movement

        // save old position
        let oldEye = new Vector3(this.eye.elements);
        let oldAt = new Vector3(this.at.elements);

        // compute "left" direction
        // forward = at - eye
        let forward = new Vector3();
        forward.set(this.at);
        forward.sub(this.eye); // calculate forward direction

        // side = up x forward => "left" direction
        let direction = Vector3.cross(this.up, forward); // calculate left direction
        direction.normalize(); // normalize the direction
        direction.mul(speed); // scale by speed

        // potential new positions
        let tempEye = new Vector3(oldEye.elements);
        let tempAt = new Vector3(oldAt.elements);
        tempEye.add(direction); // move eye position
        tempAt.add(direction); // move at position

        // collision check
        let { hitWall, hitGround } = this.checkCollision(tempEye.elements[0], tempEye.elements[2], COLLISION_RADIUS);

        // if the camera collides with the ground, only adjust `eye.y`, not `at.y`
        if (hitGround) {
            tempEye.elements[1] = GROUND_HEIGHT; // keep the camera at ground level
        }

        // if there's no wall collision, apply full movement
        if (!hitWall) {
            this.eye.set(tempEye); // update eye position
            this.at.set(tempAt); // update at position
        } else {
            // handle sliding when hitting a wall

            // try moving only along X (keeping Y and Z unchanged)
            let xOnlyEye = new Vector3(oldEye.elements);
            let xOnlyAt = new Vector3(oldAt.elements);
            xOnlyEye.elements[0] += direction.elements[0]; // move in x direction
            xOnlyAt.elements[0] += direction.elements[0]; // move at in x direction
            let xCollision = this.checkCollision(xOnlyEye.elements[0], xOnlyEye.elements[2], COLLISION_RADIUS).hitWall; // check for collision

            // try moving only along Z (keeping Y and X unchanged)
            let zOnlyEye = new Vector3(oldEye.elements);
            let zOnlyAt = new Vector3(oldAt.elements);
            zOnlyEye.elements[2] += direction.elements[2]; // move in z direction
            zOnlyAt.elements[2] += direction.elements[2]; // move at in z direction
            let zCollision = this.checkCollision(zOnlyEye.elements[0], zOnlyEye.elements[2], COLLISION_RADIUS).hitWall; // check for collision

            // decide movement based on collisions
            if (!xCollision && zCollision) {
                this.eye.set(xOnlyEye); // move along x if no collision
                this.at.set(xOnlyAt); // update at position
            } else if (xCollision && !zCollision) {
                this.eye.set(zOnlyEye); // move along z if no collision
                this.at.set(zOnlyAt); // update at position
            }
        }

        // finally, update the view matrix
        this.updateViewMatrix();
    }

    // move right
    right(speed = 0.2) {
        const GROUND_HEIGHT = 0; // ground height for collision
        const COLLISION_RADIUS = 0.2; // collision radius for movement

        // save old position
        let oldEye = new Vector3(this.eye.elements);
        let oldAt = new Vector3(this.at.elements);

        // compute "right" direction
        // forward = at - eye
        let forward = new Vector3();
        forward.set(this.at);
        forward.sub(this.eye); // calculate forward direction

        // side = forward x up => "right" direction
        let direction = Vector3.cross(forward, this.up); // calculate right direction
        direction.normalize(); // normalize the direction
        direction.mul(speed); // scale by speed

        // compute potential new positions
        let tempEye = new Vector3(oldEye.elements);
        let tempAt = new Vector3(oldAt.elements);
        tempEye.add(direction); // move eye position
        tempAt.add(direction); // move at position

        // check for collisions
        let { hitWall, hitGround } = this.checkCollision(tempEye.elements[0], tempEye.elements[2], COLLISION_RADIUS);

        // if the camera collides with the ground, only adjust `eye.y`, not `at.y`
        if (hitGround) {
            tempEye.elements[1] = GROUND_HEIGHT; // keep the camera at ground level
        }

        // if there's no wall collision, apply full movement
        if (!hitWall) {
            this.eye.set(tempEye); // update eye position
            this.at.set(tempAt); // update at position
        } else {
            // handle sliding when hitting a wall

            // try moving only along X (keeping Y and Z unchanged)
            let xOnlyEye = new Vector3(oldEye.elements);
            let xOnlyAt = new Vector3(oldAt.elements);
            xOnlyEye.elements[0] += direction.elements[0]; // move in x direction
            xOnlyAt.elements[0] += direction.elements[0]; // move at in x direction
            let xCollision = this.checkCollision(xOnlyEye.elements[0], xOnlyEye.elements[2], COLLISION_RADIUS).hitWall; // check for collision

            // try moving only along Z (keeping Y and X unchanged)
            let zOnlyEye = new Vector3(oldEye.elements);
            let zOnlyAt = new Vector3(oldAt.elements);
            zOnlyEye.elements[2] += direction.elements[2]; // move in z direction
            zOnlyAt.elements[2] += direction.elements[2]; // move at in z direction
            let zCollision = this.checkCollision(zOnlyEye.elements[0], zOnlyEye.elements[2], COLLISION_RADIUS).hitWall; // check for collision

            // decide movement based on collisions
            if (!xCollision && zCollision) {
                this.eye.set(xOnlyEye); // move along x if no collision
                this.at.set(xOnlyAt); // update at position
            } else if (xCollision && !zCollision) {
                this.eye.set(zOnlyEye); // move along z if no collision
                this.at.set(zOnlyAt); // update at position
            }
        }

        // finally, update the view matrix
        this.updateViewMatrix();
    }

    // pan left
    panLeft(alpha = 5) {
        // calculate forward vector
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye); // calculate forward direction

        // create rotation matrix
        let rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(alpha,
            this.up.elements[0],
            this.up.elements[1],
            this.up.elements[2]
        );

        // multiply rotation by forward vector to get new forward vector
        let f_prime = rotationMatrix.multiplyVector3(f);

        // update the at position
        this.at.set(this.eye);
        this.at.add(f_prime); // move at position
        viewMatrix.setLookAt(
            this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
            this.at.elements[0], this.at.elements[1], this.at.elements[2],
            this.up.elements[0], this.up.elements[1], this.up.elements[2]
        );
    }

    // pan right
    panRight(alpha = 5) {
        // calculate forward vector
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye); // calculate forward direction

        // create rotation matrix (rotate by -alpha)
        let rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(-alpha,
            this.up.elements[0],
            this.up.elements[1],
            this.up.elements[2]
        );

        // multiply rotation by forward vector to get new forward vector
        let f_prime = rotationMatrix.multiplyVector3(f);

        // update the at position
        this.at.set(this.eye);
        this.at.add(f_prime); // move at position
        viewMatrix.setLookAt(
            this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
            this.at.elements[0], this.at.elements[1], this.at.elements[2],
            this.up.elements[0], this.up.elements[1], this.up.elements[2]
        );
    }

    // pitch up
    pitchUp(angle = 5) {
        // calculate forward vector
        let forward = new Vector3();
        forward.set(this.at);
        forward.sub(this.eye); // calculate forward direction

        // calculate side vector using cross product
        let side = Vector3.cross(forward, this.up);
        side.normalize(); // normalize the side vector

        // create a rotation matrix that rotates by `angle` around `side` axis
        let rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(angle,
            side.elements[0],
            side.elements[1],
            side.elements[2]
        );

        // rotate forward vector
        let f_prime = rotationMatrix.multiplyVector3(forward);

        // update the at position
        this.at.set(this.eye);
        this.at.add(f_prime); // move at position

        // update the view matrix
        this.updateViewMatrix();
    }

    // pitch down
    pitchDown(angle = 5) {
        // calculate forward vector
        let forward = new Vector3();
        forward.set(this.at);
        forward.sub(this.eye); // calculate forward direction

        // calculate side vector using cross product
        let side = Vector3.cross(forward, this.up);
        side.normalize(); // normalize the side vector

        // rotate by -angle around side
        let rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(-angle, side.elements[0], side.elements[1], side.elements[2]);

        // apply rotation to forward vector
        let f_prime = rotationMatrix.multiplyVector3(forward);

        // update the at position
        this.at.set(this.eye);
        this.at.add(f_prime); // move at position

        // update the view matrix
        this.updateViewMatrix();
    }
}


function updateCameraFromMouse(ev) {
    const rotationSpeed = 0.1; // Adjust for smooth rotation

    // Use movementX and movementY instead of client positions
    const dx = ev.movementX;
    const dy = ev.movementY;

    // Horizontal mouse movement => pan left/right
    if (dx !== 0) {
        const angle = dx * rotationSpeed;
        if (angle > 0) {
            camera.panRight(angle);
        } else {
            camera.panLeft(-angle);
        }
    }

    // Vertical mouse movement => pitch up/down
    if (dy !== 0) {
        const angle = dy * rotationSpeed;
        if (angle > 0) {
            camera.pitchDown(angle);
        } else {
            camera.pitchUp(-angle);
        }
    }
}
