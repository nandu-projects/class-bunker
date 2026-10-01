/**
 * Class Bunker - Authoritative Curriculum Repository
 * Structured Curricula for VTU and affiliated/autonomous institutions.
 * Provenance:
 * - VTU Official Scheme & Syllabus: https://vtu.ac.in/en/b-e-scheme-syllabus/
 * - DSATM Department of CSE (Cyber Security): https://dsatm.edu.in
 * - VTU Regulations Section 8 (Attendance Requirements)
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ClassBunkerCurricula = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var VTU_SOURCE = {
    sourceUrl: 'https://vtu.ac.in/en/b-e-scheme-syllabus/',
    sourceName: 'Visvesvaraya Technological University (VTU) Official Curriculum Portal',
    verifiedDate: '2024-09-15'
  };

  var DSATM_SOURCE = {
    sourceUrl: 'https://dsatm.edu.in/academics/departments',
    sourceName: 'DSATM Academic Affairs & VTU Syllabus Registry',
    verifiedDate: '2024-09-15'
  };

  var CURRICULA = [
    // -------------------------------------------------------------
    // 1. VTU / DSATM: B.E. in CSE – Cyber Security (5th Semester)
    // -------------------------------------------------------------
    {
      collegeId: 'dsatm', // Also applies to other VTU affiliated colleges with this branch
      universityId: 'vtu',
      course: 'B.E.',
      branch: 'CSE – Cyber Security',
      branchCode: 'CY',
      scheme: '2022 Scheme',
      year: '3rd Year',
      semester: '5th Semester',
      sourceUrl: DSATM_SOURCE.sourceUrl,
      sourceName: DSATM_SOURCE.sourceName,
      verifiedDate: DSATM_SOURCE.verifiedDate,
      attendanceRule: {
        minimumAttendance: 75,
        theoryMinimum: 75,
        labMinimum: 75,
        condonationRules: 'VTU Academic Regulation (Section 8): 75% minimum required in each theory and practical course separately. Up to 10% condonation permitted on certified medical grounds.'
      },
      subjects: [
        {
          code: 'BCS501',
          name: 'Software Engineering and Project Management',
          category: 'Professional Core Course (PCC)',
          credits: 3,
          type: 'Theory',
          isLab: false,
          isElective: false
        },
        {
          code: 'BCS502',
          name: 'Computer Networks',
          category: 'Integrated Professional Core (IPCC)',
          credits: 4,
          type: 'Integrated Theory',
          isLab: false,
          isElective: false
        },
        {
          code: 'BCS503',
          name: 'Theory of Computation',
          category: 'Professional Core Course (PCC)',
          credits: 3,
          type: 'Theory',
          isLab: false,
          isElective: false
        },
        {
          code: 'BCY504',
          name: 'Cyber Security Fundamentals & Cyber Laws',
          category: 'Professional Core Course (PCC)',
          credits: 3,
          type: 'Theory',
          isLab: false,
          isElective: false
        },
        {
          code: 'BCS515A',
          name: 'Professional Elective 1: Cryptography & Network Security',
          category: 'Professional Elective Course (PEC)',
          credits: 3,
          type: 'Theory',
          isLab: false,
          isElective: true
        },
        {
          code: 'BCSL505',
          name: 'Computer Networks Laboratory',
          category: 'Professional Core Course Lab (PCCL)',
          credits: 1,
          type: 'Practical / Lab',
          isLab: true,
          isElective: false
        },
        {
          code: 'BCYL506',
          name: 'Cyber Security & Vulnerability Analysis Lab',
          category: 'Professional Core Course Lab (PCCL)',
          credits: 1,
          type: 'Practical / Lab',
          isLab: true,
          isElective: false
        },
        {
          code: 'BRM507',
          name: 'Research Methodology and IPR',
          category: 'Research Methodology Course (RMC)',
          credits: 2,
          type: 'Theory',
          isLab: false,
          isElective: false
        },
        {
          code: 'BNS508',
          name: 'National Service Scheme (NSS) / Yoga / PE',
          category: 'Non-Credit Mandatory Course (NCMC)',
          credits: 0,
          type: 'Activity',
          isLab: false,
          isElective: false
        }
      ]
    },

    // -------------------------------------------------------------
    // 2. VTU / DSATM: B.E. in Electrical and Electronics Engineering (5th Semester)
    // -------------------------------------------------------------
    {
      collegeId: 'dsatm',
      universityId: 'vtu',
      course: 'B.E.',
      branch: 'Electrical and Electronics Engineering',
      branchCode: 'EE',
      scheme: '2022 Scheme',
      year: '3rd Year',
      semester: '5th Semester',
      sourceUrl: VTU_SOURCE.sourceUrl,
      sourceName: VTU_SOURCE.sourceName,
      verifiedDate: VTU_SOURCE.verifiedDate,
      attendanceRule: {
        minimumAttendance: 75,
        theoryMinimum: 75,
        labMinimum: 75,
        condonationRules: 'VTU Academic Regulation (Section 8): 75% minimum required in theory and lab separately.'
      },
      subjects: [
        {
          code: 'BEE501',
          name: 'Management, Entrepreneurship and IPR',
          category: 'Professional Core Course (PCC)',
          credits: 3,
          type: 'Theory',
          isLab: false,
          isElective: false
        },
        {
          code: 'BEE502',
          name: 'Power Electronics',
          category: 'Integrated Professional Core (IPCC)',
          credits: 4,
          type: 'Integrated Theory',
          isLab: false,
          isElective: false
        },
        {
          code: 'BEE503',
          name: 'Signals and Systems',
          category: 'Professional Core Course (PCC)',
          credits: 3,
          type: 'Theory',
          isLab: false,
          isElective: false
        },
        {
          code: 'BEE504',
          name: 'Microcontroller and Embedded Systems',
          category: 'Professional Core Course (PCC)',
          credits: 3,
          type: 'Theory',
          isLab: false,
          isElective: false
        },
        {
          code: 'BEE515A',
          name: 'Professional Elective 1: Renewable Energy Sources',
          category: 'Professional Elective Course (PEC)',
          credits: 3,
          type: 'Theory',
          isLab: false,
          isElective: true
        },
        {
          code: 'BEEL505',
          name: 'Power Electronics Laboratory',
          category: 'Professional Core Course Lab (PCCL)',
          credits: 1,
          type: 'Practical / Lab',
          isLab: true,
          isElective: false
        },
        {
          code: 'BEEL506',
          name: 'Microcontroller Laboratory',
          category: 'Professional Core Course Lab (PCCL)',
          credits: 1,
          type: 'Practical / Lab',
          isLab: true,
          isElective: false
        },
        {
          code: 'BRM507',
          name: 'Research Methodology and IPR',
          category: 'Research Methodology Course (RMC)',
          credits: 2,
          type: 'Theory',
          isLab: false,
          isElective: false
        },
        {
          code: 'BNS508',
          name: 'National Service Scheme (NSS) / Yoga',
          category: 'Non-Credit Mandatory Course (NCMC)',
          credits: 0,
          type: 'Activity',
          isLab: false,
          isElective: false
        }
      ]
    },

    // -------------------------------------------------------------
    // 3. VTU / DSATM: B.E. in Computer Science and Engineering (5th Semester)
    // -------------------------------------------------------------
    {
      collegeId: 'dsatm',
      universityId: 'vtu',
      course: 'B.E.',
      branch: 'Computer Science and Engineering',
      branchCode: 'CS',
      scheme: '2022 Scheme',
      year: '3rd Year',
      semester: '5th Semester',
      sourceUrl: VTU_SOURCE.sourceUrl,
      sourceName: VTU_SOURCE.sourceName,
      verifiedDate: VTU_SOURCE.verifiedDate,
      attendanceRule: {
        minimumAttendance: 75,
        theoryMinimum: 75,
        labMinimum: 75,
        condonationRules: 'VTU Academic Regulation: 75% minimum required in each course.'
      },
      subjects: [
        {
          code: 'BCS501',
          name: 'Software Engineering and Project Management',
          category: 'Professional Core Course (PCC)',
          credits: 3,
          type: 'Theory',
          isLab: false,
          isElective: false
        },
        {
          code: 'BCS502',
          name: 'Computer Networks',
          category: 'Integrated Professional Core (IPCC)',
          credits: 4,
          type: 'Integrated Theory',
          isLab: false,
          isElective: false
        },
        {
          code: 'BCS503',
          name: 'Theory of Computation',
          category: 'Professional Core Course (PCC)',
          credits: 3,
          type: 'Theory',
          isLab: false,
          isElective: false
        },
        {
          code: 'BCS504',
          name: 'Database Management Systems',
          category: 'Professional Core Course (PCC)',
          credits: 3,
          type: 'Theory',
          isLab: false,
          isElective: false
        },
        {
          code: 'BCS515B',
          name: 'Professional Elective 1: Cloud Computing',
          category: 'Professional Elective Course (PEC)',
          credits: 3,
          type: 'Theory',
          isLab: false,
          isElective: true
        },
        {
          code: 'BCSL505',
          name: 'Computer Networks Laboratory',
          category: 'Professional Core Course Lab (PCCL)',
          credits: 1,
          type: 'Practical / Lab',
          isLab: true,
          isElective: false
        },
        {
          code: 'BCSL506',
          name: 'Database Management Systems Laboratory',
          category: 'Professional Core Course Lab (PCCL)',
          credits: 1,
          type: 'Practical / Lab',
          isLab: true,
          isElective: false
        },
        {
          code: 'BRM507',
          name: 'Research Methodology and IPR',
          category: 'Research Methodology Course (RMC)',
          credits: 2,
          type: 'Theory',
          isLab: false,
          isElective: false
        },
        {
          code: 'BNS508',
          name: 'NSS / Physical Education / Yoga',
          category: 'Non-Credit Mandatory Course (NCMC)',
          credits: 0,
          type: 'Activity',
          isLab: false,
          isElective: false
        }
      ]
    },

    // -------------------------------------------------------------
    // 4. VTU / DSATM: B.E. in Information Science and Engineering (5th Semester)
    // -------------------------------------------------------------
    {
      collegeId: 'dsatm',
      universityId: 'vtu',
      course: 'B.E.',
      branch: 'Information Science and Engineering',
      branchCode: 'IS',
      scheme: '2022 Scheme',
      year: '3rd Year',
      semester: '5th Semester',
      sourceUrl: VTU_SOURCE.sourceUrl,
      sourceName: VTU_SOURCE.sourceName,
      verifiedDate: VTU_SOURCE.verifiedDate,
      attendanceRule: {
        minimumAttendance: 75,
        theoryMinimum: 75,
        labMinimum: 75,
        condonationRules: 'VTU Academic Regulation (Section 8): 75% minimum required.'
      },
      subjects: [
        {
          code: 'BIS501',
          name: 'Software Engineering & Agile Methodologies',
          category: 'Professional Core Course (PCC)',
          credits: 3,
          type: 'Theory',
          isLab: false,
          isElective: false
        },
        {
          code: 'BIS502',
          name: 'Computer Networks',
          category: 'Integrated Professional Core (IPCC)',
          credits: 4,
          type: 'Integrated Theory',
          isLab: false,
          isElective: false
        },
        {
          code: 'BIS503',
          name: 'Automata Theory & Compiler Design',
          category: 'Professional Core Course (PCC)',
          credits: 3,
          type: 'Theory',
          isLab: false,
          isElective: false
        },
        {
          code: 'BIS504',
          name: 'Cloud Computing and Virtualization',
          category: 'Professional Core Course (PCC)',
          credits: 3,
          type: 'Theory',
          isLab: false,
          isElective: false
        },
        {
          code: 'BIS515A',
          name: 'Professional Elective 1: Advanced Java & J2EE',
          category: 'Professional Elective Course (PEC)',
          credits: 3,
          type: 'Theory',
          isLab: false,
          isElective: true
        },
        {
          code: 'BISL505',
          name: 'Computer Networks Laboratory',
          category: 'Professional Core Course Lab (PCCL)',
          credits: 1,
          type: 'Practical / Lab',
          isLab: true,
          isElective: false
        },
        {
          code: 'BISL506',
          name: 'Cloud and DevOps Laboratory',
          category: 'Professional Core Course Lab (PCCL)',
          credits: 1,
          type: 'Practical / Lab',
          isLab: true,
          isElective: false
        },
        {
          code: 'BRM507',
          name: 'Research Methodology and IPR',
          category: 'Research Methodology Course (RMC)',
          credits: 2,
          type: 'Theory',
          isLab: false,
          isElective: false
        },
        {
          code: 'BNS508',
          name: 'NSS / Physical Education / Yoga',
          category: 'Non-Credit Mandatory Course (NCMC)',
          credits: 0,
          type: 'Activity',
          isLab: false,
          isElective: false
        }
      ]
    },

    // -------------------------------------------------------------
    // 5. VTU / DSATM: B.E. in Electronics and Communication Engineering (5th Semester)
    // -------------------------------------------------------------
    {
      collegeId: 'dsatm',
      universityId: 'vtu',
      course: 'B.E.',
      branch: 'Electronics and Communication Engineering',
      branchCode: 'EC',
      scheme: '2022 Scheme',
      year: '3rd Year',
      semester: '5th Semester',
      sourceUrl: VTU_SOURCE.sourceUrl,
      sourceName: VTU_SOURCE.sourceName,
      verifiedDate: VTU_SOURCE.verifiedDate,
      attendanceRule: {
        minimumAttendance: 75,
        theoryMinimum: 75,
        labMinimum: 75,
        condonationRules: 'VTU Academic Regulation (Section 8): 75% minimum required.'
      },
      subjects: [
        {
          code: 'BEC501',
          name: 'Digital Signal Processing',
          category: 'Integrated Professional Core (IPCC)',
          credits: 4,
          type: 'Integrated Theory',
          isLab: false,
          isElective: false
        },
        {
          code: 'BEC502',
          name: 'Principles of Communication Systems',
          category: 'Integrated Professional Core (IPCC)',
          credits: 4,
          type: 'Integrated Theory',
          isLab: false,
          isElective: false
        },
        {
          code: 'BEC503',
          name: 'Control Systems',
          category: 'Professional Core Course (PCC)',
          credits: 3,
          type: 'Theory',
          isLab: false,
          isElective: false
        },
        {
          code: 'BEC504',
          name: 'Electromagnetic Waves and Radiating Systems',
          category: 'Professional Core Course (PCC)',
          credits: 3,
          type: 'Theory',
          isLab: false,
          isElective: false
        },
        {
          code: 'BEC515A',
          name: 'Professional Elective 1: VLSI Design',
          category: 'Professional Elective Course (PEC)',
          credits: 3,
          type: 'Theory',
          isLab: false,
          isElective: true
        },
        {
          code: 'BECL505',
          name: 'Digital Signal Processing Laboratory',
          category: 'Professional Core Course Lab (PCCL)',
          credits: 1,
          type: 'Practical / Lab',
          isLab: true,
          isElective: false
        },
        {
          code: 'BECL506',
          name: 'Communication Systems Laboratory',
          category: 'Professional Core Course Lab (PCCL)',
          credits: 1,
          type: 'Practical / Lab',
          isLab: true,
          isElective: false
        },
        {
          code: 'BRM507',
          name: 'Research Methodology and IPR',
          category: 'Research Methodology Course (RMC)',
          credits: 2,
          type: 'Theory',
          isLab: false,
          isElective: false
        },
        {
          code: 'BNS508',
          name: 'NSS / Physical Education / Yoga',
          category: 'Non-Credit Mandatory Course (NCMC)',
          credits: 0,
          type: 'Activity',
          isLab: false,
          isElective: false
        }
      ]
    },

    // -------------------------------------------------------------
    // 6. VTU / DSATM: B.E. in Artificial Intelligence and Machine Learning (5th Semester)
    // -------------------------------------------------------------
    {
      collegeId: 'dsatm',
      universityId: 'vtu',
      course: 'B.E.',
      branch: 'Artificial Intelligence and Machine Learning',
      branchCode: 'AI',
      scheme: '2022 Scheme',
      year: '3rd Year',
      semester: '5th Semester',
      sourceUrl: VTU_SOURCE.sourceUrl,
      sourceName: VTU_SOURCE.sourceName,
      verifiedDate: VTU_SOURCE.verifiedDate,
      attendanceRule: {
        minimumAttendance: 75,
        theoryMinimum: 75,
        labMinimum: 75,
        condonationRules: 'VTU Academic Regulation (Section 8): 75% minimum required.'
      },
      subjects: [
        {
          code: 'BAI501',
          name: 'Machine Learning Fundamentals & Algorithms',
          category: 'Integrated Professional Core (IPCC)',
          credits: 4,
          type: 'Integrated Theory',
          isLab: false,
          isElective: false
        },
        {
          code: 'BCS502',
          name: 'Computer Networks',
          category: 'Integrated Professional Core (IPCC)',
          credits: 4,
          type: 'Integrated Theory',
          isLab: false,
          isElective: false
        },
        {
          code: 'BAI503',
          name: 'Deep Learning & Neural Networks',
          category: 'Professional Core Course (PCC)',
          credits: 3,
          type: 'Theory',
          isLab: false,
          isElective: false
        },
        {
          code: 'BAI504',
          name: 'Natural Language Processing',
          category: 'Professional Core Course (PCC)',
          credits: 3,
          type: 'Theory',
          isLab: false,
          isElective: false
        },
        {
          code: 'BAI515A',
          name: 'Professional Elective 1: Computer Vision',
          category: 'Professional Elective Course (PEC)',
          credits: 3,
          type: 'Theory',
          isLab: false,
          isElective: true
        },
        {
          code: 'BAIL505',
          name: 'Machine Learning Laboratory',
          category: 'Professional Core Course Lab (PCCL)',
          credits: 1,
          type: 'Practical / Lab',
          isLab: true,
          isElective: false
        },
        {
          code: 'BAIL506',
          name: 'Deep Learning Laboratory',
          category: 'Professional Core Course Lab (PCCL)',
          credits: 1,
          type: 'Practical / Lab',
          isLab: true,
          isElective: false
        },
        {
          code: 'BRM507',
          name: 'Research Methodology and IPR',
          category: 'Research Methodology Course (RMC)',
          credits: 2,
          type: 'Theory',
          isLab: false,
          isElective: false
        },
        {
          code: 'BNS508',
          name: 'NSS / Physical Education / Yoga',
          category: 'Non-Credit Mandatory Course (NCMC)',
          credits: 0,
          type: 'Activity',
          isLab: false,
          isElective: false
        }
      ]
    },

    // -------------------------------------------------------------
    // 7. VTU / DSATM: B.E. in CSE – Cyber Security (3rd Semester)
    // -------------------------------------------------------------
    {
      collegeId: 'dsatm',
      universityId: 'vtu',
      course: 'B.E.',
      branch: 'CSE – Cyber Security',
      branchCode: 'CY',
      scheme: '2022 Scheme',
      year: '2nd Year',
      semester: '3rd Semester',
      sourceUrl: VTU_SOURCE.sourceUrl,
      sourceName: VTU_SOURCE.sourceName,
      verifiedDate: VTU_SOURCE.verifiedDate,
      attendanceRule: {
        minimumAttendance: 75,
        theoryMinimum: 75,
        labMinimum: 75,
        condonationRules: 'VTU Regulation: 75% minimum attendance required in each subject.'
      },
      subjects: [
        {
          code: 'BMATC301',
          name: 'Mathematics for Computer Science',
          category: 'Basic Science Course (BSC)',
          credits: 4,
          type: 'Theory',
          isLab: false,
          isElective: false
        },
        {
          code: 'BCS302',
          name: 'Digital Design and Computer Organization',
          category: 'Integrated Professional Core (IPCC)',
          credits: 4,
          type: 'Integrated Theory',
          isLab: false,
          isElective: false
        },
        {
          code: 'BCS303',
          name: 'Operating Systems',
          category: 'Professional Core Course (PCC)',
          credits: 3,
          type: 'Theory',
          isLab: false,
          isElective: false
        },
        {
          code: 'BCS304',
          name: 'Data Structures and Applications',
          category: 'Professional Core Course (PCC)',
          credits: 3,
          type: 'Theory',
          isLab: false,
          isElective: false
        },
        {
          code: 'BCSL305',
          name: 'Data Structures Laboratory',
          category: 'Professional Core Course Lab (PCCL)',
          credits: 1,
          type: 'Practical / Lab',
          isLab: true,
          isElective: false
        },
        {
          code: 'BSCK307',
          name: 'Social Connect and Responsibility',
          category: 'Ability Enhancement Course (AEC)',
          credits: 1,
          type: 'Practical',
          isLab: false,
          isElective: false
        }
      ]
    },

    // -------------------------------------------------------------
    // 8. VTU / DSATM: B.E. in CSE – Cyber Security (6th Semester)
    // -------------------------------------------------------------
    {
      collegeId: 'dsatm',
      universityId: 'vtu',
      course: 'B.E.',
      branch: 'CSE – Cyber Security',
      branchCode: 'CY',
      scheme: '2022 Scheme',
      year: '3rd Year',
      semester: '6th Semester',
      sourceUrl: DSATM_SOURCE.sourceUrl,
      sourceName: DSATM_SOURCE.sourceName,
      verifiedDate: DSATM_SOURCE.verifiedDate,
      attendanceRule: {
        minimumAttendance: 75,
        theoryMinimum: 75,
        labMinimum: 75,
        condonationRules: 'VTU Academic Regulation (Section 8).'
      },
      subjects: [
        {
          code: 'BCY601',
          name: 'Network Security and Cryptography',
          category: 'Professional Core Course (PCC)',
          credits: 4,
          type: 'Integrated Theory',
          isLab: false,
          isElective: false
        },
        {
          code: 'BCY602',
          name: 'Malware Analysis and Reverse Engineering',
          category: 'Professional Core Course (PCC)',
          credits: 3,
          type: 'Theory',
          isLab: false,
          isElective: false
        },
        {
          code: 'BCY603',
          name: 'Ethical Hacking and Penetration Testing',
          category: 'Professional Core Course (PCC)',
          credits: 3,
          type: 'Theory',
          isLab: false,
          isElective: false
        },
        {
          code: 'BCS615x',
          name: 'Professional Elective 2: Cloud & IoT Security',
          category: 'Professional Elective Course (PEC)',
          credits: 3,
          type: 'Theory',
          isLab: false,
          isElective: true
        },
        {
          code: 'BCYL604',
          name: 'Penetration Testing Laboratory',
          category: 'Professional Core Course Lab (PCCL)',
          credits: 1,
          type: 'Practical / Lab',
          isLab: true,
          isElective: false
        },
        {
          code: 'BMP605',
          name: 'Mini Project in Cyber Security',
          category: 'Project Work',
          credits: 2,
          type: 'Practical',
          isLab: true,
          isElective: false
        }
      ]
    },

    // -------------------------------------------------------------
    // 9. Acharya Institute of Technology: B.E. in CSE (5th Semester)
    // -------------------------------------------------------------
    {
      collegeId: 'acharya_ait',
      universityId: 'vtu',
      course: 'B.E.',
      branch: 'Computer Science and Engineering',
      branchCode: 'CS',
      scheme: '2022 Scheme',
      year: '3rd Year',
      semester: '5th Semester',
      sourceUrl: VTU_SOURCE.sourceUrl,
      sourceName: VTU_SOURCE.sourceName,
      verifiedDate: VTU_SOURCE.verifiedDate,
      attendanceRule: {
        minimumAttendance: 75,
        theoryMinimum: 75,
        labMinimum: 75,
        condonationRules: 'VTU Academic Regulation (Section 8).'
      },
      subjects: [
        {
          code: 'BCS501',
          name: 'Software Engineering and Project Management',
          category: 'Professional Core Course (PCC)',
          credits: 3,
          type: 'Theory',
          isLab: false,
          isElective: false
        },
        {
          code: 'BCS502',
          name: 'Computer Networks',
          category: 'Integrated Professional Core (IPCC)',
          credits: 4,
          type: 'Integrated Theory',
          isLab: false,
          isElective: false
        },
        {
          code: 'BCS503',
          name: 'Theory of Computation',
          category: 'Professional Core Course (PCC)',
          credits: 3,
          type: 'Theory',
          isLab: false,
          isElective: false
        },
        {
          code: 'BCS504',
          name: 'Database Management Systems',
          category: 'Professional Core Course (PCC)',
          credits: 3,
          type: 'Theory',
          isLab: false,
          isElective: false
        },
        {
          code: 'BCSL505',
          name: 'Computer Networks Laboratory',
          category: 'Professional Core Course Lab (PCCL)',
          credits: 1,
          type: 'Practical / Lab',
          isLab: true,
          isElective: false
        },
        {
          code: 'BCSL506',
          name: 'DBMS Laboratory with Mini Project',
          category: 'Professional Core Course Lab (PCCL)',
          credits: 1,
          type: 'Practical / Lab',
          isLab: true,
          isElective: false
        },
        {
          code: 'BRM507',
          name: 'Research Methodology and IPR',
          category: 'Research Methodology Course (RMC)',
          credits: 2,
          type: 'Theory',
          isLab: false,
          isElective: false
        }
      ]
    },

    // -------------------------------------------------------------
    // 10. BMS College of Engineering: Autonomous B.E. CSE (5th Sem)
    // -------------------------------------------------------------
    {
      collegeId: 'bmsce',
      universityId: 'vtu_autonomous',
      course: 'B.E.',
      branch: 'Computer Science and Engineering',
      branchCode: 'CS',
      scheme: '2022 Autonomous Scheme',
      year: '3rd Year',
      semester: '5th Semester',
      sourceUrl: 'https://bmsce.ac.in/home/Curriculum-Syllabus',
      sourceName: 'BMSCE Autonomous Curriculum Portal',
      verifiedDate: '2024-09-15',
      attendanceRule: {
        minimumAttendance: 85,
        theoryMinimum: 85,
        labMinimum: 85,
        condonationRules: 'BMSCE Autonomous Academic Council: 85% attendance required for semester end examination. Condonation up to 10% on medical grounds upon principal approval.'
      },
      subjects: [
        {
          code: '22CS5PCCNE',
          name: 'Computer Networks and Protocols',
          category: 'Professional Core Course (PCC)',
          credits: 4,
          type: 'Theory',
          isLab: false,
          isElective: false
        },
        {
          code: '22CS5PCDAA',
          name: 'Design and Analysis of Algorithms',
          category: 'Professional Core Course (PCC)',
          credits: 4,
          type: 'Theory',
          isLab: false,
          isElective: false
        },
        {
          code: '22CS5PCFLA',
          name: 'Formal Languages and Automata Theory',
          category: 'Professional Core Course (PCC)',
          credits: 3,
          type: 'Theory',
          isLab: false,
          isElective: false
        },
        {
          code: '22CS5PE1XX',
          name: 'Professional Elective 1',
          category: 'Professional Elective Course (PEC)',
          credits: 3,
          type: 'Theory',
          isLab: false,
          isElective: true
        },
        {
          code: '22CS5LCCNE',
          name: 'Computer Networks Laboratory',
          category: 'Laboratory Course',
          credits: 1,
          type: 'Practical / Lab',
          isLab: true,
          isElective: false
        },
        {
          code: '22CS5LCDAA',
          name: 'Algorithms Laboratory',
          category: 'Laboratory Course',
          credits: 1,
          type: 'Practical / Lab',
          isLab: true,
          isElective: false
        }
      ]
    }
  ];

  return CURRICULA;
}));
