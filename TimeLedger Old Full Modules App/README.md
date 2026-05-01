# Time Block Tracker

Plan your day. Own your time. A comprehensive time management and tracking system for your daily schedule.

## Features

- **Two Schedule Views**: Compare your current schedule with an optimized version
- **Daily Tracking**: Log your adherence to time blocks each day
- **Analytics Dashboard**: View completion rates, streaks, and personalized insights
- **Data Export**: Export your tracking data as JSON
- **Local Storage**: All data saved in your browser (no server needed)

## Setup Instructions

### Option 1: Local Setup (Recommended)

1. Download all files and maintain the directory structure
2. Open `index.html` in a modern web browser
3. Start tracking your daily schedule

### Option 2: Google Drive Setup

1. Upload all files to a Google Drive folder
2. Right-click `index.html` → Open with → Google Docs (will convert to viewer)
3. Alternative: Use Google Sites to host the HTML file

### Option 3: Dropbox/OneDrive

1. Upload files maintaining the structure
2. Share the folder and access via direct link
3. Open `index.html` from the shared link

## Usage Guide

### Adding Daily Entries

1. Click "Add Today's Entry" button
2. Select date and completion percentage
3. Check off completed time blocks
4. Add notes about challenges or successes
5. Click "Save Entry"

### Viewing Analytics

- Navigate to the Analytics tab to see:
  - Total days tracked
  - Overall completion rate
  - Current and best streaks
  - Personalized insights

### Exporting Data

- Click "Export Data" to download a JSON backup
- Keep regular backups to prevent data loss
- Import data by editing the `tracking-data.json` file

## Data Storage

All data is stored in your browser's localStorage. Important notes:

- Data persists as long as you don't clear browser cache
- Use the same browser/device for consistency
- Export data regularly for backups
- Clearing browser data will erase all entries

## Customization

### Modifying Schedules

Edit the `scheduleData` object in `script.js`:
```javascript
const scheduleData = {
    current: {
        weekday: [ /* your blocks */ ],
        weekend: [ /* your blocks */ ]
    }
}
```

### Changing Categories

Modify the category colors in `styles.css`:
```css
.time-block.health { border-color: #10b981; }
/* Add your custom categories */
```

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Responsive design

## Troubleshooting

### Data Not Saving

- Check if browser allows localStorage
- Disable private/incognito mode
- Check browser storage settings

### Analytics Not Updating

- Refresh the page
- Check console for errors (F12)
- Verify data format in localStorage

## Tips for Success

1. **Track Daily**: Set a reminder to log entries each evening
2. **Be Honest**: Accurate tracking leads to better insights
3. **Review Weekly**: Check analytics every Sunday to plan improvements
4. **Adjust Schedule**: Use data to refine your time blocks
5. **Set Realistic Goals**: Aim for 80% adherence, not perfection

## Data Privacy

- All data stored locally on your device
- No external servers or tracking
- You have complete control over your data
- Export and delete data anytime

## Support

For issues or questions:
1. Check browser console for errors
2. Verify file structure is correct
3. Ensure all files are present
4. Try a different browser

## Version History

- **v1.0** (2025-01-01): Initial release
  - Schedule comparison view
  - Daily tracking system
  - Analytics dashboard
  - Data export functionality

## License

Free to use and modify for personal use.

---


**Happy Tracking! 📊**
