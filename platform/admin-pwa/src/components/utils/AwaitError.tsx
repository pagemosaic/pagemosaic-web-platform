import { useAsyncError, useNavigate } from "react-router-dom";
import {useEffect} from 'react';

export function AwaitError() {
    const navigate = useNavigate();
    const error: any = useAsyncError();
    useEffect(() => {
        if (error.message === '[ACCESS_TOKEN_IS_MISSING]') {
            navigate('/login');
        }
    }, [error]);
    return <div className="text-xs text-red-600">{error.message}</div>;
}
