import axios from 'axios';

// Interfaces for strong typing
export interface ActivityResult {
    date: string;
    activity: string;
    rank: number;
    reasoning: string;
}

interface WeatherData {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    snowfall_sum?: number[];
    weathercode?: number[];
}

interface Coordinates {
    latitude: number;
    longitude: number;
}

// Activity types as specified in requirements
export const ACTIVITY_TYPES = [
    'Skiing',
    'Surfing',
    'Outdoor Sightseeing',
    'Indoor Sightseeing'
] as const;

export class WeatherService {
    private baseUrl = 'https://api.open-meteo.com/v1/forecast';
    private geocodingUrl = 'https://geocoding-api.open-meteo.com/v1/search';

    // Mock city database with coordinates (in production, this would use a geocoding API)
    private cityDatabase: { [key: string]: Coordinates } = {
        'london': { latitude: 51.5074, longitude: -0.1278 },
        'paris': { latitude: 48.8566, longitude: 2.3522 },
        'new york': { latitude: 40.7128, longitude: -74.0060 },
        'tokyo': { latitude: 35.6762, longitude: 139.6503 },
        'sydney': { latitude: -33.8688, longitude: 151.2093 },
        'toronto': { latitude: 43.6532, longitude: -79.3832 },
        'dubai': { latitude: 25.2048, longitude: 55.2708 },
        'mumbai': { latitude: 19.0760, longitude: 72.8777 },
    };

    /**
     * Gets coordinates for a city name
     * In production, this would use the Open-Meteo geocoding API
     */
    private async getCityCoordinates(city: string): Promise<Coordinates> {
        const cityKey = city.toLowerCase().trim();
        const coordinates = this.cityDatabase[cityKey];
        
        if (!coordinates) {
            // Try using Open-Meteo geocoding API as fallback
            try {
                const response = await axios.get(`${this.geocodingUrl}?name=${encodeURIComponent(city)}&count=1`);
                if (response.data.results && response.data.results.length > 0) {
                    return {
                        latitude: response.data.results[0].latitude,
                        longitude: response.data.results[0].longitude
                    };
                }
            } catch (error) {
                // If geocoding fails, throw error
            }
            throw new Error(`City "${city}" not found`);
        }
        
        return coordinates;
    }

    /**
     * Fetches 7-day weather forecast for a city
     * Returns ranked activities for each day
     */
    async getRankedActivities(city: string): Promise<ActivityResult[]> {
        try {
            // 1. Get city coordinates
            const coords = await this.getCityCoordinates(city);

            // 2. Fetch 7-day weather forecast from Open-Meteo
            const weatherUrl = `${this.baseUrl}?latitude=${coords.latitude}&longitude=${coords.longitude}` +
                `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,snowfall_sum,weathercode` +
                `&forecast_days=7&timezone=auto`;
            
            const response = await axios.get(weatherUrl);
            const dailyData: WeatherData = response.data.daily;
            
            const results: ActivityResult[] = [];

            // 3. For each day, rank all 4 activities
            for (let dayIndex = 0; dayIndex < dailyData.time.length; dayIndex++) {
                const date = dailyData.time[dayIndex];
                const tempMax = dailyData.temperature_2m_max[dayIndex] ?? 0;
                const tempMin = dailyData.temperature_2m_min[dayIndex] ?? 0;
                const precipitation = dailyData.precipitation_sum[dayIndex] ?? 0;
                const snowfall = dailyData.snowfall_sum?.[dayIndex] || 0;
                const avgTemp = (tempMax + tempMin) / 2;

                // Rank each activity type for this day
                for (const activity of ACTIVITY_TYPES) {
                    const { rank, reasoning } = this.rankActivity(
                        activity,
                        avgTemp,
                        tempMax,
                        tempMin,
                        precipitation,
                        snowfall
                    );

                    results.push({
                        date: date ?? '',
                        activity: activity,
                        rank: rank,
                        reasoning: reasoning
                    });
                }
            }

            return results;
        } catch (error: any) {
            // Handle errors gracefully (e.g., city not found, API failure)
            if (error.message?.includes('not found')) {
                throw error;
            }
            throw new Error(`Failed to fetch weather data: ${error.message}`);
        }
    }

    /**
     * Ranks an activity based on weather conditions
     * Returns rank (1-10) and reasoning
     */
    private rankActivity(
        activity: string,
        avgTemp: number,
        tempMax: number,
        tempMin: number,
        precipitation: number,
        snowfall: number
    ): { rank: number; reasoning: string } {
        let rank = 5; // Default middle rank
        let reasoning = '';

        switch (activity) {
            case 'Skiing':
                // Good skiing: cold temps, snow, no rain
                if (avgTemp < 5 && snowfall > 0.1) {
                    rank = 9;
                    reasoning = `Excellent conditions: ${snowfall.toFixed(1)}cm snowfall and cold temperatures (${avgTemp.toFixed(1)}°C)`;
                } else if (avgTemp < 10 && snowfall > 0) {
                    rank = 7;
                    reasoning = `Good conditions: ${snowfall.toFixed(1)}cm snowfall, temperature ${avgTemp.toFixed(1)}°C`;
                } else if (avgTemp < 15 && precipitation === 0) {
                    rank = 5;
                    reasoning = `Moderate conditions: Cold enough (${avgTemp.toFixed(1)}°C) but no fresh snow`;
                } else {
                    rank = 2;
                    reasoning = `Poor conditions: Too warm (${avgTemp.toFixed(1)}°C) and ${precipitation > 0 ? 'rain expected' : 'no snow'}`;
                }
                break;

            case 'Surfing':
                // Good surfing: moderate temps, some wind (simulated by weathercode), moderate precipitation
                if (avgTemp >= 15 && avgTemp <= 30 && precipitation < 5) {
                    rank = 8;
                    reasoning = `Great conditions: Warm water (${avgTemp.toFixed(1)}°C), minimal rain (${precipitation.toFixed(1)}mm)`;
                } else if (avgTemp >= 10 && avgTemp < 15 && precipitation < 3) {
                    rank = 6;
                    reasoning = `Moderate conditions: Cooler water (${avgTemp.toFixed(1)}°C) but surfable`;
                } else if (avgTemp > 30) {
                    rank = 4;
                    reasoning = `Hot conditions: Very warm (${avgTemp.toFixed(1)}°C), may affect performance`;
                } else {
                    rank = 3;
                    reasoning = `Poor conditions: Too cold (${avgTemp.toFixed(1)}°C) or heavy rain (${precipitation.toFixed(1)}mm)`;
                }
                break;

            case 'Outdoor Sightseeing':
                // Good outdoor: clear skies, mild temps, no heavy rain
                if (avgTemp >= 15 && avgTemp <= 25 && precipitation < 1) {
                    rank = 10;
                    reasoning = `Perfect weather: Pleasant temperature (${avgTemp.toFixed(1)}°C), clear skies, no rain`;
                } else if (avgTemp >= 10 && avgTemp < 30 && precipitation < 3) {
                    rank = 8;
                    reasoning = `Good conditions: Comfortable temperature (${avgTemp.toFixed(1)}°C), light precipitation (${precipitation.toFixed(1)}mm)`;
                } else if (precipitation >= 3 && precipitation < 10) {
                    rank = 5;
                    reasoning = `Moderate conditions: Some rain expected (${precipitation.toFixed(1)}mm), bring umbrella`;
                } else if (precipitation >= 10 || avgTemp < 5 || avgTemp > 35) {
                    rank = 3;
                    reasoning = `Challenging conditions: ${precipitation >= 10 ? `Heavy rain (${precipitation.toFixed(1)}mm)` : `Extreme temperature (${avgTemp.toFixed(1)}°C)`}`;
                } else {
                    rank = 6;
                    reasoning = `Fair conditions: Temperature ${avgTemp.toFixed(1)}°C, ${precipitation.toFixed(1)}mm precipitation`;
                }
                break;

            case 'Indoor Sightseeing':
                // Indoor is generally good, but rank lower if weather is perfect (people prefer outdoor)
                if (precipitation > 5 || avgTemp < 0 || avgTemp > 35) {
                    rank = 9;
                    reasoning = `Excellent alternative: Poor outdoor conditions (${precipitation > 5 ? `${precipitation.toFixed(1)}mm rain` : `extreme temperature (${avgTemp.toFixed(1)}°C)`}), perfect for indoor activities`;
                } else if (precipitation > 2 || avgTemp < 5 || avgTemp > 30) {
                    rank = 7;
                    reasoning = `Good option: ${precipitation > 2 ? 'Rainy' : 'Extreme temperatures'}, comfortable indoor alternative`;
                } else if (avgTemp >= 15 && avgTemp <= 25 && precipitation < 1) {
                    rank = 4;
                    reasoning = `Weather is great outside (${avgTemp.toFixed(1)}°C, clear), but indoor options always available`;
                } else {
                    rank = 6;
                    reasoning = `Always available: Indoor sightseeing is a reliable option regardless of weather`;
                }
                break;
        }

        // Ensure rank is within 1-10 range
        rank = Math.max(1, Math.min(10, rank));

        return { rank, reasoning };
    }

    /**
     * Gets autocomplete suggestions for city names
     * In production, this would query a database or use a geocoding API
     */
    async getSuggestions(partial: string): Promise<string[]> {
        if (!partial || partial.trim().length === 0) {
            return [];
        }

        const partialLower = partial.toLowerCase().trim();
        const allCities = Object.keys(this.cityDatabase).map(c => 
            c.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        );

        // Filter cities that contain the partial string (case-insensitive)
        const suggestions = allCities.filter(city => 
            city.toLowerCase().includes(partialLower)
        );

        // Also try Open-Meteo geocoding API for more suggestions
        try {
            const response = await axios.get(
                `${this.geocodingUrl}?name=${encodeURIComponent(partial)}&count=5`,
                { timeout: 2000 }
            );
            if (response.data.results) {
                const apiSuggestions = response.data.results.map((result: any) => result.name);
                // Merge and deduplicate
                const combined = [...new Set([...suggestions, ...apiSuggestions])];
                return combined.slice(0, 10); // Limit to 10 suggestions
            }
        } catch (error) {
            // If API fails, return local suggestions
        }

        return suggestions;
    }
}