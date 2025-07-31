// Quantum Fusion Website JavaScript
class QuantumFusion {
    constructor() {
        this.isMenuOpen = false;
        this.web3 = null;
        this.account = null;
        this.particles = [];
        this.animatedCounters = new Set();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initParticleSystem();
        this.initScrollAnimations();
        this.initCounters();
        this.checkWeb3();
    }

    setupEventListeners() {
        // Mobile menu toggle
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Wallet connection
        const connectBtn = document.querySelector('.connect-wallet');
        if (connectBtn) {
            connectBtn.addEventListener('click', () => this.connectWallet());
        }

        // Token swap interface
        const swapBtn = document.querySelector('.swap-btn');
        if (swapBtn) {
            swapBtn.addEventListener('click', () => this.executeSwap());
        }

        // Responsive handling
        window.addEventListener('resize', () => this.handleResize());
        
        // Close mobile menu on outside click
        document.addEventListener('click', (e) => {
            const navMenu = document.querySelector('.nav-menu');
            const menuToggle = document.querySelector('.menu-toggle');
            
            if (this.isMenuOpen && navMenu && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const menuToggle = document.querySelector('.menu-toggle');
        
        if (navMenu && menuToggle) {
            this.isMenuOpen = !this.isMenuOpen;
            navMenu.classList.toggle('active', this.isMenuOpen);
            menuToggle.classList.toggle('active', this.isMenuOpen);
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
        }
    }

    closeMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const menuToggle = document.querySelector('.menu-toggle');
        
        if (navMenu && menuToggle) {
            this.isMenuOpen = false;
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Trigger counter animation if element has counter
                    const counter = entry.target.querySelector('.counter');
                    if (counter && !this.animatedCounters.has(counter)) {
                        this.animateCounter(counter);
                        this.animatedCounters.add(counter);
                    }
                }
            });
        }, observerOptions);

        // Observe all elements with animation classes
        document.querySelectorAll('.fade-in, .slide-up, .slide-left, .slide-right, .scale-in').forEach(el => {
            observer.observe(el);
        });
    }

    initCounters() {
        document.querySelectorAll('.counter').forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target')) || 0;
            counter.textContent = '0';
            counter.setAttribute('data-target', target);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target')) || 0;
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        };

        updateCounter();
    }

    initParticleSystem() {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        this.resizeCanvas(canvas);

        // Create particles
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }

        this.animateParticles(canvas, ctx);
    }

    resizeCanvas(canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    animateParticles(canvas, ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Wrap around edges
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;

            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(100, 255, 218, ${particle.opacity})`;
            ctx.fill();
        });

        // Draw connections
        this.particles.forEach((particle, i) => {
            this.particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.strokeStyle = `rgba(100, 255, 218, ${0.1 * (1 - distance / 100)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(() => this.animateParticles(canvas, ctx));
    }

    async checkWeb3() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                this.web3 = new Web3(window.ethereum);
                
                // Check if already connected
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    this.account = accounts[0];
                    this.updateWalletUI();
                }

                // Listen for account changes
                window.ethereum.on('accountsChanged', (accounts) => {
                    this.account = accounts[0] || null;
                    this.updateWalletUI();
                });

                // Listen for chain changes
                window.ethereum.on('chainChanged', () => {
                    window.location.reload();
                });

            } catch (error) {
                console.error('Web3 initialization error:', error);
            }
        }
    }

    async connectWallet() {
        if (!this.web3) {
            alert('Please install MetaMask or another Web3 wallet');
            return;
        }

        try {
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            this.account = accounts[0];
            
            // Switch to Base chain
            await this.switchToBase();
            
            this.updateWalletUI();
            
        } catch (error) {
            console.error('Wallet connection error:', error);
            alert('Failed to connect wallet');
        }
    }

    async switchToBase() {
        const baseChainId = '0x2105'; // Base mainnet chain ID
        
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: baseChainId }],
            });
        } catch (switchError) {
            // Chain not added, try to add it
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: baseChainId,
                            chainName: 'Base',
                            nativeCurrency: {
                                name: 'Ethereum',
                                symbol: 'ETH',
                                decimals: 18,
                            },
                            rpcUrls: ['https://mainnet.base.org'],
                            blockExplorerUrls: ['https://basescan.org'],
                        }],
                    });
                } catch (addError) {
                    console.error('Failed to add Base chain:', addError);
                }
            }
        }
    }

    updateWalletUI() {
        const connectBtn = document.querySelector('.connect-wallet');
        const walletAddress = document.querySelector('.wallet-address');
        
        if (connectBtn) {
            if (this.account) {
                connectBtn.textContent = `${this.account.slice(0, 6)}...${this.account.slice(-4)}`;
                connectBtn.classList.add('connected');
            } else {
                connectBtn.textContent = 'Connect Wallet';
                connectBtn.classList.remove('connected');
            }
        }

        if (walletAddress) {
            walletAddress.textContent = this.account ? this.account : '';
        }
    }

    async executeSwap() {
        if (!this.account) {
            alert('Please connect your wallet first');
            return;
        }

        const fromToken = document.querySelector('.from-token-select')?.value;
        const toToken = document.querySelector('.to-token-select')?.value;
        const amount = document.querySelector('.swap-amount')?.value;

        if (!fromToken || !toToken || !amount) {
            alert('Please fill in all swap details');
            return;
        }

        try {
            // This is a basic swap interface - in production, you'd integrate with a DEX
            const swapBtn = document.querySelector('.swap-btn');
            const originalText = swapBtn.textContent;
            
            swapBtn.textContent = 'Swapping...';
            swapBtn.disabled = true;

            // Simulate swap transaction
            await new Promise(resolve => setTimeout(resolve, 2000));

            alert(`Swap successful: ${amount} ${fromToken} → ${toToken}`);
            
            swapBtn.textContent = originalText;
            swapBtn.disabled = false;

        } catch (error) {
            console.error('Swap error:', error);
            alert('Swap failed. Please try again.');
        }
    }

    handleResize() {
        const canvas = document.getElementById('particle-canvas');
        if (canvas) {
            this.resizeCanvas(canvas);
        }

        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768 && this.isMenuOpen) {
            this.closeMobileMenu();
        }
    }

    // Utility methods for interactive elements
    addGlowEffect(element) {
        element.addEventListener('mouseenter', () => {
            element.style.boxShadow = '0 0 20px rgba(100, 255, 218, 0.5)';
        });

        element.addEventListener('mouseleave', () => {
            element.style.boxShadow = '';
        });
    }

    addPulseEffect(element) {
        element.classList.add('pulse-animation');
    }

    // Initialize interactive elements
    initInteractiveElements() {
        // Add glow effects to buttons
        document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
            this.addGlowEffect(btn);
        });

        // Add pulse effect to important elements
        document.querySelectorAll('.pulse').forEach(el => {
            this.addPulseEffect(el);
        });

        // Add hover effects to cards
        document.querySelectorAll('.feature-card, .team-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px)';
                card.style.transition = 'transform 0.3s ease';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }
}

// Initialize the application when DOM is loaded
