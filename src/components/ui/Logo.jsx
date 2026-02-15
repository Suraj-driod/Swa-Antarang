import React from "react";

const SwaAntarangLogo = ({
    width = 120,
    height = 120,
    className = "",
}) => {
    return (
        <img
            src="/logo.png"
            alt="Swa-Antarang"
            width={width}
            height={height}
            className={className}
            style={{ objectFit: 'contain' }}
        />
    );
};

export default SwaAntarangLogo;
