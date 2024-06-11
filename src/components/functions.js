export const isTouchingDisc = (playerPosition, discPosition) => {
    const discCenter = {
        x: discPosition.left + discPosition.width / 2,
        y: discPosition.top + discPosition.height / 2,
    };

    const playerCenter = {
        x: playerPosition.left + playerPosition.width / 2,
        y: playerPosition.top + playerPosition.height / 2,
    };

    const distance = Math.sqrt(
        Math.pow(playerCenter.x - discCenter.x, 2) +
        Math.pow(playerCenter.y - discCenter.y, 2)
    );

    return distance <= playerPosition.width / 2 + discPosition.width / 2;
};

export const getKissingPoint = (playerPosition, discPosition) => {
    const playerCenter = {
        x: playerPosition.left + playerPosition.width / 2,
        y: playerPosition.top + playerPosition.height / 2,
    };

    const discCenter = {
        x: discPosition.left + discPosition.width / 2,
        y: discPosition.top + discPosition.height / 2,
    };

    const playerRadius = playerPosition.width / 2;
    const discRadius = discPosition.width / 2;

    // Calculate direction vector from player center to disc center
    const direction = {
        x: discCenter.x - playerCenter.x,
        y: discCenter.y - playerCenter.y,
    };

    // Normalize the direction vector (ensure it has a magnitude of 1)
    const magnitude = Math.hypot(direction.x, direction.y);
    const normalizedDirection = {
        x: direction.x / magnitude,
        y: direction.y / magnitude,
    };

    // Distance between centers needs to be adjusted for radii in order to get the kissing point
    const adjustedDistance = Math.max(0, magnitude - playerRadius - discRadius);

    // Calculate kissing point coordinates based on normalized direction and adjusted distance
    const kissingPoint = {
        x: playerCenter.x + normalizedDirection.x * adjustedDistance,
        y: playerCenter.y + normalizedDirection.y * adjustedDistance,
    };

    return kissingPoint;
};

export const calculateDiscVelocity = (direction, playerSpeed) => {
    // Normalize the direction vector (ensure it has a magnitude of 1)
    const magnitude = Math.hypot(direction.x, direction.y);
    const normalizedDirection = {
        x: direction.x / magnitude,
        y: direction.y / magnitude,
    };

    // Scale the normalized direction by player speed to get velocity magnitude
    const velocityMagnitude = playerSpeed;
    const velocity = {
        x: normalizedDirection.x * velocityMagnitude,
        y: normalizedDirection.y * velocityMagnitude,
    };

    return velocity;
};

export const getCenterOfElement = (rect) => ({
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
})

export const reverseDiscDirection = (borders, position, velocity, { w, h }, gap) => {
    if (borders.bottom) {
        velocity.y *= -1;
        position.y = 100 - h - gap;
    }

    if (borders.top) {
        velocity.y *= -1;
        position.y = gap;
    }

    if (borders.left) {
        velocity.x *= -1;
        position.x = gap;
    }

    if (borders.right) {
        velocity.x *= -1;
        position.x = 100 - w - gap;
    }

    return [position, velocity]
};

export const getTouchingBorder = (discRect, fieldRect) => {
    const res = { bottom: false, top: false, right: false, left: false }
    if (discRect.bottom >= fieldRect.bottom) {
        res["bottom"] = true
    }

    if (discRect.top <= fieldRect.top) {
        res["top"] = true
    }

    if (discRect.left <= fieldRect.left) {
        res["left"] = true
    }

    if (discRect.right >= fieldRect.right) {
        res["right"] = true
    }

    return res
};

export const getDeltaFromPlayerSpeed = (pressedKeys, playerSpeed) => {
    let deltaX = 0;
    let deltaY = 0;

    if (pressedKeys["ArrowUp"] || pressedKeys["w"] || pressedKeys["W"]) {
        deltaY -= playerSpeed; // Player movement distance (adjust as needed)
    }
    if (pressedKeys["ArrowDown"] || pressedKeys["s"] || pressedKeys["S"]) {
        deltaY += playerSpeed;
    }
    if (pressedKeys["ArrowRight"] || pressedKeys["d"] || pressedKeys["D"]) {
        deltaX += playerSpeed;
    }
    if (pressedKeys["ArrowLeft"] || pressedKeys["a"] || pressedKeys["A"]) {
        deltaX -= playerSpeed;
    }

    return { x: deltaX, y: deltaY }
}


export const clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max);
};


export const limitPlayerToField = ({ x, y }, { w, h }, playerNum) => {
    if (playerNum == 0) {
        x = clamp(x, 0, 50 - w);
        y = clamp(y, 0, 100 - h);
    } else {
        x = clamp(x, 50, 100 - w);
        y = clamp(y, 0, 100 - h);
    }
    return { x, y };
};