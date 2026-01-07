import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.left}>
                    <span className={styles.brand}>TimeLedger</span>
                    <span className={styles.version}>v2.4.0 High-Performance ERP</span>
                </div>

                {/* <div className={styles.center}>
                    <nav className={styles.nav}>
                        <a href="#about"></a>
                        <a href="#security"></a>
                        <a href="#api"></a>
                    </nav>
                </div> */}

                <div className={styles.right}>
                    <p className={styles.copyright}>&copy; {year} Antigravity Dynamics. System Operational.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
