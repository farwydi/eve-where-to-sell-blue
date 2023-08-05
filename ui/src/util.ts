export const securityRound = (security: number): string => {
    return security.toFixed(1).toString()
}

export const securityColor = (security: number): string => {
    switch (securityRound(security)) {
        case '1.0':
            return "text-security-1.0";
        case '0.9':
            return "text-security-0.9";
        case '0.8':
            return "text-security-0.8";
        case '0.7':
            return "text-security-0.7";
        case '0.6':
            return "text-security-0.6";
        case '0.5':
            return "text-security-0.5";
        case '0.4':
            return "text-security-0.4";
        case '0.3':
            return "text-security-0.3";
        case '0.2':
            return "text-security-0.2";
        case '0.1':
            return "text-security-0.1";
    }

    return "text-security-0.0";
}