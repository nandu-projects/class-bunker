/**
 * Class Bunker - Core Application Controller (Curriculum-Aware v2)
 * Features:
 * - Multi-tier zero-typing academic identity resolution (State -> College -> Course -> Branch -> Scheme -> Semester)
 * - Official curriculum automatic discovery with source provenance
 * - Curriculum confirmation screen before loading subjects
 * - Distinction between official curriculum and custom subjects
 * - Mathematical attendance planning engine & simulators
 * - Offline PWA readiness
 */

(function () {
  'use strict';

  var store = new ClassBunkerStore();
  var engine = AttendanceEngine;
  var curriculumService = ClassBunkerCurriculumService;

  var activeView = 'landing';
  var subjectFilter = 'all'; // 'all' | 'safe' | 'warning' | 'below' | 'official'
  var editingSubjectId = null;
  var pendingCurriculumData = null; // Staged curriculum waiting for user confirmation

  // Simulator & Calculator States
  var simTargetSubjectId = 'overall';
  var simMode = 'miss';
  var simCount = 1;
  var recoverySubjectId = 'overall';
  var recoveryTargetPct = 75;
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
    dom.academicModal = document.getElementById('modal-academic-setup');
    dom.subjectModal = document.getElementById('modal-subject');
    dom.confirmSwitchModal = document.getElementById('modal-confirm-switch');
    dom.attendanceChoiceModal = document.getElementById('modal-attendance-choice');
    dom.ocrModal = document.getElementById('modal-ocr-import');
    dom.manualEntryModal = document.getElementById('modal-manual-entry');

    // Academic Selectors (Exact 10-tier flow)
    dom.selectState = document.getElementById('select-state');
    dom.selectUnivFilter = document.getElementById('select-university-filter');
    dom.selectDistFilter = document.getElementById('select-district') || document.getElementById('select-district-filter');
    dom.collegeSearchInput = document.getElementById('college-search-input');
    dom.collegeOptionsList = document.getElementById('college-options-list');
    dom.selectedCollegeId = document.getElementById('selected-college-id');
    dom.displayUniversity = document.getElementById('display-university');
    dom.selectCourse = document.getElementById('select-course');
    dom.selectBranch = document.getElementById('select-branch');
    dom.selectScheme = document.getElementById('select-scheme');
    dom.selectAcademicYear = document.getElementById('select-academic-year');
    dom.selectYear = document.getElementById('select-year');
    dom.selectSemester = document.getElementById('select-semester');
    dom.curriculumConfirmContainer = document.getElementById('curriculum-confirmation-container');
    dom.switchProgramWarning = document.getElementById('switch-program-warning');

    // Attendance Input Choice & OCR Elements
    dom.btnChoiceOcr = document.getElementById('btn-choice-ocr');
    dom.btnChoiceManual = document.getElementById('btn-choice-manual');
    dom.ocrDropzone = document.getElementById('ocr-upload-dropzone');
    dom.ocrFileInput = document.getElementById('ocr-file-input');
    dom.ocrSpinner = document.getElementById('ocr-processing-spinner');
    dom.ocrResultsContainer = document.getElementById('ocr-results-container');
    dom.ocrTableBody = document.getElementById('ocr-table-body');
    dom.ocrDetectedCount = document.getElementById('ocr-detected-count');
    dom.btnSaveOcrAttendance = document.getElementById('btn-save-ocr-attendance');

    // Batch Manual Entry Elements
    dom.manualEntryContainer = document.getElementById('manual-entry-subjects-container');
    dom.btnSaveManualAttendance = document.getElementById('btn-save-manual-attendance');

    // Today's Decision ("What if I miss today?") Elements
    dom.todayDecisionCard = document.getElementById('dashboard-today-decision');
    dom.todaySubjectSelect = document.getElementById('today-subject-select');
    dom.todayDecisionContent = document.getElementById('today-decision-content');

    // Containers
    dom.dashboardBunkHero = document.getElementById('dashboard-bunk-hero');
    dom.dashboardStats = document.getElementById('dashboard-stats');
    dom.dashboardSubjectsList = document.getElementById('dashboard-subjects-list');
    dom.subjectsGrid = document.getElementById('subjects-grid');
    dom.subjectsTableBody = document.getElementById('subjects-table-body');
    dom.collegeInfoStrip = document.getElementById('college-info-strip');
    dom.settingsAcademicSummary = document.getElementById('settings-academic-summary');
    dom.settingsRuleProvenance = document.getElementById('settings-rule-provenance');

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

    // File Inputs & Toasts
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

    dom.navLinks.forEach(function (btn) {
      var target = btn.getAttribute('data-view');
      if (target === viewName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

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

  // =========================================================================
  // ACADEMIC PROGRAM & CURRICULUM SELECTORS (Zero manual typing) (#1, #2, #5, #6, #7, #8)
  // =========================================================================

  function populateUniversityAndDistrictFilters() {
    // Populate Universities
    var univis = curriculumService.getUniversities('Karnataka');
    var uHtml = '<option value="">All Universities</option>';
    univis.forEach(function (u) {
      uHtml += '<option value="' + u.id + '">' + escapeHtml(u.shortName || u.name) + '</option>';
    });
    if (dom.selectUnivFilter) dom.selectUnivFilter.innerHTML = uHtml;

    // Populate Districts
    var districts = curriculumService.getDistricts('Karnataka');
    var dHtml = '<option value="">All Districts</option>';
    districts.forEach(function (d) {
      dHtml += '<option value="' + escapeHtml(d) + '">' + escapeHtml(d) + '</option>';
    });
    if (dom.selectDistFilter) dom.selectDistFilter.innerHTML = dHtml;
  }

  function renderCollegeList() {
    if (!dom.collegeOptionsList) return;

    var query = dom.collegeSearchInput ? dom.collegeSearchInput.value : '';
    var univId = dom.selectUnivFilter ? dom.selectUnivFilter.value : '';
    var district = dom.selectDistFilter ? dom.selectDistFilter.value : '';
    var selectedId = dom.selectedCollegeId ? dom.selectedCollegeId.value : '';

    var filtered = curriculumService.getColleges({
      state: 'Karnataka',
      universityId: univId,
      district: district,
      query: query
    });

    if (filtered.length === 0) {
      dom.collegeOptionsList.innerHTML = 
        '<div style="padding:1rem; text-align:center; color:var(--text-muted); font-size:0.85rem;">' +
          'No colleges match the search criteria.' +
        '</div>';
      return;
    }

    var html = '';
    filtered.forEach(function (c) {
      var isSel = c.id === selectedId;
      var autoBadge = c.autonomous 
        ? '<span class="badge-tag autonomous">Autonomous</span>' 
        : '<span class="badge-tag">VTU Affiliated</span>';

      html += 
        '<div class="college-list-item ' + (isSel ? 'selected' : '') + '" data-id="' + c.id + '" role="option" aria-selected="' + isSel + '">' +
          '<div class="college-item-header">' +
            '<span class="college-item-name">' + (c.shortName ? '<strong>' + escapeHtml(c.shortName) + '</strong> — ' : '') + escapeHtml(c.name) + '</span>' +
            autoBadge +
          '</div>' +
          '<div class="college-item-meta">' +
            '<span>📍 ' + escapeHtml(c.district || 'Karnataka') + '</span>' +
            (c.vtuCode ? '<span>Code: <strong>' + escapeHtml(c.vtuCode) + '</strong></span>' : '') +
            '<span>🏛️ ' + escapeHtml(c.university) + '</span>' +
          '</div>' +
        '</div>';
    });

    dom.collegeOptionsList.innerHTML = html;

    // Attach click listeners to college items
    dom.collegeOptionsList.querySelectorAll('.college-list-item').forEach(function (el) {
      el.addEventListener('click', function () {
        var id = this.getAttribute('data-id');
        selectCollege(id);
      });
    });
  }

  function selectCollege(collegeId) {
    var college = curriculumService.getCollegeById(collegeId);
    if (!college) return;

    if (dom.selectedCollegeId) dom.selectedCollegeId.value = collegeId;
    if (dom.collegeSearchInput) dom.collegeSearchInput.value = college.shortName ? college.shortName + ' — ' + college.name : college.name;
    if (dom.displayUniversity) dom.displayUniversity.value = college.university || 'Visvesvaraya Technological University (VTU)';

    // Highlight selected item in list
    if (dom.collegeOptionsList) {
      dom.collegeOptionsList.querySelectorAll('.college-list-item').forEach(function (el) {
        if (el.getAttribute('data-id') === collegeId) el.classList.add('selected');
        else el.classList.remove('selected');
      });
    }

    // Populate Courses for this College (Requirement #5)
    var courses = curriculumService.getCourses(collegeId);
    var courseHtml = '';
    courses.forEach(function (c) {
      courseHtml += '<option value="' + escapeHtml(c) + '">' + escapeHtml(c) + '</option>';
    });
    if (dom.selectCourse) {
      dom.selectCourse.innerHTML = courseHtml;
      dom.selectCourse.value = courses[0] || 'B.E.';
    }

    updateBranchesForSelectedCourse();
  }

  function updateBranchesForSelectedCourse() {
    var collegeId = dom.selectedCollegeId ? dom.selectedCollegeId.value : 'dsatm';
    var course = dom.selectCourse ? dom.selectCourse.value : 'B.E.';

    // Populate Branches for this College and Course (Requirement #6)
    var branches = curriculumService.getBranches(collegeId, course);
    var branchHtml = '';
    branches.forEach(function (b) {
      branchHtml += '<option value="' + escapeHtml(b) + '">' + escapeHtml(b) + '</option>';
    });
    if (dom.selectBranch) {
      dom.selectBranch.innerHTML = branchHtml;
      // Default to CSE - Cyber Security if present
      if (branches.indexOf('CSE – Cyber Security') !== -1) {
        dom.selectBranch.value = 'CSE – Cyber Security';
      }
    }

    updateSchemesForSelectedBranch();
  }

  function updateSchemesForSelectedBranch() {
    var collegeId = dom.selectedCollegeId ? dom.selectedCollegeId.value : 'dsatm';
    var course = dom.selectCourse ? dom.selectCourse.value : 'B.E.';
    var branch = dom.selectBranch ? dom.selectBranch.value : 'CSE – Cyber Security';

    // Populate Schemes (Requirement #7)
    var schemes = curriculumService.getSchemes(collegeId, course, branch);
    var schemeHtml = '';
    schemes.forEach(function (s) {
      schemeHtml += '<option value="' + escapeHtml(s) + '">' + escapeHtml(s) + '</option>';
    });
    if (dom.selectScheme) {
      dom.selectScheme.innerHTML = schemeHtml;
      dom.selectScheme.value = schemes[0];
    }

    updateYearsAndSemesters();
  }

  function updateYearsAndSemesters() {
    var collegeId = dom.selectedCollegeId ? dom.selectedCollegeId.value : 'dsatm';
    var course = dom.selectCourse ? dom.selectCourse.value : 'B.E.';

    // Populate Years (Requirement #8)
    var years = curriculumService.getYears(collegeId, course);
    var yearHtml = '';
    years.forEach(function (y) {
      yearHtml += '<option value="' + escapeHtml(y) + '">' + escapeHtml(y) + '</option>';
    });
    if (dom.selectYear) {
      dom.selectYear.innerHTML = yearHtml;
      if (years.indexOf('3rd Year') !== -1) {
        dom.selectYear.value = '3rd Year';
      }
    }

    updateSemestersForSelectedYear();
  }

  function updateSemestersForSelectedYear() {
    var year = dom.selectYear ? dom.selectYear.value : '3rd Year';
    var semesters = curriculumService.getSemesters(year);
    var semHtml = '';
    semesters.forEach(function (s) {
      semHtml += '<option value="' + escapeHtml(s) + '">' + escapeHtml(s) + '</option>';
    });
    if (dom.selectSemester) {
      dom.selectSemester.innerHTML = semHtml;
      if (semesters.indexOf('5th Semester') !== -1) {
        dom.selectSemester.value = '5th Semester';
      } else {
        dom.selectSemester.value = semesters[0];
      }
    }
  }

  // Discover Curriculum & Render Confirmation Screen (Requirement #9, #10, #11, #13)
  function discoverCurriculumAction() {
    var collegeId = dom.selectedCollegeId ? dom.selectedCollegeId.value : '';
    if (!collegeId) {
      showToast('Please select a college from the list first', 'error');
      return;
    }

    var course = dom.selectCourse ? dom.selectCourse.value : 'B.E.';
    var branch = dom.selectBranch ? dom.selectBranch.value : 'CSE – Cyber Security';
    var scheme = dom.selectScheme ? dom.selectScheme.value : '2022 Scheme';
    var semester = dom.selectSemester ? dom.selectSemester.value : '5th Semester';
    var academicYear = dom.selectAcademicYear ? dom.selectAcademicYear.value : '2024-2025';
    var year = dom.selectYear ? dom.selectYear.value : '3rd Year';

    var result = curriculumService.getCurriculum(collegeId, course, branch, scheme, semester);
    var college = curriculumService.getCollegeById(collegeId);

    if (!dom.curriculumConfirmContainer) return;
    dom.curriculumConfirmContainer.classList.remove('hidden');

    if (result.found && result.isOfficial) {
      pendingCurriculumData = Object.assign({}, result, {
        collegeId: collegeId,
        collegeName: college ? college.name : 'College',
        shortName: college ? college.shortName : '',
        academicYear: academicYear,
        year: year
      });

      var subjectsHtml = '';
      result.subjects.forEach(function (sub) {
        var typeBadge = sub.isLab 
          ? '<span class="badge-tag" style="background:var(--color-info-bg); color:var(--color-info);">Lab</span>' 
          : '<span class="badge-tag">Theory</span>';
        if (sub.isElective) {
          typeBadge += ' <span class="badge-tag" style="background:var(--color-warning-bg); color:var(--color-warning);">Elective</span>';
        }

        subjectsHtml += 
          '<div class="confirm-subject-item">' +
            '<div class="confirm-sub-left">' +
              '<span class="confirm-sub-code">' + escapeHtml(sub.code) + '</span>' +
              '<div>' +
                '<div class="confirm-sub-name">' + escapeHtml(sub.name) + '</div>' +
                '<div class="confirm-sub-meta">' +
                  '<span>' + escapeHtml(sub.category || '') + '</span>' +
                  (sub.credits ? '<span>• ' + sub.credits + ' Credits</span>' : '') +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div>' + typeBadge + '</div>' +
          '</div>';
      });

      dom.curriculumConfirmContainer.innerHTML = 
        '<div class="curriculum-confirm-header">' +
          '<div class="curriculum-confirm-title">' +
            '<span>✅</span> Official Curriculum Discovered' +
          '</div>' +
          '<div class="curriculum-meta-grid">' +
            '<div class="meta-field"><div class="meta-field-label">College</div><div class="meta-field-val">' + escapeHtml(college ? college.shortName || college.name : collegeId) + '</div></div>' +
            '<div class="meta-field"><div class="meta-field-label">Program</div><div class="meta-field-val">' + escapeHtml(course + ' ' + branch) + '</div></div>' +
            '<div class="meta-field"><div class="meta-field-label">Scheme &amp; Sem</div><div class="meta-field-val">' + escapeHtml(scheme + ' • ' + semester) + '</div></div>' +
            '<div class="meta-field"><div class="meta-field-label">Subjects Found</div><div class="meta-field-val text-safe">' + result.totalSubjects + ' Official Courses</div></div>' +
          '</div>' +
        '</div>' +

        '<div style="font-size:0.85rem; font-weight:700; color:var(--text-secondary); margin-bottom:0.5rem;">' +
          'Official Semester Subject List:' +
        '</div>' +

        '<div class="confirm-subject-list">' + subjectsHtml + '</div>' +

        '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-top:1rem; padding-top:0.75rem; border-top:1px solid var(--border-subtle);">' +
          '<div style="font-size:0.78rem; color:var(--text-muted);">' +
            'Source: <a href="' + result.sourceUrl + '" target="_blank" rel="noopener noreferrer" class="curriculum-source-link">' + escapeHtml(result.sourceName) + ' ↗</a> (Verified: ' + result.verifiedDate + ')' +
          '</div>' +
          '<div style="display:flex; gap:0.5rem;">' +
            '<button type="button" class="btn btn-secondary btn-sm" id="btn-report-curriculum">Report Discrepancy</button>' +
            '<button type="button" class="btn btn-primary" id="btn-confirm-apply-curriculum">Confirm &amp; Load Subjects &rarr;</button>' +
          '</div>' +
        '</div>';

      // Attach confirmation listener
      var confirmBtn = document.getElementById('btn-confirm-apply-curriculum');
      if (confirmBtn) {
        confirmBtn.addEventListener('click', function () {
          checkAndApplyCurriculum(pendingCurriculumData);
        });
      }

      var reportBtn = document.getElementById('btn-report-curriculum');
      if (reportBtn) {
        reportBtn.addEventListener('click', function () {
          showToast('Thank you. Discrepancy logged for academic registry review.', 'info');
        });
      }

    } else {
      // Official curriculum not found fallback (Requirement #13 & #26)
      pendingCurriculumData = null;
      dom.curriculumConfirmContainer.innerHTML = 
        '<div class="fallback-notice-box">' +
          '<div style="font-weight:700; font-size:0.95rem; margin-bottom:0.35rem; color:var(--color-warning);">' +
            '⚠️ Official curriculum not available yet' +
          '</div>' +
          '<p style="color:var(--text-secondary); margin-bottom:0.75rem;">' +
            'We have verified institutions across Karnataka, but specific official syllabus data for <strong>' + escapeHtml(course + ' ' + branch + ' (' + semester + ')') + '</strong> is not yet indexed in our repository.' +
          '</p>' +
          '<div style="display:flex; gap:0.5rem; justify-content:flex-end;">' +
            '<button type="button" class="btn btn-secondary btn-sm" id="btn-fallback-manual-subjects">' +
              'Enter Subjects Manually (Unverified Fallback)' +
            '</button>' +
          '</div>' +
        '</div>';

      var fallbackManualBtn = document.getElementById('btn-fallback-manual-subjects');
      if (fallbackManualBtn) {
        fallbackManualBtn.addEventListener('click', function () {
          closeAcademicModal();
          openSubjectModal();
          showToast('Switched to manual subject entry fallback', 'info');
        });
      }
    }
  }

  // Check if existing subjects will be replaced (Requirement #28)
  function checkAndApplyCurriculum(curriculumData) {
    if (!curriculumData) return;
    var existingSubjects = store.getSubjects();

    if (existingSubjects.length > 0) {
      // Open confirm switch modal
      if (dom.confirmSwitchModal) {
        dom.confirmSwitchModal.classList.add('active');
        var switchBtn = document.getElementById('btn-confirm-program-switch');
        if (switchBtn) {
          switchBtn.onclick = function () {
            dom.confirmSwitchModal.classList.remove('active');
            executeApplyCurriculum(curriculumData);
          };
        }
      }
    } else {
      executeApplyCurriculum(curriculumData);
    }
  }

  function executeApplyCurriculum(curriculumData) {
    store.applyCurriculum(curriculumData);
    showToast('Loaded ' + curriculumData.totalSubjects + ' official subjects for ' + (curriculumData.shortName || curriculumData.collegeName) + '! 🎓', 'success');
    closeAcademicModal();
    openAttendanceChoiceModal();
  }

  function openAcademicModal() {
    populateUniversityAndDistrictFilters();
    renderCollegeList();

    // Check if user already has an active program
    var identity = store.getAcademicIdentity();
    if (identity.collegeId) {
      selectCollege(identity.collegeId);
      if (dom.selectCourse && identity.course) dom.selectCourse.value = identity.course;
      if (dom.selectBranch && identity.branch) dom.selectBranch.value = identity.branch;
      if (dom.selectScheme && identity.scheme) dom.selectScheme.value = identity.scheme;
      if (dom.selectYear && identity.year) dom.selectYear.value = identity.year;
      if (dom.selectSemester && identity.semester) dom.selectSemester.value = identity.semester;
    } else {
      // Default to DSATM
      selectCollege('dsatm');
    }

    if (dom.switchProgramWarning) {
      if (store.getSubjects().length > 0) dom.switchProgramWarning.classList.remove('hidden');
      else dom.switchProgramWarning.classList.add('hidden');
    }

    if (dom.curriculumConfirmContainer) {
      dom.curriculumConfirmContainer.classList.add('hidden');
    }

    dom.academicModal.classList.add('active');
  }

  function closeAcademicModal() {
    dom.academicModal.classList.remove('active');
  }

  // =========================================================================
  // ATTENDANCE INPUT ONBOARDING MODALS (Option 1: Screenshot OCR, Option 2: Manual)
  // =========================================================================

  function openAttendanceChoiceModal() {
    if (dom.attendanceChoiceModal) {
      dom.attendanceChoiceModal.classList.add('active');
    }
  }

  function closeAttendanceChoiceModal() {
    if (dom.attendanceChoiceModal) {
      dom.attendanceChoiceModal.classList.remove('active');
    }
    navigateTo('dashboard');
  }

  function openOcrModal() {
    if (dom.ocrModal) {
      if (dom.ocrResultsContainer) dom.ocrResultsContainer.classList.add('hidden');
      if (dom.ocrSpinner) dom.ocrSpinner.classList.add('hidden');
      if (dom.ocrFileInput) dom.ocrFileInput.value = '';
      dom.ocrModal.classList.add('active');
    }
  }

  function closeOcrModal() {
    if (dom.ocrModal) {
      dom.ocrModal.classList.remove('active');
    }
  }

  function handleOcrFile(file) {
    if (!file) return;
    if (dom.ocrSpinner) dom.ocrSpinner.classList.remove('hidden');
    if (dom.ocrResultsContainer) dom.ocrResultsContainer.classList.add('hidden');

    ClassBunkerOCR.processImageFile(file, store.getSubjects(), function (result) {
      if (dom.ocrSpinner) dom.ocrSpinner.classList.add('hidden');
      if (!result.success || !result.rows || result.rows.length === 0) {
        showToast('Could not extract attendance tables from this image. Please enter manually.', 'error');
        return;
      }

      renderOcrResults(result.rows);
      if (dom.ocrResultsContainer) dom.ocrResultsContainer.classList.remove('hidden');
      showToast('Detected ' + result.totalFound + ' subjects from screenshot! 📷', 'success');
    });
  }

  function renderOcrResults(rows) {
    if (!dom.ocrTableBody) return;
    var html = '';

    rows.forEach(function (r, idx) {
      var confBadge = r.confidence === 'high' 
        ? '<span class="badge-tag safe" style="color:var(--color-safe); background:var(--color-safe-bg);">✓ High Confidence</span>' 
        : '<span class="badge-tag warning" style="color:var(--color-warning); background:var(--color-warning-bg);">⚠️ Verify Values</span>';

      html +=
        '<tr data-idx="' + idx + '" data-sub-id="' + (r.matchedOfficialId || '') + '" data-sub-name="' + escapeHtml(r.subjectName) + '" data-sub-code="' + escapeHtml(r.code || '') + '">' +
          '<td>' +
            '<div style="font-weight:700; font-size:0.85rem;">' + escapeHtml(r.subjectName) + '</div>' +
            (r.code ? '<span style="font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono);">' + escapeHtml(r.code) + '</span>' : '') +
          '</td>' +
          '<td><input type="number" class="form-input ocr-input-att" min="0" max="300" value="' + r.attended + '" style="width:70px; padding:0.3rem 0.4rem; text-align:center;"></td>' +
          '<td><input type="number" class="form-input ocr-input-cond" min="0" max="300" value="' + r.conducted + '" style="width:70px; padding:0.3rem 0.4rem; text-align:center;"></td>' +
          '<td><span class="ocr-row-pct" style="font-weight:700; font-size:0.85rem;">' + r.percentage + '%</span></td>' +
          '<td>' + confBadge + '</td>' +
        '</tr>';
    });

    dom.ocrTableBody.innerHTML = html;
    if (dom.ocrDetectedCount) dom.ocrDetectedCount.textContent = rows.length + ' subjects detected';

    // Live update percentage on cell input
    dom.ocrTableBody.querySelectorAll('tr').forEach(function (tr) {
      var attInp = tr.querySelector('.ocr-input-att');
      var condInp = tr.querySelector('.ocr-input-cond');
      var pctSpan = tr.querySelector('.ocr-row-pct');

      function updatePct() {
        var a = parseInt(attInp.value, 10) || 0;
        var c = parseInt(condInp.value, 10) || 0;
        if (a > c) {
          c = a;
          condInp.value = c;
        }
        var pct = engine.calculatePercentage(a, c);
        pctSpan.textContent = pct + '%';
      }

      attInp.addEventListener('input', updatePct);
      condInp.addEventListener('input', updatePct);
    });
  }

  function saveOcrAttendance() {
    if (!dom.ocrTableBody) return;
    var trs = dom.ocrTableBody.querySelectorAll('tr');
    var updates = [];

    trs.forEach(function (tr) {
      var subId = tr.getAttribute('data-sub-id');
      var subName = tr.getAttribute('data-sub-name');
      var subCode = tr.getAttribute('data-sub-code');
      var att = parseInt(tr.querySelector('.ocr-input-att').value, 10) || 0;
      var cond = parseInt(tr.querySelector('.ocr-input-cond').value, 10) || 0;

      updates.push({
        id: subId,
        name: subName,
        code: subCode,
        attended: att,
        conducted: cond
      });
    });

    var count = store.batchUpdateAttendance(updates);
    showToast('Applied attendance for ' + count + ' subjects from screenshot! 📷', 'success');
    closeOcrModal();
    navigateTo('dashboard');
  }

  function openManualEntryModal() {
    var subjects = store.getSubjects();
    if (!subjects || subjects.length === 0) {
      showToast('Please load or add subjects first', 'info');
      openAcademicModal();
      return;
    }
    renderManualEntryList();
    if (dom.manualEntryModal) {
      dom.manualEntryModal.classList.add('active');
    }
  }

  function closeManualEntryModal() {
    if (dom.manualEntryModal) {
      dom.manualEntryModal.classList.remove('active');
    }
  }

  function renderManualEntryList() {
    if (!dom.manualEntryContainer) return;
    var subjects = store.getSubjects();
    var html = '';

    subjects.forEach(function (sub) {
      var pct = engine.calculatePercentage(sub.attended, sub.conducted);
      var status = engine.determineStatus(pct, sub.required);

      html +=
        '<div class="manual-entry-row" data-id="' + sub.id + '" style="display:flex; align-items:center; justify-content:space-between; gap:1rem; padding:0.75rem 0.5rem; border-bottom:1px solid var(--border-subtle); flex-wrap:wrap;">' +
          '<div style="flex:1; min-width:180px;">' +
            '<div style="font-weight:700; font-size:0.9rem;">' + (sub.code ? '<span style="color:var(--color-primary); font-family:var(--font-mono); margin-right:0.35rem;">' + escapeHtml(sub.code) + '</span>' : '') + escapeHtml(sub.name) + '</div>' +
            '<div style="font-size:0.75rem; color:var(--text-muted);">' + escapeHtml(sub.category || '') + (sub.isLab ? ' • Lab' : '') + ' • Required: ' + sub.required + '%</div>' +
          '</div>' +
          '<div style="display:flex; align-items:center; gap:0.75rem;">' +
            '<div style="display:flex; align-items:center; gap:0.35rem;">' +
              '<label style="font-size:0.75rem; color:var(--text-secondary); font-weight:600;">Att:</label>' +
              '<input type="number" class="form-input manual-input-att" min="0" max="300" value="' + sub.attended + '" style="width:70px; padding:0.35rem 0.5rem; text-align:center;">' +
            '</div>' +
            '<div style="display:flex; align-items:center; gap:0.35rem;">' +
              '<label style="font-size:0.75rem; color:var(--text-secondary); font-weight:600;">Cond:</label>' +
              '<input type="number" class="form-input manual-input-cond" min="0" max="300" value="' + sub.conducted + '" style="width:70px; padding:0.35rem 0.5rem; text-align:center;">' +
            '</div>' +
            '<div class="manual-row-pct-pill status-badge ' + status.status + '" style="min-width:65px; text-align:center; font-size:0.8rem; font-weight:700;">' +
              pct + '%' +
            '</div>' +
          '</div>' +
        '</div>';
    });

    dom.manualEntryContainer.innerHTML = html;

    // Attach live change listener to inputs
    dom.manualEntryContainer.querySelectorAll('.manual-entry-row').forEach(function (row) {
      var id = row.getAttribute('data-id');
      var sub = store.getSubject(id);
      var req = sub ? sub.required : 75;
      var attInput = row.querySelector('.manual-input-att');
      var condInput = row.querySelector('.manual-input-cond');
      var pill = row.querySelector('.manual-row-pct-pill');

      function updateLivePill() {
        var a = parseInt(attInput.value, 10) || 0;
        var c = parseInt(condInput.value, 10) || 0;
        if (a > c) {
          c = a;
          condInput.value = c;
        }
        var p = engine.calculatePercentage(a, c);
        var st = engine.determineStatus(p, req);
        pill.className = 'manual-row-pct-pill status-badge ' + st.status;
        pill.textContent = p + '%';
      }

      attInput.addEventListener('input', updateLivePill);
      condInput.addEventListener('input', updateLivePill);
    });
  }

  function saveManualBatchAttendance() {
    if (!dom.manualEntryContainer) return;
    var rows = dom.manualEntryContainer.querySelectorAll('.manual-entry-row');
    var updates = [];

    rows.forEach(function (row) {
      var id = row.getAttribute('data-id');
      var att = parseInt(row.querySelector('.manual-input-att').value, 10) || 0;
      var cond = parseInt(row.querySelector('.manual-input-cond').value, 10) || 0;
      updates.push({ id: id, attended: att, conducted: cond });
    });

    var count = store.batchUpdateAttendance(updates);
    showToast('Saved attendance for ' + count + ' subjects! ✏️', 'success');
    closeManualEntryModal();
    navigateTo('dashboard');
  }

  // =========================================================================
  // TODAY'S DECISION: "WHAT IF I MISS TODAY?" CARD
  // =========================================================================

  function renderTodayDecision() {
    if (!dom.todayDecisionCard || !dom.todayDecisionContent) return;

    var subjects = store.getSubjects();
    if (!subjects || subjects.length === 0) {
      dom.todayDecisionCard.classList.add('hidden');
      return;
    }
    dom.todayDecisionCard.classList.remove('hidden');

    // Populate dropdown
    if (dom.todaySubjectSelect) {
      var currentVal = dom.todaySubjectSelect.value;
      var optsHtml = '';
      subjects.forEach(function (s) {
        optsHtml += '<option value="' + s.id + '">' + (s.code ? s.code + ' - ' : '') + escapeHtml(s.name) + '</option>';
      });
      dom.todaySubjectSelect.innerHTML = optsHtml;
      if (currentVal && subjects.some(function (s) { return s.id === currentVal; })) {
        dom.todaySubjectSelect.value = currentVal;
      } else {
        dom.todaySubjectSelect.value = subjects[0].id;
      }
    }

    var selectedId = dom.todaySubjectSelect ? dom.todaySubjectSelect.value : subjects[0].id;
    var sub = store.getSubject(selectedId) || subjects[0];
    var att = sub.attended;
    var cond = sub.conducted;
    var req = sub.required || 75;

    // Current
    var currentPct = engine.calculatePercentage(att, cond);

    // If Attend Today
    var attendAtt = att + 1;
    var attendCond = cond + 1;
    var attendPct = engine.calculatePercentage(attendAtt, attendCond);
    var attendDiff = Math.round((attendPct - currentPct) * 100) / 100;

    // If Miss Today
    var missAtt = att;
    var missCond = cond + 1;
    var missPct = engine.calculatePercentage(missAtt, missCond);
    var missDiff = Math.round((currentPct - missPct) * 100) / 100;

    // Safe to miss today?
    var isSafeToMiss = (missAtt / missCond) >= (req / 100);

    var verdictClass = isSafeToMiss ? 'safe' : 'danger';
    var verdictIcon = isSafeToMiss ? '🟢' : '🔴';
    var verdictTitle = isSafeToMiss ? 'YES — SAFE TO MISS TODAY!' : 'NO — DO NOT MISS TODAY!';
    var verdictSubtitle = '';

    if (isSafeToMiss) {
      var remainingBunks = engine.calculateSafeBunks(missAtt, missCond, req);
      verdictSubtitle = 'Attendance drops to <strong>' + missPct + '%</strong>, remaining safely above your ' + req + '% requirement. <strong>' + remainingBunks + ' more safe ' + (remainingBunks === 1 ? 'bunk' : 'bunks') + '</strong> remaining after today.';
    } else {
      var recoveryConsecutive = engine.calculateRecoveryClasses(missAtt, missCond, req);
      verdictSubtitle = 'Missing today drops attendance to <strong>' + missPct + '%</strong> (below ' + req + '% requirement). You will need to attend <strong>' + recoveryConsecutive + ' consecutive classes</strong> to recover eligibility.';
    }

    dom.todayDecisionContent.innerHTML = 
      '<div class="today-decision-verdict ' + verdictClass + '" style="margin-bottom:1rem; padding:0.85rem 1rem; border-radius:var(--radius-md); background:var(--color-' + (isSafeToMiss ? 'safe' : 'danger') + '-bg); border:1px solid var(--color-' + (isSafeToMiss ? 'safe' : 'danger') + ');">' +
        '<div style="font-size:1.1rem; font-weight:800; color:var(--color-' + (isSafeToMiss ? 'safe' : 'danger') + '); display:flex; align-items:center; gap:0.5rem;">' +
          '<span>' + verdictIcon + '</span>' +
          '<span>' + verdictTitle + '</span>' +
        '</div>' +
        '<div style="font-size:0.85rem; color:var(--text-secondary); margin-top:0.35rem; line-height:1.4;">' +
          verdictSubtitle +
        '</div>' +
      '</div>' +

      '<div class="today-scenarios-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:0.75rem;">' +
        '<div class="scenario-box" style="background:var(--bg-tertiary); padding:0.75rem 1rem; border-radius:var(--radius-md); border-left:4px solid var(--color-safe);">' +
          '<div style="font-size:0.75rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">If You Attend Today</div>' +
          '<div style="font-size:1.4rem; font-weight:800; color:var(--color-safe); margin:0.25rem 0;">' + attendPct + '% <span style="font-size:0.8rem; font-weight:600;">(+' + (attendDiff >= 0 ? '+' : '') + attendDiff + '%)</span></div>' +
          '<div style="font-size:0.78rem; color:var(--text-secondary);">' + attendAtt + ' of ' + attendCond + ' classes attended</div>' +
        '</div>' +

        '<div class="scenario-box" style="background:var(--bg-tertiary); padding:0.75rem 1rem; border-radius:var(--radius-md); border-left:4px solid var(--color-' + (isSafeToMiss ? 'warning' : 'danger') + ');">' +
          '<div style="font-size:0.75rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">If You Miss Today</div>' +
          '<div style="font-size:1.4rem; font-weight:800; color:var(--color-' + (isSafeToMiss ? 'warning' : 'danger') + '); margin:0.25rem 0;">' + missPct + '% <span style="font-size:0.8rem; font-weight:600;">(-' + missDiff + '%)</span></div>' +
          '<div style="font-size:0.78rem; color:var(--text-secondary);">' + missAtt + ' of ' + missCond + ' classes attended</div>' +
        '</div>' +
      '</div>';
  }

  // =========================================================================
  // DASHBOARD RENDERING & PROVENANCE STRIP (#3, #14, #15, #17, #26)
  // =========================================================================

  function renderCollegeStrip() {
    if (!dom.collegeInfoStrip) return;
    var identity = store.getAcademicIdentity();
    var rule = store.getRule();
    var settings = store.getSettings();

    var collegeLabel = identity.collegeName 
      ? (identity.collegeAbbr ? identity.collegeAbbr + ' (' + identity.collegeName + ')' : identity.collegeName) 
      : 'Dayananda Sagar Academy of Technology and Management (DSATM)';

    var programLabel = [identity.course, identity.branch, identity.semester, identity.scheme].filter(Boolean).join(' • ');

    var statusBadge = '';
    if (settings.isDemoMode) {
      statusBadge = '<span class="badge-tag" style="background:var(--color-warning-bg); color:var(--color-warning);">🧪 Demo Mode (Simulated Data)</span>';
    } else if (identity.isOfficialCurriculum) {
      statusBadge = '<span class="badge-tag official">🏛️ Official Verified Curriculum</span>';
    } else {
      statusBadge = '<span class="badge-tag custom">Custom Setup</span>';
    }

    var sourceLink = identity.curriculumSourceUrl 
      ? '<a href="' + identity.curriculumSourceUrl + '" target="_blank" rel="noopener noreferrer" class="curriculum-source-link">Official curriculum source ↗</a>' 
      : '';

    dom.collegeInfoStrip.innerHTML = 
      '<div>' +
        '<div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap; margin-bottom:0.25rem;">' +
          '<strong>' + escapeHtml(collegeLabel) + '</strong>' +
          statusBadge +
        '</div>' +
        '<div style="font-size:0.82rem; color:var(--text-secondary);">' +
          (programLabel ? escapeHtml(programLabel) + ' • ' : '') +
          'Requirement: <strong>' + (rule.minimumAttendance || 75) + '%</strong> ' +
          (sourceLink ? '• ' + sourceLink : '') +
        '</div>' +
      '</div>' +
      '<div>' +
        '<button class="btn btn-secondary btn-sm" id="btn-strip-change-academic">Change Program</button>' +
      '</div>';

    var changeBtn = document.getElementById('btn-strip-change-academic');
    if (changeBtn) {
      changeBtn.addEventListener('click', function () {
        openAcademicModal();
      });
    }
  }

  function renderDashboard() {
    renderCollegeStrip();

    var subjects = store.getSubjects();
    var rule = store.getRule();
    var defaultReq = rule.minimumAttendance || 75;
    var overall = engine.calculateOverall(subjects, defaultReq);

    // Primary Prominent Answer Card (#14, #17)
    var heroHtml = '';
    if (!overall.hasSubjects) {
      heroHtml = 
        '<div class="hero-question-title"><span>❓</span> How many classes can I miss?</div>' +
        '<div class="hero-answer-main">NO SUBJECTS ADDED</div>' +
        '<div class="hero-answer-subtitle">Select your academic curriculum to automatically load your subjects and safe bunks.</div>' +
        '<div style="margin-top: 1rem; display: flex; gap: 0.75rem; flex-wrap: wrap;">' +
          '<button class="btn btn-primary" id="hero-btn-select-curriculum"><span>🏛️</span> Select College &amp; Curriculum</button>' +
          '<button class="btn btn-secondary" id="hero-btn-load-demo">Try Demo Mode</button>' +
        '</div>';
      dom.dashboardBunkHero.className = 'bunk-hero-card';
    } else if (overall.overallPercentage < overall.requiredPercentage) {
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
    var selCurricBtn = document.getElementById('hero-btn-select-curriculum');
    if (selCurricBtn) selCurricBtn.addEventListener('click', openAcademicModal);
    var demoBtn = document.getElementById('hero-btn-load-demo');
    if (demoBtn) demoBtn.addEventListener('click', loadDemoModeAction);
    var recBtn = document.getElementById('hero-btn-view-recovery');
    if (recBtn) recBtn.addEventListener('click', function () { navigateTo('calculator'); });

    // Stats Grid
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
          '<span class="stat-label">Target Requirement</span>' +
          '<span style="font-size:0.75rem; color:var(--text-muted);">Configurable</span>' +
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

    renderDashboardSubjectList(overall.subjects);
    renderTodayDecision();
  }

  function renderDashboardSubjectList(subjects) {
    if (!dom.dashboardSubjectsList) return;
    if (!subjects || subjects.length === 0) {
      dom.dashboardSubjectsList.innerHTML = 
        '<div class="empty-state">' +
          '<div class="empty-state-icon">📚</div>' +
          '<h3>No Subjects Loaded</h3>' +
          '<p>Select your college curriculum to automatically load your subjects, or add subjects manually.</p>' +
          '<button class="btn btn-primary" id="btn-empty-select-curric"><span>🏛️</span> Select Curriculum</button>' +
        '</div>';
      var emptySel = document.getElementById('btn-empty-select-curric');
      if (emptySel) emptySel.addEventListener('click', openAcademicModal);
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

  // =========================================================================
  // SUBJECTS VIEW (Cards & Table) (#4, #16, #18)
  // =========================================================================

  function renderSubjectsView() {
    var rawSubjects = store.getSubjects();
    var defaultReq = store.getRule().minimumAttendance || 75;
    var overall = engine.calculateOverall(rawSubjects, defaultReq);
    var subjects = overall.subjects || [];

    // Filter subjects
    var filtered = subjects.filter(function (s) {
      if (subjectFilter === 'all') return true;
      if (subjectFilter === 'official') {
        var raw = store.getSubject(s.id);
        return raw && raw.isOfficial;
      }
      return s.status.status === subjectFilter;
    });

    if (filtered.length === 0) {
      dom.subjectsGrid.innerHTML = 
        '<div class="empty-state" style="grid-column: 1 / -1;">' +
          '<div class="empty-state-icon">🔍</div>' +
          '<h3>No Subjects Found</h3>' +
          '<p>' + (subjects.length === 0 ? 'You haven\'t loaded any subjects yet.' : 'No subjects match the selected "' + subjectFilter + '" filter.') + '</p>' +
          '<button class="btn btn-primary" id="btn-view-select-curric"><span>🏛️</span> Load Official Curriculum</button>' +
        '</div>';
      var viewCurric = document.getElementById('btn-view-select-curric');
      if (viewCurric) viewCurric.addEventListener('click', openAcademicModal);
    } else {
      var gridHtml = '';
      filtered.forEach(function (sub) {
        gridHtml += renderSubjectCardHtml(sub);
      });
      dom.subjectsGrid.innerHTML = gridHtml;
      attachSubjectCardListeners(dom.subjectsGrid);
    }

    renderSubjectsTable(subjects, defaultReq);
  }

  function renderSubjectCardHtml(sub) {
    var rawSub = store.getSubject(sub.id) || {};
    var statusClass = sub.status.status;
    var bunkBanner = '';

    if (sub.status.status === 'below') {
      bunkBanner = '<div class="bunk-status-text below">🔴 Below limit! Attend ' + sub.recoveryClasses + ' consecutive classes to reach ' + sub.required + '%.</div>';
    } else if (sub.status.status === 'warning') {
      bunkBanner = '<div class="bunk-status-text warning">🟡 Can miss ' + sub.safeBunks + ' class' + (sub.safeBunks === 1 ? '' : 'es') + ' (Near minimum ' + sub.required + '% limit)</div>';
    } else {
      bunkBanner = '<div class="bunk-status-text safe">🟢 Can safely miss ' + sub.safeBunks + ' class' + (sub.safeBunks === 1 ? '' : 'es') + ' & remain &ge; ' + sub.required + '%</div>';
    }

    var officialTag = rawSub.isOfficial 
      ? '<span class="badge-tag official" title="Verified in official university curriculum">Official</span>' 
      : '<span class="badge-tag custom" title="Manually added custom subject">Custom</span>';

    return (
      '<div class="subject-card status-' + statusClass + '" data-id="' + sub.id + '">' +
        '<div>' +
          '<div class="subject-card-top">' +
            '<div>' +
              '<div class="subject-name">' + escapeHtml(sub.name) + '</div>' +
              '<div style="display:flex; align-items:center; gap:0.4rem; margin-top:0.25rem;">' +
                (sub.code ? '<span class="subject-code">' + escapeHtml(sub.code) + '</span>' : '') +
                officialTag +
              '</div>' +
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
            '<span>Req: ' + sub.required + '%' + (rawSub.credits ? ' • ' + rawSub.credits + ' Cr' : '') + '</span>' +
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

    container.querySelectorAll('.btn-stepper').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var id = this.getAttribute('data-id');
        var action = this.getAttribute('data-action');
        store.markAttendance(id, action);
        showToast(action === 'attend' ? 'Marked attended (+1)' : 'Marked missed (+1 conducted)', 'info');
      });
    });

    container.querySelectorAll('.btn-undo-action').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var id = this.getAttribute('data-id');
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

    container.querySelectorAll('.btn-edit-sub').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        openSubjectModal(this.getAttribute('data-id'));
      });
    });

    container.querySelectorAll('.btn-dup-sub').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var dup = store.duplicateSubject(this.getAttribute('data-id'));
        if (dup) showToast('Duplicated ' + dup.name, 'success');
      });
    });

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
      dom.subjectsTableBody.innerHTML = '<tr><td colspan="8" style="text-align:center; color:var(--text-muted); padding:2rem;">No subjects loaded yet.</td></tr>';
      return;
    }

    var html = '';
    subjects.forEach(function (sub) {
      var rawSub = store.getSubject(sub.id) || {};
      var bunkText = sub.status.status === 'below' 
        ? '<span class="text-danger">0 (Need ' + sub.recoveryClasses + ' to recover)</span>' 
        : '<span class="text-safe">' + sub.safeBunks + '</span>';

      html += 
        '<tr>' +
          '<td><strong>' + escapeHtml(sub.name) + '</strong>' + (sub.code ? '<br><small class="text-muted font-mono">' + escapeHtml(sub.code) + '</small>' : '') + '</td>' +
          '<td><span class="badge-tag">' + escapeHtml(rawSub.type || 'Theory') + '</span></td>' +
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

  // =========================================================================
  // SIMULATOR & CALCULATORS (Preserved 100% Mathematically Correct Engine)
  // =========================================================================

  function runSimulation() {
    if (!dom.simResultBox) return;

    var targetId = dom.simSubjectSelect ? dom.simSubjectSelect.value : 'overall';
    var count = parseInt(dom.simCountInput.value, 10) || 1;
    var defaultReq = store.getRule().minimumAttendance || 75;

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

  function runRecoveryCalculator() {
    if (!dom.recoveryResultBanner) return;

    var targetId = dom.recoverySubjectSelect ? dom.recoverySubjectSelect.value : 'overall';
    var targetPct = parseFloat(recoveryTargetPct) || 75;
    var defaultReq = store.getRule().minimumAttendance || 75;

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

  function renderTargetMatrix() {
    if (!dom.targetMatrixGrid) return;

    var targetId = dom.matrixSubjectSelect ? dom.matrixSubjectSelect.value : 'overall';
    var defaultReq = store.getRule().minimumAttendance || 75;

    var attended = 0;
    var conducted = 0;

    if (targetId === 'overall') {
      var overall = engine.calculateOverall(store.getSubjects(), defaultReq);
      attended = overall.totalAttended;
      conducted = overall.totalConducted;
    } else {
      var sub = store.getSubject(targetId);
      if (sub) {
        attended = sub.attended;
        conducted = sub.conducted;
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

  // =========================================================================
  // SETTINGS VIEW & DEMO MODE (#14, #16, #28)
  // =========================================================================

  function renderSettingsView() {
    var identity = store.getAcademicIdentity();
    var rule = store.getRule();

    if (dom.settingMinAttendance) dom.settingMinAttendance.value = rule.minimumAttendance || 75;
    if (dom.settingLabAttendance) dom.settingLabAttendance.value = rule.labMinimum || 75;
    if (dom.settingCondonationNotes) dom.settingCondonationNotes.value = rule.condonationRules || '';

    if (dom.settingsAcademicSummary) {
      dom.settingsAcademicSummary.innerHTML = 
        '<div class="meta-field"><div class="meta-field-label">College</div><div class="meta-field-val">' + escapeHtml(identity.collegeName || 'Not selected') + '</div></div>' +
        '<div class="meta-field"><div class="meta-field-label">Degree &amp; Branch</div><div class="meta-field-val">' + escapeHtml((identity.course || '') + ' ' + (identity.branch || '')) + '</div></div>' +
        '<div class="meta-field"><div class="meta-field-label">Scheme &amp; Sem</div><div class="meta-field-val">' + escapeHtml((identity.scheme || '') + ' • ' + (identity.semester || '')) + '</div></div>' +
        '<div class="meta-field"><div class="meta-field-label">Status</div><div class="meta-field-val">' + (identity.isOfficialCurriculum ? '<span class="text-safe">Official Curriculum</span>' : 'Custom / Unverified') + '</div></div>';
    }

    if (dom.settingsRuleProvenance) {
      if (rule.sourceUrl) {
        dom.settingsRuleProvenance.innerHTML = 'Official Source: <a href="' + rule.sourceUrl + '" target="_blank" rel="noopener noreferrer" class="curriculum-source-link">' + escapeHtml(rule.sourceUrl) + ' ↗</a>';
      } else {
        dom.settingsRuleProvenance.innerHTML = 'Attendance requirement not verified — please confirm your college rule.';
      }
    }
  }

  function loadDemoModeAction() {
    store.loadDemoMode();
    showToast('Loaded Demo Mode with simulated student attendance! 🧪', 'success');
    navigateTo('dashboard');
  }

  // Manual Subject Modal (Add / Edit)
  function openSubjectModal(subjectId) {
    editingSubjectId = subjectId || null;
    var title = document.getElementById('subject-modal-title');
    var defaultReq = store.getRule().minimumAttendance || 75;

    if (editingSubjectId) {
      var sub = store.getSubject(editingSubjectId);
      if (!sub) return;
      if (title) title.textContent = 'Edit Subject';
      document.getElementById('input-subject-name').value = sub.name;
      document.getElementById('input-subject-code').value = sub.code || '';
      document.getElementById('input-subject-credits').value = sub.credits || 3;
      document.getElementById('input-subject-attended').value = sub.attended;
      document.getElementById('input-subject-conducted').value = sub.conducted;
      document.getElementById('input-subject-req').value = sub.required || defaultReq;
      document.getElementById('input-subject-target').value = sub.target || defaultReq;
      document.getElementById('input-subject-lab').checked = Boolean(sub.isLab);
      document.getElementById('input-subject-notes').value = sub.notes || '';
    } else {
      if (title) title.textContent = 'Add Custom Subject';
      var form = document.getElementById('form-subject');
      if (form) form.reset();
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

  // =========================================================================
  // EVENT LISTENERS & SETUP
  // =========================================================================

  function setupEventListeners() {
    dom.navLinks.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var target = this.getAttribute('data-view');
        if (target) navigateTo(target);
      });
    });

    if (dom.themeToggleBtn) {
      dom.themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // Landing Page Buttons
    var landingCalcBtn = document.getElementById('landing-btn-calc');
    if (landingCalcBtn) landingCalcBtn.addEventListener('click', openAcademicModal);

    var landingDemoBtn = document.getElementById('landing-btn-demo');
    if (landingDemoBtn) landingDemoBtn.addEventListener('click', loadDemoModeAction);

    // Header buttons
    var headerCurricBtn = document.getElementById('header-btn-academic-setup');
    if (headerCurricBtn) headerCurricBtn.addEventListener('click', openAcademicModal);

    var headerAddBtn = document.getElementById('header-btn-add-subject');
    if (headerAddBtn) headerAddBtn.addEventListener('click', function () { openSubjectModal(); });

    var subjectsAddBtn = document.getElementById('btn-subjects-add-subject');
    if (subjectsAddBtn) subjectsAddBtn.addEventListener('click', function () { openSubjectModal(); });

    var syncCurricAgain = document.getElementById('btn-sync-curriculum-again');
    if (syncCurricAgain) syncCurricAgain.addEventListener('click', openAcademicModal);

    var settingsChangeAcademicBtn = document.getElementById('btn-settings-change-academic');
    if (settingsChangeAcademicBtn) settingsChangeAcademicBtn.addEventListener('click', openAcademicModal);

    // Subject Filter Chips
    document.querySelectorAll('.filter-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        document.querySelectorAll('.filter-chip').forEach(function (c) { c.classList.remove('active'); });
        this.classList.add('active');
        subjectFilter = this.getAttribute('data-filter') || 'all';
        renderSubjectsView();
      });
    });

    // Dismiss Modals
    document.querySelectorAll('[data-dismiss="modal"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        closeSubjectModal();
        closeAcademicModal();
        if (dom.confirmSwitchModal) dom.confirmSwitchModal.classList.remove('active');
      });
    });

    // Academic Selectors Search & Filters
    if (dom.collegeSearchInput) {
      dom.collegeSearchInput.addEventListener('input', renderCollegeList);
    }
    if (dom.selectUnivFilter) {
      dom.selectUnivFilter.addEventListener('change', renderCollegeList);
    }
    if (dom.selectDistFilter) {
      dom.selectDistFilter.addEventListener('change', renderCollegeList);
    }
    if (dom.selectCourse) {
      dom.selectCourse.addEventListener('change', updateBranchesForSelectedCourse);
    }
    if (dom.selectBranch) {
      dom.selectBranch.addEventListener('change', updateSchemesForSelectedBranch);
    }
    if (dom.selectYear) {
      dom.selectYear.addEventListener('change', updateSemestersForSelectedYear);
    }

    // Discover Curriculum Button
    var discoverBtn = document.getElementById('btn-discover-curriculum');
    if (discoverBtn) {
      discoverBtn.addEventListener('click', discoverCurriculumAction);
    }

    // Quick Fill DSATM Button (Requirement #30 test shortcut)
    var quickDsatmBtn = document.getElementById('btn-quick-fill-dsatm');
    if (quickDsatmBtn) {
      quickDsatmBtn.addEventListener('click', function () {
        selectCollege('dsatm');
        if (dom.selectCourse) dom.selectCourse.value = 'B.E.';
        updateBranchesForSelectedCourse();
        if (dom.selectBranch) dom.selectBranch.value = 'CSE – Cyber Security';
        updateSchemesForSelectedBranch();
        if (dom.selectScheme) dom.selectScheme.value = '2022 Scheme';
        if (dom.selectYear) dom.selectYear.value = '3rd Year';
        updateSemestersForSelectedYear();
        if (dom.selectSemester) dom.selectSemester.value = '5th Semester';
        discoverCurriculumAction();
      });
    }

    // Manual Subject Form Submit
    var subjectForm = document.getElementById('form-subject');
    if (subjectForm) {
      subjectForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = (document.getElementById('input-subject-name').value || '').trim();
        var code = (document.getElementById('input-subject-code').value || '').trim();
        var credits = parseInt(document.getElementById('input-subject-credits').value, 10) || 3;
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
            credits: credits,
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
            credits: credits,
            attended: attended,
            conducted: conducted,
            required: req,
            target: target,
            isLab: isLab,
            isOfficial: false,
            notes: notes
          });
          showToast('Custom subject added successfully', 'success');
        }

        closeSubjectModal();
      });
    }

    // Simulator Interactive Controls
    if (dom.simSubjectSelect) dom.simSubjectSelect.addEventListener('change', runSimulation);
    if (dom.simCountInput) dom.simCountInput.addEventListener('input', runSimulation);

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
    if (dom.recoverySubjectSelect) dom.recoverySubjectSelect.addEventListener('change', runRecoveryCalculator);
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
    if (dom.matrixSubjectSelect) dom.matrixSubjectSelect.addEventListener('change', renderTargetMatrix);

    // Save Attendance Thresholds from Settings
    var saveRulesBtn = document.getElementById('btn-save-settings-rules');
    if (saveRulesBtn) {
      saveRulesBtn.addEventListener('click', function () {
        var minReq = parseFloat(dom.settingMinAttendance.value) || 75;
        var labReq = parseFloat(dom.settingLabAttendance.value) || 75;
        var condonation = dom.settingCondonationNotes.value || '';

        store.setRule({
          minimumAttendance: minReq,
          labMinimum: labReq,
          condonationRules: condonation
        });

        showToast('Attendance rules updated successfully', 'success');
      });
    }

    // Export JSON
    var exportJsonBtn = document.getElementById('btn-export-json');
    if (exportJsonBtn) {
      exportJsonBtn.addEventListener('click', function () {
        var dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(store.exportJSON());
        var a = document.createElement('a');
        a.setAttribute('href', dataStr);
        a.setAttribute('download', 'class_bunker_backup_' + new Date().toISOString().slice(0, 10) + '.json');
        document.body.appendChild(a);
        a.click();
        a.remove();
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
        var a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', 'class_bunker_attendance_' + new Date().toISOString().slice(0, 10) + '.csv');
        document.body.appendChild(a);
        a.click();
        a.remove();
        showToast('Exported attendance to CSV');
      });
    }

    // Import JSON
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
          var res = store.importJSON(evt.target.result);
          if (res.success) {
            showToast('Backup restored successfully!', 'success');
            navigateTo('dashboard');
          } else {
            showToast(res.error, 'error');
          }
        };
        reader.readAsText(file);
      });
    }

    // Today's Decision Subject Selector Listener
    if (dom.todaySubjectSelect) {
      dom.todaySubjectSelect.addEventListener('change', renderTodayDecision);
    }

    // Dashboard Update Attendance Button
    var dashAddAttBtn = document.getElementById('btn-dashboard-add-attendance');
    if (dashAddAttBtn) {
      dashAddAttBtn.addEventListener('click', openAttendanceChoiceModal);
    }

    // Subject Management Buttons
    var openOcrBtn = document.getElementById('btn-open-ocr-modal');
    if (openOcrBtn) {
      openOcrBtn.addEventListener('click', openOcrModal);
    }

    var syncCurricBtn = document.getElementById('btn-sync-curriculum-again');
    if (syncCurricBtn) {
      syncCurricBtn.addEventListener('click', openAcademicModal);
    }

    // Attendance Input Choice Modal
    if (dom.btnChoiceOcr) {
      dom.btnChoiceOcr.addEventListener('click', function () {
        closeAttendanceChoiceModal();
        openOcrModal();
      });
    }

    if (dom.btnChoiceManual) {
      dom.btnChoiceManual.addEventListener('click', function () {
        closeAttendanceChoiceModal();
        openManualEntryModal();
      });
    }

    // OCR Dropzone & Upload Listeners
    if (dom.ocrDropzone && dom.ocrFileInput) {
      dom.ocrDropzone.addEventListener('click', function () {
        dom.ocrFileInput.click();
      });

      dom.ocrDropzone.addEventListener('dragover', function (e) {
        e.preventDefault();
        dom.ocrDropzone.classList.add('drag-active');
      });

      dom.ocrDropzone.addEventListener('dragleave', function () {
        dom.ocrDropzone.classList.remove('drag-active');
      });

      dom.ocrDropzone.addEventListener('drop', function (e) {
        e.preventDefault();
        dom.ocrDropzone.classList.remove('drag-active');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleOcrFile(e.dataTransfer.files[0]);
        }
      });

      dom.ocrFileInput.addEventListener('change', function (e) {
        if (e.target.files && e.target.files[0]) {
          handleOcrFile(e.target.files[0]);
        }
      });
    }

    if (dom.btnSaveOcrAttendance) {
      dom.btnSaveOcrAttendance.addEventListener('click', saveOcrAttendance);
    }

    // Batch Manual Attendance Save
    if (dom.btnSaveManualAttendance) {
      dom.btnSaveManualAttendance.addEventListener('click', saveManualBatchAttendance);
    }

    // Modal Dismiss Listeners
    document.querySelectorAll('[data-dismiss="modal"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var modal = this.closest('.modal-overlay');
        if (modal) modal.classList.remove('active');
      });
    });

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
  }

  // App Initialization
  function init() {
    initDomElements();

    var currentTheme = store.getSettings().theme || 'dark';
    applyTheme(currentTheme);

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
      } else if (activeView === 'settings') {
        renderSettingsView();
      }
    });

    setupEventListeners();

    var subjects = store.getSubjects();
    if (subjects.length > 0 || store.getSettings().hasCompletedOnboarding) {
      navigateTo('dashboard');
    } else {
      navigateTo('landing');
    }

    // Global developer console & testing API
    window.ClassBunkerApp = {
      openAcademicModal: openAcademicModal,
      closeAcademicModal: closeAcademicModal,
      openAttendanceChoiceModal: openAttendanceChoiceModal,
      closeAttendanceChoiceModal: closeAttendanceChoiceModal,
      openOcrModal: openOcrModal,
      closeOcrModal: closeOcrModal,
      openManualEntryModal: openManualEntryModal,
      closeManualEntryModal: closeManualEntryModal,
      renderTodayDecision: renderTodayDecision,
      openSubjectModal: openSubjectModal,
      closeSubjectModal: closeSubjectModal,
      navigateTo: navigateTo,
      selectCollege: selectCollege,
      discoverCurriculumAction: discoverCurriculumAction,
      loadDemoModeAction: loadDemoModeAction,
      store: store,
      engine: engine,
      curriculumService: curriculumService
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
