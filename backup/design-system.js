/* Master Design System JS - Interactive Functions
   Handles: Theme Toggle, Dropdowns, Multi-selects, Modals, Drawers, Tabs, Accordions, Toasts, AI Chat, Uploads
*/

document.addEventListener('DOMContentLoaded', () => {
  // --- Persistent Selected Video ID Navigation URL Sync ---
  const urlParams = new URLSearchParams(window.location.search);
  const selectedId = urlParams.get('id');
  if (selectedId) {
    document.querySelectorAll('a.sidebar-nav-item, .dashboard-sidebar a, a[href$=".html"]').forEach(a => {
      const href = a.getAttribute('href');
      if (href && href.includes('.html') && !href.startsWith('http') && !href.startsWith('//')) {
        try {
          const url = new URL(href, window.location.origin);
          url.searchParams.set('id', selectedId);
          a.setAttribute('href', url.pathname + url.search);
        } catch (e) {
          if (href.includes('?')) {
            a.setAttribute('href', href + '&id=' + encodeURIComponent(selectedId));
          } else {
            a.setAttribute('href', href + '?id=' + encodeURIComponent(selectedId));
          }
        }
      }
    });
  }

  // --- KONTAGI Global State Sync (localStorage) ---
  
  // 1. Theme Synchronization
  const savedTheme = localStorage.getItem('kontagi-theme') || 'dark';
  if (savedTheme === 'light') {
    document.body.classList.remove('dark');
  } else {
    document.body.classList.add('dark');
  }

  let themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    // Clone themeToggle to strip any inline duplicate click listeners
    const clonedToggle = themeToggle.cloneNode(true);
    themeToggle.parentNode.replaceChild(clonedToggle, themeToggle);
    themeToggle = clonedToggle;

    const updateThemeToggleUI = (isDark) => {
      themeToggle.innerHTML = isDark ? 
        `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 5a7 7 0 100 14 7 7 0 000-14z"/></svg> Light Mode` :
        `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg> Dark Mode`;
    };
    updateThemeToggleUI(document.body.classList.contains('dark'));

    themeToggle.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark');
      localStorage.setItem('kontagi-theme', isDark ? 'dark' : 'light');
      updateThemeToggleUI(isDark);
      
      // Sync theme card classes if on settings.html
      const themeCardLight = document.getElementById('theme-card-light');
      const themeCardDark = document.getElementById('theme-card-dark');
      if (themeCardLight && themeCardDark) {
        themeCardLight.classList.toggle('active', !isDark);
        themeCardDark.classList.toggle('active', isDark);
      }

      if (typeof window.showToast === 'function') {
        window.showToast(isDark ? "Switched to Space Dark mode." : "Switched to Clean Light mode.", "success");
      }
    });
  }

  // 2. Active Workspace Synchronization
  const activeWS = localStorage.getItem('kontagi-active-workspace') || 'pulse_energy';
  const workspaceSelect = document.getElementById('workspace-dropdown-select');
  if (workspaceSelect) {
    workspaceSelect.value = activeWS;
    // Call page-specific switchWorkspaceBrand on initial load to match dropdown selection
    setTimeout(() => {
      if (typeof window.switchWorkspaceBrand === 'function') {
        window.switchWorkspaceBrand(activeWS);
      }
    }, 50);

    workspaceSelect.addEventListener('change', (e) => {
      localStorage.setItem('kontagi-active-workspace', e.target.value);
      if (typeof window.switchWorkspaceBrand === 'function') {
        window.switchWorkspaceBrand(e.target.value);
      }
    });
  }

  // 3. User Profile Synchronization (Sidebar Footer)
  const savedProfileName = localStorage.getItem('kontagi-profile-name') || 'Jaiveer Hastar';
  const savedProfileEmail = localStorage.getItem('kontagi-profile-email') || 'jaiveer@company.com';
  const savedProfileInitials = localStorage.getItem('kontagi-profile-initials') || 'JH';
  const savedProfileAvatarBg = localStorage.getItem('kontagi-profile-avatar-bg') || '';

  const updateSidebarFooters = () => {
    const sidebarFooters = document.querySelectorAll('.sidebar-footer');
    sidebarFooters.forEach(footer => {
      const avatarEl = footer.querySelector('.avatar');
      const nameEl = footer.querySelector('.text-body-small');
      const emailEl = footer.querySelector('.text-detail');
      if (avatarEl) {
        avatarEl.innerText = savedProfileInitials;
        if (savedProfileAvatarBg) {
          avatarEl.style.background = savedProfileAvatarBg;
        } else {
          avatarEl.style.background = '';
        }
      }
      if (nameEl) nameEl.innerText = savedProfileName;
      if (emailEl) emailEl.innerText = savedProfileEmail;
    });
  };
  updateSidebarFooters();

  window.syncGlobalProfile = function(name, email, initials, avatarBg) {
    if (name) localStorage.setItem('kontagi-profile-name', name);
    if (email) localStorage.setItem('kontagi-profile-email', email);
    if (initials) localStorage.setItem('kontagi-profile-initials', initials);
    if (avatarBg !== undefined) localStorage.setItem('kontagi-profile-avatar-bg', avatarBg);
    
    updateSidebarFooters();
  };

  // 4. Border Radius Synchronization
  const savedRadius = localStorage.getItem('kontagi-border-radius');
  if (savedRadius) {
    document.documentElement.style.setProperty('--radius-lg', `${savedRadius}px`);
    document.documentElement.style.setProperty('--radius-xl', `${parseFloat(savedRadius) + 4}px`);
    const viewportFrame = document.getElementById('viewport-frame');
    if (viewportFrame) {
      viewportFrame.style.setProperty('--radius-lg', `${savedRadius}px`);
      viewportFrame.style.setProperty('--radius-xl', `${parseFloat(savedRadius) + 4}px`);
    }
  }


  // 2. Dropdown Menus
  const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
  dropdownTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const menuId = trigger.getAttribute('data-dropdown');
      const menu = document.getElementById(menuId);
      
      // Close other menus first
      document.querySelectorAll('.dropdown-menu').forEach(m => {
        if (m !== menu) m.classList.remove('active');
      });

      if (menu) menu.classList.toggle('active');
    });
  });

  // Close dropdowns on outside click
  window.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
      menu.classList.remove('active');
    });
  });

  // 3. Multi-Select Tags
  const multiselect = document.querySelector('.multiselect-container');
  if (multiselect) {
    const inputField = multiselect.querySelector('input');
    
    // Listen for Enter key to append badges
    inputField.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && inputField.value.trim() !== '') {
        e.preventDefault();
        const badgeVal = inputField.value.trim();
        createBadge(badgeVal);
        inputField.value = '';
      }
    });

    function createBadge(text) {
      const badge = document.createElement('div');
      badge.className = 'multiselect-badge';
      badge.innerHTML = `${text}<span class="multiselect-badge-remove">&times;</span>`;
      
      badge.querySelector('.multiselect-badge-remove').addEventListener('click', (e) => {
        e.stopPropagation();
        badge.remove();
      });

      // Insert before input field
      multiselect.insertBefore(badge, inputField);
    }
  }

  // 4. Modal Triggers
  const openModalBtns = document.querySelectorAll('[data-modal-target]');
  openModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal-target');
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeModalBtns = document.querySelectorAll('.modal-close, [data-modal-close]');
  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Close modal on click overlay
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // 5. Drawer Triggers
  const openDrawerBtns = document.querySelectorAll('[data-drawer-target]');
  openDrawerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const drawerId = btn.getAttribute('data-drawer-target');
      const drawer = document.getElementById(drawerId);
      if (drawer) {
        drawer.classList.add('active');
      }
    });
  });

  const closeDrawerBtns = document.querySelectorAll('[data-drawer-close]');
  closeDrawerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const drawer = btn.closest('.drawer');
      if (drawer) {
        drawer.classList.remove('active');
      }
    });
  });

  // 6. Tabs Controller
  const tabContainers = document.querySelectorAll('.tabs-container');
  tabContainers.forEach(container => {
    const tabButtons = container.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const targetGroup = btn.getAttribute('data-tab-group');
        const targetPanel = btn.getAttribute('data-tab-target');
        
        if (targetGroup) {
          const panels = document.querySelectorAll(`[data-tab-panel-group="${targetGroup}"]`);
          panels.forEach(p => p.style.display = 'none');
          const activePanel = document.getElementById(targetPanel);
          if (activePanel) activePanel.style.display = 'block';
        }
      });
    });
  });

  // 7. Accordions Controller
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close sibling items
      const parent = item.closest('.accordion');
      if (parent) {
        parent.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
      }

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 8. Dynamic Toast Trigger System
  window.showToast = function(message, type = 'success') {
    let container = document.getElementById('global-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'global-toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Choose status icon
    let icon = '';
    if (type === 'success') {
      icon = `<svg width="18" height="18" fill="none" stroke="var(--accent-green)" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" class="success-draw" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
      if (typeof window.triggerConfetti === 'function') {
        window.triggerConfetti();
      }
    } else if (type === 'error') {
      icon = `<svg width="18" height="18" fill="none" stroke="var(--accent-red)" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
      document.body.classList.add('error-shake');
      setTimeout(() => document.body.classList.remove('error-shake'), 500);
    } else {
      icon = `<svg width="18" height="18" fill="none" stroke="var(--accent-blue)" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
    }

    toast.innerHTML = `
      ${icon}
      <span class="text-body-small font-medium">${message}</span>
      <button class="modal-close" style="margin-left: auto; color: var(--text-secondary); cursor: pointer;" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(toast);
    
    // Animate removal
    setTimeout(() => {
      toast.style.transition = 'opacity 500ms, transform 500ms';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-20px)';
      setTimeout(() => toast.remove(), 500);
    }, 4000);
  };

  // 9. Drag & Drop File Upload Handler
  const dropzone = document.getElementById('upload-dropzone');
  if (dropzone) {
    const fileInput = document.getElementById('dropzone-file-input');
    const previewGrid = document.getElementById('upload-preview-grid');

    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = 'var(--brand-primary)';
      dropzone.style.backgroundColor = 'var(--bg-primary)';
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.style.borderColor = 'var(--border-default)';
      dropzone.style.backgroundColor = 'var(--bg-secondary)';
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = 'var(--border-default)';
      dropzone.style.backgroundColor = 'var(--bg-secondary)';
      if (e.dataTransfer.files.length) {
        handleFiles(e.dataTransfer.files);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length) {
        handleFiles(fileInput.files);
      }
    });

    function handleFiles(files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const isImage = file.type.startsWith('image/');
          const isVideo = file.type.startsWith('video/');
          
          const card = document.createElement('div');
          card.className = 'preview-card';
          
          if (isImage) {
            card.innerHTML = `
              <img src="${e.target.result}" alt="${file.name}">
              <div class="preview-overlay">
                <button class="btn btn-sm btn-ghost text-inverse" onclick="this.closest('.preview-card').remove()">Remove</button>
              </div>
            `;
          } else if (isVideo) {
            card.innerHTML = `
              <video src="${e.target.result}" muted autoplay loop></video>
              <div class="preview-overlay">
                <button class="btn btn-sm btn-ghost text-inverse" onclick="this.closest('.preview-card').remove()">Remove</button>
              </div>
            `;
          } else {
            card.innerHTML = `
              <div class="flex-center" style="height: 100%; flex-direction: column; padding: 12px; text-align: center;">
                <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="margin-bottom: 8px;"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                <span class="text-detail font-medium" style="word-break: break-all;">${file.name}</span>
              </div>
              <div class="preview-overlay">
                <button class="btn btn-sm btn-ghost text-inverse" onclick="this.closest('.preview-card').remove()">Remove</button>
              </div>
            `;
          }
          previewGrid.appendChild(card);
        };
        reader.readAsDataURL(file);
      });
      window.showToast(`Successfully uploaded ${files.length} file(s).`);
    }
  }

  // 10. AI Chat mock answers
  const chatForm = document.getElementById('ai-chat-form');
  const chatInput = document.getElementById('ai-chat-input');
  const chatMessages = document.getElementById('ai-chat-messages');

  if (chatForm && chatInput && chatMessages) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = chatInput.value.trim();
      if (!val) return;

      // Append User message
      appendMessage(val, 'user');
      chatInput.value = '';

      // Mock AI thinking status
      const thinkingIndicator = document.createElement('div');
      thinkingIndicator.className = 'ai-status-indicator m-sm';
      thinkingIndicator.id = 'ai-thinking';
      thinkingIndicator.innerHTML = `<span class="ai-status-pulse"></span> Analyzing query context...`;
      chatMessages.appendChild(thinkingIndicator);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      setTimeout(() => {
        thinkingIndicator.remove();
        
        let reply = '';
        if (val.toLowerCase().includes('help')) {
          reply = `Sure! I'm here to assist you with the design system components. You can preview buttons, forms, tables, grids, and overlay panels. Let me know what you need help with.`;
        } else if (val.toLowerCase().includes('color')) {
          reply = `The design system uses a curated palette consisting of a primary Indigo (#5850EC in light, #6366F1 in dark), semantic colors for green (success), red (error), orange (warning), and slate grays for structural borders and text hierarchies.`;
        } else {
          reply = `I have received your request: "${val}". As the Lead AI Assistant, I can confirm that this matches the design tokens defined in our global CSS. The components are live and interactive.`;
        }
        
        appendMessage(reply, 'ai');
      }, 1200);
    });

    function appendMessage(text, role) {
      const msg = document.createElement('div');
      msg.className = `chat-msg chat-msg-${role} animate-fade-in`;
      
      const avatarSrc = role === 'ai' ? 
        `<div class="chat-msg-avatar flex-center"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 21m0 0l-.813-5.096L3 15.094l5.096-.813L9 9.187l.813 5.094 5.096.813-5.096.813zM19.071 4.929l-1.414 1.414m0-1.414l1.414 1.414M12 3v1m0 16v1M3 12h1m16 0h1m-1.586-7.586l-1.414 1.414"/></svg></div>` :
        `<div class="chat-msg-avatar flex-center" style="background-color: var(--bg-tertiary); color: var(--text-primary);">U</div>`;
        
      msg.innerHTML = `
        ${avatarSrc}
        <div class="chat-msg-content">
          ${text}
        </div>
      `;
      chatMessages.appendChild(msg);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  // 11. Skeleton Switcher (Demo visual toggle)
  const skeletonToggleBtn = document.getElementById('skeleton-demo-toggle');
  if (skeletonToggleBtn) {
    let skeletonsActive = false;
    skeletonToggleBtn.addEventListener('click', () => {
      skeletonsActive = !skeletonsActive;
      const cardsToToggle = document.querySelectorAll('[data-skeleton-demo]');
      
      cardsToToggle.forEach(card => {
        const skeletonEl = card.querySelector('.skeleton-placeholder-view');
        const contentEl = card.querySelector('.real-content-view');
        
        if (skeletonsActive) {
          skeletonEl.style.display = 'block';
          contentEl.style.display = 'none';
        } else {
          skeletonEl.style.display = 'none';
          contentEl.style.display = 'block';
        }
      });

      skeletonToggleBtn.innerText = skeletonsActive ? "Show Content" : "Show Skeletons";
      window.showToast(skeletonsActive ? "Skeleton Loader State Activated" : "Real Content Display Activated");
    });
  }

  // --- PREMIUM CORE ANIMATION SUITE ---

  // 1. Dynamic Card Spotlights & Mouse Hover Tracker (VisionOS Style)
  const initCardSpotlights = () => {
    const cards = document.querySelectorAll('.card, .glass-panel, .pricing-card, .team-card, .metric-card');
    cards.forEach(card => {
      // Set styles for relative positioning
      card.style.position = 'relative';
      card.style.overflow = 'hidden';

      // Inject spotlight container if not already present
      if (!card.querySelector('.card-spotlight')) {
        const spotlight = document.createElement('div');
        spotlight.className = 'card-spotlight';
        card.insertBefore(spotlight, card.firstChild);
      }
      
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  };
  initCardSpotlights();

  // Re-run spotlight setup after page mutations
  const observer = new MutationObserver(() => initCardSpotlights());
  observer.observe(document.body, { childList: true, subtree: true });

  // 2. Buttons Active Spring & Ripple Feedback (Linear Style)
  const buttons = document.querySelectorAll('.btn, .sidebar-nav-item, .mobile-nav-btn, .tab-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple';
      
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      const existing = btn.querySelector('.btn-ripple');
      if (existing) existing.remove();
      
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // 3. Counter Elements Animate Count-up
  const animateCounters = () => {
    // Select all potential count target labels (metric values, numbers, totals)
    const targets = document.querySelectorAll(
      '.text-display-md, .text-display-lg, .text-display-xl, .metric-value, .score-circle-container .flex-center, .card .text-gradient, .stat-value'
    );
    targets.forEach(el => {
      const text = el.innerText.trim();
      const match = text.match(/^([\d,]+(?:\.\d+)?)(%|ms|k|m|kb|gb|x|s)?$/i);
      if (match) {
        // Parse original raw value
        const rawValue = parseFloat(match[1].replace(/,/g, ''));
        const suffix = match[2] || '';
        const duration = 1500; // time in ms
        const startTime = performance.now();
        
        el.classList.add('count-up-active');
        
        const updateCounter = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Cubic easeOut for elegant spring decelerations
          const easeProgress = 1 - Math.pow(1 - progress, 4);
          const currentValue = easeProgress * rawValue;
          
          if (text.includes('.')) {
            el.innerText = currentValue.toFixed(1) + suffix;
          } else {
            el.innerText = Math.floor(currentValue).toLocaleString() + suffix;
          }
          
          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.innerText = text;
            setTimeout(() => el.classList.remove('count-up-active'), 500);
          }
        };
        requestAnimationFrame(updateCounter);
      }
    });
  };
  setTimeout(animateCounters, 200);

  // 4. Confetti Canvas Particle System (Apple Style Success Explosion)
  window.triggerConfetti = function() {
    let canvas = document.getElementById('confetti-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'confetti-canvas';
      document.body.appendChild(canvas);
    }
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#6366F1', '#A78BFA', '#34D399', '#3B82F6', '#FBBF24', '#F87171'];
    const particles = [];

    // Create 150 high fidelity confetti particles
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 60,
        y: canvas.height + 20,
        radius: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 22,
        vy: -Math.random() * 18 - 14,
        gravity: 0.4,
        opacity: 1,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;

      particles.forEach(p => {
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.opacity -= 0.009;
        p.rotation += p.rotationSpeed;

        if (p.opacity > 0 && p.y < canvas.height + 20) {
          active = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          
          if (p.radius > 7) {
            ctx.fillRect(-p.radius, -p.radius, p.radius * 2, p.radius * 1.3);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      });

      if (active) {
        requestAnimationFrame(animate);
      } else {
        canvas.remove();
      }
    };

    requestAnimationFrame(animate);
  };

  // 5. SVG Path Trend redraw setup
  const trendPaths = document.querySelectorAll('.svg-trend-path, svg path[stroke^="var(--accent"]');
  trendPaths.forEach(path => {
    path.classList.add('svg-trend-path');
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    path.getBoundingClientRect(); // trigger layout reflow
    path.style.animation = 'drawChartPath 2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards';
  });
});
