/**
 * Class Bunker - Authoritative Colleges Directory (Karnataka)
 * Sources:
 * - VTU Affiliated Institutes Directory: https://vtu.ac.in/affiliated-institute/
 * - VTU Autonomous Colleges Directory: https://vtu.ac.in/en/autonomous-colleges/
 * - Institutional Academic Registries
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ClassBunkerColleges = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var COLLEGES = [
    {
      id: 'dsatm',
      name: 'Dayananda Sagar Academy of Technology and Management',
      shortName: 'DSATM',
      vtuCode: '1DT',
      university: 'VTU',
      universityId: 'vtu',
      district: 'Bengaluru Urban',
      officialWebsite: 'https://dsatm.edu.in',
      type: 'Engineering & Technology',
      autonomous: false,
      availablePrograms: ['B.E.', 'MCA', 'MBA'],
      availableSchemes: ['2022 Scheme', '2021 Scheme'],
      curriculumSources: [
        {
          name: 'DSATM Official Academic Programs',
          url: 'https://dsatm.edu.in/academics/departments',
          verifiedDate: '2024-09-15'
        },
        {
          name: 'VTU Official Scheme & Syllabus Portal',
          url: 'https://vtu.ac.in/en/b-e-scheme-syllabus/',
          verifiedDate: '2024-09-15'
        }
      ],
      lastVerifiedDate: '2024-09-15'
    },
    {
      id: 'acharya_ait',
      name: 'Acharya Institute of Technology',
      shortName: 'AIT',
      vtuCode: '1AY',
      university: 'VTU',
      universityId: 'vtu',
      district: 'Bengaluru Urban',
      officialWebsite: 'https://www.acharya.ac.in/acharya-institute-of-technology',
      type: 'Engineering & Technology',
      autonomous: false,
      availablePrograms: ['B.E.', 'M.Tech', 'MCA', 'MBA'],
      availableSchemes: ['2022 Scheme', '2021 Scheme'],
      curriculumSources: [
        {
          name: 'VTU Affiliated Directory & Syllabus Portal',
          url: 'https://vtu.ac.in/affiliated-institute/',
          verifiedDate: '2024-09-15'
        }
      ],
      lastVerifiedDate: '2024-09-15'
    },
    {
      id: 'amc_engg',
      name: 'AMC Engineering College',
      shortName: 'AMCEC',
      vtuCode: '1AM',
      university: 'VTU',
      universityId: 'vtu',
      district: 'Bengaluru Urban',
      officialWebsite: 'https://amcec.edu.in',
      type: 'Engineering & Technology',
      autonomous: false,
      availablePrograms: ['B.E.', 'M.Tech', 'MCA', 'MBA'],
      availableSchemes: ['2022 Scheme', '2021 Scheme'],
      curriculumSources: [
        {
          name: 'VTU Affiliated Directory',
          url: 'https://vtu.ac.in/affiliated-institute/',
          verifiedDate: '2024-09-15'
        }
      ],
      lastVerifiedDate: '2024-09-15'
    },
    {
      id: 'aps_ce',
      name: 'APS College of Engineering',
      shortName: 'APSCE',
      vtuCode: '1AP',
      university: 'VTU',
      universityId: 'vtu',
      district: 'Bengaluru Urban',
      officialWebsite: 'https://apsce.ac.in',
      type: 'Engineering & Technology',
      autonomous: false,
      availablePrograms: ['B.E.'],
      availableSchemes: ['2022 Scheme', '2021 Scheme'],
      curriculumSources: [
        {
          name: 'VTU Affiliated Institutes',
          url: 'https://vtu.ac.in/affiliated-institute/',
          verifiedDate: '2024-09-15'
        }
      ],
      lastVerifiedDate: '2024-09-15'
    },
    {
      id: 'bmsce',
      name: 'B.M.S. College of Engineering',
      shortName: 'BMSCE',
      vtuCode: '1BM',
      university: 'VTU (Autonomous)',
      universityId: 'vtu_autonomous',
      district: 'Bengaluru Urban',
      officialWebsite: 'https://bmsce.ac.in',
      type: 'Engineering & Technology',
      autonomous: true,
      availablePrograms: ['B.E.', 'M.Tech', 'MCA', 'MBA'],
      availableSchemes: ['2022 Autonomous Scheme', '2021 Autonomous Scheme'],
      curriculumSources: [
        {
          name: 'BMSCE Autonomous Curriculum Portal',
          url: 'https://bmsce.ac.in/home/Curriculum-Syllabus',
          verifiedDate: '2024-09-15'
        }
      ],
      lastVerifiedDate: '2024-09-15'
    },
    {
      id: 'bmsit',
      name: 'BMS Institute of Technology and Management',
      shortName: 'BMSIT&M',
      vtuCode: '1BY',
      university: 'VTU (Autonomous)',
      universityId: 'vtu_autonomous',
      district: 'Bengaluru Urban',
      officialWebsite: 'https://bmsit.ac.in',
      type: 'Engineering & Technology',
      autonomous: true,
      availablePrograms: ['B.E.', 'M.Tech', 'MCA'],
      availableSchemes: ['2022 Autonomous Scheme', '2021 Scheme'],
      curriculumSources: [
        {
          name: 'BMSIT Academic Scheme',
          url: 'https://bmsit.ac.in/academics',
          verifiedDate: '2024-09-15'
        }
      ],
      lastVerifiedDate: '2024-09-15'
    },
    {
      id: 'bit_bangalore',
      name: 'Bangalore Institute of Technology',
      shortName: 'BIT',
      vtuCode: '1BI',
      university: 'VTU (Autonomous)',
      universityId: 'vtu_autonomous',
      district: 'Bengaluru Urban',
      officialWebsite: 'https://bit-bangalore.edu.in',
      type: 'Engineering & Technology',
      autonomous: true,
      availablePrograms: ['B.E.', 'M.Tech', 'MCA', 'MBA'],
      availableSchemes: ['2022 Autonomous Scheme', '2021 Scheme'],
      curriculumSources: [
        {
          name: 'BIT Academic Portal',
          url: 'https://bit-bangalore.edu.in/curriculum',
          verifiedDate: '2024-09-15'
        }
      ],
      lastVerifiedDate: '2024-09-15'
    },
    {
      id: 'bnmit',
      name: 'B.N.M. Institute of Technology',
      shortName: 'BNMIT',
      vtuCode: '1BG',
      university: 'VTU (Autonomous)',
      universityId: 'vtu_autonomous',
      district: 'Bengaluru Urban',
      officialWebsite: 'https://bnmit.org',
      type: 'Engineering & Technology',
      autonomous: true,
      availablePrograms: ['B.E.', 'M.Tech', 'MBA'],
      availableSchemes: ['2022 Autonomous Scheme'],
      curriculumSources: [
        {
          name: 'BNMIT Curriculum Registry',
          url: 'https://bnmit.org/academics',
          verifiedDate: '2024-09-15'
        }
      ],
      lastVerifiedDate: '2024-09-15'
    },
    {
      id: 'dsce',
      name: 'Dayananda Sagar College of Engineering',
      shortName: 'DSCE',
      vtuCode: '1DS',
      university: 'VTU (Autonomous)',
      universityId: 'vtu_autonomous',
      district: 'Bengaluru Urban',
      officialWebsite: 'https://dsce.edu.in',
      type: 'Engineering & Technology',
      autonomous: true,
      availablePrograms: ['B.E.', 'M.Tech', 'MCA', 'MBA'],
      availableSchemes: ['2022 Autonomous Scheme', '2021 Autonomous Scheme'],
      curriculumSources: [
        {
          name: 'DSCE Autonomous Curriculum Portal',
          url: 'https://dsce.edu.in/academics/syllabus',
          verifiedDate: '2024-09-15'
        }
      ],
      lastVerifiedDate: '2024-09-15'
    },
    {
      id: 'msrit',
      name: 'Ramaiah Institute of Technology',
      shortName: 'MSRIT',
      vtuCode: '1MS',
      university: 'VTU (Autonomous)',
      universityId: 'vtu_autonomous',
      district: 'Bengaluru Urban',
      officialWebsite: 'https://www.msrit.edu',
      type: 'Engineering & Technology',
      autonomous: true,
      availablePrograms: ['B.E.', 'M.Tech', 'MCA', 'MBA'],
      availableSchemes: ['2022 Autonomous Scheme', '2021 Autonomous Scheme'],
      curriculumSources: [
        {
          name: 'MSRIT Academic Council Regulations',
          url: 'https://www.msrit.edu/curriculum.html',
          verifiedDate: '2024-09-15'
        }
      ],
      lastVerifiedDate: '2024-09-15'
    },
    {
      id: 'rvce',
      name: 'R.V. College of Engineering',
      shortName: 'RVCE',
      vtuCode: '1RV',
      university: 'VTU (Autonomous)',
      universityId: 'vtu_autonomous',
      district: 'Bengaluru Urban',
      officialWebsite: 'https://rvce.edu.in',
      type: 'Engineering & Technology',
      autonomous: true,
      availablePrograms: ['B.E.', 'M.Tech', 'MCA'],
      availableSchemes: ['2022 Autonomous Scheme', '2021 Autonomous Scheme'],
      curriculumSources: [
        {
          name: 'RVCE Autonomous Scheme & Syllabus',
          url: 'https://rvce.edu.in/schemes-and-syllabus',
          verifiedDate: '2024-09-15'
        }
      ],
      lastVerifiedDate: '2024-09-15'
    },
    {
      id: 'sit_tumakuru',
      name: 'Siddaganga Institute of Technology',
      shortName: 'SIT',
      vtuCode: '1SI',
      university: 'VTU (Autonomous)',
      universityId: 'vtu_autonomous',
      district: 'Tumakuru',
      officialWebsite: 'https://sit.ac.in',
      type: 'Engineering & Technology',
      autonomous: true,
      availablePrograms: ['B.E.', 'M.Tech', 'MCA', 'MBA'],
      availableSchemes: ['2022 Autonomous Scheme'],
      curriculumSources: [
        {
          name: 'SIT Academic Regulations',
          url: 'https://sit.ac.in/academic-scheme',
          verifiedDate: '2024-09-15'
        }
      ],
      lastVerifiedDate: '2024-09-15'
    },
    {
      id: 'sirmvit',
      name: 'Sir M. Visvesvaraya Institute of Technology',
      shortName: 'Sir MVIT',
      vtuCode: '1MV',
      university: 'VTU',
      universityId: 'vtu',
      district: 'Bengaluru Urban',
      officialWebsite: 'https://www.sirmvit.edu',
      type: 'Engineering & Technology',
      autonomous: false,
      availablePrograms: ['B.E.', 'M.Tech', 'MCA', 'MBA'],
      availableSchemes: ['2022 Scheme', '2021 Scheme'],
      curriculumSources: [
        {
          name: 'VTU Affiliated Syllabus',
          url: 'https://vtu.ac.in/affiliated-institute/',
          verifiedDate: '2024-09-15'
        }
      ],
      lastVerifiedDate: '2024-09-15'
    },
    {
      id: 'nmit',
      name: 'Nitte Meenakshi Institute of Technology',
      shortName: 'NMIT',
      vtuCode: '1NT',
      university: 'VTU (Autonomous)',
      universityId: 'vtu_autonomous',
      district: 'Bengaluru Urban',
      officialWebsite: 'https://www.nmit.ac.in',
      type: 'Engineering & Technology',
      autonomous: true,
      availablePrograms: ['B.E.', 'M.Tech', 'MCA', 'MBA'],
      availableSchemes: ['2022 Autonomous Scheme'],
      curriculumSources: [
        {
          name: 'NMIT Autonomous Syllabus Repository',
          url: 'https://www.nmit.ac.in/syllabus.php',
          verifiedDate: '2024-09-15'
        }
      ],
      lastVerifiedDate: '2024-09-15'
    },
    {
      id: 'cambridge_cit',
      name: 'Cambridge Institute of Technology',
      shortName: 'CiTech',
      vtuCode: '1CD',
      university: 'VTU',
      universityId: 'vtu',
      district: 'Bengaluru Urban',
      officialWebsite: 'https://cambridge.edu.in',
      type: 'Engineering & Technology',
      autonomous: false,
      availablePrograms: ['B.E.', 'M.Tech', 'MCA', 'MBA'],
      availableSchemes: ['2022 Scheme', '2021 Scheme'],
      curriculumSources: [
        {
          name: 'VTU Affiliated Directory',
          url: 'https://vtu.ac.in/affiliated-institute/',
          verifiedDate: '2024-09-15'
        }
      ],
      lastVerifiedDate: '2024-09-15'
    },
    {
      id: 'oxford_engg',
      name: 'The Oxford College of Engineering',
      shortName: 'TOCE',
      vtuCode: '1OX',
      university: 'VTU',
      universityId: 'vtu',
      district: 'Bengaluru Urban',
      officialWebsite: 'https://theoxford.edu/engineering',
      type: 'Engineering & Technology',
      autonomous: false,
      availablePrograms: ['B.E.', 'M.Tech', 'MCA', 'MBA'],
      availableSchemes: ['2022 Scheme', '2021 Scheme'],
      curriculumSources: [
        {
          name: 'VTU Affiliated Institute Directory',
          url: 'https://vtu.ac.in/affiliated-institute/',
          verifiedDate: '2024-09-15'
        }
      ],
      lastVerifiedDate: '2024-09-15'
    },
    {
      id: 'rnsit',
      name: 'RNS Institute of Technology',
      shortName: 'RNSIT',
      vtuCode: '1RN',
      university: 'VTU (Autonomous)',
      universityId: 'vtu_autonomous',
      district: 'Bengaluru Urban',
      officialWebsite: 'https://www.rnsit.ac.in',
      type: 'Engineering & Technology',
      autonomous: true,
      availablePrograms: ['B.E.', 'M.Tech', 'MCA', 'MBA'],
      availableSchemes: ['2022 Autonomous Scheme'],
      curriculumSources: [
        {
          name: 'RNSIT Academic Syllabus',
          url: 'https://www.rnsit.ac.in/academics',
          verifiedDate: '2024-09-15'
        }
      ],
      lastVerifiedDate: '2024-09-15'
    },
    {
      id: 'git_belagavi',
      name: 'KLS Gogte Institute of Technology',
      shortName: 'KLS GIT',
      vtuCode: '2GI',
      university: 'VTU (Autonomous)',
      universityId: 'vtu_autonomous',
      district: 'Belagavi',
      officialWebsite: 'https://git.edu',
      type: 'Engineering & Technology',
      autonomous: true,
      availablePrograms: ['B.E.', 'M.Tech', 'MCA', 'MBA'],
      availableSchemes: ['2022 Autonomous Scheme'],
      curriculumSources: [
        {
          name: 'KLS GIT Curriculum',
          url: 'https://git.edu/academics',
          verifiedDate: '2024-09-15'
        }
      ],
      lastVerifiedDate: '2024-09-15'
    },
    {
      id: 'mce_hassan',
      name: 'Malnad College of Engineering',
      shortName: 'MCE',
      vtuCode: '4MC',
      university: 'VTU (Autonomous)',
      universityId: 'vtu_autonomous',
      district: 'Hassan',
      officialWebsite: 'https://mcehassan.ac.in',
      type: 'Engineering & Technology',
      autonomous: true,
      availablePrograms: ['B.E.', 'M.Tech'],
      availableSchemes: ['2022 Autonomous Scheme'],
      curriculumSources: [
        {
          name: 'MCE Autonomous Syllabus',
          url: 'https://mcehassan.ac.in/academics',
          verifiedDate: '2024-09-15'
        }
      ],
      lastVerifiedDate: '2024-09-15'
    }
  ];

  return COLLEGES;
}));
