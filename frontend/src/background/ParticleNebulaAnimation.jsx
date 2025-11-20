// import { useRef, useEffect } from "react";

// export default function ParticleNebulaAnimation() {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");

//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;

//     const particles = [];
//     const count = 80;

//     class Particle {
//       constructor() {
//         this.x = Math.random() * canvas.width;
//         this.y = Math.random() * canvas.height;
//         this.r = Math.random() * 3 + 1;
//         this.vx = (Math.random() - 0.5) * 0.3;
//         this.vy = (Math.random() - 0.5) * 0.3;
//         this.alpha = Math.random() * 0.6 + 0.2;
//       }

//       draw() {
//         ctx.beginPath();
//         ctx.fillStyle = `rgba(0, 110, 255, ${this.alpha})
// // 