/**
 * Class Bunker - Data Store & Persistence Layer
 * 
 * Future-ready local storage architecture designed for seamless migration to cloud databases.
 * Supports complete import/export (JSON/CSV) and pre-configured demo datasets (e.g. DSATM).
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['./engine'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./engine'));
  } else {
    root.ClassBunkerStore = factory(root.AttendanceEngine);
  }
}(typeof self !== 'undefined' ? self : this, function (AttendanceEngine) {
  'use strict';

  var STORAGE_KEY = 'class_bunker_app_state_v1';

  var DSATM_DEMO_COLLEGE = {
    id: 'dsatm_demo',
    name: 'Dayananda Sagar Academy of Technology and Management',
    abbreviation: 'DSATM',
    university: 'Visvesvaraya Technological University (VTU)',
    course: 'Bachelor of Engineering (B.E.)',
    branch: 'Computer Science and Engineering',
    year: '3rd Year',
    semester: '5th Semester'
  };

  var DSATM_DEMO_SUBJECTS = [
    {
      id: 'sub_1',
      name: 'Operating Systems',
      code: '21CS51',
      conducted: 50,
      attended: 42,
      required: 75,
      target: 80,
      isLab: false,
      notes: 'Includes Linux process scheduling and memory management'
    },
    {
      id: 'sub_2',
      name: 'Database Management Systems',
      code: '21CS52',
      conducted: 48,
      attended: 37,
      required: 75,
      target: 80,
      isLab: false,
      notes: 'SQL and relational algebra'
    },
    {
      id: 'sub_3',
      name: 'Computer Networks',
      code: '21CS53',
      conducted: 45,
      attended: 31,
      required: 75,
      target: 75,
      isLab: false,
      notes: 'Near limit, need careful attendance management'
    },
    {
      id: 'sub_4',
      name: 'Information and Network Security',
      code: '21CS54',
      conducted: 40,
      attended: 38,
      required: 75,
      target: 85,
      isLab: false,
      notes: 'Cryptography & cyber defense fundamentals'
    },
    {
      id: 'sub_5',
      name: 'DBMS & OS Laboratory',
      code: '21CSL55',
      conducted: 24,
      attended: 22,
      required: 80,
      target: 85,
      isLab: true,
      notes: 'Practical lab sessions require 80% minimum'
    }
  ];

  function generateId(prefix) {
    prefix = prefix || 'sub';
    return prefix + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
  }

  function getDefaultState() {
    return {
      schemaVersion: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      settings: {
        theme: 'dark', // 'dark' | 'light'
        defaultMinAttendance: 75,
        defaultTargetAttendance: 80,
        showDisclaimerModal: true,
        hasCompletedOnboarding: false,
        isDemoLoaded: false
      },
      college: {
        id: '',
        name: '',
        abbreviation: '',
        university: '',
        course: '',
        branch: '',
        year: '',
        semester: ''
      },
      attendanceRule: {
        minPercentage: 75,
        labMinPercentage: 80,
        condonationPercentage: 65,
        condonationPolicy: 'University permits condonation up to 10% on medical grounds upon submitting verified medical certificates.'
      },
      subjects: [],
      history: []
    };
  }

  function ClassBunkerStore() {
    this.state = this.load();
    this.listeners = [];
  }

  ClassBunkerStore.prototype.subscribe = function (listener) {
    if (typeof listener === 'function') {
      this.listeners.push(listener);
    }
    var self = this;
    return function () {
      self.listeners = self.listeners.filter(function (l) { return l !== listener; });
    };
  };

  ClassBunkerStore.prototype.notify = function () {
    var self = this;
    this.listeners.forEach(function (listener) {
      try {
        listener(self.state);
      } catch (err) {
        console.error('ClassBunkerStore listener error:', err);
      }
    });
  };

  ClassBunkerStore.prototype.load = function () {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.schemaVersion === 1) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read from localStorage, using fresh default state', e);
    }
    return getDefaultState();
  };

  ClassBunkerStore.prototype.save = function () {
    this.state.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Could not save to localStorage', e);
    }
    this.notify();
  };

  ClassBunkerStore.prototype.getState = function () {
    return this.state;
  };

  ClassBunkerStore.prototype.getSettings = function () {
    return this.state.settings;
  };

  ClassBunkerStore.prototype.updateSettings = function (updates) {
    this.state.settings = Object.assign({}, this.state.settings, updates);
    this.save();
  };

  ClassBunkerStore.prototype.getCollege = function () {
    return this.state.college;
  };

  ClassBunkerStore.prototype.setCollege = function (collegeData) {
    this.state.college = Object.assign({}, this.state.college, collegeData);
    this.save();
  };

  ClassBunkerStore.prototype.getRule = function () {
    return this.state.attendanceRule;
  };

  ClassBunkerStore.prototype.setRule = function (ruleData) {
    this.state.attendanceRule = Object.assign({}, this.state.attendanceRule, ruleData);
    if (typeof ruleData.minPercentage === 'number') {
      this.state.settings.defaultMinAttendance = ruleData.minPercentage;
    }
    this.save();
  };

  ClassBunkerStore.prototype.getSubjects = function () {
    return this.state.subjects || [];
  };

  ClassBunkerStore.prototype.getSubject = function (id) {
    return (this.state.subjects || []).find(function (s) { return s.id === id; });
  };

  ClassBunkerStore.prototype.addSubject = function (subject) {
    var minReq = typeof subject.required === 'number' && !isNaN(subject.required)
      ? subject.required
      : (this.state.attendanceRule.minPercentage || 75);

    var newSubject = {
      id: generateId('sub'),
      name: (subject.name || '').trim(),
      code: (subject.code || '').trim(),
      conducted: Math.max(0, parseInt(subject.conducted, 10) || 0),
      attended: Math.max(0, parseInt(subject.attended, 10) || 0),
      required: minReq,
      target: typeof subject.target === 'number' ? subject.target : minReq,
      isLab: Boolean(subject.isLab),
      notes: (subject.notes || '').trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (newSubject.attended > newSubject.conducted) {
      newSubject.conducted = newSubject.attended;
    }

    this.state.subjects.push(newSubject);
    this.save();
    return newSubject;
  };

  ClassBunkerStore.prototype.updateSubject = function (id, updates) {
    var index = this.state.subjects.findIndex(function (s) { return s.id === id; });
    if (index === -1) return null;

    var current = this.state.subjects[index];
    var updated = Object.assign({}, current, updates, {
      updatedAt: new Date().toISOString()
    });

    if (typeof updated.attended === 'number') {
      updated.attended = Math.max(0, updated.attended);
    }
    if (typeof updated.conducted === 'number') {
      updated.conducted = Math.max(0, updated.conducted);
    }
    if (updated.attended > updated.conducted) {
      updated.conducted = updated.attended;
    }

    this.state.subjects[index] = updated;
    this.save();
    return updated;
  };

  ClassBunkerStore.prototype.deleteSubject = function (id) {
    var before = this.state.subjects.length;
    this.state.subjects = this.state.subjects.filter(function (s) { return s.id !== id; });
    if (this.state.subjects.length !== before) {
      this.save();
      return true;
    }
    return false;
  };

  ClassBunkerStore.prototype.duplicateSubject = function (id) {
    var original = this.getSubject(id);
    if (!original) return null;

    var duplicate = Object.assign({}, original, {
      id: generateId('sub'),
      name: original.name + ' (Copy)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    this.state.subjects.push(duplicate);
    this.save();
    return duplicate;
  };

  ClassBunkerStore.prototype.resetSubject = function (id) {
    var subject = this.getSubject(id);
    if (!subject) return null;
    return this.updateSubject(id, { attended: 0, conducted: 0 });
  };

  /**
   * Fast attendance actions:
   * 'attend': student attended a class (+1 attended, +1 conducted)
   * 'miss': student missed a class (+1 conducted, +0 attended)
   * 'undo_attend': undo last attended class (-1 attended, -1 conducted)
   * 'undo_miss': undo last missed class (-1 conducted)
   */
  ClassBunkerStore.prototype.markAttendance = function (id, action) {
    var subject = this.getSubject(id);
    if (!subject) return null;

    var att = subject.attended;
    var cond = subject.conducted;

    switch (action) {
      case 'attend':
        att += 1;
        cond += 1;
        break;
      case 'miss':
        cond += 1;
        break;
      case 'undo_attend':
        if (att > 0 && cond > 0) {
          att -= 1;
          cond -= 1;
        }
        break;
      case 'undo_miss':
        if (cond > att) {
          cond -= 1;
        }
        break;
      default:
        return null;
    }

    return this.updateSubject(id, { attended: att, conducted: cond });
  };

  ClassBunkerStore.prototype.loadDemoData = function () {
    this.state.college = Object.assign({}, DSATM_DEMO_COLLEGE);
    this.state.attendanceRule = {
      minPercentage: 75,
      labMinPercentage: 80,
      condonationPercentage: 65,
      condonationPolicy: 'VTU/DSATM regulation: Minimum 75% attendance in theory courses and 80% in labs. Up to 10% condonation permitted on certified medical grounds.'
    };
    this.state.settings.defaultMinAttendance = 75;
    this.state.settings.defaultTargetAttendance = 80;
    this.state.settings.isDemoLoaded = true;
    this.state.settings.hasCompletedOnboarding = true;

    // Deep clone demo subjects
    this.state.subjects = DSATM_DEMO_SUBJECTS.map(function (sub) {
      return Object.assign({}, sub, {
        id: generateId('demo'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    });

    this.save();
    return this.state;
  };

  ClassBunkerStore.prototype.clearAllData = function () {
    var fresh = getDefaultState();
    fresh.settings.theme = this.state.settings.theme; // Preserve user's theme
    this.state = fresh;
    this.save();
    return this.state;
  };

  /**
   * Export all data as structured JSON
   */
  ClassBunkerStore.prototype.exportJSON = function () {
    var exportPayload = {
      app: 'Class Bunker',
      tagline: 'Bunk smart. Stay eligible.',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      data: this.state
    };
    return JSON.stringify(exportPayload, null, 2);
  };

  /**
   * Import data from JSON string
   */
  ClassBunkerStore.prototype.importJSON = function (jsonString) {
    try {
      var parsed = JSON.parse(jsonString);
      var incomingState = parsed.data || parsed;

      if (!incomingState || !Array.isArray(incomingState.subjects)) {
        return { success: false, error: 'Invalid Class Bunker backup file format.' };
      }

      this.state = Object.assign({}, getDefaultState(), incomingState, {
        schemaVersion: 1,
        updatedAt: new Date().toISOString()
      });

      this.save();
      return { success: true };
    } catch (e) {
      return { success: false, error: 'Malformed JSON file: ' + e.message };
    }
  };

  /**
   * Export subjects as CSV
   */
  ClassBunkerStore.prototype.exportCSV = function () {
    var subjects = this.getSubjects();
    var defaultReq = this.state.attendanceRule.minPercentage || 75;
    var overall = AttendanceEngine.calculateOverall(subjects, defaultReq);

    var rows = [
      ['Subject Name', 'Course Code', 'Classes Attended', 'Classes Conducted', 'Attendance %', 'Required %', 'Can Miss (Bunks)', 'Classes to Recover', 'Status']
    ];

    subjects.forEach(function (sub) {
      var pct = AttendanceEngine.calculatePercentage(sub.attended, sub.conducted);
      var req = sub.required || defaultReq;
      var bunks = AttendanceEngine.calculateSafeBunks(sub.attended, sub.conducted, req);
      var recovery = AttendanceEngine.calculateRecoveryClasses(sub.attended, sub.conducted, req);
      var status = AttendanceEngine.getStatus(sub.attended, sub.conducted, req).label;

      rows.push([
        '"' + (sub.name || '').replace(/"/g, '""') + '"',
        '"' + (sub.code || '').replace(/"/g, '""') + '"',
        sub.attended,
        sub.conducted,
        pct + '%',
        req + '%',
        bunks,
        recovery,
        '"' + status + '"'
      ]);
    });

    // Add Overall Summary row
    rows.push([]);
    rows.push([
      '"OVERALL ATTENDANCE"',
      '""',
      overall.totalAttended,
      overall.totalConducted,
      overall.overallPercentage + '%',
      overall.requiredPercentage + '%',
      overall.safeBunks,
      overall.recoveryClasses,
      '"' + overall.status.label + '"'
    ]);

    return rows.map(function (row) { return row.join(','); }).join('\r\n');
  };

  return ClassBunkerStore;
}));
