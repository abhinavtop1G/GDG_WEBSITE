# GDG Universe

An immersive 3D website for the Google Developers Group student chapter. Not a page of sections — a continuous cosmos the visitor flies through.

## Stack

- **Next.js 14** (App Router, JSX)
- **React Three Fiber** + **Drei** + **@react-three/postprocessing**
- **GSAP** + **Framer Motion** for animation
- **Lenis** for smooth scroll
- **Zustand** for minimal global state
- **Tailwind CSS** with a custom "Nebula Forge" palette

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000

## The Experience

A single 3D scene. The camera flies along a Catmull-Rom curve through six zones, driven by smooth-scroll progress. Each zone is a diegetic 3D environment, not a DOM section pretending to be 3D:

| # | Zone | What lives there |
|---|------|------------------|
| 0 | Orbital Core | Pulsing icosahedron, wireframe shell, three orbital rings, 24 orbiting dots |
| 1 | Events Nexus | Five holographic panels in a curved array with scan lines |
| 2 | Learning Constellation | Nine neural nodes, ~16 pulsing edges, signal packets traveling between them |
| 3 | Community Orbit | Central dodecahedron with eight member cards in varied orbits (billboarded) |
| 4 | Projects Gallery | Three rotating artifacts (torus knot, octahedron, cone) on a light-beam platform |
| 5 | Impact Horizon | Stylized globe with contributor nodes and bezier connection arcs between them |

Ambient lighting color lerps between zone palettes as the camera moves — events feel red, learning feels green, community feels gold, etc.

## Project structure

```
.
├── app/
│   ├── layout.jsx           # metadata, global CSS
│   ├── page.jsx             # composes cursor, loader, scene, overlay
│   └── globals.css          # design tokens, typography, grain, scan line
├── components/
│   ├── Scene.jsx            # R3F Canvas + postprocessing
│   ├── CameraRig.jsx        # scroll-driven camera along curve
│   ├── Lights.jsx           # dynamic lighting that shifts per zone
│   ├── zones/               # one file per zone
│   │   ├── OrbitalCore.jsx
│   │   ├── EventsNexus.jsx
│   │   ├── LearningConstellation.jsx
│   │   ├── CommunityOrbit.jsx
│   │   ├── ProjectsGallery.jsx
│   │   └── ImpactHorizon.jsx
│   ├── effects/
│   │   ├── ParticleField.jsx  # 1500-particle atmospheric dust
│   │   ├── StarField.jsx
│   │   └── Cursor.jsx         # custom dot + lerped ring
│   └── ui/
│       ├── Navigation.jsx    # top bar + zone dots + telemetry
│       ├── ScrollOverlay.jsx # framer-motion-driven editorial text
│       └── Loader.jsx        # intro screen
├── lib/
│   ├── scenePath.js          # zone waypoints + camera path
│   └── store.js              # Zustand: scrollProgress, activeZone
├── hooks/
│   └── useLenis.js
└── data/
    └── content.js            # single source of truth for all zone copy
```

## Editing content

Non-3D content (event names, member counts, taglines) all lives in `data/content.js`. A GDG lead can update copy without touching Three.js.

## Performance notes

- Single persistent Canvas — never unmounts
- Instanced particles where possible
- Textures & meshes are primitives + shaders, no heavy GLTFs
- Bloom gated at luminance threshold 0.25 to avoid blowing out text
- `dpr={[1, 2]}` caps pixel ratio on retina for battery

## Customization

- **Color palette**: edit CSS variables in `app/globals.css` + `tailwind.config.js`
- **Zone order / positions**: `lib/scenePath.js` → `ZONE_POSITIONS` + `CAMERA_PATH`
- **Add a zone**: create `components/zones/YourZone.jsx`, add entry to `ZONES` in `data/content.js`, add waypoint in `scenePath.js`, import into `Scene.jsx`
