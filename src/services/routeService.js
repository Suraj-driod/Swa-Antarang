import { supabase } from './supabaseClient';

const TOMTOM_KEY = import.meta.env.VITE_TOMTOM_API_KEY;
const TOMTOM_BASE = 'https://api.tomtom.com';

// ── Indian Festival Calendar (major festivals that affect delivery patterns) ──
const FESTIVAL_CALENDAR = [
    { name: 'Republic Day', month: 1, day: 26, impactDays: 1 },
    { name: 'Holi', month: 3, day: 14, impactDays: 2 },
    { name: 'Ram Navami', month: 4, day: 17, impactDays: 1 },
    { name: 'Eid ul-Fitr', month: 4, day: 10, impactDays: 2 },
    { name: 'Independence Day', month: 8, day: 15, impactDays: 1 },
    { name: 'Raksha Bandhan', month: 8, day: 9, impactDays: 1 },
    { name: 'Janmashtami', month: 8, day: 26, impactDays: 1 },
    { name: 'Ganesh Chaturthi', month: 9, day: 7, impactDays: 3 },
    { name: 'Navratri Start', month: 10, day: 3, impactDays: 9 },
    { name: 'Dussehra', month: 10, day: 12, impactDays: 1 },
    { name: 'Diwali', month: 10, day: 31, impactDays: 5 },
    { name: 'Eid ul-Adha', month: 6, day: 17, impactDays: 2 },
    { name: 'Christmas', month: 12, day: 25, impactDays: 2 },
    { name: 'New Year', month: 1, day: 1, impactDays: 1 },
];

// ── Check if today is near a festival ──
export function getNearbyFestivals(date = new Date()) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return FESTIVAL_CALENDAR.filter(f => {
        const diff = Math.abs((f.month - month) * 30 + (f.day - day));
        return diff <= f.impactDays + 1; // Within impact window
    });
}

// ── TomTom Geocoding ──
export async function geocodeAddress(address) {
    try {
        const url = `${TOMTOM_BASE}/search/2/geocode/${encodeURIComponent(address)}.json?key=${TOMTOM_KEY}&countrySet=IN&limit=1`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.results && data.results.length > 0) {
            const pos = data.results[0].position;
            return { lat: pos.lat, lng: pos.lon, formattedAddress: data.results[0].address?.freeformAddress || address };
        }
        return null;
    } catch (err) {
        console.error('Geocoding error:', err);
        return null;
    }
}

// ── TomTom Waypoint Optimization ──
export async function optimizeWaypoints(origin, destinations) {
    try {
        // Build waypoints string: origin:lat,lng:destinations
        const waypoints = [
            `${origin.lat},${origin.lng}`,
            ...destinations.map(d => `${d.lat},${d.lng}`)
        ];

        // TomTom Waypoint Optimization API
        const url = `${TOMTOM_BASE}/routing/waypointoptimization/1?key=${TOMTOM_KEY}`;
        const body = {
            waypoints: waypoints.map((wp, i) => ({
                point: { latitude: parseFloat(wp.split(',')[0]), longitude: parseFloat(wp.split(',')[1]) },
            })),
            options: {
                travelMode: 'car',
                vehicleHeading: 0,
            }
        };

        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const data = await res.json();

        if (data.optimizedOrder) {
            return data.optimizedOrder;
        }
        // Fallback: return original order
        return destinations.map((_, i) => i + 1);
    } catch (err) {
        console.error('Waypoint optimization error:', err);
        return destinations.map((_, i) => i + 1);
    }
}

// ── Get Route Geometry via GraphHopper (free) ──
export async function getRouteGeometry(waypoints) {
    try {
        // Use OSRM free routing service (no API key needed)
        const coords = waypoints.map(w => `${w.lng},${w.lat}`).join(';');
        const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            // Convert GeoJSON coordinates [lng, lat] to Leaflet [lat, lng]
            const polyline = route.geometry.coordinates.map(c => [c[1], c[0]]);
            return {
                polyline,
                distance: route.distance, // meters
                duration: route.duration, // seconds
            };
        }
        return null;
    } catch (err) {
        console.error('Route geometry error:', err);
        return null;
    }
}

// ── TomTom Traffic Flow ──
export async function getTrafficFlow(lat, lng) {
    try {
        const url = `${TOMTOM_BASE}/traffic/services/4/flowSegmentData/absolute/10/json?point=${lat},${lng}&key=${TOMTOM_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.flowSegmentData) {
            const flow = data.flowSegmentData;
            const congestionRatio = flow.currentSpeed / flow.freeFlowSpeed;
            return {
                currentSpeed: flow.currentSpeed,
                freeFlowSpeed: flow.freeFlowSpeed,
                congestion: congestionRatio < 0.5 ? 'High' : congestionRatio < 0.75 ? 'Medium' : 'Low',
                confidence: flow.confidence,
            };
        }
        return { congestion: 'Unknown', currentSpeed: 0, freeFlowSpeed: 0 };
    } catch (err) {
        console.error('Traffic flow error:', err);
        return { congestion: 'Unknown', currentSpeed: 0, freeFlowSpeed: 0 };
    }
}

// ── Density Clustering (simple grid-based) ──
function clusterByDensity(geocodedOrders, gridSizeKm = 2) {
    const clusters = {};
    const gridSize = gridSizeKm / 111; // approx degrees per km

    geocodedOrders.forEach(order => {
        const gx = Math.floor(order.lat / gridSize);
        const gy = Math.floor(order.lng / gridSize);
        const key = `${gx}_${gy}`;
        if (!clusters[key]) clusters[key] = [];
        clusters[key].push(order);
    });

    // Sort clusters by density (most orders first)
    return Object.values(clusters).sort((a, b) => b.length - a.length);
}

// ── Schedule Assignment based on density ──
function assignSchedule(clusters) {
    const totalClusters = clusters.length;
    return clusters.map((cluster, idx) => {
        const ratio = idx / totalClusters;
        let timeSlot, priority;
        if (ratio < 0.33) {
            // High density → Morning delivery
            timeSlot = '06:00 AM - 10:00 AM';
            priority = 'High';
        } else if (ratio < 0.66) {
            // Medium density → Afternoon
            timeSlot = '11:00 AM - 03:00 PM';
            priority = 'Medium';
        } else {
            // Low density → Evening
            timeSlot = '04:00 PM - 08:00 PM';
            priority = 'Low';
        }
        return cluster.map(order => ({ ...order, timeSlot, priority }));
    }).flat();
}

// ── Main Orchestrator ──
export async function calculateDeliverySchedule(orders, merchantLocation) {
    const festivals = getNearbyFestivals();
    const hasFestival = festivals.length > 0;

    // 1. Geocode all order addresses
    const geocoded = [];
    for (const order of orders) {
        const addr = order.shipping_address;
        let addrStr = '';
        if (typeof addr === 'string') {
            addrStr = addr;
        } else if (addr && typeof addr === 'object') {
            addrStr = addr.address || addr.street || `${addr.city || ''} ${addr.state || ''} ${addr.pincode || ''}`;
        }

        if (!addrStr || addrStr.trim() === '') {
            // Use a fallback location near merchant
            geocoded.push({
                ...order,
                lat: merchantLocation.lat + (Math.random() - 0.5) * 0.02,
                lng: merchantLocation.lng + (Math.random() - 0.5) * 0.02,
                geocodedAddress: 'Near merchant location',
            });
            continue;
        }

        const geo = await geocodeAddress(addrStr);
        if (geo) {
            geocoded.push({ ...order, lat: geo.lat, lng: geo.lng, geocodedAddress: geo.formattedAddress });
        } else {
            // Fallback
            geocoded.push({
                ...order,
                lat: merchantLocation.lat + (Math.random() - 0.5) * 0.02,
                lng: merchantLocation.lng + (Math.random() - 0.5) * 0.02,
                geocodedAddress: addrStr || 'Unknown',
            });
        }
    }

    // 2. Cluster by density
    const clusters = clusterByDensity(geocoded);

    // 3. Assign schedule
    let scheduled = assignSchedule(clusters);

    // 4. Festival adjustment: shift all deliveries earlier during festivals
    if (hasFestival) {
        scheduled = scheduled.map(order => ({
            ...order,
            timeSlot: order.priority === 'Low' ? '02:00 PM - 06:00 PM' : order.timeSlot,
            festivalNote: `Near ${festivals[0].name} — adjusted schedule`,
        }));
    }

    // 5. Optimize waypoint order via TomTom
    const waypointsForOpt = scheduled.map(o => ({ lat: o.lat, lng: o.lng }));
    let optimizedOrder;
    try {
        optimizedOrder = await optimizeWaypoints(merchantLocation, waypointsForOpt);
    } catch {
        optimizedOrder = scheduled.map((_, i) => i);
    }

    // Reorder based on optimization
    const reordered = Array.isArray(optimizedOrder)
        ? optimizedOrder.map(idx => scheduled[typeof idx === 'number' ? idx : idx - 1]).filter(Boolean)
        : scheduled;

    // 6. Get route geometry
    const allWaypoints = [merchantLocation, ...reordered.map(o => ({ lat: o.lat, lng: o.lng }))];
    let routeGeo = null;
    try {
        routeGeo = await getRouteGeometry(allWaypoints);
    } catch {
        routeGeo = null;
    }

    // 7. Get traffic for first few stops
    const trafficData = [];
    for (let i = 0; i < Math.min(reordered.length, 5); i++) {
        try {
            const traffic = await getTrafficFlow(reordered[i].lat, reordered[i].lng);
            trafficData.push(traffic);
        } catch {
            trafficData.push({ congestion: 'Unknown' });
        }
    }

    // Merge traffic into stops
    const stops = reordered.map((order, idx) => ({
        ...order,
        stopNumber: idx + 1,
        traffic: trafficData[idx] || { congestion: 'Unknown' },
        estimatedTime: calculateStopTime(idx, reordered.length),
    }));

    return {
        stops,
        routeGeometry: routeGeo,
        festivals: festivals.map(f => f.name),
        totalDistance: routeGeo?.distance ? (routeGeo.distance / 1000).toFixed(1) : null,
        totalDuration: routeGeo?.duration ? Math.round(routeGeo.duration / 60) : null,
        fuelEstimate: routeGeo?.distance ? (routeGeo.distance / 1000 / 12).toFixed(1) : null, // ~12 km/L
    };
}

function calculateStopTime(index, total) {
    // Start from 6 AM, distribute stops evenly
    const startHour = 6;
    const endHour = 20;
    const hoursAvailable = endHour - startHour;
    const intervalMinutes = (hoursAvailable * 60) / total;
    const totalMinutes = startHour * 60 + index * intervalMinutes;
    const hours = Math.floor(totalMinutes / 60);
    const mins = Math.round(totalMinutes % 60);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${String(displayHour).padStart(2, '0')}:${String(mins).padStart(2, '0')} ${period}`;
}

// ── Save optimized route to Supabase ──
export async function saveOptimizedRoute(merchantId, driverId, routeData) {
    // Save route plan to each order's delivery record
    const { stops, routeGeometry, totalDistance, totalDuration } = routeData;

    const routePlan = {
        optimizedAt: new Date().toISOString(),
        totalDistance,
        totalDuration,
        stops: stops.map(s => ({
            orderId: s.id,
            stopNumber: s.stopNumber,
            lat: s.lat,
            lng: s.lng,
            address: s.geocodedAddress,
            timeSlot: s.timeSlot,
            estimatedTime: s.estimatedTime,
            priority: s.priority,
        })),
        polyline: routeGeometry?.polyline || [],
    };

    // Update each order with the assigned driver and create delivery records
    const results = [];
    for (const stop of stops) {
        if (!stop.id) continue;

        // Update order logistics
        const { error: orderErr } = await supabase
            .from('orders')
            .update({
                logistics_type: 'own_driver',
                assigned_driver_id: driverId,
                status: 'confirmed',
                updated_at: new Date().toISOString(),
            })
            .eq('id', stop.id);
        if (orderErr) console.error('Order update error:', orderErr);

        // Check if delivery record exists
        const { data: existing } = await supabase
            .from('deliveries')
            .select('id')
            .eq('order_id', stop.id)
            .eq('driver_id', driverId)
            .maybeSingle();

        if (existing) {
            // Update existing
            await supabase
                .from('deliveries')
                .update({ gps_log: routePlan, updated_at: new Date().toISOString() })
                .eq('id', existing.id);
        } else {
            // Create new delivery
            const { error: delErr } = await supabase
                .from('deliveries')
                .insert({
                    order_id: stop.id,
                    driver_id: driverId,
                    status: 'pending',
                    gps_log: routePlan,
                });
            if (delErr) console.error('Delivery insert error:', delErr);
        }
        results.push(stop.id);
    }

    return results;
}

// ── Get assigned route for driver ──
export async function getAssignedRoute(driverProfileId) {
    const { data, error } = await supabase
        .from('deliveries')
        .select('*, orders(*, order_items(*), merchant_profiles!merchant_id(business_name, address, lat, lng))')
        .eq('driver_id', driverProfileId)
        .neq('status', 'delivered')
        .order('created_at', { ascending: false });

    if (error) throw error;

    // Find the most recent route plan from gps_log
    const withRoute = data?.find(d => d.gps_log && d.gps_log.stops);
    if (withRoute) {
        return {
            routePlan: withRoute.gps_log,
            deliveries: data,
        };
    }

    return { routePlan: null, deliveries: data || [] };
}

// ── Get own drivers for merchant ──
export async function getMerchantDrivers() {
    const { data, error } = await supabase
        .from('driver_profiles')
        .select('*, profiles(full_name, phone)')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
}
