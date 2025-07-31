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
      address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
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
  }

  // Web3 and Wallet Integration
  async checkWalletConnection() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        this.web3 = new Web3(window.ethereum);
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
      alert('Please install MetaMask or another Web3 wallet');
      return;
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        this.web3 = new Web3(window.ethereum);
        this.account = accounts[0];
        this.isConnected = true;

        // Switch to Base chain
        await this.switchToBaseChain();
        this.updateWalletUI();
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet');
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
  }

  updateWalletUI() {
    const walletButtons = document.querySelectorAll('.wallet-connect');
    const walletInfo = document.querySelectorAll('.wallet-info');

    walletButtons.forEach(button => {
      if (this.isConnected) {
        button.textContent = `${this.account.slice(0, 6)}...${this.account.slice(-4)}`;
        button.classList.add('connected');
      } else {
        button.textContent = 'Connect Wallet';
        button.classList.remove('connected');
      }
    });

    walletInfo.forEach(info => {
      info.style.display = this.isConnected ? 'block' : 'none';
    });

    // Update buy section
    const buyInterface = document.getElementById('buy-interface');
    if (buyInterface) {
      buyInterface.style.display = this.isConnected ? 'block' : 'none';
    }

    const connectMessage = document.getElementById('connect-message');
    if (connectMessage) {
      connectMessage.style.display = this.isConnected ? 'none' : 'block';
    }
  }

  // Floating Particles Animation System
  setupParticleSystem() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    // Create floating particles
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'floating-particle';
      particle.style.cssText = `
        position: absolute;
        width: 8px;
        height: 8px;
        background: rgba(59, 130, 246, 0.6);
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: float ${3 + Math.random() * 2}s ease-in-out infinite;
        animation-delay: ${Math.random() * 2}s;
        pointer-events: none;
      `;
      heroSection.appendChild(particle);
    }

    // Create large floating orbs
    const orb1 = document.createElement('div');
    orb1.className = 'floating-orb orb-1';
    orb1.style.cssText = `
      position: absolute;
      top: 80px;
      left: 80px;
      width: 128px;
      height: 128px;
      background: linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3));
      border-radius: 50%;
      filter: blur(40px);
      animation: orbFloat1 6s ease-in-out infinite;
      pointer-events: none;
    `;
    heroSection.appendChild(orb1);

    const orb2 = document.createElement('div');
    orb2.className = 'floating-orb orb-2';
    orb2.style.cssText = `
      position: absolute;
      bottom: 80px;
      right: 80px;
      width: 160px;
      height: 160px;
      background: linear-gradient(45deg, rgba(147, 51, 234, 0.3), rgba(79, 70, 229, 0.3));
      border-radius: 50%;
      filter: blur(40px);
      animation: orbFloat2 8s ease-in-out infinite;
      pointer-events: none;
    `;
    heroSection.appendChild(orb2);
  }

  // Animated Counters
  setupCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const animateCounter = (counter) => {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = parseInt(counter.getAttribute('data-duration')) || 2000;
      const suffix = counter.getAttribute('data-suffix') || '';
      
      let start = 0;
      const increment = target / (duration / 16);
      
      const updateCounter = () => {
        start += increment;
        if (start < target) {
          counter.textContent = Math.floor(start) + suffix;
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target + suffix;
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
      labels: ['Community', 'Liquidity', 'Development', 'Marketing'],
      datasets: [{
        data: [40, 30, 20, 10],
        backgroundColor: [
          '#8B5CF6',
          '#06B6D4',
          '#10B981',
          '#F59E0B'
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
              color: '#ffffff',
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
      datasets: [
        {
          label: 'APY %',
          data: [12, 18, 25, 35],
          backgroundColor: '#8B5CF6',
          borderColor: '#8B5CF6',
          borderWidth: 1
        },
        {
          label: 'Multiplier',
          data: [1.2, 1.8, 2.5, 3.5],
          backgroundColor: '#06B6D4',
          borderColor: '#06B6D4',
          borderWidth: 1
        }
      ]
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
              color: '#ffffff'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
          x: {
            ticks: {
              color: '#ffffff'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: '#ffffff'
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
      if (e.target.matches('[data-scroll]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('data-scroll');
        this.smoothScrollTo(targetId);
      }

      // Wallet connection
      if (e.target.matches('.wallet-connect')) {
        e.preventDefault();
        if (this.isConnected) {
          this.disconnectWallet();
        } else {
          this.connectWallet();
        }
      }

      // Mobile menu toggle
      if (e.target.matches('.mobile-menu-toggle') || e.target.closest('.mobile-menu-toggle')) {
        this.toggleMobileMenu();
      }

      // Buy buttons
      if (e.target.matches('.buy-button')) {
        this.smoothScrollTo('buy');
      }

      // Learn more buttons
      if (e.target.matches('.learn-more-button')) {
        this.smoothScrollTo('about');
      }

      // DEX links
      if (e.target.matches('.dex-link')) {
        const url = e.target.getAttribute('data-url');
        if (url) {
          window.open(url, '_blank', 'noopener,noreferrer');
        }
      }

      // Social links
      if (e.target.matches('.social-link')) {
        const url = e.target.getAttribute('data-url');
        if (url) {
          window.open(url, '_blank', 'noopener,noreferrer');
        }
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
    const menuIcon = document.querySelector('.mobile-menu-icon');
    
    if (mobileMenu) {
      if (this.mobileMenuOpen) {
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden';
      } else {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    }

    if (menuIcon) {
      menuIcon.classList.toggle('open', this.mobileMenuOpen);
    }
  }

  // Newsletter Subscription
  async handleNewsletterSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const email = form.querySelector('input[type="email"]').value;
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
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }
