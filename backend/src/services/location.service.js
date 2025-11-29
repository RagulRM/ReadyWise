/**
 * Location Mapping Service
 * Maps Indian states/regions to their primary disaster risks
 */

const { RISK_LEVELS, DISASTER_TYPES } = require('../constants/disaster.constants');

const locationDisasterMap = {
  // Coastal States - Cyclone & Flood prone
  'Tamil Nadu': [DISASTER_TYPES.CYCLONE, DISASTER_TYPES.FLOOD, DISASTER_TYPES.HEATWAVE, DISASTER_TYPES.EARTHQUAKE],
  'Andhra Pradesh': [DISASTER_TYPES.CYCLONE, DISASTER_TYPES.FLOOD, DISASTER_TYPES.HEATWAVE],
  'Odisha': [DISASTER_TYPES.CYCLONE, DISASTER_TYPES.FLOOD, DISASTER_TYPES.HEATWAVE],
  'West Bengal': [DISASTER_TYPES.CYCLONE, DISASTER_TYPES.FLOOD, DISASTER_TYPES.EARTHQUAKE],
  'Kerala': [DISASTER_TYPES.FLOOD, DISASTER_TYPES.LANDSLIDE, DISASTER_TYPES.EARTHQUAKE],
  'Goa': [DISASTER_TYPES.FLOOD, DISASTER_TYPES.CYCLONE],
  'Karnataka': [DISASTER_TYPES.FLOOD, DISASTER_TYPES.DROUGHT, DISASTER_TYPES.EARTHQUAKE],
  'Maharashtra': [DISASTER_TYPES.FLOOD, DISASTER_TYPES.DROUGHT, DISASTER_TYPES.EARTHQUAKE],
  'Gujarat': [DISASTER_TYPES.EARTHQUAKE, DISASTER_TYPES.CYCLONE, DISASTER_TYPES.FLOOD, DISASTER_TYPES.DROUGHT],
  
  // Himalayan States - Earthquake & Landslide prone
  'Jammu and Kashmir': [DISASTER_TYPES.EARTHQUAKE, DISASTER_TYPES.LANDSLIDE, DISASTER_TYPES.AVALANCHE, DISASTER_TYPES.FLOOD],
  'Himachal Pradesh': [DISASTER_TYPES.EARTHQUAKE, DISASTER_TYPES.LANDSLIDE, DISASTER_TYPES.AVALANCHE, DISASTER_TYPES.FLOOD],
  'Uttarakhand': [DISASTER_TYPES.EARTHQUAKE, DISASTER_TYPES.LANDSLIDE, DISASTER_TYPES.FLOOD, DISASTER_TYPES.AVALANCHE],
  'Sikkim': [DISASTER_TYPES.EARTHQUAKE, DISASTER_TYPES.LANDSLIDE, DISASTER_TYPES.FLOOD],
  'Arunachal Pradesh': [DISASTER_TYPES.EARTHQUAKE, DISASTER_TYPES.LANDSLIDE, DISASTER_TYPES.FLOOD],
  'Nagaland': [DISASTER_TYPES.EARTHQUAKE, DISASTER_TYPES.LANDSLIDE],
  'Manipur': [DISASTER_TYPES.EARTHQUAKE, DISASTER_TYPES.LANDSLIDE, DISASTER_TYPES.FLOOD],
  'Mizoram': [DISASTER_TYPES.EARTHQUAKE, DISASTER_TYPES.LANDSLIDE, DISASTER_TYPES.FLOOD],
  'Tripura': [DISASTER_TYPES.EARTHQUAKE, DISASTER_TYPES.FLOOD],
  'Meghalaya': [DISASTER_TYPES.EARTHQUAKE, DISASTER_TYPES.LANDSLIDE, DISASTER_TYPES.FLOOD],
  'Assam': [DISASTER_TYPES.FLOOD, DISASTER_TYPES.EARTHQUAKE, DISASTER_TYPES.LANDSLIDE],
  
  // Northern States
  'Delhi': [DISASTER_TYPES.EARTHQUAKE, DISASTER_TYPES.FIRE, DISASTER_TYPES.HEATWAVE, DISASTER_TYPES.STAMPEDE],
  'Haryana': [DISASTER_TYPES.EARTHQUAKE, DISASTER_TYPES.FLOOD, DISASTER_TYPES.DROUGHT],
  'Punjab': [DISASTER_TYPES.FLOOD, DISASTER_TYPES.EARTHQUAKE],
  'Uttar Pradesh': [DISASTER_TYPES.FLOOD, DISASTER_TYPES.EARTHQUAKE, DISASTER_TYPES.DROUGHT],
  'Rajasthan': [DISASTER_TYPES.DROUGHT, DISASTER_TYPES.HEATWAVE, DISASTER_TYPES.EARTHQUAKE],
  
  // Central & Eastern States
  'Madhya Pradesh': [DISASTER_TYPES.FLOOD, DISASTER_TYPES.DROUGHT, DISASTER_TYPES.HEATWAVE],
  'Chhattisgarh': [DISASTER_TYPES.DROUGHT, DISASTER_TYPES.FLOOD, DISASTER_TYPES.HEATWAVE],
  'Bihar': [DISASTER_TYPES.FLOOD, DISASTER_TYPES.EARTHQUAKE, DISASTER_TYPES.DROUGHT],
  'Jharkhand': [DISASTER_TYPES.DROUGHT, DISASTER_TYPES.FLOOD, DISASTER_TYPES.HEATWAVE],
  
  // Southern States
  'Telangana': [DISASTER_TYPES.FLOOD, DISASTER_TYPES.DROUGHT, DISASTER_TYPES.HEATWAVE],
  'Puducherry': [DISASTER_TYPES.CYCLONE, DISASTER_TYPES.FLOOD],
  'Andaman and Nicobar Islands': [DISASTER_TYPES.CYCLONE, DISASTER_TYPES.EARTHQUAKE, DISASTER_TYPES.TSUNAMI],
  'Lakshadweep': [DISASTER_TYPES.CYCLONE, DISASTER_TYPES.TSUNAMI],
};

const metroCities = [
  'Delhi',
  'Mumbai',
  'Bangalore',
  'Chennai',
  'Kolkata',
  'Hyderabad',
  'Pune',
  'Ahmedabad',
  'Surat',
];

const coastalStates = [
  'Tamil Nadu',
  'Andhra Pradesh',
  'Odisha',
  'West Bengal',
  'Kerala',
  'Goa',
  'Karnataka',
  'Maharashtra',
  'Gujarat',
];

const himalayanStates = [
  'Jammu and Kashmir',
  'Himachal Pradesh',
  'Uttarakhand',
  'Sikkim',
  'Arunachal Pradesh',
];

/**
 * Get disaster risks based on location
 */
const getDisastersByLocation = (state, city = null, pincode = null) => {
  let disasters = locationDisasterMap[state] || [
    DISASTER_TYPES.EARTHQUAKE,
    DISASTER_TYPES.FIRE,
    DISASTER_TYPES.FLOOD,
  ];
  
  // Add metro-specific risks
  if (city && metroCities.includes(city)) {
    if (!disasters.includes(DISASTER_TYPES.FIRE)) {
      disasters.push(DISASTER_TYPES.FIRE);
    }
    if (!disasters.includes(DISASTER_TYPES.STAMPEDE)) {
      disasters.push(DISASTER_TYPES.STAMPEDE);
    }
  }
  
  return disasters;
};

/**
 * Get detailed risk profile for a location
 */
const getLocationRiskProfile = (state, city = null, district = null) => {
  const disasters = getDisastersByLocation(state, city);
  
  const riskLevel =
    disasters.length >= 4
      ? RISK_LEVELS.HIGH
      : disasters.length >= 2
      ? RISK_LEVELS.MEDIUM
      : RISK_LEVELS.LOW;
  
  return {
    state,
    city,
    district,
    primaryDisasters: disasters.slice(0, 3),
    secondaryDisasters: disasters.slice(3),
    isCoastal: coastalStates.includes(state),
    isHimalayan: himalayanStates.includes(state),
    isMetro: metroCities.includes(city),
    riskLevel,
  };
};

/**
 * Get all Indian states and UTs
 */
const getAllStates = () => {
  return Object.keys(locationDisasterMap).sort();
};

/**
 * Validate if state exists
 */
const isValidState = (state) => {
  return locationDisasterMap.hasOwnProperty(state);
};

module.exports = {
  locationDisasterMap,
  metroCities,
  coastalStates,
  himalayanStates,
  getDisastersByLocation,
  getLocationRiskProfile,
  getAllStates,
  isValidState,
};
