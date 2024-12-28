import seedrandom from "seedrandom";

// Define cell types
type Cell = "#" | " " | "X" | "E";

export function generateMaze(
  height: number = 12,
  width: number = 24,
  seed: number = Date.now()
): Cell[][] {
  // Initialize random seed
  Math.random = seedrandom(seed.toString());

  // Initialize maze with walls
  const maze: Cell[][] = Array(height)
    .fill(null)
    .map(() => Array(width).fill("#"));

  // Helper to get valid neighbors
  function getUnvisitedNeighbors(x: number, y: number): [number, number][] {
    const neighbors: [number, number][] = [];
    const directions = [
      [0, 2],
      [2, 0],
      [0, -2],
      [-2, 0], // right, down, left, up
    ];

    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;
      if (
        newX > 0 &&
        newX < width - 1 &&
        newY > 0 &&
        newY < height - 1 &&
        maze[newY][newX] === "#"
      ) {
        neighbors.push([newX, newY]);
      }
    }

    // Shuffle neighbors for randomization
    return neighbors.sort(() => Math.random() - 0.5);
  }

  function carve(x: number, y: number) {
    maze[y][x] = " ";

    const neighbors = getUnvisitedNeighbors(x, y);
    for (const [nextX, nextY] of neighbors) {
      if (maze[nextY][nextX] === "#") {
        // Carve the wall between current cell and neighbor
        maze[y + (nextY - y) / 2][x + (nextX - x) / 2] = " ";
        carve(nextX, nextY);
      }
    }
  }

  // Start from a random position instead of (1,1)
  const startX =
    1 + 2 * Math.floor(Math.random() * Math.floor((width - 2) / 2));
  const startY =
    1 + 2 * Math.floor(Math.random() * Math.floor((height - 2) / 2));
  carve(startX, startY);

  // Place start (X) point
  maze[startY][startX] = "X";

  // Find all valid positions for the exit
  const validExitPositions: [number, number][] = [];
  const minDistance = Math.floor(Math.max(width, height) / 2); // Minimum distance between start and exit

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      if (maze[y][x] === " ") {
        const distance = Math.abs(x - startX) + Math.abs(y - startY);
        if (distance >= minDistance) {
          validExitPositions.push([x, y]);
        }
      }
    }
  }

  // Randomly select an exit position from valid positions
  if (validExitPositions.length > 0) {
    const randomIndex = Math.floor(Math.random() * validExitPositions.length);
    const [exitX, exitY] = validExitPositions[randomIndex];
    maze[exitY][exitX] = "E";
  } else {
    // Fallback to the furthest point if no valid positions found
    let maxDistance = 0;
    let furthestPoint: [number, number] = [1, 1];

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        if (maze[y][x] === " ") {
          const distance = Math.abs(x - startX) + Math.abs(y - startY);
          if (distance > maxDistance) {
            maxDistance = distance;
            furthestPoint = [x, y];
          }
        }
      }
    }

    const [exitX, exitY] = furthestPoint;
    maze[exitY][exitX] = "E";
  }

  return maze;
}

export function getMaze(index: number): Cell[][] {
  // Use index and current timestamp to generate different seeds
  const seed = Date.now() + index;
  return generateMaze(12, 24, seed);
}
