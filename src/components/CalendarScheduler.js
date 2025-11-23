'use client';

import { useEffect, memo } from 'react';
import Cal, { getCalApi } from '@calcom/embed-react';

function CalendarScheduler({ currentTheme, isDarkMode }) {
    useEffect(() => {
        (async function () {
            const cal = await getCalApi({ namespace: '30min' });
            cal('ui', {
                hideEventTypeDetails: true,
                layout: 'month_view',
                theme: isDarkMode ? 'dark' : 'light'
            });
        })();
    }, [isDarkMode]);

    return (
        <div className="bg-white dark:bg-black rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 min-h-[600px] overflow-hidden">
            <Cal
                namespace="30min"
                calLink="kushyanth-pothineni-e3afdq/30min"
                style={{ width: '100%', height: '100%', overflow: 'scroll' }}
                config={{ layout: 'month_view' }}
            />
        </div>
    );
}

// Memoize to prevent re-renders when theme changes
export default memo(CalendarScheduler);
