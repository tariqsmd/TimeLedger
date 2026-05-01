export const sampleTodos = [
    {
        id: 't1',
        text: 'Design System Documentation',
        description: 'Update the component library documentation with new tokens and guidelines for dark mode.',
        listTitle: 'Work',
        priority: 'high',
        dueAt: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        completed: false,
        status: 'idle',
        subtasks: [
            { text: 'Audit existing color tokens', done: true },
            { text: 'Draft new spacing guidelines', done: false },
            { text: 'Update button component examples', done: false }
        ],
        createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
    },
    {
        id: 't2',
        text: 'Review Q1 Analytics',
        description: 'Analyze user growth trends and prepare slides for the quarterly meeting.',
        listTitle: 'Work',
        priority: 'high',
        dueAt: new Date(Date.now() + 172800000).toISOString(), // 2 days
        completed: false,
        status: 'running',
        accumulatedTime: 3600000,
        lastStartedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
    },
    {
        id: 't3',
        text: 'Grocery Shopping',
        description: 'Buy essentials for the week: Fruits, Vegetables, Milk, Eggs.',
        listTitle: 'Personal',
        priority: 'medium',
        dueAt: new Date(Date.now() + 43200000).toISOString(), // 12 hours
        completed: false,
        status: 'idle',
        subtasks: [
            { text: 'Check pantry stocks', done: true },
            { text: 'Make a list', done: true }
        ],
        createdAt: new Date().toISOString()
    },
    {
        id: 't4',
        text: 'React Query Integration',
        description: 'Refactor data fetching layer to use React Query for better caching and background updates.',
        listTitle: 'Side Project',
        priority: 'high',
        dueAt: null,
        completed: false,
        status: 'paused',
        accumulatedTime: 7200000,
        createdAt: new Date(Date.now() - 345600000).toISOString() // 4 days ago
    },
    {
        id: 't5',
        text: 'Read "Atomic Habits"',
        description: 'Finish chapter 4 and take notes on habit stacking.',
        listTitle: 'Learning',
        priority: 'low',
        dueAt: null,
        completed: false,
        status: 'idle',
        createdAt: new Date().toISOString()
    },
    {
        id: 't6',
        text: 'Morning Jog',
        description: 'Run 5km at the park.',
        listTitle: 'Health',
        priority: 'medium',
        dueAt: new Date().toISOString(),
        completed: true,
        status: 'completed',
        accumulatedTime: 1800000,
        createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
        id: 't7',
        text: 'Fix Navbar Bug',
        description: 'Mobile menu doesn’t close when clicking outside on iOS devices.',
        listTitle: 'Work',
        priority: 'high',
        dueAt: new Date(Date.now() - 3600000).toISOString(), // Overdue
        completed: false,
        status: 'idle',
        createdAt: new Date(Date.now() - 259200000).toISOString()
    },
    {
        id: 't8',
        text: 'Plan Weekend Trip',
        description: 'Look for Airbnb options in the mountains.',
        listTitle: 'Personal',
        priority: 'low',
        dueAt: new Date(Date.now() + 432000000).toISOString(), // 5 days
        completed: false,
        status: 'idle',
        createdAt: new Date().toISOString()
    },
    {
        id: 't9',
        text: 'Update Portfolio',
        description: 'Add recent projects and update resume PDF.',
        listTitle: 'Work',
        priority: 'medium',
        dueAt: null,
        completed: false,
        status: 'idle',
        createdAt: new Date(Date.now() - 604800000).toISOString()
    },
    {
        id: 't10',
        text: 'Car Service',
        description: 'Book appointment for annual maintenance.',
        listTitle: 'Personal',
        priority: 'medium',
        dueAt: new Date(Date.now() + 604800000).toISOString(),
        completed: false,
        status: 'idle',
        createdAt: new Date().toISOString()
    }
];

export const sampleTrackerEntries = [
    {
        id: 'e1',
        description: 'Email & Communications',
        duration: 1800, // 30 mins
        startTime: new Date(Date.now() - 3600000 * 4).toISOString(),
        endTime: new Date(Date.now() - 3600000 * 3.5).toISOString(),
        tags: ['Admin', 'Comms']
    },
    {
        id: 'e2',
        description: 'Daily Standup',
        duration: 900,
        startTime: new Date(Date.now() - 3600000 * 3.5).toISOString(),
        endTime: new Date(Date.now() - 3600000 * 3.25).toISOString(),
        tags: ['Meeting']
    },
    {
        id: 'e3',
        description: 'Project Architecture',
        duration: 5400, // 1.5 hrs
        startTime: new Date(Date.now() - 3600000 * 3).toISOString(),
        endTime: new Date(Date.now() - 3600000 * 1.5).toISOString(),
        tags: ['Deep Work', 'Dev']
    },
    {
        id: 'e4',
        description: 'Lunch Break',
        duration: 3600,
        startTime: new Date(Date.now() - 3600000 * 1.5).toISOString(),
        endTime: new Date(Date.now() - 3600000 * 0.5).toISOString(),
        tags: ['Break']
    },
    {
        id: 'e5',
        description: 'Code Review',
        duration: 2700,
        startTime: new Date(Date.now() - 86400000).toISOString(),
        endTime: new Date(Date.now() - 86400000 + 2700000).toISOString(), // Yesterday
        tags: ['Dev']
    },
    {
        id: 'e6',
        description: 'Client Meeting',
        duration: 3600,
        startTime: new Date(Date.now() - 86400000 * 2).toISOString(),
        endTime: new Date(Date.now() - 86400000 * 2 + 3600000).toISOString(),
        tags: ['Meeting', 'Client']
    },
    {
        id: 'e7',
        description: 'Bug Fixes',
        duration: 4500,
        startTime: new Date(Date.now() - 86400000 * 2.5).toISOString(),
        endTime: new Date(Date.now() - 86400000 * 2.5 + 4500000).toISOString(),
        tags: ['Dev']
    },
    {
        id: 'e8',
        description: 'Learning Rust',
        duration: 3600,
        startTime: new Date(Date.now() - 86400000 * 3).toISOString(),
        endTime: new Date(Date.now() - 86400000 * 3 + 3600000).toISOString(),
        tags: ['Learning']
    },
    {
        id: 'e9',
        description: 'Gym Workout',
        duration: 4800,
        startTime: new Date(Date.now() - 86400000 * 4).toISOString(),
        endTime: new Date(Date.now() - 86400000 * 4 + 4800000).toISOString(),
        tags: ['Health']
    },
    {
        id: 'e10',
        description: 'Weekly Planning',
        duration: 1800,
        startTime: new Date(Date.now() - 86400000 * 7).toISOString(),
        endTime: new Date(Date.now() - 86400000 * 7 + 1800000).toISOString(),
        tags: ['Admin']
    }
];

export const sampleMonthlyGoals = [
    { id: 'g1', text: 'Complete React Certification', target: 20, progress: 12, unit: 'hours', completed: false },
    { id: 'g2', text: 'Read 2 Books', target: 2, progress: 1, unit: 'books', completed: false },
    { id: 'g3', text: 'Gym Attendance', target: 15, progress: 8, unit: 'days', completed: false },
    { id: 'g4', text: 'Save $500', target: 500, progress: 350, unit: 'dollars', completed: false },
    { id: 'g5', text: 'Write 4 Blog Posts', target: 4, progress: 1, unit: 'posts', completed: false },
    { id: 'g6', text: 'Network with 5 people', target: 5, progress: 2, unit: 'people', completed: false },
    { id: 'g7', text: 'Meditate Daily', target: 30, progress: 20, unit: 'days', completed: false },
    { id: 'g8', text: 'Launch Side Project', target: 100, progress: 80, unit: '%', completed: false },
    { id: 'g9', text: 'Clean Digital Workspace', target: 1, progress: 0, unit: 'task', completed: false },
    { id: 'g10', text: 'Try 3 New Recipes', target: 3, progress: 3, unit: 'recipes', completed: true }
];

export const sampleProjects = ['Work', 'Personal', 'Side Project', 'Learning', 'Health', 'Finance', 'Travel', 'Household', 'Volunteer', 'Fitness'];
