/**
 * Class Bunker - Data Store & Persistence Layer (Curriculum-Aware v2)
 * 
 * Future-ready local storage architecture with authoritative curriculum mapping.
 * Supports official curriculum synchronization, academic identity state,
 * complete JSON/CSV import/export, and verified college attendance rules.
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

  var STORAGE_KEY = 'class_bunker_app_state_v2';
  var LEGACY_STORAGE_KEY = 'class_bunker_app_state_v1';

  function generateId(prefix) {
    prefix = prefix || 'sub';
    return prefix + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
  }

  function getDefaultState() {
    return {
      schemaVersion: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      settings: {
        theme: 'dark', // 'dark' | 'light'
        defaultMinAttendance: 75,
        defaultTargetAttendance: 80,
        hasCompletedOnboarding: false,
        isDemoMode: false
      },
      academicIdentity: {
        state: 'Karnataka',
        collegeId: '',
        collegeName: '',
        collegeAbbr: '',
        university: '',
        universityId: '',
        course: '',
        branch: '',
        branchCode: '',
        scheme: '',
        year: '',
        semester: '',
        isOfficialCurriculum: false,
        curriculumSourceUrl: '',
        curriculumSourceName: '',
        curriculumVerifiedDate: ''
      },
      college: {
        id: '',
        name: '',
        abbreviation: '',
        university: '',
        district: '',
        officialWebsite: '',
        autonomous: false
      },
      attendanceRule: {
        isVerified: false,
        minimumAttendance: 75,
        theoryMinimum: 75,
        labMinimum: 75,
        condonationRules: 'VTU Regulation: Minimum 75% attendance required in each subject (theory and practical separately).',
        sourceUrl: '',
        verifiedDate: ''
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
        if (parsed && parsed.schemaVersion === 2) {
          return parsed;
        }
      }

      // Check migration from legacy v1
      var legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyRaw) {
        var legacy = JSON.parse(legacyRaw);
        if (legacy) {
          var state = getDefaultState();
          state.settings.theme = (legacy.settings && legacy.settings.theme) || 'dark';
          return state;
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

  ClassBunkerStore.prototype.getAcademicIdentity = function () {
    return this.state.academicIdentity;
  };

  ClassBunkerStore.prototype.setAcademicIdentity = function (identityData) {
    this.state.academicIdentity = Object.assign({}, this.state.academicIdentity, identityData);
    this.state.settings.hasCompletedOnboarding = true;
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
    if (typeof ruleData.minimumAttendance === 'number') {
      this.state.settings.defaultMinAttendance = ruleData.minimumAttendance;
    }
    this.save();
  };

  ClassBunkerStore.prototype.getSubjects = function () {
    return this.state.subjects || [];
  };

  ClassBunkerStore.prototype.getSubject = function (id) {
    return (this.state.subjects || []).find(function (s) { return s.id === id; });
  };

  /**
   * Apply official discovered curriculum to state
   * (Replaces subjects with official syllabus list while preserving user confirmation)
   */
  ClassBunkerStore.prototype.applyCurriculum = function (curriculumData) {
    var minReq = (curriculumData.attendanceRule && curriculumData.attendanceRule.minimumAttendance) || 75;
    var self = this;

    // Update Academic Identity
    this.state.academicIdentity = {
      state: 'Karnataka',
      collegeId: curriculumData.collegeId || this.state.college.id || '',
      collegeName: curriculumData.collegeName || '',
      collegeAbbr: curriculumData.shortName || '',
      university: curriculumData.university || 'VTU',
      course: curriculumData.course || '',
      branch: curriculumData.branch || '',
      branchCode: curriculumData.branchCode || '',
      scheme: curriculumData.scheme || '',
      year: curriculumData.year || '',
      semester: curriculumData.semester || '',
      isOfficialCurriculum: Boolean(curriculumData.isOfficial),
      curriculumSourceUrl: curriculumData.sourceUrl || '',
      curriculumSourceName: curriculumData.sourceName || '',
      curriculumVerifiedDate: curriculumData.verifiedDate || ''
    };

    // Update Attendance Rule
    if (curriculumData.attendanceRule) {
      this.state.attendanceRule = Object.assign({}, this.state.attendanceRule, curriculumData.attendanceRule, {
        isVerified: true
      });
      this.state.settings.defaultMinAttendance = curriculumData.attendanceRule.minimumAttendance || 75;
    }

    // Map subjects
    var rawSubs = curriculumData.subjects || [];
    this.state.subjects = rawSubs.map(function (sub) {
      return {
        id: generateId('sub'),
        code: (sub.code || '').trim(),
        name: (sub.name || '').trim(),
        category: sub.category || 'Professional Core Course',
        credits: typeof sub.credits === 'number' ? sub.credits : 3,
        conducted: 0,
        attended: 0,
        required: minReq,
        target: minReq + 5,
        type: sub.type || (sub.isLab ? 'Practical / Lab' : 'Theory'),
        isLab: Boolean(sub.isLab),
        isOfficial: true,
        isElective: Boolean(sub.isElective),
        notes: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    });

    this.state.settings.isDemoMode = false;
    this.state.settings.hasCompletedOnboarding = true;
    this.save();
    return this.state.subjects;
  };

  /**
   * Add a manual custom subject
   */
  ClassBunkerStore.prototype.addSubject = function (subject) {
    var minReq = typeof subject.required === 'number' && !isNaN(subject.required)
      ? subject.required
      : (this.state.attendanceRule.minimumAttendance || 75);

    var newSubject = {
      id: generateId('sub'),
      name: (subject.name || '').trim(),
      code: (subject.code || '').trim(),
      category: subject.category || 'Custom Subject',
      credits: typeof subject.credits === 'number' ? subject.credits : 3,
      conducted: Math.max(0, parseInt(subject.conducted, 10) || 0),
      attended: Math.max(0, parseInt(subject.attended, 10) || 0),
      required: minReq,
      target: typeof subject.target === 'number' ? subject.target : minReq,
      type: subject.isLab ? 'Practical / Lab' : 'Theory',
      isLab: Boolean(subject.isLab),
      isOfficial: Boolean(subject.isOfficial),
      isElective: Boolean(subject.isElective),
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
      isOfficial: false, // Duplicates are marked custom
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    this.state.subjects.push(duplicate);
    this.save();
    return duplicate;
  };

  ClassBunkerStore.prototype.resetSubject = function (id) {
    return this.updateSubject(id, { attended: 0, conducted: 0 });
  };

  /**
   * Fast attendance actions
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

  /**
   * Dedicated, clearly labeled Demo Mode (Requirement #14)
   * Does NOT masquerade as official curriculum
   */
  ClassBunkerStore.prototype.loadDemoMode = function () {
    this.state.academicIdentity = {
      state: 'Karnataka',
      collegeId: 'dsatm',
      collegeName: 'Dayananda Sagar Academy of Technology and Management',
      collegeAbbr: 'DSATM',
      university: 'VTU',
      universityId: 'vtu',
      course: 'B.E.',
      branch: 'CSE – Cyber Security',
      branchCode: 'CY',
      scheme: '2022 Scheme',
      year: '3rd Year',
      semester: '5th Semester',
      isOfficialCurriculum: false, // Explicitly false for simulated demo mode
      curriculumSourceUrl: 'https://vtu.ac.in/en/b-e-scheme-syllabus/',
      curriculumSourceName: 'Demonstration Sample Dataset (Simulated Attendance)',
      curriculumVerifiedDate: '2024-09-15'
    };

    this.state.college = {
      id: 'dsatm',
      name: 'Dayananda Sagar Academy of Technology and Management',
      abbreviation: 'DSATM',
      university: 'VTU',
      district: 'Bengaluru Urban',
      officialWebsite: 'https://dsatm.edu.in',
      autonomous: false
    };

    this.state.attendanceRule = {
      isVerified: true,
      minimumAttendance: 75,
      theoryMinimum: 75,
      labMinimum: 75,
      condonationRules: 'VTU Academic Regulation (Section 8): 75% minimum required.',
      sourceUrl: 'https://vtu.ac.in',
      verifiedDate: '2024-09-15'
    };

    this.state.settings.defaultMinAttendance = 75;
    this.state.settings.isDemoMode = true;
    this.state.settings.hasCompletedOnboarding = true;

    // Realistic attendance sample data
    this.state.subjects = [
      {
        id: generateId('demo'),
        code: 'BCS501',
        name: 'Software Engineering and Project Management',
        category: 'Professional Core Course',
        credits: 3,
        conducted: 42,
        attended: 37,
        required: 75,
        target: 80,
        type: 'Theory',
        isLab: false,
        isOfficial: true,
        isElective: false,
        notes: 'Includes Agile & Scrum modeling'
      },
      {
        id: generateId('demo'),
        code: 'BCS502',
        name: 'Computer Networks',
        category: 'Integrated Professional Core',
        credits: 4,
        conducted: 40,
        attended: 31,
        required: 75,
        target: 80,
        type: 'Integrated Theory',
        isLab: false,
        isOfficial: true,
        isElective: false,
        notes: 'Near limit, avoid missing'
      },
      {
        id: generateId('demo'),
        code: 'BCS503',
        name: 'Theory of Computation',
        category: 'Professional Core Course',
        credits: 3,
        conducted: 38,
        attended: 25,
        required: 75,
        target: 75,
        type: 'Theory',
        isLab: false,
        isOfficial: true,
        isElective: false,
        notes: 'Under limit! Needs consecutive classes'
      },
      {
        id: generateId('demo'),
        code: 'BCY504',
        name: 'Cyber Security Fundamentals & Cyber Laws',
        category: 'Professional Core Course',
        credits: 3,
        conducted: 35,
        attended: 32,
        required: 75,
        target: 85,
        type: 'Theory',
        isLab: false,
        isOfficial: true,
        isElective: false,
        notes: 'Safe standing'
      },
      {
        id: generateId('demo'),
        code: 'BCSL505',
        name: 'Computer Networks Laboratory',
        category: 'Laboratory Course',
        credits: 1,
        conducted: 20,
        attended: 18,
        required: 75,
        target: 80,
        type: 'Practical / Lab',
        isLab: true,
        isOfficial: true,
        isElective: false,
        notes: 'Socket programming in C'
      },
      {
        id: generateId('demo'),
        code: 'BCYL506',
        name: 'Cyber Security & Vulnerability Analysis Lab',
        category: 'Laboratory Course',
        credits: 1,
        conducted: 18,
        attended: 17,
        required: 75,
        target: 80,
        type: 'Practical / Lab',
        isLab: true,
        isOfficial: true,
        isElective: false,
        notes: 'Wireshark & Nmap packet analysis'
      }
    ];

    this.save();
    return this.state;
  };

  ClassBunkerStore.prototype.clearAllData = function () {
    var fresh = getDefaultState();
    fresh.settings.theme = this.state.settings.theme;
    this.state = fresh;
    this.save();
    return this.state;
  };

  ClassBunkerStore.prototype.exportJSON = function () {
    var payload = {
      app: 'Class Bunker',
      tagline: 'Bunk smart. Stay eligible.',
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      data: this.state
    };
    return JSON.stringify(payload, null, 2);
  };

  ClassBunkerStore.prototype.importJSON = function (jsonString) {
    try {
      var parsed = JSON.parse(jsonString);
      var incomingState = parsed.data || parsed;

      if (!incomingState || !Array.isArray(incomingState.subjects)) {
        return { success: false, error: 'Invalid Class Bunker backup file format.' };
      }

      this.state = Object.assign({}, getDefaultState(), incomingState, {
        schemaVersion: 2,
        updatedAt: new Date().toISOString()
      });

      this.save();
      return { success: true };
    } catch (e) {
      return { success: false, error: 'Malformed JSON file: ' + e.message };
    }
  };

  ClassBunkerStore.prototype.exportCSV = function () {
    var subjects = this.getSubjects();
    var defaultReq = this.state.attendanceRule.minimumAttendance || 75;
    var overall = AttendanceEngine.calculateOverall(subjects, defaultReq);

    var rows = [
      ['Subject Name', 'Course Code', 'Category', 'Type', 'Attended', 'Conducted', 'Attendance %', 'Required %', 'Can Miss (Bunks)', 'Classes to Recover', 'Status', 'Curriculum Status']
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
        '"' + (sub.category || '').replace(/"/g, '""') + '"',
        '"' + (sub.type || '').replace(/"/g, '""') + '"',
        sub.attended,
        sub.conducted,
        pct + '%',
        req + '%',
        bunks,
        recovery,
        '"' + status + '"',
        sub.isOfficial ? '"Official Curriculum"' : '"Custom / Unverified"'
      ]);
    });

    rows.push([]);
    rows.push([
      '"OVERALL ATTENDANCE"',
      '""',
      '""',
      '""',
      overall.totalAttended,
      overall.totalConducted,
      overall.overallPercentage + '%',
      overall.requiredPercentage + '%',
      overall.safeBunks,
      overall.recoveryClasses,
      '"' + overall.status.label + '"',
      '""'
    ]);

    return rows.map(function (row) { return row.join(','); }).join('\r\n');
  };

  return ClassBunkerStore;
}));
