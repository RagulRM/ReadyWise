/**
 * Disaster Mapping Service
 * Maps Indian states/cities to disaster priorities based on geographic risk data
 * Based on India Disaster Mapping Database
 */

// State-wise disaster priority mapping
const stateDisasterMapping = {
  // VERY HIGH RISK STATES
  "Odisha": {
    riskLevel: "VERY_HIGH",
    primary: ["cyclone", "flood"],
    secondary: ["heatwave", "drought"],
    tertiary: ["fire"],
    earthquakeZone: "II-III",
    region: "Eastern Coastal",
    specialNotes: "80% of India's cyclones, Super-Cyclone Risk Zone"
  },
  "West Bengal": {
    riskLevel: "VERY_HIGH",
    primary: ["cyclone", "flood"],
    secondary: ["earthquake", "heatwave"],
    tertiary: ["drought"],
    earthquakeZone: "IV-V",
    region: "Eastern Coastal",
    specialNotes: "Sundarbans delta, high population density"
  },
  "Assam": {
    riskLevel: "VERY_HIGH",
    primary: ["flood", "earthquake"],
    secondary: ["landslide", "drought"],
    tertiary: ["fire"],
    earthquakeZone: "V",
    region: "North Eastern",
    specialNotes: "Brahmaputra Valley floods, annual monsoon inundation"
  },
  "Bihar": {
    riskLevel: "VERY_HIGH",
    primary: ["flood", "earthquake"],
    secondary: ["drought", "heatwave"],
    tertiary: ["fire"],
    earthquakeZone: "IV-V",
    region: "Indo-Gangetic Plains",
    specialNotes: "Annual Ganga flooding, high population density"
  },
  "Jammu and Kashmir": {
    riskLevel: "VERY_HIGH",
    primary: ["earthquake", "landslide"],
    secondary: ["flood", "avalanche"],
    tertiary: ["tsunami", "drought"],
    earthquakeZone: "V",
    region: "Himalayan",
    specialNotes: "Kashmir Valley highest seismic risk, glacial hazards"
  },
  "Maharashtra": {
    riskLevel: "VERY_HIGH",
    primary: ["drought", "flood"],
    secondary: ["heatwave", "cyclone"],
    tertiary: ["earthquake"],
    earthquakeZone: "IV",
    region: "Western & Central",
    specialNotes: "Multi-hazard, Vidarbha drought, coastal cyclones"
  },
  "Andhra Pradesh": {
    riskLevel: "VERY_HIGH",
    primary: ["cyclone", "flood"],
    secondary: ["drought", "heatwave"],
    tertiary: ["tsunami"],
    earthquakeZone: "II-III",
    region: "Eastern Coastal",
    specialNotes: "Bay of Bengal cyclones, Rayalaseema drought"
  },

  // HIGH RISK STATES
  "Madhya Pradesh": {
    riskLevel: "HIGH",
    primary: ["drought", "heatwave"],
    secondary: ["flood", "fire"],
    tertiary: ["earthquake"],
    earthquakeZone: "II-III",
    region: "Central",
    specialNotes: "India's most drought-vulnerable state"
  },
  "Uttar Pradesh": {
    riskLevel: "HIGH",
    primary: ["flood", "heatwave"],
    secondary: ["drought", "fire"],
    tertiary: ["earthquake", "stampede"],
    earthquakeZone: "IV",
    region: "Indo-Gangetic Plains",
    specialNotes: "Temperature extremes, Ganga floods"
  },
  "Gujarat": {
    riskLevel: "HIGH",
    primary: ["earthquake", "cyclone"],
    secondary: ["drought", "heatwave"],
    tertiary: ["flood"],
    earthquakeZone: "V",
    region: "Western",
    specialNotes: "Kutch region seismic risk, coastal cyclones"
  },
  "Himachal Pradesh": {
    riskLevel: "HIGH",
    primary: ["earthquake", "landslide"],
    secondary: ["flood", "avalanche"],
    tertiary: ["fire", "drought"],
    earthquakeZone: "IV-V",
    region: "Himalayan",
    specialNotes: "80% of India's landslides in Himalayas"
  },
  "Uttarakhand": {
    riskLevel: "HIGH",
    primary: ["earthquake", "landslide"],
    secondary: ["flood", "avalanche"],
    tertiary: ["fire", "drought"],
    earthquakeZone: "IV-V",
    region: "Himalayan",
    specialNotes: "Glacial lake outburst floods, 2013 Kedarnath floods"
  },
  "Arunachal Pradesh": {
    riskLevel: "HIGH",
    primary: ["earthquake", "flood"],
    secondary: ["landslide", "avalanche"],
    tertiary: ["drought"],
    earthquakeZone: "V",
    region: "North Eastern",
    specialNotes: "Himalayan foothills, river valleys"
  },
  "Tamil Nadu": {
    riskLevel: "HIGH",
    primary: ["cyclone", "drought"],
    secondary: ["flood", "heatwave"],
    tertiary: ["tsunami"],
    earthquakeZone: "II-III",
    region: "Southern Coastal",
    specialNotes: "Pre-monsoon and retreat monsoon cyclones"
  },
  "Rajasthan": {
    riskLevel: "HIGH",
    primary: ["drought", "heatwave"],
    secondary: ["fire", "stampede"],
    tertiary: ["flood"],
    earthquakeZone: "II-IV",
    region: "Desert & Western",
    specialNotes: "Extreme temperature range, Marusthali desert"
  },

  // MODERATE-HIGH RISK STATES
  "Kerala": {
    riskLevel: "MODERATE_HIGH",
    primary: ["flood", "landslide"],
    secondary: ["cyclone", "drought"],
    tertiary: ["heatwave"],
    earthquakeZone: "III",
    region: "Southern Coastal",
    specialNotes: "Western Ghats terrain, extreme rainfall"
  },
  "Karnataka": {
    riskLevel: "MODERATE_HIGH",
    primary: ["drought", "flood"],
    secondary: ["cyclone", "heatwave"],
    tertiary: ["earthquake"],
    earthquakeZone: "II-III",
    region: "Southern",
    specialNotes: "Coastal cyclones, plateau droughts"
  },
  "Manipur": {
    riskLevel: "MODERATE_HIGH",
    primary: ["earthquake", "flood"],
    secondary: ["landslide", "drought"],
    tertiary: ["fire"],
    earthquakeZone: "V",
    region: "North Eastern",
    specialNotes: "Monsoon floods, hilly terrain"
  },
  "Meghalaya": {
    riskLevel: "MODERATE_HIGH",
    primary: ["flood", "landslide"],
    secondary: ["earthquake", "cyclone"],
    tertiary: ["drought"],
    earthquakeZone: "V",
    region: "North Eastern",
    specialNotes: "World's wettest places, extreme rainfall"
  },
  "Delhi": {
    riskLevel: "MODERATE_HIGH",
    primary: ["earthquake", "heatwave"],
    secondary: ["flood", "fire"],
    tertiary: ["drought"],
    earthquakeZone: "IV",
    region: "Indo-Gangetic Plains",
    specialNotes: "Urban flood risk, Yamuna floods"
  },
  "Sikkim": {
    riskLevel: "MODERATE_HIGH",
    primary: ["earthquake", "landslide"],
    secondary: ["flood", "avalanche"],
    tertiary: ["tsunami"],
    earthquakeZone: "IV-V",
    region: "Himalayan",
    specialNotes: "Glacial lake risk, alpine terrain"
  },

  // MODERATE RISK STATES
  "Goa": {
    riskLevel: "MODERATE",
    primary: ["flood", "landslide"],
    secondary: ["cyclone"],
    tertiary: ["tsunami"],
    earthquakeZone: "III",
    region: "Western Coastal",
    specialNotes: "Western Ghats monsoon floods"
  },
  "Haryana": {
    riskLevel: "MODERATE",
    primary: ["heatwave", "drought"],
    secondary: ["flood", "fire"],
    tertiary: ["earthquake"],
    earthquakeZone: "IV",
    region: "Indo-Gangetic Plains",
    specialNotes: "Temperature extremes"
  },
  "Jharkhand": {
    riskLevel: "MODERATE",
    primary: ["drought", "heatwave"],
    secondary: ["flood", "fire"],
    tertiary: ["earthquake"],
    earthquakeZone: "II-III",
    region: "Central Plateau",
    specialNotes: "Plateau region, seasonal droughts"
  },
  "Tripura": {
    riskLevel: "MODERATE",
    primary: ["flood", "earthquake"],
    secondary: ["landslide", "cyclone"],
    tertiary: ["drought"],
    earthquakeZone: "V",
    region: "North Eastern",
    specialNotes: "Monsoon floods, hilly terrain"
  },
  "Mizoram": {
    riskLevel: "MODERATE",
    primary: ["landslide", "earthquake"],
    secondary: ["flood"],
    tertiary: ["fire"],
    earthquakeZone: "V",
    region: "North Eastern",
    specialNotes: "Hilly terrain, sparse population"
  },
  "Nagaland": {
    riskLevel: "MODERATE",
    primary: ["earthquake", "landslide"],
    secondary: ["flood"],
    tertiary: ["fire"],
    earthquakeZone: "V",
    region: "North Eastern",
    specialNotes: "Mountain terrain"
  },
  "Punjab": {
    riskLevel: "MODERATE",
    primary: ["heatwave", "drought"],
    secondary: ["flood", "fire"],
    tertiary: ["earthquake"],
    earthquakeZone: "IV",
    region: "Indo-Gangetic Plains",
    specialNotes: "Agricultural extremes"
  },
  "Chhattisgarh": {
    riskLevel: "MODERATE",
    primary: ["drought", "fire"],
    secondary: ["heatwave", "flood"],
    tertiary: ["cyclone"],
    earthquakeZone: "II-III",
    region: "Central Forest",
    specialNotes: "High forest density, fire risk"
  },
  "Telangana": {
    riskLevel: "MODERATE",
    primary: ["drought", "heatwave"],
    secondary: ["flood", "fire"],
    tertiary: ["earthquake"],
    earthquakeZone: "II-III",
    region: "Central",
    specialNotes: "Plateau droughts"
  },

  // UNION TERRITORIES
  "Andaman and Nicobar Islands": {
    riskLevel: "HIGH",
    primary: ["tsunami", "cyclone"],
    secondary: ["earthquake", "flood"],
    tertiary: ["landslide"],
    earthquakeZone: "V",
    region: "Island Territory",
    specialNotes: "2004 tsunami impact zone"
  },
  "Chandigarh": {
    riskLevel: "MODERATE",
    primary: ["earthquake", "heatwave"],
    secondary: ["flood", "fire"],
    tertiary: ["drought"],
    earthquakeZone: "IV",
    region: "Indo-Gangetic Plains",
    specialNotes: "Urban planning mitigates risks"
  },
  "Dadra and Nagar Haveli and Daman and Diu": {
    riskLevel: "MODERATE",
    primary: ["cyclone", "flood"],
    secondary: ["heatwave"],
    tertiary: ["tsunami"],
    earthquakeZone: "III",
    region: "Western Coastal",
    specialNotes: "Coastal vulnerability"
  },
  "Lakshadweep": {
    riskLevel: "MODERATE",
    primary: ["cyclone", "tsunami"],
    secondary: ["flood", "heatwave"],
    tertiary: ["drought"],
    earthquakeZone: "III",
    region: "Island Territory",
    specialNotes: "Low-lying coral islands"
  },
  "Puducherry": {
    riskLevel: "MODERATE_HIGH",
    primary: ["cyclone", "flood"],
    secondary: ["tsunami", "heatwave"],
    tertiary: ["drought"],
    earthquakeZone: "III",
    region: "Southern Coastal",
    specialNotes: "Coastal enclave"
  },
  "Ladakh": {
    riskLevel: "MODERATE_HIGH",
    primary: ["earthquake", "coldwave"],
    secondary: ["avalanche", "flood"],
    tertiary: ["landslide"],
    earthquakeZone: "IV-V",
    region: "Himalayan",
    specialNotes: "High altitude, glacial hazards"
  }
};

// All disaster types with module information
const disasterModules = {
  earthquake: {
    name: "Earthquake",
    icon: "🌍",
    priority: 1,
    description: "Learn Drop, Cover, and Hold techniques",
    color: "#8B4513",
    tags: ["seismic", "structural", "immediate"],
    modules: ["basics", "dropcoverhold", "aftershocks", "safety"]
  },
  cyclone: {
    name: "Cyclone",
    icon: "🌀",
    priority: 2,
    description: "Understand cyclone warnings and evacuation",
    color: "#4682B4",
    tags: ["wind", "coastal", "evacuation"],
    modules: ["warnings", "evacuation", "shelter", "aftermath"]
  },
  flood: {
    name: "Flood",
    icon: "🌊",
    priority: 3,
    description: "Water safety and evacuation procedures",
    color: "#1E90FF",
    tags: ["water", "evacuation", "monsoon"],
    modules: ["rising-water", "evacuation", "aftermath", "safety"]
  },
  drought: {
    name: "Drought",
    icon: "🏜️",
    priority: 4,
    description: "Water conservation and drought preparedness",
    color: "#D2691E",
    tags: ["water-scarcity", "conservation", "long-term"],
    modules: ["conservation", "survival", "community", "planning"]
  },
  landslide: {
    name: "Landslide",
    icon: "⛰️",
    priority: 5,
    description: "Recognize warning signs and escape routes",
    color: "#8B7355",
    tags: ["terrain", "monsoon", "evacuation"],
    modules: ["warning-signs", "evacuation", "prevention", "safety"]
  },
  fire: {
    name: "Fire",
    icon: "🔥",
    priority: 6,
    description: "Fire safety and evacuation techniques",
    color: "#FF4500",
    tags: ["urban", "forest", "evacuation"],
    modules: ["prevention", "evacuation", "smoke", "extinguisher"]
  },
  heatwave: {
    name: "Heat Wave",
    icon: "☀️",
    priority: 7,
    description: "Heat stroke prevention and hydration",
    color: "#FF6347",
    tags: ["temperature", "health", "summer"],
    modules: ["prevention", "symptoms", "hydration", "safety"]
  },
  coldwave: {
    name: "Cold Wave",
    icon: "❄️",
    priority: 8,
    description: "Hypothermia prevention and winter safety",
    color: "#87CEEB",
    tags: ["temperature", "health", "winter"],
    modules: ["prevention", "warmth", "symptoms", "safety"]
  },
  tsunami: {
    name: "Tsunami",
    icon: "🌊",
    priority: 9,
    description: "Tsunami warning signs and high ground evacuation",
    color: "#008B8B",
    tags: ["coastal", "earthquake", "evacuation"],
    modules: ["warning-signs", "evacuation", "high-ground", "aftermath"]
  },
  avalanche: {
    name: "Avalanche",
    icon: "🏔️",
    priority: 10,
    description: "Mountain safety and avalanche awareness",
    color: "#F0F8FF",
    tags: ["mountain", "snow", "evacuation"],
    modules: ["warning-signs", "safety", "survival", "rescue"]
  }
};

/**
 * Get disaster priority for a given location
 */
const getDisasterPriority = (state, city = null) => {
  const stateData = stateDisasterMapping[state];
  
  if (!stateData) {
    // Return default moderate risk if state not found
    return {
      state,
      city,
      riskLevel: "MODERATE",
      primary: ["earthquake", "flood", "fire"],
      secondary: ["heatwave", "thunderstorm"],
      tertiary: ["drought"],
      allDisasters: getAllDisastersOrdered(["earthquake", "flood", "fire"], ["heatwave", "thunderstorm"], ["drought"]),
      earthquakeZone: "III",
      region: "Unknown",
      specialNotes: "General disaster preparedness"
    };
  }

  return {
    state,
    city,
    ...stateData,
    allDisasters: getAllDisastersOrdered(stateData.primary, stateData.secondary, stateData.tertiary)
  };
};

/**
 * Get all disasters ordered by priority for a location
 */
const getAllDisastersOrdered = (primary, secondary, tertiary) => {
  const priorityDisasters = [...primary, ...secondary, ...tertiary];
  const allDisasterTypes = Object.keys(disasterModules);
  
  // Add remaining disasters at the end
  const remainingDisasters = allDisasterTypes.filter(d => !priorityDisasters.includes(d));
  
  return [...priorityDisasters, ...remainingDisasters];
};

/**
 * Get personalized module sequence for a student
 */
const getPersonalizedModules = (state, city = null) => {
  const locationData = getDisasterPriority(state, city);
  const orderedDisasters = locationData.allDisasters;
  
  return orderedDisasters.map((disasterType, index) => {
    const module = disasterModules[disasterType];
    const isPrimary = locationData.primary.includes(disasterType);
    const isSecondary = locationData.secondary.includes(disasterType);
    const isTertiary = locationData.tertiary.includes(disasterType);
    
    return {
      ...module,
      type: disasterType,
      locationPriority: isPrimary ? 'PRIMARY' : isSecondary ? 'SECONDARY' : isTertiary ? 'TERTIARY' : 'ADDITIONAL',
      displayOrder: index + 1,
      recommended: isPrimary || isSecondary,
      urgent: isPrimary
    };
  });
};

/**
 * Get disaster statistics for organization dashboard
 */
const getDisasterStats = (state) => {
  const locationData = getDisasterPriority(state);
  
  return {
    riskLevel: locationData.riskLevel,
    primaryDisasters: locationData.primary.length,
    secondaryDisasters: locationData.secondary.length,
    totalDisasters: locationData.allDisasters.length,
    earthquakeZone: locationData.earthquakeZone,
    region: locationData.region,
    highPriorityModules: locationData.primary.map(d => disasterModules[d]?.name || d)
  };
};

module.exports = {
  stateDisasterMapping,
  disasterModules,
  getDisasterPriority,
  getPersonalizedModules,
  getDisasterStats,
  getAllDisastersOrdered
};
