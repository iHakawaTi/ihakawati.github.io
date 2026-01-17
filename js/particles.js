// ===== Neural Network Particle Background =====
class NeuralNetwork {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.particleCount = 80;
        this.connectionDistance = 150;
        this.particleColor = 'rgba(99, 102, 241, 0.8)';
        this.lineColor = 'rgba(99, 102, 241, 0.15)';
        
        this.init();
        this.animate();
        this.addEventListeners();
    }

    init() {
        this.resize();
        this.createParticles();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                originalRadius: Math.random() * 2 + 1
            });
        }
    }

    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = this.particleColor;
        this.ctx.fill();
    }

    drawConnection(p1, p2, distance) {
        const opacity = 1 - distance / this.connectionDistance;
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.strokeStyle = `rgba(99, 102, 241, ${opacity * 0.2})`;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }

    updateParticle(particle) {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

        // Mouse interaction
        if (this.mouse.x !== null) {
            const dx = particle.x - this.mouse.x;
            const dy = particle.y - this.mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.mouse.radius) {
                const force = (this.mouse.radius - distance) / this.mouse.radius;
                particle.x += dx * force * 0.03;
                particle.y += dy * force * 0.03;
                particle.radius = particle.originalRadius * (1 + force);
            } else {
                particle.radius = particle.originalRadius;
            }
        }
    }

    findConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.connectionDistance) {
                    this.drawConnection(this.particles[i], this.particles[j], distance);
                }
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            this.updateParticle(particle);
            this.drawParticle(particle);
        });

        this.findConnections();

        requestAnimationFrame(() => this.animate());
    }

    addEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });

        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    updateColors(isDark) {
        if (isDark) {
            this.particleColor = 'rgba(99, 102, 241, 0.8)';
            this.lineColor = 'rgba(99, 102, 241, 0.15)';
        } else {
            this.particleColor = 'rgba(99, 102, 241, 0.6)';
            this.lineColor = 'rgba(99, 102, 241, 0.1)';
        }
    }
}

// Initialize on load
window.NeuralNetwork = NeuralNetwork;
