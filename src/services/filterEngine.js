export function filterAndRankProperties(properties, filters) {
  if (!filters) return properties;

  const ranked = properties.map(property => {
    let matchScore = 0;
    const matchReasons = [];

    // BHK match: +30 points
    if (filters.bhk !== null && filters.bhk !== undefined) {
      if (property.bhk === filters.bhk) {
        matchScore += 30;
        matchReasons.push(`Matches your ${filters.bhk}BHK requirement`);
      }
    }

    // Price match: +25 points
    if (filters.minPrice !== null || filters.maxPrice !== null) {
      const min = filters.minPrice !== null ? filters.minPrice : 0;
      const max = filters.maxPrice !== null ? filters.maxPrice : Infinity;
      
      if (property.price >= min && property.price <= max) {
        matchScore += 25;
        matchReasons.push("Within your budget");
      }
    }

    // Sector match: +20 points
    if (filters.sectors && filters.sectors.length > 0) {
      const isSectorMatch = filters.sectors.some(sector => 
        property.sector.toLowerCase().includes(sector.toLowerCase()) || 
        property.locality.toLowerCase().includes(sector.toLowerCase())
      );
      if (isSectorMatch) {
        matchScore += 20;
        matchReasons.push("Located in your preferred area");
      }
    }

    // Amenity match: +5 points per amenity match (max 20)
    if (filters.amenities && filters.amenities.length > 0) {
      let amenityMatches = 0;
      const friendlyNames = {
        "gym": "Has a gym",
        "school_nearby": "Near schools",
        "metro": "Metro accessible",
        "sunlight": "Great natural light",
        "park": "Near a park",
        "pool": "Has a swimming pool",
        "security": "Good security"
      };

      filters.amenities.forEach(amenity => {
        if (property.amenities.includes(amenity)) {
          amenityMatches++;
          matchReasons.push(friendlyNames[amenity] || `Has ${amenity.replace('_', ' ')}`);
        }
      });
      
      const amenityScore = Math.min(amenityMatches * 5, 20);
      matchScore += amenityScore;
    }

    // Facing match: +5 points
    if (filters.facing && property.facing) {
      if (property.facing.toLowerCase() === filters.facing.toLowerCase()) {
        matchScore += 5;
        matchReasons.push(`${property.facing} facing`);
      }
    }

    return {
      ...property,
      matchScore,
      matchReasons
    };
  });

  // Sort by matchScore descending
  return ranked.sort((a, b) => b.matchScore - a.matchScore);
}
