/**
 * Class Bunker - Core Application Controller
 * Handles UI interactions, view transitions, onboarding wizard, live calculators,
 * modal dialogs, and instant reactive state synchronization.
 */

(function () {
  'use strict';

  // Instantiate Store and reference Engine
  var store = new ClassBunkerStore();
  var engine = AttendanceEngine;

  // App State Variables
  var activeView = 'landing';
  var subjectFilter = 'all'; // 'all' | 'safe' | 'warning' | 'below'
  var editingSubjectId = null;
  var currentWizardStep = 1;

  // Simulator State
  var simTargetSubjectId = 'overall'; // 'overall' or subject id
  var simMode = 'miss'; // 'miss' or 'attend'
  var simCount = 1;

  // Recovery Calculator State
  var recoverySubjectId = 'overall';
  var recoveryTargetPct = 75;

  // Target Matrix State
  var matrixSubjectId = 'overall';

  // DOM Elements Cache
  var dom = {};

  function initDomElements() {
    dom.views = {
      landing: document.getElementById('view-landing'),
      dashboard: document.getElementById('view-dashboard'),
      subjects: document.getElementById('view-subjects'),
      simulator: document.getElementById('view-simulator'),
      calculator: document.getElementById('view-calculator'),
      settings: document.getElementById('view-settings')
    };

    dom.navLinks = document.querySelectorAll('.nav-link, .mobile-nav-btn');
    dom.themeToggleBtn = document.getElementById('theme-toggle-btn');
    dom.themeIcon = document.getElementById('theme-icon');

    // Modals
    dom.onboardingModal = document.getElementById('modal-onboarding');
    dom.subjectModal = document.getElementById('modal-subject');
    dom.collegeModal = document.getElementById('modal-college');

    // Forms
    dom.subjectForm = document.getElementById('form-subject');
    dom.collegeForm = document.getElementById('form-college');

    // Containers
    dom.dashboardBunkHero = document.getElementById('dashboard-bunk-hero');
    dom.dashboardStats = document.getElementById('dashboard-stats');
    dom.dashboardSubjectsList = document.getElementById('dashboard-subjects-list');
    dom.subjectsGrid = document.getElementById('subjects-grid');
    dom.subjectsTableBody = document.getElementById('subjects-table-body');
    dom.collegeInfoStrip = document.getElementById('college-info-strip');

    // Simulator Elements
    dom.simSubjectSelect = document.getElementById('sim-subject-select');
    dom.simCountInput = document.getElementById('sim-count-input');
    dom.simResultBox = document.getElementById('sim-result-box');

    // Recovery Elements
    dom.recoverySubjectSelect = document.getElementById('recovery-subject-select');
    dom.recoveryTargetSelect = document.getElementById('recovery-target-select');
    dom.recoveryCustomInput = document.getElementById('recovery-custom-input');
    dom.recoveryResultBanner = document.getElementById('recovery-result-banner');
    dom.recoveryMilestonesGrid = document.getElementById('recovery-milestones-grid');

    // Target Matrix Elements
    dom.matrixSubjectSelect = document.getElementById('matrix-subject-select');
    dom.targetMatrixGrid = document.getElementById('target-matrix-grid');

    // Settings Inputs
    dom.settingMinAttendance = document.getElementById('setting-min-attendance');
    dom.settingLabAttendance = document.getElementById('setting-lab-attendance');
    dom.settingCondonationNotes = document.getElementById('setting-condonation-notes');
    dom.settingCollegeName = document.getElementById('setting-college-name');
    dom.settingCollegeAbbr = document.getElementById('setting-college-abbr');
    dom.settingCourse = document.getElementById('setting-course');
    dom.settingBranch = document.getElementById('setting-branch');
    dom.settingSemester = document.getElementById('setting-semester');

    // File Inputs
    dom.jsonFileInput = document.getElementById('json-file-input');
    dom.toastContainer = document.getElementById('toast-container');
  }

  // Toast Notification System
  function showToast(message, type) {
    if (!dom.toastContainer) return;
    var toast = document.createElement('div');
    toast.className = 'toast';
    var icon = type === 'error' ? '❌' : (type === 'success' ? '✅' : 'ℹ️');
    toast.innerHTML = '<span>' + icon + '</span><span>' + message + '</span>';
    dom.toastContainer.appendChild(toast);

    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 3200);
  }

  // Theme Management
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (dom.themeIcon) {
      dom.themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    }
  }

  function toggleTheme() {
    var current = store.getSettings().theme || 'dark';
    var next = current === 'dark' ? 'light' : 'dark';
    store.updateSettings({ theme: next });
    applyTheme(next);
    showToast('Switched to ' + next + ' mode');
  }

  // View Navigation
  function navigateTo(viewName) {
    if (!dom.views[viewName]) return;

    activeView = viewName;
    Object.keys(dom.views).forEach(function (key) {
      if (dom.views[key]) {
        if (key === viewName) {
          dom.views[key].classList.add('active');
        } else {
          dom.views[key].classList.remove('active');
        }
      }
    });

    // Update Nav buttons
    dom.navLinks.forEach(function (btn) {
      var target = btn.getAttribute('data-view');
      if (target === viewName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Refresh view specific components
    if (viewName === 'dashboard') {
      renderDashboard();
    } else if (viewName === 'subjects') {
      renderSubjectsView();
    } else if (viewName === 'simulator') {
      populateSubjectDropdowns();
      runSimulation();
    } else if (viewName === 'calculator') {
      populateSubjectDropdowns();
      runRecoveryCalculator();
      renderTargetMatrix();
    } else if (viewName === 'settings') {
      renderSettingsView();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Render College Info Strip
  function renderCollegeStrip() {
    if (!dom.collegeInfoStrip) return;
    var college = store.getCollege();
    var rule = store.getRule();

    var nameStr = college.name ? (college.abbreviation ? college.abbreviation + ' (' + college.name + ')' : college.name) : 'Universal College Setup';
    var courseStr = [college.course, college.branch, college.semester].filter(Boolean).join(' • ');

    dom.collegeInfoStrip.innerHTML = 
      '<div class="college-details">' +
        '<span class="college-pill">🏛️ ' + escapeHtml(nameStr) + '</span>' +
        (courseStr ? '<span class="college-pill">🎓 ' + escapeHtml(courseStr) + '</span>' : '') +
        '<span class="college-pill">🎯 Min Required: <strong>' + (rule.minPercentage || 75) + '%</strong></span>' +
      '</div>' +
      '<div>' +
        '<button class="btn btn-secondary btn-sm" id="btn-quick-edit-college">Edit College Rules</button>' +
      '</div>';

    var editBtn = document.getElementById('btn-quick-edit-college');
    if (editBtn) {
      editBtn.addEventListener('click', function () {
        openCollegeModal();
      });
    }
  }

  // Render Main Dashboard (#3, #14, #15, #17)
  function renderDashboard() {
    renderCollegeStrip();

    var subjects = store.getSubjects();
    var rule = store.getRule();
    var defaultReq = rule.minPercentage || 75;
    var overall = engine.calculateOverall(subjects, defaultReq);

    // Primary Prominent Answer Card (#14)
    var heroHtml = '';
    if (!overall.hasSubjects) {
      heroHtml = 
        '<div class="hero-question-title"><span>❓</span> How many classes can I miss?</div>' +
        '<div class="hero-answer-main">0 SUBJECTS ADDED</div>' +
        '<div class="hero-answer-subtitle">Add your semester subjects to start tracking safe bunks and eligibility.</div>' +
        '<div style="margin-top: 1rem; display: flex; gap: 0.75rem; flex-wrap: wrap;">' +
          '<button class="btn btn-primary" id="hero-btn-add-subject">+ Add Your First Subject</button>' +
          '<button class="btn btn-secondary" id="hero-btn-load-demo">Try DSATM Demo</button>' +
        '</div>';
      dom.dashboardBunkHero.className = 'bunk-hero-card';
    } else if (overall.overallPercentage < overall.requiredPercentage) {
      // Below Requirement state
      heroHtml = 
        '<div class="hero-question-title"><span>⚠️</span> Primary Attendance Status</div>' +
        '<div class="hero-answer-main text-danger">BELOW REQUIREMENT</div>' +
        '<div class="hero-answer-subtitle">You are below your ' + overall.requiredPercentage + '% requirement. <strong>Attend ' + (overall.recoveryClasses === Infinity ? 'maximum' : overall.recoveryClasses) + ' consecutive classes</strong> without missing any to reach eligibility.</div>' +
        '<div style="display:flex; align-items:center; gap: 0.75rem; flex-wrap:wrap;">' +
          '<span class="hero-pill-badge below">🔴 ' + overall.status.badge + ' (' + overall.overallPercentage + '%)</span>' +
          '<button class="btn btn-secondary btn-sm" id="hero-btn-view-recovery">View Recovery Plan &rarr;</button>' +
        '</div>';
      dom.dashboardBunkHero.className = 'bunk-hero-card below';
    } else {
      // Safe or Warning State
      var isWarning = overall.status.status === 'warning';
      var cardClass = isWarning ? 'warning' : 'safe';
      var badgeClass = isWarning ? 'warning' : 'safe';
      var badgeIcon = isWarning ? '🟡' : '🟢';

      heroHtml = 
        '<div class="hero-question-title"><span>🎯</span> How many classes can I safely miss?</div>' +
        '<div class="hero-answer-main ' + (isWarning ? 'text-warning' : 'text-safe') + '">' +
          overall.safeBunks + ' ' + (overall.safeBunks === 1 ? 'CLASS' : 'CLASSES') +
        '</div>' +
        '<div class="hero-answer-subtitle">You will still remain at or above <strong>' + overall.requiredPercentage + '%</strong> attendance.</div>' +
        '<div style="display:flex; align-items:center; gap: 0.75rem; flex-wrap:wrap;">' +
          '<span class="hero-pill-badge ' + badgeClass + '">' + badgeIcon + ' ' + overall.status.badge + ' (' + overall.overallPercentage + '%)</span>' +
          (isWarning ? '<span style="font-size:0.85rem; color:var(--color-warning);">Near limit! Avoid missing classes without planning.</span>' : '') +
        '</div>';
      dom.dashboardBunkHero.className = 'bunk-hero-card ' + cardClass;
    }

    dom.dashboardBunkHero.innerHTML = heroHtml;

    // Attach hero button listeners
    var addBtn = document.getElementById('hero-btn-add-subject');
    if (addBtn) addBtn.addEventListener('click', function () { openSubjectModal(); });
    var demoBtn = document.getElementById('hero-btn-load-demo');
    if (demoBtn) demoBtn.addEventListener('click', function () { loadDemoDataAction(); });
    var recBtn = document.getElementById('hero-btn-view-recovery');
    if (recBtn) recBtn.addEventListener('click', function () { navigateTo('calculator'); });

    // Render Stats Grid
    var pctBarFillClass = overall.status.status === 'safe' ? 'safe' : (overall.status.status === 'warning' ? 'warning' : 'below');
    var barWidth = Math.min(100, Math.max(0, overall.overallPercentage));

    dom.dashboardStats.innerHTML = 
      '<div class="stat-card">' +
        '<div class="stat-card-header">' +
          '<span class="stat-label">Overall Attendance</span>' +
          '<span class="status-badge ' + overall.status.status + '">' + overall.status.icon + ' ' + overall.status.badge + '</span>' +
        '</div>' +
        '<div class="stat-value-large ' + (overall.status.status === 'safe' ? 'text-safe' : (overall.status.status === 'warning' ? 'text-warning' : 'text-danger')) + '">' +
          (overall.totalConducted === 0 ? '100%' : overall.overallPercentage + '%') +
        '</div>' +
        '<div class="progress-bar-container">' +
          '<div class="progress-bar-fill ' + pctBarFillClass + '" style="width: ' + barWidth + '%;"></div>' +
        '</div>' +
        '<div class="stat-subtext">' + overall.totalAttended + ' attended out of ' + overall.totalConducted + ' conducted classes</div>' +
      '</div>' +

      '<div class="stat-card">' +
        '<div class="stat-card-header">' +
          '<span class="stat-label">Requirement Target</span>' +
          '<button class="tool-icon-btn" id="btn-quick-adjust-req" title="Quick change requirement">⚙️ Adjust</button>' +
        '</div>' +
        '<div class="stat-value-large">' + overall.requiredPercentage + '%</div>' +
        '<div class="stat-subtext">' + 
          (overall.overallPercentage >= overall.requiredPercentage 
            ? '+' + (Math.round((overall.overallPercentage - overall.requiredPercentage) * 100) / 100) + '% buffer above threshold' 
            : '-' + (Math.round((overall.requiredPercentage - overall.overallPercentage) * 100) / 100) + '% deficit below threshold') +
        '</div>' +
      '</div>' +

      '<div class="stat-card">' +
        '<div class="stat-card-header">' +
          '<span class="stat-label">Subject Breakdown</span>' +
          '<span style="font-size:0.8rem; font-weight:700;">' + overall.subjectCount + ' Total</span>' +
        '</div>' +
        '<div style="display:flex; gap: 0.5rem; margin-top: 0.5rem;">' +
          '<div style="flex:1; background:var(--color-safe-bg); padding:0.5rem; border-radius:var(--radius-sm); text-align:center;">' +
            '<div style="font-size:1.25rem; font-weight:800; color:var(--color-safe);">' + overall.subjectsSafe + '</div>' +
            '<div style="font-size:0.7rem; color:var(--text-muted); font-weight:700;">SAFE</div>' +
          '</div>' +
          '<div style="flex:1; background:var(--color-warning-bg); padding:0.5rem; border-radius:var(--radius-sm); text-align:center;">' +
            '<div style="font-size:1.25rem; font-weight:800; color:var(--color-warning);">' + overall.subjectsWarning + '</div>' +
            '<div style="font-size:0.7rem; color:var(--text-muted); font-weight:700;">NEAR LIMIT</div>' +
          '</div>' +
          '<div style="flex:1; background:var(--color-danger-bg); padding:0.5rem; border-radius:var(--radius-sm); text-align:center;">' +
            '<div style="font-size:1.25rem; font-weight:800; color:var(--color-danger);">' + overall.subjectsBelow + '</div>' +
            '<div style="font-size:0.7rem; color:var(--text-muted); font-weight:700;">BELOW</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    var adjustReqBtn = document.getElementById('btn-quick-adjust-req');
    if (adjustReqBtn) {
      adjustReqBtn.addEventListener('click', function () {
        openCollegeModal();
      });
    }

    // Render Preview of Subjects on Dashboard
    renderDashboardSubjectList(overall.subjects);
  }

  function renderDashboardSubjectList(subjects) {
    if (!dom.dashboardSubjectsList) return;
    if (!subjects || subjects.length === 0) {
      dom.dashboardSubjectsList.innerHTML = 
        '<div class="empty-state">' +
          '<div class="empty-state-icon">📚</div>' +
          '<h3>No Subjects Added Yet</h3>' +
          '<p>Add your classes to see safe bunks, recovery targets, and overall semester status.</p>' +
          '<button class="btn btn-primary" id="btn-empty-add-subject">+ Add Subject</button>' +
        '</div>';
      var emptyAdd = document.getElementById('btn-empty-add-subject');
      if (emptyAdd) emptyAdd.addEventListener('click', function () { openSubjectModal(); });
      return;
    }

    var html = '<div class="subject-grid">';
    subjects.forEach(function (sub) {
      html += renderSubjectCardHtml(sub);
    });
    html += '</div>';

    dom.dashboardSubjectsList.innerHTML = html;
    attachSubjectCardListeners(dom.dashboardSubjectsList);
  }

  // Render Full Subjects View
  function renderSubjectsView() {
    var rawSubjects = store.getSubjects();
    var defaultReq = store.getRule().minPercentage || 75;
    var overall = engine.calculateOverall(rawSubjects, defaultReq);
    var subjects = overall.subjects || [];

    // Filter subjects
    var filtered = subjects.filter(function (s) {
      if (subjectFilter === 'all') return true;
      return s.status.status === subjectFilter;
    });

    if (filtered.length === 0) {
      dom.subjectsGrid.innerHTML = 
        '<div class="empty-state" style="grid-column: 1 / -1;">' +
          '<div class="empty-state-icon">🔍</div>' +
          '<h3>No Subjects Found</h3>' +
          '<p>' + (subjects.length === 0 ? 'You haven\'t added any subjects yet.' : 'No subjects match the selected "' + subjectFilter + '" filter.') + '</p>' +
          '<button class="btn btn-primary" id="btn-view-add-subject">+ Add Subject</button>' +
        '</div>';
      var viewAdd = document.getElementById('btn-view-add-subject');
      if (viewAdd) viewAdd.addEventListener('click', function () { openSubjectModal(); });
    } else {
      var gridHtml = '';
      filtered.forEach(function (sub) {
        gridHtml += renderSubjectCardHtml(sub);
      });
      dom.subjectsGrid.innerHTML = gridHtml;
      attachSubjectCardListeners(dom.subjectsGrid);
    }

    // Render Table View as well
    renderSubjectsTable(subjects, defaultReq);
  }

  function renderSubjectCardHtml(sub) {
    var statusClass = sub.status.status;
    var bunkBanner = '';

    if (sub.status.status === 'below') {
      bunkBanner = '<div class="bunk-status-text below">🔴 Below limit! Attend ' + sub.recoveryClasses + ' consecutive classes to reach ' + sub.required + '%.</div>';
    } else if (sub.status.status === 'warning') {
      bunkBanner = '<div class="bunk-status-text warning">🟡 Can miss ' + sub.safeBunks + ' class' + (sub.safeBunks === 1 ? '' : 'es') + ' (Near minimum ' + sub.required + '% limit)</div>';
    } else {
      bunkBanner = '<div class="bunk-status-text safe">🟢 Can safely miss ' + sub.safeBunks + ' class' + (sub.safeBunks === 1 ? '' : 'es') + ' & remain &ge; ' + sub.required + '%</div>';
    }

    return (
      '<div class="subject-card status-' + statusClass + '" data-id="' + sub.id + '">' +
        '<div>' +
          '<div class="subject-card-top">' +
            '<div>' +
              '<div class="subject-name">' + escapeHtml(sub.name) + '</div>' +
              (sub.code ? '<span class="subject-code">' + escapeHtml(sub.code) + '</span>' : '') +
            '</div>' +
            '<span class="status-badge ' + statusClass + '">' + sub.status.icon + ' ' + sub.status.badge + '</span>' +
          '</div>' +

          '<div class="subject-metrics-row">' +
            '<div class="subject-pct ' + (statusClass === 'safe' ? 'text-safe' : (statusClass === 'warning' ? 'text-warning' : 'text-danger')) + '">' +
              sub.percentage + '%' +
            '</div>' +
            '<div class="subject-counts">' +
              '<strong>' + sub.attended + '</strong> / ' + sub.conducted + ' attended' +
            '</div>' +
          '</div>' +

          '<div class="progress-bar-container">' +
            '<div class="progress-bar-fill ' + statusClass + '" style="width: ' + Math.min(100, sub.percentage) + '%;"></div>' +
          '</div>' +

          bunkBanner +
        '</div>' +

        '<div>' +
          '<div class="subject-quick-actions">' +
            '<button class="btn-stepper btn-stepper-attend" data-action="attend" data-id="' + sub.id + '" title="Mark class attended (+1 attended, +1 conducted)">+ Attended</button>' +
            '<button class="btn-stepper btn-stepper-miss" data-action="miss" data-id="' + sub.id + '" title="Mark class missed (+1 conducted only)">+ Missed</button>' +
          '</div>' +

          '<div class="subject-footer-tools">' +
            '<span>Req: ' + sub.required + '%</span>' +
            '<div class="icon-btn-group">' +
              '<button class="tool-icon-btn btn-undo-action" data-id="' + sub.id + '" title="Undo last attendance mark">↩️</button>' +
              '<button class="tool-icon-btn btn-edit-sub" data-id="' + sub.id + '" title="Edit subject">✏️</button>' +
              '<button class="tool-icon-btn btn-dup-sub" data-id="' + sub.id + '" title="Duplicate subject">📋</button>' +
              '<button class="tool-icon-btn btn-reset-sub" data-id="' + sub.id + '" title="Reset attendance to 0">🔄</button>' +
              '<button class="tool-icon-btn btn-del-sub" data-id="' + sub.id + '" title="Delete subject" style="color:var(--color-danger);">🗑️</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function attachSubjectCardListeners(container) {
    if (!container) return;

    // Fast Stepper Buttons
    container.querySelectorAll('.btn-stepper').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var id = this.getAttribute('data-id');
        var action = this.getAttribute('data-action');
        store.markAttendance(id, action);
        showToast(action === 'attend' ? 'Marked attended (+1)' : 'Marked missed (+1 conducted)', 'info');
      });
    });

    // Undo
    container.querySelectorAll('.btn-undo-action').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var id = this.getAttribute('data-id');
        // Try undo attend first if valid
        var sub = store.getSubject(id);
        if (sub && sub.conducted > 0) {
          if (sub.attended > 0 && confirm('Undo 1 attended class (removes 1 attended & 1 conducted)? Cancel to undo 1 missed class.')) {
            store.markAttendance(id, 'undo_attend');
            showToast('Undid 1 attended class');
          } else {
            store.markAttendance(id, 'undo_miss');
            showToast('Undid 1 missed class');
          }
        }
      });
    });

    // Edit
    container.querySelectorAll('.btn-edit-sub').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        openSubjectModal(this.getAttribute('data-id'));
      });
    });

    // Duplicate
    container.querySelectorAll('.btn-dup-sub').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var dup = store.duplicateSubject(this.getAttribute('data-id'));
        if (dup) showToast('Duplicated ' + dup.name, 'success');
      });
    });

    // Reset
    container.querySelectorAll('.btn-reset-sub').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var id = this.getAttribute('data-id');
        var sub = store.getSubject(id);
        if (sub && confirm('Reset attendance for "' + sub.name + '" to 0 attended and 0 conducted?')) {
          store.resetSubject(id);
          showToast('Attendance reset to 0');
        }
      });
    });

    // Delete
    container.querySelectorAll('.btn-del-sub').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var id = this.getAttribute('data-id');
        var sub = store.getSubject(id);
        if (sub && confirm('Are you sure you want to delete "' + sub.name + '"?')) {
          store.deleteSubject(id);
          showToast('Subject deleted', 'info');
        }
      });
    });
  }

  function renderSubjectsTable(subjects, defaultReq) {
    if (!dom.subjectsTableBody) return;
    if (subjects.length === 0) {
      dom.subjectsTableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:var(--text-muted); padding:2rem;">No subjects added yet.</td></tr>';
      return;
    }

    var html = '';
    subjects.forEach(function (sub) {
      var bunkText = sub.status.status === 'below' 
        ? '<span class="text-danger">0 (Need ' + sub.recoveryClasses + ' to recover)</span>' 
        : '<span class="text-safe">' + sub.safeBunks + '</span>';

      html += 
        '<tr>' +
          '<td><strong>' + escapeHtml(sub.name) + '</strong>' + (sub.code ? '<br><small class="text-muted font-mono">' + escapeHtml(sub.code) + '</small>' : '') + '</td>' +
          '<td>' + sub.attended + '</td>' +
          '<td>' + sub.conducted + '</td>' +
          '<td><strong class="' + (sub.status.status === 'safe' ? 'text-safe' : (sub.status.status === 'warning' ? 'text-warning' : 'text-danger')) + '">' + sub.percentage + '%</strong></td>' +
          '<td>' + sub.required + '%</td>' +
          '<td>' + bunkText + '</td>' +
          '<td><span class="status-badge ' + sub.status.status + '">' + sub.status.icon + ' ' + sub.status.badge + '</span></td>' +
        '</tr>';
    });

    dom.subjectsTableBody.innerHTML = html;
  }

  // Populate Dropdown for Simulator & Recovery Calculators
  function populateSubjectDropdowns() {
    var subjects = store.getSubjects();
    var optionsHtml = '<option value="overall">Overall (All Subjects Combined)</option>';

    subjects.forEach(function (sub) {
      optionsHtml += '<option value="' + sub.id + '">' + escapeHtml(sub.name) + ' (' + sub.attended + '/' + sub.conducted + ')</option>';
    });

    if (dom.simSubjectSelect) {
      var prevVal = dom.simSubjectSelect.value || 'overall';
      dom.simSubjectSelect.innerHTML = optionsHtml;
      dom.simSubjectSelect.value = prevVal;
    }
    if (dom.recoverySubjectSelect) {
      var prevRecVal = dom.recoverySubjectSelect.value || 'overall';
      dom.recoverySubjectSelect.innerHTML = optionsHtml;
      dom.recoverySubjectSelect.value = prevRecVal;
    }
    if (dom.matrixSubjectSelect) {
      var prevMatVal = dom.matrixSubjectSelect.value || 'overall';
      dom.matrixSubjectSelect.innerHTML = optionsHtml;
      dom.matrixSubjectSelect.value = prevMatVal;
    }
  }

  // What-If / Bunk Simulator Logic (#6)
  function runSimulation() {
    if (!dom.simResultBox) return;

    var targetId = dom.simSubjectSelect ? dom.simSubjectSelect.value : 'overall';
    var count = parseInt(dom.simCountInput.value, 10) || 1;
    var defaultReq = store.getRule().minPercentage || 75;

    var attended = 0;
    var conducted = 0;
    var required = defaultReq;
    var targetLabel = 'Overall';

    if (targetId === 'overall') {
      var overall = engine.calculateOverall(store.getSubjects(), defaultReq);
      attended = overall.totalAttended;
      conducted = overall.totalConducted;
      required = overall.requiredPercentage;
      targetLabel = 'Overall Semester Attendance';
    } else {
      var sub = store.getSubject(targetId);
      if (sub) {
        attended = sub.attended;
        conducted = sub.conducted;
        required = sub.required || defaultReq;
        targetLabel = sub.name;
      }
    }

    var deltaAttended = simMode === 'attend' ? count : 0;
    var deltaMissed = simMode === 'miss' ? count : 0;

    var result = engine.simulate(attended, conducted, required, deltaAttended, deltaMissed);

    var diffSign = result.diff >= 0 ? '+' : '';
    var diffColor = result.diff > 0 ? 'text-safe' : (result.diff < 0 ? 'text-danger' : 'text-muted');

    dom.simResultBox.innerHTML = 
      '<div style="font-size:0.9rem; font-weight:700; color:var(--text-secondary);">' +
        'Simulation for: <strong>' + escapeHtml(targetLabel) + '</strong> (' + (simMode === 'miss' ? 'Miss ' : 'Attend ') + count + ' class' + (count === 1 ? '' : 'es') + ')' +
      '</div>' +

      '<div class="sim-comparison">' +
        '<div class="sim-stat-box">' +
          '<span class="label">Current</span>' +
          '<span class="val">' + result.currentPct + '%</span>' +
          '<span style="font-size:0.8rem; color:var(--text-muted);">' + attended + '/' + conducted + '</span>' +
        '</div>' +

        '<div class="sim-arrow">&rarr;</div>' +

        '<div class="sim-stat-box">' +
          '<span class="label">Projected</span>' +
          '<span class="val ' + (result.status.status === 'safe' ? 'text-safe' : (result.status.status === 'warning' ? 'text-warning' : 'text-danger')) + '">' +
            result.newPct + '%' +
          '</span>' +
          '<span style="font-size:0.8rem; color:var(--text-muted);">' + result.newAttended + '/' + result.newConducted + '</span>' +
        '</div>' +

        '<div class="sim-stat-box">' +
          '<span class="label">Difference</span>' +
          '<span class="val ' + diffColor + '">' + diffSign + result.diff + '%</span>' +
          '<span class="status-badge ' + result.status.status + '" style="margin-top:0.25rem;">' + result.status.icon + ' ' + result.status.badge + '</span>' +
        '</div>' +
      '</div>' +

      '<div style="background:var(--bg-card); padding:0.85rem 1.1rem; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">' +
        (result.newPct >= required 
          ? '<span class="text-safe"><strong>Safe Buffer:</strong> You can still miss <strong>' + result.safeBunks + '</strong> more classes after this scenario.</span>' 
          : '<span class="text-danger"><strong>Under Limit:</strong> In this scenario, you would need to attend <strong>' + result.recoveryClasses + '</strong> consecutive classes to recover to ' + required + '%.</span>') +
      '</div>';
  }

  // Recovery Calculator Logic (#7)
  function runRecoveryCalculator() {
    if (!dom.recoveryResultBanner) return;

    var targetId = dom.recoverySubjectSelect ? dom.recoverySubjectSelect.value : 'overall';
    var targetPct = parseFloat(recoveryTargetPct) || 75;
    var defaultReq = store.getRule().minPercentage || 75;

    var attended = 0;
    var conducted = 0;
    var label = 'Overall';

    if (targetId === 'overall') {
      var overall = engine.calculateOverall(store.getSubjects(), defaultReq);
      attended = overall.totalAttended;
      conducted = overall.totalConducted;
      label = 'Overall Attendance';
    } else {
      var sub = store.getSubject(targetId);
      if (sub) {
        attended = sub.attended;
        conducted = sub.conducted;
        label = sub.name;
      }
    }

    var currentPct = engine.calculatePercentage(attended, conducted);
    var classesNeeded = engine.calculateRecoveryClasses(attended, conducted, targetPct);

    var bannerHtml = '';
    if (currentPct >= targetPct) {
      var canMissNow = engine.calculateSafeBunks(attended, conducted, targetPct);
      bannerHtml = 
        '<div style="font-size:1.1rem; font-weight:800; color:var(--color-safe); margin-bottom:0.35rem;">' +
          '🎉 Already at or above ' + targetPct + '%!' +
        '</div>' +
        '<p style="color:var(--text-secondary);">' +
          'Current attendance for ' + escapeHtml(label) + ' is <strong>' + currentPct + '%</strong>. You don\'t need recovery classes; you can safely miss up to <strong>' + canMissNow + ' classes</strong>.' +
        '</p>';
    } else if (classesNeeded === Infinity) {
      bannerHtml = 
        '<div style="font-size:1.1rem; font-weight:800; color:var(--color-danger); margin-bottom:0.35rem;">' +
          '⚠️ Target of 100% Unachievable' +
        '</div>' +
        '<p style="color:var(--text-secondary);">' +
          'Because classes have already been missed (' + attended + '/' + conducted + '), mathematical 100% attendance cannot be reached this semester.' +
        '</p>';
    } else {
      bannerHtml = 
        '<div style="font-size:1.3rem; font-weight:900; color:var(--color-danger); margin-bottom:0.4rem;">' +
          'Attend ' + classesNeeded + ' Consecutive Classes' +
        '</div>' +
        '<p style="color:var(--text-secondary); font-size:0.95rem;">' +
          'To recover ' + escapeHtml(label) + ' from <strong>' + currentPct + '%</strong> up to <strong>' + targetPct + '%</strong>, you must attend <strong>' + classesNeeded + ' consecutive classes</strong> without missing any.' +
        '</p>';
    }

    dom.recoveryResultBanner.innerHTML = bannerHtml;

    // Render Milestone Projections (+1, +3, +5, +10 classes)
    var projections = engine.getRecoveryProjections(attended, conducted, targetPct, [1, 2, 3, 5, 10]);
    var projHtml = '';

    projections.forEach(function (p) {
      var diffSign = p.diff >= 0 ? '+' : '';
      projHtml += 
        '<div class="milestone-card">' +
          '<div class="milestone-classes">+' + p.classesAttended + ' ' + (p.classesAttended === 1 ? 'class' : 'classes') + '</div>' +
          '<div class="milestone-pct ' + (p.status.status === 'safe' ? 'text-safe' : (p.status.status === 'warning' ? 'text-warning' : 'text-danger')) + '">' +
            p.newPct + '%' +
          '</div>' +
          '<div class="milestone-diff ' + (p.diff >= 0 ? 'positive' : 'negative') + '">' +
            diffSign + p.diff + '%' +
          '</div>' +
          '<div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.25rem;">' +
            p.newAttended + '/' + p.newConducted +
          '</div>' +
        '</div>';
    });

    dom.recoveryMilestonesGrid.innerHTML = projHtml;
  }

  // Attendance Target Calculator Matrix (#8)
  function renderTargetMatrix() {
    if (!dom.targetMatrixGrid) return;

    var targetId = dom.matrixSubjectSelect ? dom.matrixSubjectSelect.value : 'overall';
    var defaultReq = store.getRule().minPercentage || 75;

    var attended = 0;
    var conducted = 0;
    var label = 'Overall';

    if (targetId === 'overall') {
      var overall = engine.calculateOverall(store.getSubjects(), defaultReq);
      attended = overall.totalAttended;
      conducted = overall.totalConducted;
      label = 'Overall';
    } else {
      var sub = store.getSubject(targetId);
      if (sub) {
        attended = sub.attended;
        conducted = sub.conducted;
        label = sub.name;
      }
    }

    var targets = [75, 80, 85, 90];
    var matrix = engine.getTargetMatrix(attended, conducted, targets);

    var html = '';
    matrix.forEach(function (m) {
      var cardHeader = 
        '<div class="target-card-top">' +
          '<span class="target-percentage-label">' + m.targetPct + '% Target</span>' +
          '<span class="status-badge ' + m.status.status + '">' + m.status.icon + ' ' + m.status.badge + '</span>' +
        '</div>';

      var cardBody = '';
      if (m.isAchieved) {
        cardBody = 
          '<div class="target-card-body">' +
            '<p class="text-safe"><strong>Can safely miss: ' + m.safeBunks + ' ' + (m.safeBunks === 1 ? 'class' : 'classes') + '</strong></p>' +
            '<p style="font-size:0.8rem; color:var(--text-muted);">Current: ' + m.currentPct + '% (Target met)</p>' +
          '</div>';
      } else {
        cardBody = 
          '<div class="target-card-body">' +
            '<p class="text-danger"><strong>Need to attend: ' + (m.recoveryClasses === Infinity ? 'N/A' : m.recoveryClasses + ' consecutive classes') + '</strong></p>' +
            '<p style="font-size:0.8rem; color:var(--text-muted);">Current: ' + m.currentPct + '% (Under target)</p>' +
          '</div>';
      }

      html += '<div class="target-card">' + cardHeader + cardBody + '</div>';
    });

    dom.targetMatrixGrid.innerHTML = html;
  }

  // Render Settings View (#9, #10, #19)
  function renderSettingsView() {
    var college = store.getCollege();
    var rule = store.getRule();

    if (dom.settingMinAttendance) dom.settingMinAttendance.value = rule.minPercentage || 75;
    if (dom.settingLabAttendance) dom.settingLabAttendance.value = rule.labMinPercentage || 80;
    if (dom.settingCondonationNotes) dom.settingCondonationNotes.value = rule.condonationPolicy || '';

    if (dom.settingCollegeName) dom.settingCollegeName.value = college.name || '';
    if (dom.settingCollegeAbbr) dom.settingCollegeAbbr.value = college.abbreviation || '';
    if (dom.settingCourse) dom.settingCourse.value = college.course || '';
    if (dom.settingBranch) dom.settingBranch.value = college.branch || '';
    if (dom.settingSemester) dom.settingSemester.value = college.semester || '';
  }

  // Subject Modal Actions (Add / Edit)
  function openSubjectModal(subjectId) {
    editingSubjectId = subjectId || null;
    var title = document.getElementById('subject-modal-title');
    var defaultReq = store.getRule().minPercentage || 75;

    if (editingSubjectId) {
      var sub = store.getSubject(editingSubjectId);
      if (!sub) return;
      if (title) title.textContent = 'Edit Subject';
      document.getElementById('input-subject-name').value = sub.name;
      document.getElementById('input-subject-code').value = sub.code || '';
      document.getElementById('input-subject-attended').value = sub.attended;
      document.getElementById('input-subject-conducted').value = sub.conducted;
      document.getElementById('input-subject-req').value = sub.required || defaultReq;
      document.getElementById('input-subject-target').value = sub.target || defaultReq;
      document.getElementById('input-subject-lab').checked = Boolean(sub.isLab);
      document.getElementById('input-subject-notes').value = sub.notes || '';
    } else {
      if (title) title.textContent = 'Add New Subject';
      dom.subjectForm.reset();
      document.getElementById('input-subject-req').value = defaultReq;
      document.getElementById('input-subject-target').value = defaultReq + 5;
      document.getElementById('input-subject-attended').value = '0';
      document.getElementById('input-subject-conducted').value = '0';
    }

    dom.subjectModal.classList.add('active');
    document.getElementById('input-subject-name').focus();
  }

  function closeSubjectModal() {
    dom.subjectModal.classList.remove('active');
    editingSubjectId = null;
  }

  // College & Rules Modal
  function openCollegeModal() {
    var college = store.getCollege();
    var rule = store.getRule();

    document.getElementById('college-input-name').value = college.name || '';
    document.getElementById('college-input-abbr').value = college.abbreviation || '';
    document.getElementById('college-input-university').value = college.university || '';
    document.getElementById('college-input-course').value = college.course || '';
    document.getElementById('college-input-branch').value = college.branch || '';
    document.getElementById('college-input-sem').value = college.semester || '';
    document.getElementById('college-input-min').value = rule.minPercentage || 75;
    document.getElementById('college-input-condonation').value = rule.condonationPolicy || '';

    dom.collegeModal.classList.add('active');
  }

  function closeCollegeModal() {
    dom.collegeModal.classList.remove('active');
  }

  // Onboarding Wizard (#12)
  function startOnboardingWizard() {
    currentWizardStep = 1;
    showWizardStep(1);
    dom.onboardingModal.classList.add('active');
  }

  function closeOnboardingWizard() {
    dom.onboardingModal.classList.remove('active');
    store.updateSettings({ hasCompletedOnboarding: true });
    navigateTo('dashboard');
  }

  function showWizardStep(stepNum) {
    currentWizardStep = stepNum;
    for (var i = 1; i <= 4; i++) {
      var stepEl = document.getElementById('wizard-step-' + i);
      var barEl = document.getElementById('wizard-bar-' + i);
      if (stepEl) {
        if (i === stepNum) stepEl.classList.add('active');
        else stepEl.classList.remove('active');
      }
      if (barEl) {
        if (i <= stepNum) barEl.classList.add('completed');
        else barEl.classList.remove('completed');
      }
    }
  }

  // Quick Demo Loader (#11, #27)
  function loadDemoDataAction() {
    store.loadDemoData();
    showToast('Loaded DSATM demo data with realistic subjects! 🎓', 'success');
    closeOnboardingWizard();
    navigateTo('dashboard');
  }

  // Setup Event Listeners
  function setupEventListeners() {
    // Navigation Links
    dom.navLinks.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var target = this.getAttribute('data-view');
        if (target) navigateTo(target);
      });
    });

    // Theme Toggle
    if (dom.themeToggleBtn) {
      dom.themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // Landing Page Buttons
    var landingCalcBtn = document.getElementById('landing-btn-calc');
    if (landingCalcBtn) {
      landingCalcBtn.addEventListener('click', function () {
        if (store.getSubjects().length === 0) {
          startOnboardingWizard();
        } else {
          navigateTo('dashboard');
        }
      });
    }

    var landingDemoBtn = document.getElementById('landing-btn-demo');
    if (landingDemoBtn) {
      landingDemoBtn.addEventListener('click', function () {
        loadDemoDataAction();
      });
    }

    // Header Action: Add Subject
    var headerAddBtn = document.getElementById('header-btn-add-subject');
    if (headerAddBtn) {
      headerAddBtn.addEventListener('click', function () {
        openSubjectModal();
      });
    }

    var subjectsAddBtn = document.getElementById('btn-subjects-add-subject');
    if (subjectsAddBtn) {
      subjectsAddBtn.addEventListener('click', function () {
        openSubjectModal();
      });
    }

    // Subject Filter Chips
    document.querySelectorAll('.filter-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        document.querySelectorAll('.filter-chip').forEach(function (c) { c.classList.remove('active'); });
        this.classList.add('active');
        subjectFilter = this.getAttribute('data-filter') || 'all';
        renderSubjectsView();
      });
    });

    // Subject Modal Close & Cancel
    document.querySelectorAll('[data-dismiss="modal"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        closeSubjectModal();
        closeCollegeModal();
      });
    });

    // Subject Form Submit
    if (dom.subjectForm) {
      dom.subjectForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = (document.getElementById('input-subject-name').value || '').trim();
        var code = (document.getElementById('input-subject-code').value || '').trim();
        var attended = parseInt(document.getElementById('input-subject-attended').value, 10) || 0;
        var conducted = parseInt(document.getElementById('input-subject-conducted').value, 10) || 0;
        var req = parseFloat(document.getElementById('input-subject-req').value) || 75;
        var target = parseFloat(document.getElementById('input-subject-target').value) || req;
        var isLab = document.getElementById('input-subject-lab').checked;
        var notes = (document.getElementById('input-subject-notes').value || '').trim();

        if (!name) {
          showToast('Subject name cannot be empty', 'error');
          return;
        }

        var validation = engine.validateInputs(attended, conducted, req);
        if (!validation.isValid) {
          showToast(validation.error, 'error');
          return;
        }

        if (editingSubjectId) {
          store.updateSubject(editingSubjectId, {
            name: name,
            code: code,
            attended: attended,
            conducted: conducted,
            required: req,
            target: target,
            isLab: isLab,
            notes: notes
          });
          showToast('Subject updated successfully', 'success');
        } else {
          store.addSubject({
            name: name,
            code: code,
            attended: attended,
            conducted: conducted,
            required: req,
            target: target,
            isLab: isLab,
            notes: notes
          });
          showToast('Subject added successfully', 'success');
        }

        closeSubjectModal();
      });
    }

    // College & Rules Form Submit
    if (dom.collegeForm) {
      dom.collegeForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = (document.getElementById('college-input-name').value || '').trim();
        var abbr = (document.getElementById('college-input-abbr').value || '').trim();
        var univ = (document.getElementById('college-input-university').value || '').trim();
        var course = (document.getElementById('college-input-course').value || '').trim();
        var branch = (document.getElementById('college-input-branch').value || '').trim();
        var sem = (document.getElementById('college-input-sem').value || '').trim();
        var minReq = parseFloat(document.getElementById('college-input-min').value) || 75;
        var condonation = (document.getElementById('college-input-condonation').value || '').trim();

        if (minReq < 0 || minReq > 100) {
          showToast('Minimum attendance must be between 0% and 100%', 'error');
          return;
        }

        store.setCollege({
          name: name,
          abbreviation: abbr,
          university: univ,
          course: course,
          branch: branch,
          semester: sem
        });

        store.setRule({
          minPercentage: minReq,
          condonationPolicy: condonation
        });

        closeCollegeModal();
        showToast('College & attendance rules updated', 'success');
      });
    }

    // DSATM Preset Button in College Modal
    var dsatmPresetBtn = document.getElementById('btn-preset-dsatm');
    if (dsatmPresetBtn) {
      dsatmPresetBtn.addEventListener('click', function () {
        document.getElementById('college-input-name').value = 'Dayananda Sagar Academy of Technology and Management';
        document.getElementById('college-input-abbr').value = 'DSATM';
        document.getElementById('college-input-university').value = 'Visvesvaraya Technological University (VTU)';
        document.getElementById('college-input-course').value = 'Bachelor of Engineering (B.E.)';
        document.getElementById('college-input-branch').value = 'Computer Science & Engineering';
        document.getElementById('college-input-sem').value = '5th Semester';
        document.getElementById('college-input-min').value = '75';
        document.getElementById('college-input-condonation').value = 'VTU allows up to 10% condonation with medical certificate if permitted by principal.';
        showToast('Loaded DSATM template details');
      });
    }

    // Simulator Interactive Controls
    if (dom.simSubjectSelect) {
      dom.simSubjectSelect.addEventListener('change', runSimulation);
    }
    if (dom.simCountInput) {
      dom.simCountInput.addEventListener('input', runSimulation);
    }

    // Simulator Mode Buttons (Miss vs Attend)
    var btnModeMiss = document.getElementById('btn-sim-mode-miss');
    var btnModeAttend = document.getElementById('btn-sim-mode-attend');
    if (btnModeMiss && btnModeAttend) {
      btnModeMiss.addEventListener('click', function () {
        simMode = 'miss';
        btnModeMiss.classList.add('active');
        btnModeAttend.classList.remove('active');
        runSimulation();
      });
      btnModeAttend.addEventListener('click', function () {
        simMode = 'attend';
        btnModeAttend.classList.add('active');
        btnModeMiss.classList.remove('active');
        runSimulation();
      });
    }

    // Simulator Preset Chips (1, 2, 3, 5, 10)
    document.querySelectorAll('.sim-preset-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        document.querySelectorAll('.sim-preset-chip').forEach(function (c) { c.classList.remove('active'); });
        this.classList.add('active');
        var val = parseInt(this.getAttribute('data-count'), 10);
        if (dom.simCountInput) dom.simCountInput.value = val;
        runSimulation();
      });
    });

    // Recovery Calculator Controls
    if (dom.recoverySubjectSelect) {
      dom.recoverySubjectSelect.addEventListener('change', runRecoveryCalculator);
    }
    if (dom.recoveryTargetSelect) {
      dom.recoveryTargetSelect.addEventListener('change', function () {
        if (this.value === 'custom') {
          if (dom.recoveryCustomInput) dom.recoveryCustomInput.classList.remove('hidden');
          recoveryTargetPct = parseFloat(dom.recoveryCustomInput.value) || 75;
        } else {
          if (dom.recoveryCustomInput) dom.recoveryCustomInput.classList.add('hidden');
          recoveryTargetPct = parseFloat(this.value);
        }
        runRecoveryCalculator();
      });
    }
    if (dom.recoveryCustomInput) {
      dom.recoveryCustomInput.addEventListener('input', function () {
        recoveryTargetPct = parseFloat(this.value) || 75;
        runRecoveryCalculator();
      });
    }

    // Target Matrix Dropdown
    if (dom.matrixSubjectSelect) {
      dom.matrixSubjectSelect.addEventListener('change', renderTargetMatrix);
    }

    // Settings View Buttons
    var saveRulesBtn = document.getElementById('btn-save-settings-rules');
    if (saveRulesBtn) {
      saveRulesBtn.addEventListener('click', function () {
        var minReq = parseFloat(dom.settingMinAttendance.value) || 75;
        var labReq = parseFloat(dom.settingLabAttendance.value) || 80;
        var condonation = dom.settingCondonationNotes.value || '';

        store.setRule({
          minPercentage: minReq,
          labMinPercentage: labReq,
          condonationPolicy: condonation
        });

        store.setCollege({
          name: dom.settingCollegeName.value,
          abbreviation: dom.settingCollegeAbbr.value,
          course: dom.settingCourse.value,
          branch: dom.settingBranch.value,
          semester: dom.settingSemester.value
        });

        showToast('Settings saved successfully', 'success');
      });
    }

    // Export JSON
    var exportJsonBtn = document.getElementById('btn-export-json');
    if (exportJsonBtn) {
      exportJsonBtn.addEventListener('click', function () {
        var dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(store.exportJSON());
        var downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataStr);
        downloadAnchor.setAttribute('download', 'class_bunker_backup_' + new Date().toISOString().slice(0, 10) + '.json');
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        showToast('Exported complete backup to JSON');
      });
    }

    // Export CSV
    var exportCsvBtn = document.getElementById('btn-export-csv');
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', function () {
        var csvStr = store.exportCSV();
        var blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
        var url = URL.createObjectURL(blob);
        var downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', url);
        downloadAnchor.setAttribute('download', 'class_bunker_attendance_' + new Date().toISOString().slice(0, 10) + '.csv');
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        showToast('Exported attendance to CSV');
      });
    }

    // Import JSON File Trigger
    var importTriggerBtn = document.getElementById('btn-trigger-import-json');
    if (importTriggerBtn && dom.jsonFileInput) {
      importTriggerBtn.addEventListener('click', function () {
        dom.jsonFileInput.click();
      });

      dom.jsonFileInput.addEventListener('change', function (e) {
        var file = e.target.files[0];
        if (!file) return;

        var reader = new FileReader();
        reader.onload = function (evt) {
          var result = store.importJSON(evt.target.result);
          if (result.success) {
            showToast('Backup restored successfully!', 'success');
            navigateTo('dashboard');
          } else {
            showToast(result.error, 'error');
          }
        };
        reader.readAsText(file);
      });
    }

    // Clear All Data
    var clearAllBtn = document.getElementById('btn-clear-all-data');
    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', function () {
        if (confirm('Are you sure you want to clear ALL subjects and college data? This cannot be undone.')) {
          store.clearAllData();
          showToast('All local data cleared', 'info');
          navigateTo('landing');
        }
      });
    }

    // Load DSATM Demo from Settings
    var loadDemoSettingsBtn = document.getElementById('btn-settings-load-demo');
    if (loadDemoSettingsBtn) {
      loadDemoSettingsBtn.addEventListener('click', function () {
        loadDemoDataAction();
      });
    }

    // Wizard Navigation Buttons
    var wizardNext1 = document.getElementById('wizard-next-1');
    var wizardNext2 = document.getElementById('wizard-next-2');
    var wizardNext3 = document.getElementById('wizard-next-3');
    var wizardSkip = document.getElementById('wizard-skip');
    var wizardDemo = document.getElementById('wizard-load-demo');

    if (wizardNext1) wizardNext1.addEventListener('click', function () { showWizardStep(2); });
    if (wizardNext2) {
      wizardNext2.addEventListener('click', function () {
        var colName = (document.getElementById('wiz-college-name').value || '').trim();
        var course = (document.getElementById('wiz-course').value || '').trim();
        var sem = (document.getElementById('wiz-sem').value || '').trim();

        store.setCollege({
          name: colName,
          course: course,
          semester: sem
        });
        showWizardStep(3);
      });
    }
    if (wizardNext3) {
      wizardNext3.addEventListener('click', function () {
        var req = parseFloat(document.getElementById('wiz-min-req').value) || 75;
        store.setRule({ minPercentage: req });
        showWizardStep(4);
      });
    }
    if (wizardSkip) wizardSkip.addEventListener('click', closeOnboardingWizard);
    if (wizardDemo) wizardDemo.addEventListener('click', loadDemoDataAction);

    var wizFinishBtn = document.getElementById('wizard-finish');
    if (wizFinishBtn) wizFinishBtn.addEventListener('click', closeOnboardingWizard);

    var wizAddSubBtn = document.getElementById('wizard-add-sub');
    if (wizAddSubBtn) {
      wizAddSubBtn.addEventListener('click', function () {
        closeOnboardingWizard();
        openSubjectModal();
      });
    }

    // Wizard DSATM Shortcut
    var wizSelectDsatm = document.getElementById('wiz-select-dsatm');
    if (wizSelectDsatm) {
      wizSelectDsatm.addEventListener('click', function () {
        document.getElementById('wiz-college-name').value = 'Dayananda Sagar Academy of Technology and Management';
        document.getElementById('wiz-course').value = 'B.E. Computer Science';
        document.getElementById('wiz-sem').value = '5th Semester';
        showToast('Selected DSATM preconfiguration');
      });
    }
  }

  // Application Entry Point
  function init() {
    initDomElements();

    // Apply stored theme
    var currentTheme = store.getSettings().theme || 'dark';
    applyTheme(currentTheme);

    // Setup reactive store subscription: any store changes re-renders current view
    store.subscribe(function () {
      if (activeView === 'dashboard') {
        renderDashboard();
      } else if (activeView === 'subjects') {
        renderSubjectsView();
      } else if (activeView === 'simulator') {
        populateSubjectDropdowns();
        runSimulation();
      } else if (activeView === 'calculator') {
        populateSubjectDropdowns();
        runRecoveryCalculator();
        renderTargetMatrix();
      }
    });

    setupEventListeners();

    // If user has subjects or completed onboarding, start on dashboard; otherwise show landing
    var subjects = store.getSubjects();
    if (subjects.length > 0 || store.getSettings().hasCompletedOnboarding) {
      navigateTo('dashboard');
    } else {
      navigateTo('landing');
    }

    // Expose for global actions and developer console testing
    window.ClassBunkerApp = {
      openSubjectModal: openSubjectModal,
      closeSubjectModal: closeSubjectModal,
      openCollegeModal: openCollegeModal,
      closeCollegeModal: closeCollegeModal,
      navigateTo: navigateTo,
      loadDemoDataAction: loadDemoDataAction,
      store: store,
      engine: engine
    };
  }

  function escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
