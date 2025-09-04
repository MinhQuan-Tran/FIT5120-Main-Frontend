/**
 * Simple hash function for generating avatar pattern
 */
function hashCode(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return hash;
}

/**
 * Generate a unique SVG avatar based on deviceId
 * @param {string} deviceId
 * @param {number} size
 * @returns {string} base64 data URL of avatar
 */
export function generateAvatar(deviceId: string, size = 64) {
    const hash = Math.abs(hashCode(deviceId));
    const cell = size / 8;
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;
    svg += `<rect width="${size}" height="${size}" fill="#f0f0f0"/>`;

    const color = `hsl(${hash % 360}, 60%, 50%)`;

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 4; x++) {
            const bit = (hash >> (x + y * 4)) & 1;
            if (bit) {
                svg += `<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}" fill="${color}"/>`;
                svg += `<rect x="${(7 - x) * cell}" y="${y * cell}" width="${cell}" height="${cell}" fill="${color}"/>`;
            }
        }
    }
    svg += `</svg>`;

    return 'data:image/svg+xml;base64,' + btoa(svg);
}
