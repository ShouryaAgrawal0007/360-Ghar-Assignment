const TEXT_MODELS = [
  "nvidia/nemotron-nano-12b-v2-vl:free",
  "openrouter/free",
];

function localParseSearchQuery(query) {
  const normalized = query.toLowerCase();
  
  // BHK
  let bhk = null;
  const bhkMatch = normalized.match(/(\d+)\s*bhk/);
  if (bhkMatch) {
    bhk = parseInt(bhkMatch[1], 10);
  }

  // Price
  let minPrice = null;
  let maxPrice = null;
  
  // Helper to convert value to Lakhs
  const toLakhs = (val, unit) => {
    let num = parseFloat(val);
    if (unit && (unit.includes("cr") || unit.includes("crore"))) {
      return num * 100;
    }
    return num;
  };

  // under/below/less than X
  const priceUnderMatch = normalized.match(/(?:under|below|less than|max|maximum)\s*(?:rs\.?\s*)?(\d+(?:\.\d+)?)\s*(lakhs|l|cr|crores?|crore)?/);
  if (priceUnderMatch) {
    maxPrice = toLakhs(priceUnderMatch[1], priceUnderMatch[2]);
  }

  // above/more than X
  const priceAboveMatch = normalized.match(/(?:above|over|more than|min|minimum)\s*(?:rs\.?\s*)?(\d+(?:\.\d+)?)\s*(lakhs|l|cr|crores?|crore)?/);
  if (priceAboveMatch) {
    minPrice = toLakhs(priceAboveMatch[1], priceAboveMatch[2]);
  }

  // between X and Y
  const priceBetweenMatch = normalized.match(/(?:between|from)\s*(?:rs\.?\s*)?(\d+(?:\.\d+)?)\s*(lakhs|l|cr|crores?|crore)?\s*(?:to|and|-)\s*(\d+(?:\.\d+)?)\s*(lakhs|l|cr|crores?|crore)?/);
  if (priceBetweenMatch) {
    minPrice = toLakhs(priceBetweenMatch[1], priceBetweenMatch[2] || priceBetweenMatch[4]);
    maxPrice = toLakhs(priceBetweenMatch[3], priceBetweenMatch[4] || priceBetweenMatch[2]);
  }

  // Sectors
  const sectors = [];
  const sectorMatches = normalized.matchAll(/sector\s*(\d+)/g);
  for (const match of sectorMatches) {
    sectors.push(match[1]);
  }
  const dlfMatches = normalized.matchAll(/dlf\s*(?:phase)?\s*(\d+|i+|v+)/g);
  for (const match of dlfMatches) {
    sectors.push(`dlf phase ${match[1]}`);
  }
  if (normalized.includes("dlf")) {
    sectors.push("dlf");
  }

  // Amenities
  const amenities = [];
  if (normalized.includes("gym")) amenities.push("gym");
  if (normalized.includes("school")) amenities.push("school_nearby");
  if (normalized.includes("metro")) amenities.push("metro");
  if (normalized.includes("sunlight") || normalized.includes("sun")) amenities.push("sunlight");
  if (normalized.includes("park")) amenities.push("park");
  if (normalized.includes("pool") || normalized.includes("swimming")) amenities.push("pool");
  if (normalized.includes("security")) amenities.push("security");

  // Facing
  let facing = null;
  const facingDirections = ["east", "west", "north", "south", "north-east", "north-west", "south-east", "south-west"];
  for (const dir of facingDirections) {
    if (normalized.includes(dir)) {
      facing = dir;
      break;
    }
  }

  return {
    bhk,
    minPrice,
    maxPrice,
    sectors,
    amenities,
    preferences: [],
    minArea: null,
    facing,
    summary: `You are looking for ${bhk ? `${bhk} BHK ` : ''}properties${sectors.length ? ` in Sector/Area ${sectors.join(', ')}` : ''}${maxPrice ? ` under ₹${maxPrice} Lakhs` : ''}${minPrice ? ` above ₹${minPrice} Lakhs` : ''}${amenities.length ? ` with ${amenities.join(', ')}` : ''}.`
  };
}

async function callOpenRouter(messages) {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey || apiKey === "your_key_here" || apiKey.trim() === "") {
    throw new Error("Missing VITE_OPENROUTER_API_KEY in .env");
  }

  for (const model of TEXT_MODELS) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": "https://360ghar.vercel.app",
          "X-Title": "360 Ghar"
        },
        body: JSON.stringify({ model, max_tokens: 300, messages })
      });

      const rawText = await response.text();

      if (!response.ok) {
        console.warn(`Model ${model} failed (${response.status}), trying next...`);
        continue;
      }

      const data = JSON.parse(rawText);
      const content = data?.choices?.[0]?.message?.content;

      // If model returned null content (image model picked by router), skip it
      if (!content || typeof content !== "string") {
        console.warn(`Model ${model} returned non-text content, trying next...`);
        continue;
      }

      console.log(`✅ Used model: ${model}`);
      return content.trim();

    } catch (err) {
      console.warn(`Error with model ${model}:`, err.message);
      continue;
    }
  }

  throw new Error("All models failed or returned non-text responses.");
}

export async function parseSearchQuery(naturalQuery) {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey || apiKey === "your_key_here" || apiKey.trim() === "") {
    console.warn("⚠️ VITE_OPENROUTER_API_KEY is missing or placeholder. Using local fallback parser.");
    return localParseSearchQuery(naturalQuery);
  }

  try {
    const result = await callOpenRouter([
      {
        role: "system",
        content: `You are a real estate search parser for an Indian property platform (Gurgaon/NCR).
Extract structured filters from the user's natural language query.
Return ONLY valid JSON — no explanation, no markdown, no code fences.

JSON shape:
{
  "bhk": number | null,
  "minPrice": number | null,
  "maxPrice": number | null,
  "sectors": string[],
  "amenities": string[],
  "preferences": string[],
  "minArea": number | null,
  "facing": string | null,
  "summary": string
}

Rules:
- Prices in lakhs (e.g. "80 lakhs" = 80, "1 crore" = 100)
- amenities: map to these tags only: ["gym", "school_nearby", "metro", "sunlight", "park", "pool", "security"]
- summary: 1 sentence rephrasing the query in second person
- Unmentioned fields = null or []`
      },
      { role: "user", content: naturalQuery }
    ]);

    // Extract only the JSON object — ignore any text the model prepends or appends
    const jsonStart = result.indexOf("{");
    const jsonEnd = result.lastIndexOf("}");
    
    if (jsonStart === -1 || jsonEnd === -1) {
      console.error("No JSON object found in response:", result);
      return localParseSearchQuery(naturalQuery);
    }
    
    const jsonString = result.slice(jsonStart, jsonEnd + 1);
    return JSON.parse(jsonString);
  } catch (err) {
    console.error("parseSearchQuery failed, using fallback:", err);
    return localParseSearchQuery(naturalQuery);
  }
}

export async function generatePropertySummary(property, userQuery) {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey || apiKey === "your_key_here" || apiKey.trim() === "") {
    console.warn("⚠️ VITE_OPENROUTER_API_KEY is missing or placeholder. Using local fallback summary.");
    return `This is a beautiful ${property.bhk}BHK apartment spanning ${property.area} sq ft in ${property.locality}, Sector ${property.sector}. Priced at ${property.priceLabel}, it matches your query of "${userQuery}" and includes features such as ${property.amenities.join(', ')}.`;
  }

  try {
    const propertyDescription = `
      ${property.bhk}BHK, ${property.area} sq ft
      Location: ${property.sector}, ${property.locality}
      Price: ${property.priceLabel}
      Facing: ${property.facing}, Floor ${property.floor}/${property.totalFloors}
      Amenities: ${property.amenities.join(", ")}
      Match reasons: ${property.matchReasons.join(", ")}
    `.trim();

    return await callOpenRouter([
      {
        role: "system",
        content: `You are a concierge AI for 360 Ghar, a premium Indian real estate platform.
Write exactly 2–3 sentences explaining why this property matches the user's search.
Be warm, specific, and personal. Mention concrete details that address the user's query.
Do NOT start with "This property". No generic filler. Return only the sentences.`
      },
      {
        role: "user",
        content: `User searched: "${userQuery}"\n\nProperty:\n${propertyDescription}`
      }
    ]);
  } catch (err) {
    console.error("generatePropertySummary failed, using fallback:", err);
    return `This is a beautiful ${property.bhk}BHK apartment spanning ${property.area} sq ft in ${property.locality}, Sector ${property.sector}. Priced at ${property.priceLabel}, it matches your query of "${userQuery}" and includes features such as ${property.amenities.join(', ')}.`;
  }
}

function localFollowUpQuestion(query, filters) {
  const normalized = query.toLowerCase();
  
  if (normalized.includes("50")) {
    return {
      text: "Did you mean Sector 50 or nearby Sector 57? Sector 57 offers highly spacious 3BHK builder floors.",
      options: [
        { label: "Sector 50", query: query },
        { label: "Sector 57", query: query.replace(/sector\s*50/i, "Sector 57").replace(/50/i, "57") }
      ]
    };
  }

  if (normalized.includes("dlf")) {
    return {
      text: "Are you interested in DLF Phase 4 or DLF Phase 1? DLF Phase 1 has more independent builder floors.",
      options: [
        { label: "DLF Phase 4", query: query.includes("phase 1") ? query.replace(/phase\s*1/i, "Phase 4") : query },
        { label: "DLF Phase 1", query: query.includes("phase 4") ? query.replace(/phase\s*4/i, "Phase 1") : query + " DLF Phase 1" }
      ]
    };
  }

  if (normalized.includes("1bhk") || normalized.includes("1 bhk")) {
    return {
      text: "Would you like to explore 2BHK properties as well? They offer better resale value and space for a minor price increase.",
      options: [
        { label: "Keep 1BHK", query: query },
        { label: "Try 2BHK", query: query.replace(/1\s*bhk/i, "2BHK") }
      ]
    };
  }

  // Generic fallback
  return {
    text: "Would you like to view properties closer to the Metro station or inside premium Gated Societies?",
    options: [
      { label: "Near Metro", query: query + " near metro" },
      { label: "Gated Society", query: query + " gated society" }
    ]
  };
}

export async function generateFollowUpQuestion(userQuery, parsedFilters) {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey || apiKey === "your_key_here" || apiKey.trim() === "") {
    console.warn("⚠️ VITE_OPENROUTER_API_KEY is missing or placeholder. Using local fallback follow-up.");
    return localFollowUpQuestion(userQuery, parsedFilters);
  }

  try {
    const result = await callOpenRouter([
      {
        role: "system",
        content: `You are a real estate AI search concierge for 360 Ghar (Gurgaon/NCR).
Based on the user's search query and extracted filters, formulate a helpful, single follow-up clarifying question to help narrow down or expand their search.
Return ONLY valid JSON in the format:
{
  "text": "The clarifying question (e.g., 'Did you mean Sector 50 or Sector 57? Sector 57 offers similar 3BHK options under budget.')",
  "options": [
    { "label": "Option Label (e.g. 'Sector 50')", "query": "The updated query search string (e.g. '3BHK in Sector 50 under 150 Lakhs')" },
    { "label": "Option Label (e.g. 'Sector 57')", "query": "The updated query search string (e.g. '3BHK in Sector 57 under 150 Lakhs')" }
  ]
}
Keep options to exactly 2. Return ONLY the JSON object, no explanation, no markdown.`
      },
      {
        role: "user",
        content: `User query: "${userQuery}"\nParsed Filters: ${JSON.stringify(parsedFilters)}`
      }
    ]);

    const jsonStart = result.indexOf("{");
    const jsonEnd = result.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1) {
      return localFollowUpQuestion(userQuery, parsedFilters);
    }
    const jsonString = result.slice(jsonStart, jsonEnd + 1);
    return JSON.parse(jsonString);
  } catch (err) {
    console.error("generateFollowUpQuestion failed, using fallback:", err);
    return localFollowUpQuestion(userQuery, parsedFilters);
  }
}
