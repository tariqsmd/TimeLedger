// Schedule data for current and optimized versions
export const scheduleData = {
    current: {
        weekday: [
            { time: '06:00-08:00', activity: 'EMS (Walk, Exercise, School Drop, Breakfast)', hours: 2, category: 'health', icon: '💪' },
            { time: '08:00-10:00', activity: 'Learning (Goal/Challenge)', hours: 2, category: 'learning', icon: '📚' },
            { time: '10:00-13:00', activity: 'Company Work', hours: 3, category: 'company', icon: '💼' },
            { time: '13:00-14:00', activity: 'Lunch, Rest, School Pick', hours: 1, category: 'rest', icon: '🛋️' },
            { time: '14:00-18:00', activity: 'Own Work (Freelance/Dev/Practice)', hours: 4, category: 'own', icon: '🚀' },
            { time: '18:00-19:00', activity: 'Company Work', hours: 1, category: 'company', icon: '💼' },
            { time: '19:00-21:00', activity: 'Family, Dinner', hours: 2, category: 'family', icon: '👨‍👩‍👧' },
            { time: '21:00-00:00', activity: 'Own Work (Freelance/Dev)', hours: 3, category: 'own', icon: '🚀' }
        ],
        weekend: [
            { time: '06:00-08:00', activity: 'EMS (Walk, Exercise, Breakfast)', hours: 2, category: 'health', icon: '💪' },
            { time: '08:00-13:00', activity: 'Learning (Goal/Challenge)', hours: 5, category: 'learning', icon: '📚' },
            { time: '13:00-14:00', activity: 'Lunch, Rest', hours: 1, category: 'rest', icon: '🛋️' },
            { time: '14:00-19:00', activity: 'Own Work (Freelance/Dev/Practice)', hours: 5, category: 'own', icon: '🚀' },
            { time: '19:00-21:00', activity: 'Family, Dinner', hours: 2, category: 'family', icon: '👨‍👩‍👧' },
            { time: '21:00-00:00', activity: 'Own Work (Freelance/Dev)', hours: 3, category: 'own', icon: '🚀' }
        ]
    },
    optimized: {
        weekday: [
            { time: '06:00-08:00', activity: 'EMS (Walk, Exercise, School Drop, Breakfast)', hours: 2, category: 'health', icon: '💪' },
            { time: '08:00-10:00', activity: 'Learning (Goal/Challenge)', hours: 2, category: 'learning', icon: '📚' },
            { time: '10:00-13:00', activity: 'Company Work', hours: 3, category: 'company', icon: '💼' },
            { time: '13:00-14:30', activity: 'Lunch, Rest, School Pick', hours: 1.5, category: 'rest', icon: '🛋️' },
            { time: '14:30-18:30', activity: 'Own Work (Freelance/Dev/Practice)', hours: 4, category: 'own', icon: '🚀' },
            { time: '18:30-19:30', activity: 'Company Work', hours: 1, category: 'company', icon: '💼' },
            { time: '19:30-21:30', activity: 'Family, Dinner', hours: 2, category: 'family', icon: '👨‍👩‍👧' },
            { time: '21:30-23:30', activity: 'Own Work (Freelance/Dev)', hours: 2, category: 'own', icon: '🚀' },
            { time: '23:30-00:00', activity: 'Wind Down / Buffer', hours: 0.5, category: 'rest', icon: '🛋️' }
        ],
        weekend: [
            { time: '06:00-08:00', activity: 'EMS (Walk, Exercise, Breakfast)', hours: 2, category: 'health', icon: '💪' },
            { time: '08:00-12:30', activity: 'Learning (Deep Focus)', hours: 4.5, category: 'learning', icon: '📚' },
            { time: '12:30-14:00', activity: 'Lunch, Rest, Buffer', hours: 1.5, category: 'rest', icon: '🛋️' },
            { time: '14:00-18:30', activity: 'Own Work (Freelance/Dev/Practice)', hours: 4.5, category: 'own', icon: '🚀' },
            { time: '18:30-21:00', activity: 'Family, Dinner, Recreation', hours: 2.5, category: 'family', icon: '👨‍👩‍👧' },
            { time: '21:00-23:00', activity: 'Own Work or Free Time', hours: 2, category: 'own', icon: '🚀' },
            { time: '23:00-00:00', activity: 'Wind Down', hours: 1, category: 'rest', icon: '🛋️' }
        ]
    }
};
