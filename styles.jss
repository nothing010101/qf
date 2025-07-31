:root {
  --primary-blue: #1e40af;
  --primary-purple: #7c3aed;
  --secondary-blue: #3b82f6;
  --secondary-purple: #a855f7;
  --accent-cyan: #06b6d4;
  --accent-pink: #ec4899;
  --dark-bg: #0f172a;
  --darker-bg: #020617;
  --light-text: #f8fafc;
  --gray-text: #94a3b8;
  --card-bg: rgba(30, 41, 59, 0.8);
  --card-border: rgba(148, 163, 184, 0.2);
  --glow-blue: rgba(59, 130, 246, 0.5);
  --glow-purple: rgba(168, 85, 247, 0.5);
  --transition-fast: 0.2s ease;
  --transition-medium: 0.4s ease;
  --transition-slow: 0.6s ease;
  --border-radius: 12px;
  --shadow-glow: 0 0 20px rgba(59, 130, 246, 0.3);
  --shadow-card: 0 4px 20px rgba(0, 0, 0, 0.3);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, var(--dark-bg) 0%, var(--darker-bg) 100%);
  color: var(--light-text);
  line-height: 1.6;
  overflow-x: hidden;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Quantum Background Animation */
.quantum-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

.quantum-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 20% 80%, var(--glow-blue) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, var(--glow-purple) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, var(--accent-cyan) 0%, transparent 50%);
  animation: quantumShift 20s ease-in-out infinite;
}

@keyframes quantumShift {
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.3; }
  33% { transform: scale(1.1) rotate(120deg); opacity: 0.5; }
  66% { transform: scale(0.9) rotate(240deg); opacity: 0.4; }
}

/* Floating Particles */
.particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: linear-gradient(45deg, var(--accent-cyan), var(--accent-pink));
  border-radius: 50%;
  animation: float 15s linear infinite;
  opacity: 0.6;
}

.particle:nth-child(odd) {
  animation-duration: 20s;
  background: linear-gradient(45deg, var(--primary-blue), var(--primary-purple));
}

.particle:nth-child(3n) {
  animation-duration: 25s;
  width: 2px;
  height: 2px;
}

@keyframes float {
  0% {
    transform: translateY(100vh) translateX(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.6;
  }
  90% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(-100px) translateX(100px) rotate(360deg);
    opacity: 0;
  }
}

/* Header Styles */
header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--card-border);
  z-index: 1000;
  transition: var(--transition-medium);
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(45deg, var(--primary-blue), var(--primary-purple));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-links a {
  color: var(--gray-text);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition-fast);
  position: relative;
}

.nav-links a:hover {
  color: var(--light-text);
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(45deg, var(--primary-blue), var(--primary-purple));
  transition: var(--transition-fast);
}

.nav-links a:hover::after {
  width: 100%;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  cursor: pointer;
  gap: 4px;
}

.menu-toggle span {
  width: 25px;
  height: 3px;
  background: var(--light-text);
  transition: var(--transition-fast);
}

/* Hero Section */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  padding-top: 80px;
}

.hero-content h1 {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, var(--primary-blue), var(--primary-purple), var(--accent-cyan));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: titleGlow 3s ease-in-out infinite alternate;
}

@keyframes titleGlow {
  0% { filter: drop-shadow(0 0 10px var(--glow-blue)); }
  100% { filter: drop-shadow(0 0 20px var(--glow-purple)); }
}

.hero-content p {
  font-size: 1.25rem;
  color: var(--gray-text);
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* Button Styles */
.btn {
  display: inline-block;
  padding: 12px 24px;
  border: none;
  border-radius: var(--border-radius);
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: var(--transition-medium);
  position: relative;
  overflow: hidden;
  font-size: 1rem;
}

.btn-primary {
  background: linear-gradient(45deg, var(--primary-blue), var(--primary-purple));
  color: var(--light-text);
  box-shadow: var(--shadow-glow);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 30px rgba(59, 130, 246, 0.5);
}

.btn-secondary {
  background: transparent;
  color: var(--light-text);
  border: 2px solid var(--primary-blue);
}

.btn-secondary:hover {
  background: var(--primary-blue);
  transform: translateY(-2px);
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: var(--transition-medium);
}

.btn:hover::before {
  left: 100%;
}

/* Card Styles */
.card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--border-radius);
  padding: 2rem;
  backdrop-filter: blur(10px);
  transition: var(--transition-medium);
  position: relative;
  overflow: hidden;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-card);
  border-color: var(--primary-blue);
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--primary-blue), var(--primary-purple));
  transform: scaleX(0);
  transition: var(--transition-medium);
}

.card:hover::before {
  transform: scaleX(1);
}

/* Section Styles */
section {
  padding: 5rem 0;
  position: relative;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 3rem;
  background: linear-gradient(45deg, var(--primary-blue), var(--primary-purple));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-subtitle {
  text-align: center;
  color: var(--gray-text);
  font-size: 1.125rem;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* Grid Layouts */
.grid {
  display: grid;
  gap: 2rem;
}

.grid-2 {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.grid-3 {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.grid-4 {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

/* Features Section */
.feature-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(45deg, var(--primary-blue), var(--primary-purple));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.feature h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--light-text);
}

.feature p {
  color: var(--gray-text);
  line-height: 1.6;
}

/* Stats Section */
.stats {
  background: rgba(30, 41, 59, 0.5);
  border-radius: var(--border-radius);
  padding: 3rem 2rem;
  margin: 3rem 0;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(45deg, var(--accent-cyan), var(--accent-pink));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: block;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: var(--gray-text);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.875rem;
}

/* Timeline Styles */
.timeline {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, var(--primary-blue), var(--primary-purple));
  transform: translateX(-50%);
}

.timeline-item {
  position: relative;
  margin-bottom: 3rem;
  width: 50%;
}

.timeline-item:nth-child(odd) {
  left: 0;
  padding-right: 2rem;
}

.timeline-item:nth-child(even) {
  left: 50%;
  padding-left: 2rem;
}

.timeline-content {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  position: relative;
}

.timeline-item::before {
  content: '';
  position: absolute;
  top: 20px;
  width: 12px;
  height: 12px;
  background: var(--primary-blue);
  border-radius: 50%;
  border: 3px solid var(--dark-bg);
}

.timeline-item:nth-child(odd)::before {
  right: -6px;
}

.timeline-item:nth-child(even)::before {
  left: -6px;
}

/* Form Styles */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--light-text);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid var(--card-border);
  border-radius: var(--border-radius);
  color: var(--light-text);
  font-size: 1rem;
  transition: var(--transition-fast);
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

/* Footer */
footer {
  background: var(--darker-bg);
  border-top: 1px solid var(--card-border);
  padding: 3rem 0 1rem;
  text-align: center;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--light-text);
}

.footer-section p,
.footer-section a {
  color: var(--gray-text);
  text-decoration: none;
  transition: var(--transition-fast);
}

.footer-section a:hover {
  color: var(--primary-blue);
}

.footer-bottom {
  border-top: 1px solid var(--card-border);
  padding-top: 1rem;
  color: var(--gray-text);
  font-size: 0.875rem;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

.animate-fade-in-left {
  animation: fadeInLeft 0.6s ease-out;
}

.animate-fade-in-right {
  animation: fadeInRight 0.6s ease-out;
}

.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}

/* Utility Classes */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

.mb-1 { margin-bottom: 0.25rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 1rem; }
.mb-4 { margin-bottom: 1.5rem; }
.mb-5 { margin-bottom: 2rem; }

.mt-1 { margin-top: 0.25rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-3 { margin-top: 1rem; }
.mt-4 { margin-top: 1.5rem; }
.mt-5 { margin-top: 2rem; }

.p-1 { padding: 0.25rem; }
.p-2 { padding: 0.5rem; }
.p-3 { padding: 1rem; }
.p-4 { padding: 1.5rem; }
.p-5 { padding: 2rem; }

.hidden { display: none; }
.block { display: block; }
.inline-block { display: inline-block; }
.flex { display: flex; }
.grid { display: grid; }

.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }

.w-full { width: 100%; }
.h-full { height: 100%; }

.relative { position: relative; }
.absolute { position: absolute; }
.fixed { position: fixed; }

.z-10 { z-index: 10; }
.z-20 { z-index: 20; }
.z-30 { z-index: 30; }

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
  
  .nav-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(10px);
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }
  
  .nav-links.active {
    display: flex;
  }
  
  .menu-toggle {
    display: flex;
  }
  
  .menu-toggle.active span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }
  
  .menu-toggle.active span:nth-child(2) {
    opacity: 0;
  }
  
  .menu-toggle.active span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -6px);
  }
  
  .hero-content h1 {
    font-size: 2.5rem;
  }
  
  .hero-content p {
    font-size: 1.125rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .grid-2,
  .grid-3,
  .grid-4 {
    grid-template-columns: 1fr;
  }
  
  .timeline::before {
    left: 20px;
  }
  
  .timeline-item {
    width: 100%;
    left: 0 !important;
    padding-left: 3rem !important;
    padding-right: 0 !important;
  }
  
  .timeline-item::before {
    left: 14px !important;
    right: auto !important;
  }
  
  .stat-number {
    font-size: 2rem;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .hero {
    padding-top: 100px;
  }
  
  .hero-content h1 {
    font-size: 2rem;
  }
  
  .card {
    padding: 1.5rem;
  }
  
  section {
    padding: 3rem 0;
  }
  
  .btn {
    padding: 10px 20px;
    font-size: 0.875rem;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --card-border: rgba(255, 255, 255, 0.5);
    --gray-text: #e2e8f0;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .quantum-bg::before {
    animation: none;
  }
  
  .particle {
    animation: none;
  }
}

/* Print styles */
@media print {
  .quantum-bg,
  .particles,
  header,
  .btn,
  footer {
    display: none !important;
  }
  
  body {
