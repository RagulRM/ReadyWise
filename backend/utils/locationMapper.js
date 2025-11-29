/**
 * Location-to-Disaster Risk Mapping Engine
 * Maps Indian states/regions to their primary disaster risks
 */

const locationDisasterMap = {
  // Coastal States - Cyclone & Flood prone
  'Tamil Nadu': ['cyclone', 'flood', 'heatwave', 'earthquake'],
  'Andhra Pradesh': ['cyclone', 'flood', 'heatwave'],
  'Odisha': ['cyclone', 'flood', 'heatwave'],
  'West Bengal': ['cyclone', 'flood', 'earthquake'],
  'Kerala': ['flood', 'landslide', 'earthquake'],
  'Goa': ['flood', 'cyclone'],
  'Karnataka': ['flood', 'drought', 'earthquake'],
  'Maharashtra': ['flood', 'drought', 'earthquake'],
  'Gujarat': ['earthquake', 'cyclone', 'flood', 'drought'],
  
  // Himalayan States - Earthquake & Landslide prone
  'Jammu and Kashmir': ['earthquake', 'landslide', 'avalanche', 'flood'],
  'Himachal Pradesh': ['earthquake', 'landslide', 'avalanche', 'flood'],
  'Uttarakhand': ['earthquake', 'landslide', 'flood', 'avalanche'],
  'Sikkim': ['earthquake', 'landslide', 'flood'],
  'Arunachal Pradesh': ['earthquake', 'landslide', 'flood'],
  'Nagaland': ['earthquake', 'landslide'],
  'Manipur': ['earthquake', 'landslide', 'flood'],
  'Mizoram': ['earthquake', 'landslide', 'flood'],
  'Tripura': ['earthquake', 'flood'],
  'Meghalaya': ['earthquake', 'landslide', 'flood'],
  'Assam': ['flood', 'earthquake', 'landslide'],
  
  // Northern States
  'Delhi': ['earthquake', 'fire', 'heatwave', 'stampede'],
  'Haryana': ['earthquake', 'flood', 'drought'],
  'Punjab': ['flood', 'earthquake'],
  'Uttar Pradesh': ['flood', 'earthquake', 'drought'],
  'Rajasthan': ['drought', 'heatwave', 'earthquake'],
  
  // Central & Eastern States
  'Madhya Pradesh': ['flood', 'drought', 'heatwave'],
  'Chhattisgarh': ['drought', 'flood', 'heatwave'],
  'Bihar': ['flood', 'earthquake', 'drought'],
  'Jharkhand': ['drought', 'flood', 'heatwave'],
  
  // Southern States
  'Telangana': ['flood', 'drought', 'heatwave'],
  'Puducherry': ['cyclone', 'flood'],
  'Andaman and Nicobar Islands': ['cyclone', 'earthquake', 'tsunami'],
  'Lakshadweep': ['cyclone', 'tsunami'],
};

// Metropolitan cities - Fire & Stampede risks
const metroCities = [
  'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 
  'Hyderabad', 'Pune', 'Ahmedabad', 'Surat'
];

/**
 * Get disaster risks based on location
 * @param {string} state - State name
 * @param {string} city - City name (optional)
 * @param {string} pincode - Pincode (optional)
 * @returns {Array} List of disaster types for that location
 */
function getDisastersByLocation(state, city = null, pincode = null) {
  let disasters = locationDisasterMap[state] || ['earthquake', 'fire', 'flood'];
  
  // Add metro-specific risks
  if (city && metroCities.includes(city)) {
    if (!disasters.includes('fire')) disasters.push('fire');
    if (!disasters.includes('stampede')) disasters.push('stampede');
  }
  
  return disasters;
}

/**
 * Get detailed risk profile for a location
 */
function getLocationRiskProfile(state, city = null, district = null) {
  const disasters = getDisastersByLocation(state, city);
  
  return {
    state,
    city,
    district,
    primaryDisasters: disasters.slice(0, 3),
    secondaryDisasters: disasters.slice(3),
    isCoastal: ['Tamil Nadu', 'Andhra Pradesh', 'Odisha', 'West Bengal', 'Kerala', 'Goa', 'Karnataka', 'Maharashtra', 'Gujarat'].includes(state),
    isHimalayan: ['Jammu and Kashmir', 'Himachal Pradesh', 'Uttarakhand', 'Sikkim', 'Arunachal Pradesh'].includes(state),
    isMetro: metroCities.includes(city),
    riskLevel: disasters.length >= 4 ? 'HIGH' : disasters.length >= 2 ? 'MEDIUM' : 'LOW'
  };
}

module.exports = {
  locationDisasterMap,
  metroCities,
  getDisastersByLocation,
  getLocationRiskProfile
};
