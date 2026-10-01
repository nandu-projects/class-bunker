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
    // --- BENGALURU URBAN ---
    {
      id: 'dsatm',
      name: 'Dayananda Sagar Academy of Technology and Management',
      shortName: 'DSATM',
      vtuCode: '1DT',
      university: 'Visvesvaraya Technological University',
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
      id: 'dsce',
      name: 'Dayananda Sagar College of Engineering',
      shortName: 'DSCE',
      vtuCode: '1DS',
      university: 'Visvesvaraya Technological University (Autonomous)',
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
      id: 'rvce',
      name: 'R.V. College of Engineering',
      shortName: 'RVCE',
      vtuCode: '1RV',
      university: 'Visvesvaraya Technological University (Autonomous)',
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
      id: 'bmsce',
      name: 'B.M.S. College of Engineering',
      shortName: 'BMSCE',
      vtuCode: '1BM',
      university: 'Visvesvaraya Technological University (Autonomous)',
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
      id: 'msrit',
      name: 'Ramaiah Institute of Technology',
      shortName: 'MSRIT',
      vtuCode: '1MS',
      university: 'Visvesvaraya Technological University (Autonomous)',
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
      id: 'bit_bangalore',
      name: 'Bangalore Institute of Technology',
      shortName: 'BIT',
      vtuCode: '1BI',
      university: 'Visvesvaraya Technological University (Autonomous)',
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
      id: 'bmsit',
      name: 'BMS Institute of Technology and Management',
      shortName: 'BMSIT&M',
      vtuCode: '1BY',
      university: 'Visvesvaraya Technological University (Autonomous)',
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
      id: 'bnmit',
      name: 'B.N.M. Institute of Technology',
      shortName: 'BNMIT',
      vtuCode: '1BG',
      university: 'Visvesvaraya Technological University (Autonomous)',
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
      id: 'acharya_ait',
      name: 'Acharya Institute of Technology',
      shortName: 'AIT',
      vtuCode: '1AY',
      university: 'Visvesvaraya Technological University',
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
      university: 'Visvesvaraya Technological University',
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
      university: 'Visvesvaraya Technological University',
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
      id: 'sirmvit',
      name: 'Sir M. Visvesvaraya Institute of Technology',
      shortName: 'Sir MVIT',
      vtuCode: '1MV',
      university: 'Visvesvaraya Technological University',
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
      university: 'Visvesvaraya Technological University (Autonomous)',
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
      university: 'Visvesvaraya Technological University',
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
      id: 'rnsit',
      name: 'RNS Institute of Technology',
      shortName: 'RNSIT',
      vtuCode: '1RN',
      university: 'Visvesvaraya Technological University (Autonomous)',
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
      id: 'oxford_engg',
      name: 'The Oxford College of Engineering',
      shortName: 'TOCE',
      vtuCode: '1OX',
      university: 'Visvesvaraya Technological University',
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
      id: 'new_horizon',
      name: 'New Horizon College of Engineering',
      shortName: 'NHCE',
      vtuCode: '1NH',
      university: 'Visvesvaraya Technological University (Autonomous)',
      universityId: 'vtu_autonomous',
      district: 'Bengaluru Urban',
      officialWebsite: 'https://newhorizonindia.edu/nhengineering',
      type: 'Engineering & Technology',
      autonomous: true,
      availablePrograms: ['B.E.', 'M.Tech', 'MCA', 'MBA'],
      availableSchemes: ['2022 Autonomous Scheme'],
      curriculumSources: [
        {
          name: 'NHCE Autonomous Syllabus Portal',
          url: 'https://newhorizonindia.edu/nhengineering/academics/',
          verifiedDate: '2024-09-15'
        }
      ],
      lastVerifiedDate: '2024-09-15'
    },

    // --- MYSURU ---
    {
      id: 'sjce_mysuru',
      name: 'Sri Jayachamarajendra College of Engineering (JSS STU)',
      shortName: 'SJCE',
      vtuCode: '4JC',
      university: 'JSS Science and Technology University',
      universityId: 'jss_stu',
      district: 'Mysuru',
      officialWebsite: 'https://jssstuniv.in',
      type: 'Engineering & Technology',
      autonomous: true,
      availablePrograms: ['B.E.', 'M.Tech', 'MCA', 'MBA'],
      availableSchemes: ['2022 Autonomous Scheme'],
      curriculumSources: [
        {
          name: 'JSS STU Syllabus Portal',
          url: 'https://jssstuniv.in/academics-syllabus/',
          verifiedDate: '2024-09-15'
        }
      ],
      lastVerifiedDate: '2024-09-15'
    },
    {
      id: 'nie_mysuru',
      name: 'The National Institute of Engineering',
      shortName: 'NIE',
      vtuCode: '4NI',
      university: 'Visvesvaraya Technological University (Autonomous)',
      universityId: 'vtu_autonomous',
      district: 'Mysuru',
      officialWebsite: 'https://nie.ac.in',
      type: 'Engineering & Technology',
      autonomous: true,
      availablePrograms: ['B.E.', 'M.Tech', 'MCA'],
      availableSchemes: ['2022 Autonomous Scheme'],
      curriculumSources: [
        {
          name: 'NIE Autonomous Syllabus',
          url: 'https://nie.ac.in/academics/syllabus/',
          verifiedDate: '2024-09-15'
        }
      ],
      lastVerifiedDate: '2024-09-15'
    },
    {
      id: 'vvce_mysuru',
      name: 'Vidyavardhaka College of Engineering',
      shortName: 'VVCE',
      vtuCode: '4VV',
      university: 'Visvesvaraya Technological University (Autonomous)',
      universityId: 'vtu_autonomous',
      district: 'Mysuru',
      officialWebsite: 'https://vvce.ac.in',
      type: 'Engineering & Technology',
      autonomous: true,
      availablePrograms: ['B.E.', 'M.Tech', 'MBA'],
      availableSchemes: ['2022 Autonomous Scheme'],
      curriculumSources: [
        {
          name: 'VVCE Curriculum Repository',
          url: 'https://vvce.ac.in/academics/',
          verifiedDate: '2024-09-15'
        }
      ],
      lastVerifiedDate: '2024-09-15'
    },

    // --- DAKSHINA KANNADA (MANGALURU) ---
    {
      id: 'sjec_mangalore',
      name: 'St Joseph Engineering College',
      shortName: 'SJEC',
      vtuCode: '4SO',
      university: 'Visvesvaraya Technological University (Autonomous)',
      universityId: 'vtu_autonomous',
      district: 'Dakshina Kannada',
      officialWebsite: 'https://sjec.ac.in',
      type: 'Engineering & Technology',
      autonomous: true,
      availablePrograms: ['B.E.', 'M.Tech', 'MCA', 'MBA'],
      availableSchemes: ['2022 Autonomous Scheme'],
      curriculumSources: [
        {
          name: 'SJEC Autonomous Syllabus',
          url: 'https://sjec.ac.in/academics',
          verifiedDate: '2024-09-15'
        }
      ],
      lastVerifiedDate: '2024-09-15'
    },
    {
      id: 'sahyadri_mangalore',
      name: 'Sahyadri College of Engineering and Management',
      shortName: 'SCEM',
      vtuCode: '4SF',
      university: 'Visvesvaraya Technological University (Autonomous)',
      universityId: 'vtu_autonomous',
      district: 'Dakshina Kannada',
      officialWebsite: 'https://sahyadri.edu.in',
      type: 'Engineering & Technology',
      autonomous: true,
      availablePrograms: ['B.E.', 'MBA'],
      availableSchemes: ['2022 Autonomous Scheme'],
      curriculumSources: [
        {
          name: 'Sahyadri Academic Scheme',
          url: 'https://sahyadri.edu.in/academics',
          verifiedDate: '2024-09-15'
        }
      ],
      lastVerifiedDate: '2024-09-15'
    },

    // --- UDUPI ---
    {
      id: 'nmam_nitte',
      name: 'NMAM Institute of Technology',
      shortName: 'NMAMIT',
      vtuCode: '4NM',
      university: 'Nitte (Deemed to be University)',
      universityId: 'nitte',
      district: 'Udupi',
      officialWebsite: 'https://nmamit.nitte.edu.in',
      type: 'Engineering & Technology',
      autonomous: true,
      availablePrograms: ['B.E.', 'M.Tech', 'MCA'],
      availableSchemes: ['2022 Autonomous Scheme'],
      curriculumSources: [
        {
          name: 'Nitte DU Engineering Curriculum',
          url: 'https://nmamit.nitte.edu.in/curriculum.php',
          verifiedDate: '2024-09-15'
        }
      ],
      lastVerifiedDate: '2024-09-15'
    },

    // --- BELAGAVI ---
    {
      id: 'git_belagavi',
      name: 'KLS Gogte Institute of Technology',
      shortName: 'KLS GIT',
      vtuCode: '2GI',
      university: 'Visvesvaraya Technological University (Autonomous)',
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

    // --- DHARWAD ---
    {
      id: 'sdm_dharwad',
      name: 'SDM College of Engineering and Technology',
      shortName: 'SDMCET',
      vtuCode: '2SD',
      university: 'Visvesvaraya Technological University (Autonomous)',
      universityId: 'vtu_autonomous',
      district: 'Dharwad',
      officialWebsite: 'https://sdmcet.ac.in',
      type: 'Engineering & Technology',
      autonomous: true,
      availablePrograms: ['B.E.', 'M.Tech', 'MBA'],
      availableSchemes: ['2022 Autonomous Scheme'],
      curriculumSources: [
        {
          name: 'SDMCET Academic Portal',
          url: 'https://sdmcet.ac.in/academics',
          verifiedDate: '2024-09-15'
        }
      ],
      lastVerifiedDate: '2024-09-15'
    },

    // --- TUMAKURU ---
    {
      id: 'sit_tumakuru',
      name: 'Siddaganga Institute of Technology',
      shortName: 'SIT',
      vtuCode: '1SI',
      university: 'Visvesvaraya Technological University (Autonomous)',
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

    // --- HASSAN ---
    {
      id: 'mce_hassan',
      name: 'Malnad College of Engineering',
      shortName: 'MCE',
      vtuCode: '4MC',
      university: 'Visvesvaraya Technological University (Autonomous)',
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
    },

    // --- KALABURAGI ---
    {
      id: 'pda_kalaburagi',
      name: 'Poojya Doddappa Appa College of Engineering',
      shortName: 'PDA College of Engineering',
      vtuCode: '3PD',
      university: 'Visvesvaraya Technological University (Autonomous)',
      universityId: 'vtu_autonomous',
      district: 'Kalaburagi',
      officialWebsite: 'https://pdaengg.com',
      type: 'Engineering & Technology',
      autonomous: true,
      availablePrograms: ['B.E.', 'M.Tech'],
      availableSchemes: ['2022 Autonomous Scheme'],
      curriculumSources: [
        {
          name: 'PDA Engineering Syllabus Portal',
          url: 'https://pdaengg.com/academics',
          verifiedDate: '2024-09-15'
        }
      ],
      lastVerifiedDate: '2024-09-15'
    },

    // --- BALLARI / VIJAYANAGARA ---
    {
      id: 'bitm_ballari',
      name: 'Ballari Institute of Technology and Management',
      shortName: 'BITM',
      vtuCode: '3BR',
      university: 'Visvesvaraya Technological University (Autonomous)',
      universityId: 'vtu_autonomous',
      district: 'Ballari',
      officialWebsite: 'https://bitm.edu.in',
      type: 'Engineering & Technology',
      autonomous: true,
      availablePrograms: ['B.E.', 'MBA'],
      availableSchemes: ['2022 Autonomous Scheme'],
      curriculumSources: [
        {
          name: 'BITM Academic Schemes',
          url: 'https://bitm.edu.in/academics',
          verifiedDate: '2024-09-15'
        }
      ],
      lastVerifiedDate: '2024-09-15'
    },

    // --- DAVANAGERE ---
    {
      id: 'biet_davanagere',
      name: 'Bapuji Institute of Engineering and Technology',
      shortName: 'BIET',
      vtuCode: '4BD',
      university: 'Visvesvaraya Technological University (Autonomous)',
      universityId: 'vtu_autonomous',
      district: 'Davanagere',
      officialWebsite: 'https://bietdvg.edu',
      type: 'Engineering & Technology',
      autonomous: true,
      availablePrograms: ['B.E.', 'M.Tech', 'MCA', 'MBA'],
      availableSchemes: ['2022 Autonomous Scheme'],
      curriculumSources: [
        {
          name: 'BIET Curriculum Portal',
          url: 'https://bietdvg.edu/academics',
          verifiedDate: '2024-09-15'
        }
      ],
      lastVerifiedDate: '2024-09-15'
    },

    // --- SHIVAMOGGA ---
    {
      id: 'jnnce_shivamogga',
      name: 'Jawaharlal Nehru National College of Engineering',
      shortName: 'JNNCE',
      vtuCode: '4JN',
      university: 'Visvesvaraya Technological University (Autonomous)',
      universityId: 'vtu_autonomous',
      district: 'Shivamogga',
      officialWebsite: 'https://jnnce.ac.in',
      type: 'Engineering & Technology',
      autonomous: true,
      availablePrograms: ['B.E.', 'M.Tech', 'MCA', 'MBA'],
      availableSchemes: ['2022 Autonomous Scheme'],
      curriculumSources: [
        {
          name: 'JNNCE Academic Regulations',
          url: 'https://jnnce.ac.in/academics',
          verifiedDate: '2024-09-15'
        }
      ],
      lastVerifiedDate: '2024-09-15'
    },

    // --- BAGALKOTE ---
    {
      id: 'bec_bagalkote',
      name: 'Basaveshwar Engineering College',
      shortName: 'BEC',
      vtuCode: '2BA',
      university: 'Visvesvaraya Technological University (Autonomous)',
      universityId: 'vtu_autonomous',
      district: 'Bagalkote',
      officialWebsite: 'https://becbgk.edu',
      type: 'Engineering & Technology',
      autonomous: true,
      availablePrograms: ['B.E.', 'M.Tech', 'MBA'],
      availableSchemes: ['2022 Autonomous Scheme'],
      curriculumSources: [
        {
          name: 'BEC Syllabus Repository',
          url: 'https://becbgk.edu/academics',
          verifiedDate: '2024-09-15'
        }
      ],
      lastVerifiedDate: '2024-09-15'
    },

    // --- MANDYA ---
    {
      id: 'pesce_mandya',
      name: 'P.E.S. College of Engineering',
      shortName: 'PESCE',
      vtuCode: '4PS',
      university: 'Visvesvaraya Technological University (Autonomous)',
      universityId: 'vtu_autonomous',
      district: 'Mandya',
      officialWebsite: 'https://pescemandya.org',
      type: 'Engineering & Technology',
      autonomous: true,
      availablePrograms: ['B.E.', 'M.Tech', 'MCA', 'MBA'],
      availableSchemes: ['2022 Autonomous Scheme'],
      curriculumSources: [
        {
          name: 'PESCE Autonomous Syllabus',
          url: 'https://pescemandya.org/academics',
          verifiedDate: '2024-09-15'
        }
      ],
      lastVerifiedDate: '2024-09-15'
    }
  ];

  return COLLEGES;
}));
