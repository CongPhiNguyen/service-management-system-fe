import { useCallback, useState } from "react";

export const useCenteredTree = (defaultTranslate = { x: 0, y: 0 }) => {
    const [translate, setTranslate] = useState(defaultTranslate);
    const [dimensions, setDimensions] = useState();
    const containerRef = useCallback((containerElem) => {
        if (containerElem !== null) {
            const { width, height } = containerElem.getBoundingClientRect();
            setDimensions({ width: width / 1.5, height: height / 2 });
            setTranslate({ x: width / 10, y: height / 2 });
        }
    }, []);
    return [dimensions, translate, containerRef];
};
