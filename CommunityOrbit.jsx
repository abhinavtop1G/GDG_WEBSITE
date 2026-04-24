// All zone positions in 3D space. Camera flies through them.
// Units are in world-space. Camera offset slightly so zones stay in frame.

export const ZONE_POSITIONS = [
  [0, 0, 0],       // 0: Orbital Core (landing)
  [14, 3, -18],    // 1: Events Nexus
  [-12, -4, -38],  // 2: Learning Constellation
  [10, 5, -58],    // 3: Community Orbit
  [-14, -2, -80],  // 4: Projects Gallery
  [0, 8, -105],    // 5: Impact Horizon
];

// Camera travels along this path (offset from zone positions toward the viewer).
export const CAMERA_PATH = [
  [0, 0, 8],         // looking at orbital core from +z
  [0, 1, -2],        // pulling deeper into space
  [14, 3, -10],      // near events
  [7, 1, -22],       // transition
  [-12, -4, -30],    // near learning
  [-6, 0, -45],      // transition
  [10, 5, -50],      // near community
  [3, 3, -68],       // transition
  [-14, -2, -72],    // near projects
  [-6, 3, -90],      // transition
  [0, 8, -97],       // near impact
  [0, 10, -110],     // final pullout
];

export const CAMERA_LOOK_PATH = [
  [0, 0, 0],
  [4, 1, -10],
  [14, 3, -18],
  [2, 0, -28],
  [-12, -4, -38],
  [-2, 0, -48],
  [10, 5, -58],
  [0, 2, -70],
  [-14, -2, -80],
  [-4, 3, -92],
  [0, 8, -105],
  [0, 8, -115],
];

// Number of zones
export const ZONE_COUNT = 6;
