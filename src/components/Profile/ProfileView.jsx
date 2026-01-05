import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './ProfileView.module.css';

export default function ProfileView() {
    const { userProfile, updateProfile } = useApp();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...userProfile });

    const handleSave = (e) => {
        e.preventDefault();
        updateProfile(formData);
        setIsEditing(false);
    };

    return (
        <div className={styles.profileView}>
            <div className="view-header">
                <h2 className="view-title">User Profile</h2>
                <p className="view-subtitle">Manage your personal information and productivity goals</p>
            </div>

            <div className={styles.profileCard}>
                <div className={styles.header}>
                    <div className={styles.avatarLarge}>
                        {userProfile.avatar || userProfile.name[0]}
                    </div>
                    <div className={styles.headerInfo}>
                        <h3 className={styles.userName}>{userProfile.name}</h3>
                        <p className={styles.userRole}>{userProfile.role}</p>
                    </div>
                    <button
                        className={styles.btnEdit}
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                    </button>
                </div>

                {isEditing ? (
                    <form className={styles.editForm} onSubmit={handleSave}>
                        <div className={styles.formGrid}>
                            <div className={styles.inputGroup}>
                                <label>Full Name</label>
                                <input
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Professional Role</label>
                                <input
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Weekly Goal (Hours)</label>
                                <input
                                    type="number"
                                    value={formData.goal}
                                    onChange={e => setFormData({ ...formData, goal: parseInt(e.target.value) })}
                                    required
                                />
                            </div>
                            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                <label>Specialization</label>
                                <input
                                    value={formData.specialization}
                                    onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                                />
                            </div>
                            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                <label>Bio</label>
                                <textarea
                                    value={formData.bio}
                                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                    rows="4"
                                />
                            </div>
                        </div>
                        <button type="submit" className={styles.btnSave}>Save Changes</button>
                    </form>
                ) : (
                    <div className={styles.profileDetails}>
                        <div className={styles.detailSection}>
                            <h4>About Me</h4>
                            <p className={styles.bioText}>{userProfile.bio}</p>
                        </div>

                        <div className={styles.infoGrid}>
                            <div className={styles.infoBox}>
                                <span className={styles.infoLabel}>Email</span>
                                <span className={styles.infoValue}>{userProfile.email}</span>
                            </div>
                            <div className={styles.infoBox}>
                                <span className={styles.infoLabel}>Specialization</span>
                                <span className={styles.infoValue}>{userProfile.specialization}</span>
                            </div>
                            <div className={styles.infoBox}>
                                <span className={styles.infoLabel}>Weekly Target</span>
                                <span className={styles.infoValue}>{userProfile.goal} Hours</span>
                            </div>
                            <div className={styles.infoBox}>
                                <span className={styles.infoLabel}>Account Status</span>
                                <span className={styles.infoValue}>Premium Professional</span>
                            </div>
                        </div>

                        <div className={styles.achievements}>
                            <h4>Productivity Highlights</h4>
                            <div className={styles.badgeGrid}>
                                <div className={styles.badge}>
                                    <span className={styles.badgeIcon}>🔥</span>
                                    <span className={styles.badgeName}>7 Day Streak</span>
                                </div>
                                <div className={styles.badge}>
                                    <span className={styles.badgeIcon}>⚡</span>
                                    <span className={styles.badgeName}>Deep Focus Master</span>
                                </div>
                                <div className={styles.badge}>
                                    <span className={styles.badgeIcon}>🏆</span>
                                    <span className={styles.badgeName}>Goal Crusher</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
