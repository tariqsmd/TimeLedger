/**
 * Electron Integration Hook
 * Handles communication between React app and Electron main process
 */
import { useEffect, useCallback } from 'react';

/**
 * Check if running in Electron
 */
export const isElectron = () => {
    return window.electronAPI?.isElectron === true;
};

/**
 * Hook to handle Electron app lifecycle events
 * @param {Function} onSave - Async function to save data before app closes
 */
export const useElectronLifecycle = (onSave) => {
    const handleAppClosing = useCallback(async () => {
        if (onSave && typeof onSave === 'function') {
            console.log('App closing - saving data...');
            try {
                await onSave();
                console.log('Data saved successfully');

                // Notify Electron that save is complete
                if (window.electronAPI?.saveComplete) {
                    await window.electronAPI.saveComplete();
                }
            } catch (error) {
                console.error('Failed to save data on close:', error);
            }
        }
    }, [onSave]);

    useEffect(() => {
        if (isElectron() && window.electronAPI?.onAppClosing) {
            window.electronAPI.onAppClosing(handleAppClosing);
            console.log('Registered app closing handler');
        }

        // Also handle browser beforeunload for non-Electron environment
        const handleBeforeUnload = (event) => {
            if (!isElectron()) {
                // For browser, we can't do async save, just warn
                // Data is auto-saved on changes anyway
                event.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [handleAppClosing]);
};

/**
 * Get the application path (useful for accessing resources)
 */
export const getAppPath = async () => {
    if (isElectron() && window.electronAPI?.getAppPath) {
        return await window.electronAPI.getAppPath();
    }
    return null;
};

export default {
    isElectron,
    useElectronLifecycle,
    getAppPath
};
