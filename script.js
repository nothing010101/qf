// Quantum Fusion Network - Main JavaScript File
// Comprehensive functionality replicating Next.js version

class QuantumFusionApp {
  constructor() {
    this.web3 = null;
    this.account = null;
    this.isConnected = false;
    this.charts = {};
    this.animations = {};
    this.mobileMenuOpen = false;
    
    // Token configuration
    this.qfToken = {
      name: 'Quantum Fusion',
      address: '0x000000000000000000', // Coming Soon
      symbol: 'QF',
      decimals: 18,
      chainId: 8453, // Base chain
    };

    // Base chain configuration
    this.baseChain = {
      chainId: '0x2105', // 8453 in hex
      chainName: 'Base',
      nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: ['https://mainnet.base.org'],
      blockExplorerUrls: ['https://basescan.org'],
    };

    this.init();
  }

  async init() {
    this.setupEventListeners();
    this.initializeAnimations();
    this.initializeCharts();
    this.setupScrollAnimations();
    this.setupParticleSystem();
    this.setupCounters();
    this.checkWalletConnection();
    this.initializeLucideIcons();
  }

  // Initialize Lucide Icons
  initializeLucideIcons() {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  // Web3 and Wallet Integration
  async checkWalletConnection() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          this.account = accounts[0];
          this.isConnected = true;
          this.updateWalletUI();
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  }

  async connectWallet() {
    if (typeof window.ethereum === 'undefined') {
      this.showNotification('Please install MetaMask or another Web3 wallet', 'error');
      return;
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        this.account = accounts[0];
        this.isConnected = true;

        // Switch to Base chain
        await this.switchToBaseChain();
        this.updateWalletUI();
        this.showNotification('Wallet connected successfully!', 'success');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      this.showNotification('Failed to connect wallet', 'error');
    }
  }

  async switchToBaseChain() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: this.baseChain.chainId }],
      });
    } catch (switchError) {
      // Chain not added, try to add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [this.baseChain],
          });
        } catch (addError) {
          console.error('Error adding Base chain:', addError);
        }
      } else {
        console.error('Error switching to Base chain:', switchError);
      }
    }
  }

  async disconnectWallet() {
    this.account = null;
    this.isConnected = false;
    this.updateWalletUI();
    this.showNotification('Wallet disconnected', 'info');
  }

  updateWalletUI() {
    const connectButtons = [
      document.getElementById('connect-wallet'),
      document.getElementById('mobile-connect-wallet'),
      document.getElementById('wallet-connect-btn')
    ];

    connectButtons.forEach(button => {
      if (button) {
        if (this.isConnected) {
          button.textContent = `${this.account.slice(0, 6)}...${this.account.slice(-4)}`;
          button.classList.add('connected');
        } else {
          button.textContent = 'Connect Wallet';
          button.classList.remove('connected');
        }
      }
    });

    // Update buy section
    const buyInterface = document.getElementById('buy-interface');
    const walletPrompt = document.getElementById('wallet-prompt');
    
    if (buyInterface && walletPrompt) {
      if (this.isConnected) {
        buyInterface.classList.remove('hidden');
        walletPrompt.classList.add('hidden');
      } else {
        buyInterface.classList.add('hidden');
        walletPrompt.classList.remove('hidden');
      }
    }
  }

  // Floating Particles Animation System
  setupParticleSystem() {
    const particleContainer = document.getElementById('floating-particles');
    if (!particleContainer) return;

    // Create floating particles
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'floating-particle';
      particle.style.cssText = `
        position: absolute;
        width: ${4 + Math.random() * 8}px;
        height: ${4 + Math.random() * 8}px;
        background: rgba(${59 + Math.random() * 100}, ${130 + Math.random() * 100}, 246, ${0.3 + Math.random() * 0.7});
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
        animation-delay: ${Math.random() * 3}s;
        pointer-events: none;
      `;
      particleContainer.appendChild(particle);
    }
  }

  // Animated Counters
  setupCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const animateCounter = (counter) => {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = 2000;
      
      let start = 0;
      const increment = target / (duration / 16);
      
      const updateCounter = () => {
        start += increment;
        if (start < target) {
          counter.textContent = Math.floor(start);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };
      
      updateCounter();
    };

    // Intersection Observer for counters
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
          entry.target.classList.add('animated');
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
      counterObserver.observe(counter);
    });
  }

  // Chart.js Integration
  async initializeCharts() {
    // Wait for Chart.js to load
    if (typeof Chart === 'undefined') {
      setTimeout(() => this.initializeCharts(), 100);
      return;
    }

    this.initTokenomicsChart();
    this.initStakingChart();
  }

  initTokenomicsChart() {
    const ctx = document.getElementById('tokenomics-chart');
    if (!ctx) return;

    const data = {
      labels: ['Liquidity Pool', 'Team'],
      datasets: [{
        data: [95, 5],
        backgroundColor: [
          '#06B6D4',
          '#8B5CF6'
        ],
        borderWidth: 2,
        borderColor: '#1f2937'
      }]
    };

    this.charts.tokenomics = new Chart(ctx, {
      type: 'pie',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#374151',
              padding: 20,
              usePointStyle: true
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#3b82f6',
            borderWidth: 1
          }
        }
      }
    });
  }

  initStakingChart() {
    const ctx = document.getElementById('staking-chart');
    if (!ctx) return;

    const data = {
      labels: ['Bronze', 'Silver', 'Gold', 'Quantum'],
      datasets: [{
        label: 'APY %',
        data: [12, 18, 25, 35],
        backgroundColor: '#8B5CF6',
        borderColor: '#8B5CF6',
        borderWidth: 1
      }]
    };

    this.charts.staking = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#374151'
            },
            grid: {
              color: 'rgba(55, 65, 81, 0.1)'
            }
          },
          x: {
            ticks: {
              color: '#374151'
            },
            grid: {
              color: 'rgba(55, 65, 81, 0.1)'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: '#374151'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#3b82f6',
            borderWidth: 1
          }
        }
      }
    });
  }

  // Smooth Scrolling Navigation
  setupEventListeners() {
    // Navigation links
    document.addEventListener('click', (e) => {
      // Handle navigation links
      if (e.target.matches('a[href^="#"]') || e.target.closest('a[href^="#"]')) {
        const link = e.target.matches('a[href^="#"]') ? e.target : e.target.closest('a[href^="#"]');
        const href = link.getAttribute('href');
        if (href && href !== '#') {
          e.preventDefault();
          this.smoothScrollTo(href.substring(1));
          this.closeMobileMenu();
        }
      }

      // Wallet connection buttons
      if (e.target.matches('#connect-wallet, #mobile-connect-wallet, #wallet-connect-btn')) {
        e.preventDefault();
        if (this.isConnected) {
          this.disconnectWallet();
        } else {
          this.connectWallet();
        }
      }

      // Mobile menu toggle
      if (e.target.matches('#mobile-menu-btn') || e.target.closest('#mobile-menu-btn')) {
        this.toggleMobileMenu();
      }

      // Buy buttons
      if (e.target.matches('#buy-token-btn') || e.target.matches('.buy-button')) {
        window.open('https://ape.store', '_blank');
      }

      // Learn more buttons
      if (e.target.matches('#learn-more-btn')) {
        this.smoothScrollTo('about');
      }

      // Buy steps
      if (e.target.matches('.buy-step') || e.target.closest('.buy-step')) {
        const step = e.target.matches('.buy-step') ? e.target : e.target.closest('.buy-step');
        this.activateBuyStep(step);
      }
    });

    // Newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        this.handleNewsletterSubmit(e);
      });
    }

    // Window events
    window.addEventListener('scroll', () => {
      this.handleScroll();
    });

    window.addEventListener('resize', () => {
      this.handleResize();
    });

    // Ethereum events
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          this.disconnectWallet();
        } else {
          this.account = accounts[0];
          this.updateWalletUI();
        }
      });

      window.ethereum.on('chainChanged', (chainId) => {
        window.location.reload();
      });
    }
  }

  smoothScrollTo(targetId) {
    const element = document.getElementById(targetId);
    if (element) {
      const offsetTop = element.offsetTop - 80; // Account for fixed navbar
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  }

  // Mobile Menu Toggle
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenu) {
      if (this.mobileMenuOpen) {
        mobileMenu.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      } else {
        mobileMenu.classList.add('hidden');
        document.body.style.overflow = '';
      }
    }
  }

  closeMobileMenu() {
    if (this.mobileMenuOpen) {
      this.mobileMenuOpen = false;
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu) {
        mobileMenu.classList.add('hidden');
        document.body.style.overflow = '';
      }
    }
  }

  // Buy Step Activation
  activateBuyStep(stepElement) {
    // Remove active class from all steps
    document.querySelectorAll('.buy-step').forEach(step => {
      step.classList.remove('active');
    });

    // Add active class to clicked step
    stepElement.classList.add('active');

    // Update step icons
    const stepNumber = stepElement.getAttribute('data-step');
    this.updateBuyStepIcons(stepNumber);
  }

  updateBuyStepIcons(activeStep) {
    document.querySelectorAll('.buy-step').forEach((step, index) => {
      const stepNum = index + 1;
      const icon = step.querySelector('.w-16');
      
      if (stepNum <= activeStep) {
        icon.classList.remove('bg-gray-100', 'text-gray-600');
        icon.classList.add('bg-purple-500', 'text-white');
      } else {
        icon.classList.remove('bg-purple-500', 'text-white');
        icon.classList.add('bg-gray-100', 'text-gray-600');
      }
    });
  }

  // Newsletter Subscription
  async handleNewsletterSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const email = form.querySelector('#newsletter-email').value;
    const submitButton = form.querySelector('button[type="submit"]');
    
    if (!email) return;

    // Update button state
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Subscribing...';
    submitButton.disabled = true;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      this.showNotification('Successfully subscribed to QF updates!', 'success');
      form.reset();
    } catch (error) {
      this.showNotification('Failed to subscribe. Please try again.', 'error');
    } finally {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  }

  // Scroll-triggered Animations
  setupScrollAnimations() {
    // Hero animations
    const heroElements = [
      { selector: '.hero-logo', delay: 0 },
      { selector: '.hero-title', delay: 200 },
      { selector: '.hero-tagline', delay: 400 },
      { selector: '.hero-buttons', delay: 600 },
      { selector: '.hero-stats', delay: 800 }
    ];

    heroElements.forEach(({ selector, delay }) => {
      const element = document.querySelector(selector);
      if (element) {
        setTimeout(() => {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0) scale(1)';
        }, delay);
      }
    });

    // About section animations
    const aboutObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.about-header, .about-stats, .tech-highlight').forEach(el => {
      aboutObserver.observe(el);
    });

    // Feature cards staggered animation
    const featureCards = document.querySelectorAll('.feature-card');
    const featureObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 100);
        }
      });
    }, { threshold: 0.1 });

    featureCards.forEach(card => {
      featureObserver.observe(card);
    });

    // Roadmap animations
    const roadmapPhases = document.querySelectorAll('.roadmap-phase');
    const roadmapObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 200);
        }
      });
    }, { threshold: 0.1 });

    roadmapPhases.forEach(phase => {
      roadmapObserver.observe(phase);
    });
  }

  // Interactive Timeline for Roadmap
  initializeAnimations() {
    // Initialize floating orb animations
    const orbs = document.querySelectorAll('.floating-orb-1, .floating-orb-2');
    orbs.forEach((orb, index) => {
      orb.style.animation = `float-large-${index + 1} ${6 + index * 2}s ease-in-out infinite`;
    });

    // Initialize quantum background animations
    const quantumBgs = document.querySelectorAll('.quantum-bg-1, .quantum-bg-2, .quantum-bg-3');
    quantumBgs.forEach((bg, index) => {
      bg.style.animationDelay = `${index * 0.5}s`;
    });
  }

  // Scroll Handler
  handleScroll() {
    const scrollY = window.scrollY;
    
    // Navbar background opacity
    const navbar = document.getElementById('navbar');
    if (navbar) {
      if (scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
      } else {
        navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
      }
    }

    // Parallax effects for hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection && scrollY < window.innerHeight) {
      const parallaxElements = heroSection.querySelectorAll('.floating-orb-1, .floating-orb-2');
      parallaxElements.forEach((element, index) => {
        const speed = 0.3 + (index * 0.1);
        const yPos = -(scrollY * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    }
  }

  // Resize Handler
  handleResize() {
    // Recalculate chart dimensions
    Object.values(this.charts).forEach(chart => {
      if (chart && chart.resize) {
        chart.resize();
      }
    });

    // Close mobile menu on desktop
    if (window.innerWidth >= 768 && this.mobileMenuOpen) {
      this.closeMobileMenu();
    }

    // Reinitialize Lucide icons
    this.initializeLucideIcons();
  }

  // Token Contract Integration
  async addTokenToWallet() {
    if (!window.ethereum) {
      this.showNotification('Please install MetaMask to add token', 'error');
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: this.qfToken.address,
            symbol: this.qfToken.symbol,
            decimals: this.qfToken.decimals,
          },
        },
      });
      this.showNotification('QF token added to wallet!', 'success');
    } catch (error) {
      console.error('Error adding token to wallet:', error);
      this.showNotification('Failed to add token to wallet', 'error');
    }
  }

  // Utility Functions
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px 24px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
      max-width: 400px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    `;

    if (type === 'success') {
      notification.style.backgroundColor = '#10B981';
    } else if (type === 'error') {
      notification.style.backgroundColor = '#EF4444';
    } else {
      notification.style.backgroundColor = '#3B82F6';
    }

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 4000);
  }

  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  formatAddress(address) {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  // Copy to clipboard
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      this.showNotification('Copied to clipboard!', 'success');
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      this.showNotification('Copied to clipboard!', 'success');
    }
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.quantumFusionApp = new QuantumFusionApp();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
    50% { transform: translateY(-20px) scale(1.2); opacity: 1; }
  }

  @keyframes float-large-1 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(50px, -30px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
  }

  @keyframes float-large-2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(-40px, 20px) scale(1.2); }
    75% { transform: translate(30px, -10px) scale(0.8); }
  }

  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }

  .hero-logo, .hero-title, .hero-tagline, .hero-buttons, .hero-stats {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .hero-logo {
    transform: translateY(30px) scale(0.5);
  }

  .about-header, .about-stats, .tech-highlight, .feature-card, .roadmap-phase {
    opacity: 0;
    transform: translateY(50px);
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .feature-card:hover {
    transform: translateY(-5px) scale(1.02);
  }

  .buy-step {
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .buy-step:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }

  .buy-step.active {
    border-color: #8B5CF6;
    box-shadow: 0 10px 25px rgba(139, 92, 246, 0.2);
  }

  .connected {
    background: linear-gradient(45deg, #10B981, #059669) !important;
  }

  .floating-particle {
    will-change: transform, opacity;
  }

  .notification {
    backdrop-filter: blur(10px);
  }

  /* Mobile menu animations */
  #mobile-menu {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Smooth scrolling for all browsers */
  html {
    scroll-behavior: smooth;
  }

  /* Loading states */
  .loading {
    opacity: 0.6;
    pointer-events: none;
}
