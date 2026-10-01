/**
 * Class Bunker - Official Districts of Karnataka Directory
 * Contains all 31 administrative districts of Karnataka.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ClassBunkerDistricts = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var KARNATAKA_DISTRICTS = [
    { id: 'bagalkote', name: 'Bagalkote', zone: 'Belagavi Division' },
    { id: 'ballari', name: 'Ballari', zone: 'Kalaburagi Division' },
    { id: 'belagavi', name: 'Belagavi', zone: 'Belagavi Division' },
    { id: 'bengaluru_rural', name: 'Bengaluru Rural', zone: 'Bengaluru Division' },
    { id: 'bengaluru_urban', name: 'Bengaluru Urban', zone: 'Bengaluru Division' },
    { id: 'bidar', name: 'Bidar', zone: 'Kalaburagi Division' },
    { id: 'chamarajanagar', name: 'Chamarajanagar', zone: 'Mysuru Division' },
    { id: 'chikkaballapura', name: 'Chikkaballapura', zone: 'Bengaluru Division' },
    { id: 'chikkamagaluru', name: 'Chikkamagaluru', zone: 'Mysuru Division' },
    { id: 'chitradurga', name: 'Chitradurga', zone: 'Bengaluru Division' },
    { id: 'dakshina_kannada', name: 'Dakshina Kannada', zone: 'Mysuru Division' },
    { id: 'davanagere', name: 'Davanagere', zone: 'Bengaluru Division' },
    { id: 'dharwad', name: 'Dharwad', zone: 'Belagavi Division' },
    { id: 'gadag', name: 'Gadag', zone: 'Belagavi Division' },
    { id: 'hassan', name: 'Hassan', zone: 'Mysuru Division' },
    { id: 'haveri', name: 'Haveri', zone: 'Belagavi Division' },
    { id: 'kalaburagi', name: 'Kalaburagi', zone: 'Kalaburagi Division' },
    { id: 'kodagu', name: 'Kodagu', zone: 'Mysuru Division' },
    { id: 'kolar', name: 'Kolar', zone: 'Bengaluru Division' },
    { id: 'koppal', name: 'Koppal', zone: 'Kalaburagi Division' },
    { id: 'mandya', name: 'Mandya', zone: 'Mysuru Division' },
    { id: 'mysuru', name: 'Mysuru', zone: 'Mysuru Division' },
    { id: 'raichur', name: 'Raichur', zone: 'Kalaburagi Division' },
    { id: 'ramanagara', name: 'Ramanagara', zone: 'Bengaluru Division' },
    { id: 'shivamogga', name: 'Shivamogga', zone: 'Bengaluru Division' },
    { id: 'tumakuru', name: 'Tumakuru', zone: 'Bengaluru Division' },
    { id: 'udupi', name: 'Udupi', zone: 'Mysuru Division' },
    { id: 'uttara_kannada', name: 'Uttara Kannada', zone: 'Belagavi Division' },
    { id: 'vijayanagara', name: 'Vijayanagara', zone: 'Kalaburagi Division' },
    { id: 'vijayapura', name: 'Vijayapura', zone: 'Belagavi Division' },
    { id: 'yadgir', name: 'Yadgir', zone: 'Kalaburagi Division' }
  ];

  return KARNATAKA_DISTRICTS;
}));
