/**
 * Class Bunker - Curriculum & Academic Registry Service (10-Tier Flow)
 * 
 * Orchestrates multi-tier academic lookup matching the exact flow:
 * Karnataka -> District -> College -> University -> Course -> Branch -> Scheme -> Academic Year -> Year -> Semester -> Official Subjects
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['./data/districts', './data/universities', './data/colleges', './data/curricula'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(
      require('./data/districts'),
      require('./data/universities'),
      require('./data/colleges'),
      require('./data/curricula')
    );
  } else {
    root.ClassBunkerCurriculumService = factory(
      root.ClassBunkerDistricts,
      root.ClassBunkerUniversities,
      root.ClassBunkerColleges,
      root.ClassBunkerCurricula
    );
  }
}(typeof self !== 'undefined' ? self : this, function (districts, universities, colleges, curricula) {
  'use strict';

  var CurriculumService = {};

  var BRANCH_DEFINITIONS = {
    'B.E.': [
      'CSE – Cyber Security',
      'Computer Science and Engineering',
      'Electrical and Electronics Engineering',
      'Information Science and Engineering',
      'Electronics and Communication Engineering',
      'Artificial Intelligence and Machine Learning',
      'Mechanical Engineering',
      'Civil Engineering'
    ],
    'B.Tech': [
      'Computer Science and Engineering',
      'Artificial Intelligence and Data Science',
      'Cyber Security',
      'Information Technology'
    ],
    'M.Tech': [
      'Computer Science and Engineering',
      'VLSI Design and Embedded Systems',
      'Digital Communication'
    ],
    'MCA': [
      'Master of Computer Applications'
    ],
    'MBA': [
      'Master of Business Administration'
    ]
  };

  /**
   * 1. Get States (Karnataka primary)
   */
  CurriculumService.getStates = function () {
    return ['Karnataka'];
  };

  /**
   * 2. Get All 31 Districts of Karnataka
   */
  CurriculumService.getDistricts = function () {
    if (Array.isArray(districts)) {
      return districts.map(function (d) { return d.name; }).sort();
    }
    return [
      'Bagalkote', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban',
      'Bidar', 'Chamarajanagar', 'Chikkaballapura', 'Chikkamagaluru', 'Chitradurga',
      'Dakshina Kannada', 'Davanagere', 'Dharwad', 'Gadag', 'Hassan',
      'Haveri', 'Kalaburagi', 'Kodagu', 'Kolar', 'Koppal',
      'Mandya', 'Mysuru', 'Raichur', 'Ramanagara', 'Shivamogga',
      'Tumakuru', 'Udupi', 'Uttara Kannada', 'Vijayanagara', 'Vijayapura', 'Yadgir'
    ];
  };

  /**
   * 3. Get Colleges filtered by District, University, or Query
   */
  CurriculumService.getColleges = function (filter) {
    filter = filter || {};
    var query = (filter.query || '').trim().toLowerCase();
    var univId = filter.universityId || '';
    var district = filter.district || '';

    return colleges.filter(function (col) {
      if (univId && col.universityId !== univId) return false;
      if (district && district !== 'All Districts' && col.district !== district) return false;

      if (query) {
        var matchName = col.name.toLowerCase().indexOf(query) !== -1;
        var matchShort = (col.shortName || '').toLowerCase().indexOf(query) !== -1;
        var matchCode = (col.vtuCode || '').toLowerCase().indexOf(query) !== -1;
        var matchDist = (col.district || '').toLowerCase().indexOf(query) !== -1;
        if (!matchName && !matchShort && !matchCode && !matchDist) return false;
      }

      return true;
    });
  };

  CurriculumService.getCollegeById = function (id) {
    return colleges.find(function (c) { return c.id === id; });
  };

  /**
   * 4. Get University affiliation for selected college
   */
  CurriculumService.getUniversityForCollege = function (collegeId) {
    var col = CurriculumService.getCollegeById(collegeId);
    if (!col) return 'Visvesvaraya Technological University (VTU)';
    return col.university || 'Visvesvaraya Technological University (VTU)';
  };

  CurriculumService.getUniversities = function () {
    return universities;
  };

  /**
   * 5. Get Courses for selected college
   */
  CurriculumService.getCourses = function (collegeId) {
    var col = CurriculumService.getCollegeById(collegeId);
    if (!col || !Array.isArray(col.availablePrograms) || col.availablePrograms.length === 0) {
      return ['B.E.'];
    }
    return col.availablePrograms;
  };

  /**
   * 6. Get Branches for selected college & course
   */
  CurriculumService.getBranches = function (collegeId, course) {
    course = course || 'B.E.';
    return BRANCH_DEFINITIONS[course] || BRANCH_DEFINITIONS['B.E.'];
  };

  /**
   * 7. Get Schemes for selected college & program
   */
  CurriculumService.getSchemes = function (collegeId, course, branch) {
    var col = CurriculumService.getCollegeById(collegeId);
    if (col && Array.isArray(col.availableSchemes) && col.availableSchemes.length > 0) {
      return col.availableSchemes;
    }
    return ['2022 Scheme', '2021 Scheme'];
  };

  /**
   * 8. Get Academic Years
   */
  CurriculumService.getAcademicYears = function () {
    return ['2024-2025', '2023-2024', '2025-2026'];
  };

  /**
   * 9. Get Years
   */
  CurriculumService.getYears = function (collegeId, course) {
    if (course === 'MCA' || course === 'MBA' || course === 'M.Tech') {
      return ['1st Year', '2nd Year'];
    }
    return ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  };

  /**
   * 10. Get Semesters corresponding to Year
   */
  CurriculumService.getSemesters = function (year) {
    switch (year) {
      case '1st Year':
        return ['1st Semester', '2nd Semester'];
      case '2nd Year':
        return ['3rd Semester', '4th Semester'];
      case '3rd Year':
        return ['5th Semester', '6th Semester'];
      case '4th Year':
        return ['7th Semester', '8th Semester'];
      default:
        return ['1st Semester', '2nd Semester', '3rd Semester', '4th Semester', '5th Semester', '6th Semester', '7th Semester', '8th Semester'];
    }
  };

  /**
   * Automatic Official Subject Discovery
   */
  CurriculumService.getCurriculum = function (collegeId, course, branch, scheme, semester) {
    if (!collegeId || !course || !branch || !scheme || !semester) {
      return { found: false, message: 'Incomplete academic selection.' };
    }

    var col = CurriculumService.getCollegeById(collegeId);
    var targetUnivId = col ? col.universityId : 'vtu';

    // 1. Direct College specific match
    var match = curricula.find(function (cur) {
      return cur.collegeId === collegeId &&
             cur.course === course &&
             cur.branch === branch &&
             cur.scheme === scheme &&
             cur.semester === semester;
    });

    // 2. VTU affiliated central curriculum match
    if (!match && col && !col.autonomous) {
      match = curricula.find(function (cur) {
        return (cur.collegeId === 'dsatm' || cur.universityId === 'vtu') &&
               cur.course === course &&
               cur.branch === branch &&
               cur.scheme === scheme &&
               cur.semester === semester;
      });
    }

    if (match) {
      return {
        found: true,
        isOfficial: true,
        collegeName: col ? col.name : 'VTU Affiliated College',
        shortName: col ? col.shortName : 'VTU',
        university: col ? col.university : 'VTU',
        district: col ? col.district : 'Karnataka',
        course: match.course,
        branch: match.branch,
        scheme: match.scheme,
        semester: match.semester,
        sourceUrl: match.sourceUrl,
        sourceName: match.sourceName,
        verifiedDate: match.verifiedDate,
        attendanceRule: match.attendanceRule,
        subjects: match.subjects,
        totalSubjects: match.subjects.length
      };
    }

    // Official curriculum not found fallback
    return {
      found: false,
      isOfficial: false,
      message: 'Official curriculum data is not available yet.',
      fallbackAvailable: true,
      collegeName: col ? col.name : collegeId,
      course: course,
      branch: branch,
      scheme: scheme,
      semester: semester
    };
  };

  return CurriculumService;
}));
