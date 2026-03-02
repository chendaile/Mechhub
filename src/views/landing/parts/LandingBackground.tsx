export const LandingBackground = () => {
    return (
        <div className="absolute inset-0 pointer-events-none">
            <svg
                className="w-full h-full"
                viewBox="0 0 800 600"
                preserveAspectRatio="xMidYMid slice"
            >
                <line x1="50" y1="100" x2="200" y2="250" stroke="#e2e8f0" strokeWidth="1" />
                <line x1="50" y1="300" x2="200" y2="250" stroke="#e2e8f0" strokeWidth="1" />
                <line x1="50" y1="100" x2="50" y2="300" stroke="#e2e8f0" strokeWidth="1" />
                <circle cx="50" cy="100" r="3" fill="#cbd5e1" />
                <circle cx="200" cy="250" r="3" fill="#cbd5e1" />
                <circle cx="50" cy="300" r="3" fill="#cbd5e1" />

                <line x1="700" y1="50" x2="600" y2="150" stroke="#e2e8f0" strokeWidth="1" />
                <line x1="750" y1="200" x2="600" y2="150" stroke="#e2e8f0" strokeWidth="1" />
                <circle cx="700" cy="50" r="3" fill="#cbd5e1" />
                <circle cx="600" cy="150" r="3" fill="#cbd5e1" />
                <circle cx="750" cy="200" r="3" fill="#cbd5e1" />
            </svg>
        </div>
    );
};
