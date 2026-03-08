import { useState, useEffect } from 'react';

// For the UI phase, we'll import the JSON directly and simulate network delay
import messagesData from '../mock/messages.json';

const mockStores = {
    messages: messagesData
};

export function useMockData(storeName) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simulate a 500ms network request
        const timer = setTimeout(() => {
            if (mockStores[storeName]) {
                setData(mockStores[storeName]);
                setError(null);
            } else {
                setError(new Error(`Mock store '${storeName}' not found`));
            }
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [storeName]);

    return { data, loading, error };
}
