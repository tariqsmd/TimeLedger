const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

// Server configuration
const VITE_PORT = 5173;
const EXPRESS_PORT = 5175;

let mainWindow = null;
let serverProcess = null;
let isQuitting = false;
let serversStartedByUs = false; // Track if we started the servers

// Function to check if a server is ready
function checkServerRunning(port) {
    return new Promise((resolve) => {
        const req = http.request({
            hostname: 'localhost',
            port,
            path: '/',
            method: 'GET',
            timeout: 1000
        }, (res) => {
            resolve(true);
        });

        req.on('error', () => {
            resolve(false);
        });

        req.end();
    });
}

// Function to wait for a server to be ready
function waitForServer(port, maxRetries = 30, interval = 500) {
    return new Promise((resolve, reject) => {
        let retries = 0;

        const check = () => {
            const req = http.request({
                hostname: 'localhost',
                port,
                path: '/',
                method: 'GET',
                timeout: 1000
            }, (res) => {
                resolve(true);
            });

            req.on('error', () => {
                retries++;
                if (retries >= maxRetries) {
                    reject(new Error(`Server on port ${port} did not start in time`));
                } else {
                    setTimeout(check, interval);
                }
            });

            req.end();
        };

        check();
    });
}

// Start both Vite and Express servers
function startServers() {
    return new Promise((resolve, reject) => {
        const isPackaged = app.isPackaged;
        const appPath = isPackaged ? process.resourcesPath : path.join(__dirname, '..');

        console.log('Starting servers...');
        console.log('App path:', appPath);

        // Use npx to run concurrently
        const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

        serverProcess = spawn(npmCmd, ['run', 'start'], {
            cwd: appPath,
            shell: true,
            stdio: 'pipe',
            env: { ...process.env, ELECTRON_RUN_AS_NODE: '1' }
        });

        serversStartedByUs = true;

        serverProcess.stdout.on('data', (data) => {
            console.log(`Server: ${data}`);
        });

        serverProcess.stderr.on('data', (data) => {
            console.error(`Server Error: ${data}`);
        });

        serverProcess.on('error', (err) => {
            console.error('Failed to start server:', err);
            reject(err);
        });

        serverProcess.on('exit', (code) => {
            console.log(`Server process exited with code ${code}`);
            if (!isQuitting) {
                console.log('Server crashed unexpectedly');
            }
        });

        // Wait for both servers to be ready
        Promise.all([
            waitForServer(VITE_PORT),
            waitForServer(EXPRESS_PORT)
        ])
            .then(() => {
                console.log('Both servers are ready!');
                resolve();
            })
            .catch(reject);
    });
}

// Check if servers are already running, or start them
async function ensureServersRunning() {
    const [viteRunning, expressRunning] = await Promise.all([
        checkServerRunning(VITE_PORT),
        checkServerRunning(EXPRESS_PORT)
    ]);

    if (viteRunning && expressRunning) {
        console.log('Servers are already running - connecting to existing instances');
        serversStartedByUs = false;
        return;
    }

    if (viteRunning || expressRunning) {
        console.log('Partial servers running - waiting for all to be ready');
        await Promise.all([
            waitForServer(VITE_PORT),
            waitForServer(EXPRESS_PORT)
        ]);
        serversStartedByUs = false;
        return;
    }

    // Neither server is running, start them
    console.log('No servers running - starting new instances');
    await startServers();
}

// Save data before quitting
async function saveDataBeforeQuit() {
    return new Promise((resolve) => {
        console.log('Attempting to save data before quit...');

        // Send a signal to the renderer to save data
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('app-closing');

            // Give some time for save operation
            setTimeout(() => {
                resolve();
            }, 1000);
        } else {
            resolve();
        }
    });
}

// Gracefully shutdown servers (only if we started them)
function shutdownServers() {
    return new Promise((resolve) => {
        if (!serversStartedByUs) {
            console.log('Servers were not started by us - leaving them running');
            resolve();
            return;
        }

        if (serverProcess) {
            console.log('Shutting down servers...');

            if (process.platform === 'win32') {
                // On Windows, we need to kill the process tree
                spawn('taskkill', ['/pid', serverProcess.pid, '/f', '/t']);
            } else {
                serverProcess.kill('SIGTERM');
            }

            serverProcess = null;
        }

        // Also kill any lingering processes on our ports (only if we started them)
        if (process.platform === 'win32') {
            spawn('cmd', ['/c', `for /f "tokens=5" %a in ('netstat -ano ^| findstr :${VITE_PORT}') do taskkill /F /PID %a`], { shell: true });
            spawn('cmd', ['/c', `for /f "tokens=5" %a in ('netstat -ano ^| findstr :${EXPRESS_PORT}') do taskkill /F /PID %a`], { shell: true });
        }

        setTimeout(resolve, 500);
    });
}

// Create main application window
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        title: 'TimeLedger',
        icon: path.join(__dirname, 'icon.ico'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.cjs')
        },
        show: false, // Don't show until ready
        backgroundColor: '#1a1a2e'
    });

    // Show window when ready
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // Load the Vite dev server
    mainWindow.loadURL(`http://localhost:${VITE_PORT}`);

    // Handle window close
    mainWindow.on('close', async (event) => {
        if (!isQuitting) {
            event.preventDefault();
            isQuitting = true;

            await saveDataBeforeQuit();
            await shutdownServers();

            mainWindow.destroy();
            app.quit();
        }
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// IPC handlers
ipcMain.handle('get-app-path', () => {
    return app.isPackaged ? process.resourcesPath : path.join(__dirname, '..');
});

ipcMain.handle('save-complete', () => {
    console.log('Save completed successfully');
    return true;
});

// App lifecycle
app.whenReady().then(async () => {
    try {
        console.log('TimeLedger is starting...');

        await ensureServersRunning();
        createWindow();

    } catch (error) {
        console.error('Failed to start application:', error);
        app.quit();
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.on('before-quit', async (event) => {
    if (!isQuitting) {
        event.preventDefault();
        isQuitting = true;

        await saveDataBeforeQuit();
        await shutdownServers();

        app.quit();
    }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled rejection at:', promise, 'reason:', reason);
});
