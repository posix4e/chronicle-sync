import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { getDatabase } from '@chronicle-sync/core';
export function HistoryList() {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function loadEntries() {
            try {
                const db = await getDatabase();
                const result = await db.history.find().exec();
                setEntries(result);
            }
            catch (error) {
                console.error('Failed to load history:', error);
            }
            finally {
                setLoading(false);
            }
        }
        loadEntries();
    }, []);
    if (loading) {
        return _jsx("div", { children: "Loading..." });
    }
    return (_jsx("ul", { children: entries.map((entry) => (_jsxs("li", { children: [_jsx("a", { href: entry.url, target: "_blank", rel: "noopener noreferrer", children: entry.title || entry.url }), _jsx("time", { dateTime: new Date(entry.timestamp).toISOString(), children: new Date(entry.timestamp).toLocaleString() })] }, entry.id))) }));
}
