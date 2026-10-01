/**
 * Class Bunker - Mathematical Attendance Calculation Engine
 * 
 * Universal attendance planning formulas for college and university students.
 * Mathematically verified for integer-exact calculations without floating-point errors.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.AttendanceEngine = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var AttendanceEngine = {};

  /**
   * Validate attendance inputs
   * @param {number} attended - Number of classes attended
   * @param {number} conducted - Total classes conducted
   * @param {number} required - Required attendance percentage (0 to 100)
   * @returns {Object} { isValid: boolean, error: string|null }
   */
  AttendanceEngine.validateInputs = function (attended, conducted, required) {
    if (typeof attended !== 'number' || isNaN(attended) || attended < 0) {
      return { isValid: false, error: 'Attended classes must be a non-negative number.' };
    }
    if (typeof conducted !== 'number' || isNaN(conducted) || conducted < 0) {
      return { isValid: false, error: 'Conducted classes must be a non-negative number.' };
    }
    if (attended > conducted) {
      return { isValid: false, error: 'Attended classes cannot exceed conducted classes.' };
    }
    if (typeof required !== 'number' || isNaN(required) || required < 0 || required > 100) {
      return { isValid: false, error: 'Required attendance must be between 0% and 100%.' };
    }
    return { isValid: true, error: null };
  };

  /**
   * Calculate current attendance percentage
   * @param {number} attended
   * @param {number} conducted
   * @returns {number} percentage rounded to 2 decimal places (or 100 if conducted is 0)
   */
  AttendanceEngine.calculatePercentage = function (attended, conducted) {
    if (conducted === 0) {
      return 100.0;
    }
    var pct = (attended / conducted) * 100;
    return Math.round(pct * 100) / 100;
  };

  /**
   * Calculate maximum number of future classes that can be missed
   * while remaining at or above the required percentage.
   * 
   * Mathematical proof:
   * We seek the largest integer x >= 0 such that:
   *   attended / (conducted + x) >= R / 100
   *   100 * attended >= R * (conducted + x)
   *   conducted + x <= floor((100 * attended) / R)
   *   x <= floor((100 * attended) / R) - conducted
   * 
   * If current attendance < R%, x = 0 (cannot safely miss any class).
   * 
   * @param {number} attended
   * @param {number} conducted
   * @param {number} required - Required percentage (e.g. 75)
   * @returns {number} Integer number of classes that can be missed
   */
  AttendanceEngine.calculateSafeBunks = function (attended, conducted, required) {
    if (conducted === 0) return 0;
    if (required <= 0) return 999; // With 0% requirement, can miss all classes
    if (required > 100) return 0;

    // Check if currently below requirement
    // Use integer arithmetic: 100 * attended < required * conducted
    if (100 * attended < required * conducted) {
      return 0;
    }

    var maxTotalClasses = Math.floor((100 * attended) / required);
    var safeBunks = maxTotalClasses - conducted;
    return Math.max(0, safeBunks);
  };

  /**
   * Calculate minimum consecutive classes required to attend to recover to target percentage.
   * 
   * Mathematical proof:
   * We seek the smallest integer x >= 0 such that:
   *   (attended + x) / (conducted + x) >= R / 100
   *   100 * (attended + x) >= R * (conducted + x)
   *   100 * attended + 100 * x >= R * conducted + R * x
   *   (100 - R) * x >= R * conducted - 100 * attended
   * 
   * If R === 100:
   *   If attended === conducted => x = 0
   *   If attended < conducted => Impossible to recover to 100% once a class is missed. (Infinity)
   * If R < 100:
   *   x = ceil((R * conducted - 100 * attended) / (100 - R))
   * 
   * @param {number} attended
   * @param {number} conducted
   * @param {number} required - Target percentage
   * @returns {number} Consecutive classes to attend (0 if already >= required, Infinity if impossible)
   */
  AttendanceEngine.calculateRecoveryClasses = function (attended, conducted, required) {
    if (conducted === 0) return 0;
    if (required <= 0) return 0;

    // If already at or above required percentage
    if (100 * attended >= required * conducted) {
      return 0;
    }

    if (required >= 100) {
      // If student missed any class, 100% can never be reached
      return attended === conducted ? 0 : Infinity;
    }

    var numerator = (required * conducted) - (100 * attended);
    var denominator = 100 - required;
    var x = Math.ceil(numerator / denominator);
    return Math.max(0, x);
  };

  /**
   * Determine attendance status code and label
   * 
   * Status Rules:
   * - 'below': Current percentage is strictly less than required percentage.
   * - 'warning': At or above requirement, but margin is razor-thin (can miss <= 1 class or < 2% above).
   * - 'safe': Comfortably above requirement (can miss >= 2 classes AND >= required + 2%).
   * 
   * @param {number} attended
   * @param {number} conducted
   * @param {number} required
   * @returns {Object} { status: 'safe'|'warning'|'below', label: string, color: string, icon: string }
   */
  AttendanceEngine.getStatus = function (attended, conducted, required) {
    if (conducted === 0) {
      return {
        status: 'safe',
        label: 'No Classes Yet',
        badge: 'Safe',
        color: '#10b981',
        icon: '🟢'
      };
    }

    var pct = (attended / conducted) * 100;
    var safeBunks = AttendanceEngine.calculateSafeBunks(attended, conducted, required);

    if (pct < required) {
      return {
        status: 'below',
        label: 'Below Requirement',
        badge: 'Below Requirement',
        color: '#ef4444',
        icon: '🔴'
      };
    }

    // Near limit if safe bunks <= 1 or buffer percentage is < 2.5%
    if (safeBunks <= 1 || (pct - required) < 2.5) {
      return {
        status: 'warning',
        label: 'Near Limit / Warning',
        badge: 'Near Limit',
        color: '#f59e0b',
        icon: '🟡'
      };
    }

    return {
      status: 'safe',
      label: 'Safe',
      badge: 'Safe',
      color: '#10b981',
      icon: '🟢'
    };
  };

  /**
   * Simulate effect of missing or attending future classes
   * 
   * @param {number} attended - Current attended
   * @param {number} conducted - Current conducted
   * @param {number} required - Required percentage
   * @param {number} deltaAttended - Additional attended classes (can be 0)
   * @param {number} deltaMissed - Additional missed classes (can be 0)
   * @returns {Object} Simulation results
   */
  AttendanceEngine.simulate = function (attended, conducted, required, deltaAttended, deltaMissed) {
    deltaAttended = Math.max(0, parseInt(deltaAttended, 10) || 0);
    deltaMissed = Math.max(0, parseInt(deltaMissed, 10) || 0);

    var currentPct = AttendanceEngine.calculatePercentage(attended, conducted);
    var newAttended = attended + deltaAttended;
    var newConducted = conducted + deltaAttended + deltaMissed;
    var newPct = AttendanceEngine.calculatePercentage(newAttended, newConducted);
    var diff = Math.round((newPct - currentPct) * 100) / 100;

    var newSafeBunks = AttendanceEngine.calculateSafeBunks(newAttended, newConducted, required);
    var newRecovery = AttendanceEngine.calculateRecoveryClasses(newAttended, newConducted, required);
    var newStatus = AttendanceEngine.getStatus(newAttended, newConducted, required);

    return {
      currentPct: currentPct,
      newAttended: newAttended,
      newConducted: newConducted,
      newPct: newPct,
      diff: diff,
      safeBunks: newSafeBunks,
      recoveryClasses: newRecovery,
      status: newStatus
    };
  };

  /**
   * Calculate recovery milestones for projection
   * Shows projected percentage after attending 1, 3, 5, 10 consecutive classes
   * 
   * @param {number} attended
   * @param {number} conducted
   * @param {number} required
   * @param {Array<number>} milestones - Optional milestones array, defaults to [1, 2, 3, 5, 10]
   * @returns {Array<Object>}
   */
  AttendanceEngine.getRecoveryProjections = function (attended, conducted, required, milestones) {
    milestones = milestones || [1, 2, 3, 5, 10];
    var currentPct = AttendanceEngine.calculatePercentage(attended, conducted);
    var results = [];

    for (var i = 0; i < milestones.length; i++) {
      var count = milestones[i];
      var newAtt = attended + count;
      var newCond = conducted + count;
      var newPct = AttendanceEngine.calculatePercentage(newAtt, newCond);
      var status = AttendanceEngine.getStatus(newAtt, newCond, required);

      results.push({
        classesAttended: count,
        newAttended: newAtt,
        newConducted: newCond,
        newPct: newPct,
        diff: Math.round((newPct - currentPct) * 100) / 100,
        status: status
      });
    }

    return results;
  };

  /**
   * Calculate attendance target matrix
   * Evaluates targets (75%, 80%, 85%, 90%, or custom) and computes safe bunks & recovery for each.
   * 
   * @param {number} attended
   * @param {number} conducted
   * @param {Array<number>} targets - Array of target percentages
   * @returns {Array<Object>} Target analysis
   */
  AttendanceEngine.getTargetMatrix = function (attended, conducted, targets) {
    targets = targets || [75, 80, 85, 90];
    var currentPct = AttendanceEngine.calculatePercentage(attended, conducted);
    var results = [];

    for (var i = 0; i < targets.length; i++) {
      var target = targets[i];
      var canMiss = AttendanceEngine.calculateSafeBunks(attended, conducted, target);
      var mustAttend = AttendanceEngine.calculateRecoveryClasses(attended, conducted, target);
      var isAchieved = currentPct >= target;

      results.push({
        targetPct: target,
        currentPct: currentPct,
        isAchieved: isAchieved,
        safeBunks: canMiss,
        recoveryClasses: mustAttend,
        status: AttendanceEngine.getStatus(attended, conducted, target)
      });
    }

    return results;
  };

  /**
   * Calculate overall summary for a list of subjects
   * 
   * CRITICAL REQUIREMENT:
   * Do NOT simply average subject percentages!
   * Overall attendance = Sum(attended) / Sum(conducted) * 100
   * 
   * @param {Array<Object>} subjects - Array of subject objects { attended, conducted, required }
   * @param {number} defaultRequired - Default fallback required %
   * @returns {Object} Complete overall attendance summary
   */
  AttendanceEngine.calculateOverall = function (subjects, defaultRequired) {
    defaultRequired = defaultRequired || 75;
    var totalAttended = 0;
    var totalConducted = 0;
    var subjectSummaries = [];
    var subjectsBelow = 0;
    var subjectsWarning = 0;
    var subjectsSafe = 0;

    if (!Array.isArray(subjects) || subjects.length === 0) {
      return {
        totalAttended: 0,
        totalConducted: 0,
        overallPercentage: 100.0,
        requiredPercentage: defaultRequired,
        safeBunks: 0,
        recoveryClasses: 0,
        status: AttendanceEngine.getStatus(0, 0, defaultRequired),
        subjectsBelow: 0,
        subjectsWarning: 0,
        subjectsSafe: 0,
        subjectCount: 0,
        hasSubjects: false
      };
    }

    for (var i = 0; i < subjects.length; i++) {
      var sub = subjects[i];
      var att = Math.max(0, parseInt(sub.attended, 10) || 0);
      var cond = Math.max(0, parseInt(sub.conducted, 10) || 0);
      // Ensure attended doesn't exceed conducted
      if (att > cond) cond = att;

      var req = typeof sub.required === 'number' && !isNaN(sub.required) ? sub.required : defaultRequired;

      totalAttended += att;
      totalConducted += cond;

      var pct = AttendanceEngine.calculatePercentage(att, cond);
      var safeBunks = AttendanceEngine.calculateSafeBunks(att, cond, req);
      var recovery = AttendanceEngine.calculateRecoveryClasses(att, cond, req);
      var status = AttendanceEngine.getStatus(att, cond, req);

      if (status.status === 'below') subjectsBelow++;
      else if (status.status === 'warning') subjectsWarning++;
      else subjectsSafe++;

      subjectSummaries.push({
        id: sub.id,
        name: sub.name,
        code: sub.code || '',
        attended: att,
        conducted: cond,
        percentage: pct,
        required: req,
        target: sub.target || req,
        safeBunks: safeBunks,
        recoveryClasses: recovery,
        status: status
      });
    }

    var overallPct = AttendanceEngine.calculatePercentage(totalAttended, totalConducted);
    var overallSafeBunks = AttendanceEngine.calculateSafeBunks(totalAttended, totalConducted, defaultRequired);
    var overallRecovery = AttendanceEngine.calculateRecoveryClasses(totalAttended, totalConducted, defaultRequired);
    var overallStatus = AttendanceEngine.getStatus(totalAttended, totalConducted, defaultRequired);

    return {
      totalAttended: totalAttended,
      totalConducted: totalConducted,
      overallPercentage: overallPct,
      requiredPercentage: defaultRequired,
      safeBunks: overallSafeBunks,
      recoveryClasses: overallRecovery,
      status: overallStatus,
      subjectsBelow: subjectsBelow,
      subjectsWarning: subjectsWarning,
      subjectsSafe: subjectsSafe,
      subjectCount: subjects.length,
      hasSubjects: true,
      subjects: subjectSummaries
    };
  };

  return AttendanceEngine;
}));
