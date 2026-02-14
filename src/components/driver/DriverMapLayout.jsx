/**
 * DriverMapLayout — Wrapper that ensures the map sits below the navbar
 * and fills the remaining viewport height.
 */
export default function DriverMapLayout({ children }) {
    return (
        <div
            className="w-full relative"
            style={{ height: 'calc(100vh - 80px)' }}
        >
            {children}
        </div>
    );
}
