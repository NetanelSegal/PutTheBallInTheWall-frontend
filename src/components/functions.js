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


export const getCenterOfElement = (elem) => {
    const elemRect = elem.getBoundingClientRect();
    return {
        x: elemRect.left + elemRect.width / 2,
        y: elemRect.top + elemRect.height / 2,
    };
}

export const calculateImpulseForce = (playerSpeed) => {
    const impulseFactor = 20; // Adjust this factor for desired push strength
    return playerSpeed * impulseFactor;
};