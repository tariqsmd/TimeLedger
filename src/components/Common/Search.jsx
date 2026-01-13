/**
 * Search.jsx
 * Reusable search input component
 */
import React from 'react';
import { IconSearch } from '../../assets/Icons';

export default function Search({ value = '', onChange = () => { }, placeholder = 'Search...', className = '' }) {
    return (
        <div className={`search-bar ${className}`}>
            <span className="search-icon"><IconSearch size={18} /></span>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}