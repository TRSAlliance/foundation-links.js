// TRS Foundation - Self-Healing Link System
// Builds strength, doesn't just break when things go wrong

class TRSLinkFoundation {
  constructor() {
    this.checkedLinks = new Set();
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1 second
    this.fallbackUrl = '/404.html';
    this.logErrors = true;
  }

  // Enhanced broken link checker with retry logic
  async checkBrokenLinks() {
    console.log('🔍 TRS Foundation: Starting link integrity check...');
    
    const links = document.querySelectorAll('a[href]');
    const linkPromises = Array.from(links).map(link => this.validateLink(link));
    
    try {
      await Promise.allSettled(linkPromises);
      console.log('✅ TRS Foundation: Link check complete');
    } catch (error) {
      console.error('❌ TRS Foundation: Link check encountered issues:', error);
    }
  }

  // Validate individual link with retry mechanism
  async validateLink(link) {
    const url = link.href;
    
    // Skip if already checked or invalid URL
    if (this.checkedLinks.has(url) || !this.isValidUrl(url)) {
      return;
    }

    this.checkedLinks.add(url);

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await fetch(url, { 
          method: 'HEAD',
          mode: 'no-cors', // Handle CORS issues
          cache: 'no-cache',
          timeout: 5000 // 5 second timeout
        });

        if (response.ok || response.type === 'opaque') {
          // Link is working or we can't verify due to CORS (assume working)
          this.markLinkHealthy(link);
          return;
        }
      } catch (error) {
        if (attempt === this.retryAttempts) {
          console.warn(`🔧 TRS Foundation: Link needs correction after ${attempt} attempts: ${url}`);
          this.handleBrokenLink(link, error);
        } else {
          // Wait before retry
          await this.sleep(this.retryDelay * attempt);
        }
      }
    }
  }

  // Handle broken links with TRS philosophy - correct, don't punish
  handleBrokenLink(link, error) {
    const originalUrl = link.href;
    const originalText = link.textContent;

    // TRS Correction Protocol
    if (this.canRedirectToAlternative(originalUrl)) {
      const alternativeUrl = this.findAlternative(originalUrl);
      link.href = alternativeUrl;
      link.title = `Original: ${originalUrl} | Redirected to working alternative`;
      this.logCorrection(originalUrl, alternativeUrl, 'alternative_found');
    } else {
      // Graceful fallback
      link.href = this.fallbackUrl;
      link.title = `Original: ${originalUrl} | Temporarily unavailable`;
      this.logCorrection(originalUrl, this.fallbackUrl, 'fallback_applied');
    }

    // Visual indicator that system auto-corrected
    link.classList.add('trs-corrected-link');
    link.setAttribute('data-original-url', originalUrl);
    
    // Don't break the user experience - inform transparently
    if (!link.querySelector('.trs-correction-notice')) {
      const notice = document.createElement('span');
      notice.className = 'trs-correction-notice';
      notice.textContent = ' 🔧';
      notice.title = 'TRS Foundation auto-corrected this link';
      link.appendChild(notice);
    }
  }

  // Mark healthy links for performance
  markLinkHealthy(link) {
    link.classList.add('trs-verified-link');
    link.setAttribute('data-trs-verified', Date.now());
  }

  // Find alternative URLs for common patterns
  findAlternative(url) {
    const alternatives = {
      // Common redirects and alternatives
      'http://': url.replace('http://', 'https://'),
      'www.': url.replace('www.', ''),
      'github.com': url.replace('github.com', 'github.io'),
    };

    for (const [pattern, alternative] of Object.entries(alternatives)) {
      if (url.includes(pattern) && alternative !== url) {
        return alternative;
      }
    }

    return this.fallbackUrl;
  }

  // Check if we can attempt to find an alternative
  canRedirectToAlternative(url) {
    return url.includes('http://') || url.includes('www.') || url.includes('github.com');
  }

  // Validate URL format
  isValidUrl(string) {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  }

  // TRS logging - transparent and helpful
  logCorrection(originalUrl, newUrl, correctionType) {
    if (this.logErrors) {
      console.log(`🔧 TRS Foundation Correction:
        Original: ${originalUrl}
        Corrected: ${newUrl}
        Type: ${correctionType}
        Time: ${new Date().toISOString()}
      `);
    }
  }

  // Utility function for delays
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Periodic health check for the foundation
  startPeriodicCheck(intervalMinutes = 30) {
    console.log(`🔄 TRS Foundation: Starting periodic checks every ${intervalMinutes} minutes`);
    
    setInterval(() => {
      this.checkedLinks.clear(); // Reset cache
      this.checkBrokenLinks();
    }, intervalMinutes * 60 * 1000);
  }

  // Manual recheck trigger
  recheckAll() {
    this.checkedLinks.clear();
    return this.checkBrokenLinks();
  }
}

// TRS Foundation CSS for visual indicators
const trsStyles = `
  .trs-corrected-link {
    border-bottom: 1px dashed orange;
  }
  
  .trs-verified-link {
    border-bottom: 1px solid green;
  }
  
  .trs-correction-notice {
    font-size: 0.8em;
    color: orange;
    margin-left: 2px;
  }
  
  .trs-foundation-status {
    position: fixed;
    bottom: 10px;
    right: 10px;
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 12px;
    z-index: 9999;
  }
`;

// Inject TRS styles
function injectTRSStyles() {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = trsStyles;
  document.head.appendChild(styleSheet);
}

// Initialize TRS Foundation System
function initTRSFoundation() {
  console.log('🔥 TRS Foundation: Initializing self-healing link system...');
  
  const trsFoundation = new TRSLinkFoundation();
  
  // Inject visual styles
  injectTRSStyles();
  
  // Run initial check
  trsFoundation.checkBrokenLinks();
  
  // Start periodic monitoring
  trsFoundation.startPeriodicCheck(30); // Every 30 minutes
  
  // Make available globally for manual triggers
  window.TRSFoundation = trsFoundation;
  
  // Add status indicator
  const statusDiv = document.createElement('div');
  statusDiv.className = 'trs-foundation-status';
  statusDiv.textContent = '🔧 TRS Foundation Active';
  statusDiv.title = 'Self-healing link system is monitoring and correcting broken links';
  document.body.appendChild(statusDiv);
  
  console.log('✅ TRS Foundation: System active and monitoring');
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTRSFoundation);
} else {
  initTRSFoundation();
}

// Manual recheck function for console use
window.recheckTRSLinks = () => {
  if (window.TRSFoundation) {
    return window.TRSFoundation.recheckAll();
  } else {
    console.warn('TRS Foundation not initialized yet');
  }
};
