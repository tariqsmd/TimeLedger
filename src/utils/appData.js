export const sampleCategories = [
    { name: 'Work' },
    { name: 'Personal' },
    { name: 'Side Project' },
    { name: 'Learning' },
    { name: 'Health' },
    { name: 'Finance' }
];

export const sampleTasks = [
    {
        id: 't1',
        text: 'Design System Documentation',
        description: 'Update the component library documentation with new tokens and guidelines for dark mode.',
        categories: ['Work'],
        priority: 'high',
        dueAt: new Date(Date.now() + 86400000).toISOString(),
        completed: false,
        status: 'idle',
        checklists: [
            {
                id: 'cl1', title: 'Preparation', items: [
                    { text: 'Audit existing color tokens', done: true },
                    { text: 'Draft new spacing guidelines', done: false }
                ]
            },
            {
                id: 'cl2', title: 'Implementation', items: [
                    { text: 'Update button component examples', done: false }
                ]
            }
        ],
        createdAt: new Date(Date.now() - 172800000).toISOString()
    },
    {
        id: 't2',
        text: 'Review Q1 Analytics',
        description: 'Analyze user growth trends and prepare slides for the quarterly meeting.',
        listTitle: 'Work',
        priority: 'high',
        dueAt: new Date(Date.now() + 172800000).toISOString(),
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
        dueAt: new Date(Date.now() + 43200000).toISOString(),
        completed: false,
        status: 'idle',
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
        createdAt: new Date(Date.now() - 345600000).toISOString()
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
        description: 'Mobile menu does not close when clicking outside on iOS devices.',
        listTitle: 'Work',
        priority: 'high',
        dueAt: new Date(Date.now() - 3600000).toISOString(),
        completed: false,
        status: 'idle',
        createdAt: new Date(Date.now() - 259200000).toISOString()
    }
];