import { useEffect, useRef } from "react";

const useIntersectionObserver = (
    onIntersect : () => void,
    options : IntersectionObserverInit
) => {
    const targetRef = useRef<HTMLDivElement | null>(null);

    useEffect(()=>{

        if(!targetRef.current) return;

        const observer = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting){
                onIntersect();
            }
        }, options);

        const currentTarget = targetRef.current;

        observer.observe(currentTarget);

        return () => {
            if(currentTarget){
                observer.unobserve(currentTarget);
            }
        };
    }, [onIntersect, options])

    return targetRef;
}

export default useIntersectionObserver;