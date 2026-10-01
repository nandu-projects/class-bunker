/**
 * Class Bunker - Authoritative Universities Directory
 * Scope: Karnataka Educational Framework
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ClassBunkerUniversities = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var UNIVERSITIES = [
    {
      id: 'vtu',
      name: 'Visvesvaraya Technological University',
      shortName: 'VTU',
      state: 'Karnataka',
      headquarters: 'Belagavi',
      officialWebsite: 'https://vtu.ac.in',
      type: 'State Technical University',
      curriculumPortal: 'https://vtu.ac.in/en/b-e-scheme-syllabus/',
      defaultAttendanceThreshold: 75,
      attendancePolicy: 'VTU Academic Regulation (Section 8): A candidate shall be considered to have satisfied the attendance requirements if he/she has attended at least 75% of classes held in each subject (theory and practical separately). A condonation of up to 10% may be granted on certified medical grounds by the Vice-Chancellor.'
    },
    {
      id: 'vtu_autonomous',
      name: 'VTU Autonomous Colleges (Institution-Specific Curricula)',
      shortName: 'VTU Autonomous',
      state: 'Karnataka',
      headquarters: 'Karnataka',
      officialWebsite: 'https://vtu.ac.in/en/autonomous-colleges/',
      type: 'Autonomous under VTU',
      curriculumPortal: 'https://vtu.ac.in/en/autonomous-colleges/',
      defaultAttendanceThreshold: 75,
      attendancePolicy: 'Autonomous institutions set their specific academic council regulations with a baseline 75% to 85% requirement.'
    },
    {
      id: 'bcu',
      name: 'Bengaluru City University',
      shortName: 'BCU',
      state: 'Karnataka',
      headquarters: 'Bengaluru',
      officialWebsite: 'https://bcu.ac.in',
      type: 'State Public University',
      defaultAttendanceThreshold: 75,
      attendancePolicy: 'Minimum 75% attendance required in each paper for university semester examination eligibility.'
    },
    {
      id: 'bu',
      name: 'Bangalore University',
      shortName: 'BU',
      state: 'Karnataka',
      headquarters: 'Bengaluru',
      officialWebsite: 'https://bangaloreuniversity.karnataka.gov.in',
      type: 'State Public University',
      defaultAttendanceThreshold: 75,
      attendancePolicy: 'Minimum 75% overall attendance mandatory.'
    },
    {
      id: 'uom',
      name: 'University of Mysore',
      shortName: 'UoM',
      state: 'Karnataka',
      headquarters: 'Mysuru',
      officialWebsite: 'https://uni-mysore.ac.in',
      type: 'State Public University',
      defaultAttendanceThreshold: 75,
      attendancePolicy: 'Minimum 75% attendance in theory and practicals required.'
    },
    {
      id: 'mu',
      name: 'Mangalore University',
      shortName: 'MU',
      state: 'Karnataka',
      headquarters: 'Mangaluru',
      officialWebsite: 'https://mangaloreuniversity.ac.in',
      type: 'State Public University',
      defaultAttendanceThreshold: 75,
      attendancePolicy: '75% minimum required attendance.'
    }
  ];

  return UNIVERSITIES;
}));
