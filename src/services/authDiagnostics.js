/**
 * Auth Performance Diagnostics
 * 
 * This file provides tools to diagnose where login delays are occurring.
 * Use this to identify if delays are in:
 * - Supabase network requests (/auth/v1/token endpoint)
 * - React profile loading
 * - Browser cookie handling
 * 
 * Instructions:
 * 1. Import this in AuthContext.jsx
 * 2. Call trackLoginPerformance() at the start of login()
 * 3. Watch the console for detailed timing breakdown
 * 4. Check Network tab in DevTools for /auth/v1/token timing
 */

const timings = {};

export function startTimer(label) {
    timings[label] = Date.now();
    console.log(`⏱️  [${label}] START`);
}

export function endTimer(label, expectMs = null) {
    if (!timings[label]) {
        console.warn(`⏱️  [${label}] No start time recorded`);
        return 0;
    }
    const elapsed = Date.now() - timings[label];
    const tooSlow = expectMs && elapsed > expectMs;
    const icon = tooSlow ? '🔴' : '✅';
    console.log(`${icon} [${label}] ${elapsed}ms ${tooSlow ? `(expected <${expectMs}ms)` : ''}`);
    return elapsed;
}

export function printTimingSummary() {
    console.group('📊 LOGIN PERFORMANCE SUMMARY');
    
    const keys = Object.keys(timings);
    keys.forEach(key => {
        const elapsed = Date.now() - timings[key];
        console.log(`  ${key}: ${elapsed}ms`);
    });
    
    console.groupEnd();
}

/**
 * Analyze where the slowness is:
 * 
 * If cookie clear + signOut < 500ms:  ✅ Not the bottleneck
 * If signInWithPassword takes > 3000ms:  🔴 Supabase network is slow or being rate-limited
 * If loadProfile takes > 5000ms:  🔴 Database queries are slow or missing indexes
 * If total is < 2000ms but UI still feels sluggish:  🔴 React rendering issue (check Dev Tools Profiler)
 */

export function diagnoseSlowness(totalMs) {
    console.group('🔍 DIAGNOSIS');
    
    if (totalMs < 2000) {
        console.log('✅ Auth process is fast. If UI feels slow, the issue is in React rendering.');
        console.log('   → Open React DevTools Profiler to see which components are re-rendering');
    } else if (totalMs < 5000) {
        console.log('⚠️  Auth is moderately slow (2-5 seconds)');
        console.log('   → Check if signInWithPassword() or loadProfile() are the culprits');
        console.log('   → Open Network tab and look for /auth/v1/token endpoint timing');
    } else {
        console.log('🔴 Auth is VERY slow (>5 seconds)');
        console.log('   → This is likely a Supabase rate limit or database issue');
        console.log('   → Check Supabase dashboard: Settings > Auth > Rate Limits');
        console.log('   → Check if database triggers are attached to auth.users table');
    }
    
    console.groupEnd();
}

/**
 * Network-level diagnostics
 */
export function checkNetworkBottleneck() {
    console.group('🌐 NETWORK DIAGNOSTICS');
    console.log('To see where the network delay is:');
    console.log('1. Open DevTools → Network tab');
    console.log('2. Filter by "token" or "auth"');
    console.log('3. Attempt login');
    console.log('4. Look for /auth/v1/token endpoint');
    console.log('   - If it takes > 3s: Supabase is rate-limiting or slow');
    console.log('   - If it\'s fast but app is slow: Delay is in React/profile loading');
    console.groupEnd();
}

/**
 * Cookie diagnostics
 */
export function checkCookies() {
    console.group('🍪 COOKIE DIAGNOSTICS');
    const cookies = document.cookie.split(';');
    console.log('Current cookies:');
    cookies.forEach(c => console.log(`  ${c.trim()}`));
    
    // Check for Supabase-specific cookies
    const sbCookies = cookies.filter(c => c.includes('sb-'));
    if (sbCookies.length > 0) {
        console.warn('⚠️  Found stale Supabase cookies:', sbCookies);
        console.log('These should have been cleared before login. Check if manual cookie clearing worked.');
    } else {
        console.log('✅ No stale Supabase cookies found');
    }
    console.groupEnd();
}

export default {
    startTimer,
    endTimer,
    printTimingSummary,
    diagnoseSlowness,
    checkNetworkBottleneck,
    checkCookies,
};
