import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { formatDate, isWeekend } from '../../utils/dateUtils';
import styles from './EntryModal.module.css';

export default function EntryModal() {
    const { isModalOpen, editingEntry, closeModal, saveEntry, customSchedules } = useApp();

    const [date, setDate] = useState('');
    const [completion, setCompletion] = useState(100);
    const [completedBlocks, setCompletedBlocks] = useState([]);
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (isModalOpen) {
            if (editingEntry) {
                // Check if it's a full entry or just a quick-track hint
                if (editingEntry.id) {
                    setDate(editingEntry.date);
                    setCompletion(editingEntry.completion);
                    setCompletedBlocks(editingEntry.completedBlocks || []);
                    setNotes(editingEntry.notes || '');
                } else {
                    // Quick-track hint from Schedule
                    setDate(formatDate(new Date()));
                    setCompletion(100);
                    setCompletedBlocks([]);
                    setNotes(editingEntry.activity ? `Focus on: ${editingEntry.activity}` : '');
                }
            } else {
                setDate(formatDate(new Date()));
                setCompletion(100);
                setCompletedBlocks([]);
                setNotes('');
            }
        }
    }, [isModalOpen, editingEntry]);

    if (!customSchedules) return null;

    const availableBlocks = isWeekend(date)
        ? customSchedules.current.weekend
        : customSchedules.current.weekday;

    const handleToggleBlock = (index) => {
        setCompletedBlocks(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    const handleSubmit = () => {
        const entry = {
            id: (editingEntry && editingEntry.id) ? editingEntry.id : Date.now().toString(),
            date,
            completion,
            completedBlocks,
            notes,
            timestamp: new Date().toISOString()
        };
        saveEntry(entry);
        closeModal();
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    if (!isModalOpen) return null;

    return (
        <div className={styles.modal} onClick={handleOverlayClick}>
            <div className={styles.modalContent}>
                <span className={styles.close} onClick={closeModal}>&times;</span>
                <h2>{editingEntry?.id ? 'Edit Daily Log' : 'Log Daily Adherence'}</h2>

                <div className={styles.formGroup}>
                    <label>Date:</label>
                    <input
                        type="date"
                        value={date}
                        max={formatDate(new Date())}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Success Level:</label>
                    <div className={styles.ratingGrid}>
                        {[100, 75, 50, 25, 0].map(val => (
                            <button
                                key={val}
                                className={`${styles.ratingBtn} ${completion === val ? styles.activeRating : ''}`}
                                onClick={() => setCompletion(val)}
                            >
                                {val}%
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label>Blocks Completed ({completedBlocks.length}/{availableBlocks.length}):</label>
                    <div className={styles.blocksChecklist}>
                        {availableBlocks.map((block, idx) => (
                            <div key={idx} className={`${styles.checkboxItem} ${completedBlocks.includes(idx) ? styles.itemDone : ''}`}>
                                <input
                                    type="checkbox"
                                    id={`block-${idx}`}
                                    checked={completedBlocks.includes(idx)}
                                    onChange={() => handleToggleBlock(idx)}
                                />
                                <label htmlFor={`block-${idx}`}>
                                    <span className={styles.blockIcon}>{block.icon}</span>
                                    <span className={styles.blockTime}>{block.time}</span>
                                    <span className={styles.blockName}>{block.activity}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label>Reflections & Notes:</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows="3"
                        placeholder="What did you learn today? What held you back?"
                    />
                </div>

                <div className={styles.modalActions}>
                    <button className={styles.btnPrimary} onClick={handleSubmit}>
                        Verify & Save
                    </button>
                    <button className={styles.btnSecondary} onClick={closeModal}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
