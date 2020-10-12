const { useState } = require("react")

export const InitialRender = () => {
    const [isInitialRender, setIsInitialRender] = useState(false);

    if (!isInitialRender) {
        setTimeout(() => setIsInitialRender(true), 1);
        return true;
    }
    return false;
};