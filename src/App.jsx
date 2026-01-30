import { AppProvider, useApp } from './utils/AppContext';
import Header from './components/Layout/Header';
import SideBar from './components/Layout/Sidebar';
import TodoView from './components/Todo/TodoView';

function MainLayout() {
    const {
        appTheme,
        boardBackgroundType,
        boardBackgroundValue,
    } = useApp();

    const getBackgroundStyle = () => {
        if (!boardBackgroundValue && boardBackgroundType !== 'none') return 'var(--app-bg)';
        if (boardBackgroundType === 'none') return 'var(--app-bg)';
        if (boardBackgroundType === 'color') return boardBackgroundValue;
        if (boardBackgroundType === 'gradient') return boardBackgroundValue;
        if (boardBackgroundType === 'image') return `url(${boardBackgroundValue}) center/cover no-repeat fixed`;
        return 'var(--app-bg)';
    };

    return (
        <div className="dashboard-layout" style={{ background: getBackgroundStyle() }} data-theme={appTheme}>
            <Header />
            <main className="main-content">
                <div className="content-area">
                    <TodoView />
                </div>
                <SideBar />
            </main>
        </div>
    );
}

function App() {
    return (
        <AppProvider>
            <MainLayout />
        </AppProvider>
    );
}

export default App;
