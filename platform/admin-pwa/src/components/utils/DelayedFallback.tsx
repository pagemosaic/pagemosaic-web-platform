import {useState, useEffect} from 'react';

export function DelayedFallback() {
    const [show, setShow] = useState(false);
    useEffect(() => {
        let timeout = setTimeout(() => setShow(true), 300);
        return () => {
            clearTimeout(timeout);
        }
    }, []);

    if (show) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center">
                <p className="text-xl">Loading...</p>
            </div>
        );
    }
    return null;
}
