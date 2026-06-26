# ModMyRide 3D Configurator (PoC v2.0)

ModMyRide PoC v2.0 is a high-performance 3D vehicle configurator designed for the automotive retail industry. This application demonstrates real-time customization, advanced lighting pipelines, and interactive 3D rendering capabilities, serving as a robust foundation for scalable automotive e-commerce solutions.

## 🎯 Project Goal
The primary objective of this Proof-of-Concept (PoC) is to demonstrate the technical feasibility of a browser-based, high-performance platform that allows users to customize vehicle components, textures, and aesthetic elements in real-time.

## 🚀 Key Technical Features
* **Real-time Customization:** Interactive modification of vehicle body paint, wheel variants, and dynamic glass tinting using `Three.js` and `React Three Fiber`.
* **High-Fidelity Rendering:** Optimized material pipelines utilizing physical roughness and metalness mapping for showroom-grade visual fidelity.
* **Dynamic Lighting Engine:** A synchronized lighting system that toggles headlights and taillights with high-intensity emission effects upon engine activation.
* **Cinematic Camera Logic:** Smooth, GSAP-driven camera transitions between predefined cinematic angles (Front, Side, Rear, Top).
* **Performance Optimization:** Efficient scene traversal and memory-managed material cloning to maintain stable frame rates.

## 🛠 Tech Stack
* **Frontend:** [React](https://react.dev/)
* **3D Engine:** [Three.js](https://threejs.org/) / [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
* **Animation:** [GSAP](https://gsap.com/) (GreenSock Animation Platform)
* **Assets:** [drei](https://github.com/pmndrei) (Abstractions for R3F)

## 📦 Project Structure
- `App.jsx`: Main entry component handling the UI, audio control, and primary Canvas setup.
- `CarModel.jsx`: Core engine component responsible for scene traversal, material customization, and camera logic.
- `Public/Assets`: Contains the optimized `.glb` 3D model and audio assets for web delivery.

## ⚙️ Setup & Installation

To get this project up and running on your local machine, follow these commands in your terminal:

```bash
git clone [https://github.com/samithasudesh859-ops/mod-my-ride](https://github.com/samithasudesh859-ops/mod-my-ride)
cd mod-my-ride
npm install
npm run dev