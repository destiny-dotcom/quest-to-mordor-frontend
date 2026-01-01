# Apple Health Sync - Shortcut Setup Guide

This guide explains how to create the Apple Shortcut that syncs your step data from Apple Health to Quest to Mordor.

## Prerequisites

- iPhone with iOS 15 or later
- Apple Watch (optional, but recommended for step tracking)
- Health app with step data
- Your Quest to Mordor API key (generated in the app)

## Backend Webhook URL

```
https://quest-to-mordor-backend-production.up.railway.app/api/webhooks/apple-health
```

## Creating the Shortcut

### Step 1: Open Shortcuts App

Open the Shortcuts app on your iPhone. If you don't have it, download it from the App Store.

### Step 2: Create New Shortcut

1. Tap the **+** button in the top right to create a new shortcut
2. Tap **Add Action**

### Step 3: Add "Find Health Samples" Action

1. Search for **"Find Health Samples"**
2. Tap to add it
3. Configure it:
   - **Type**: Steps
   - **Start Date**: Tap and select **"Adjust Date"** → Set to **"Start of Yesterday"**
   - **End Date**: Tap and select **"Adjust Date"** → Set to **"End of Yesterday"**

### Step 4: Add "Calculate Statistics" Action

1. Tap **+** to add another action
2. Search for **"Calculate Statistics"**
3. Configure it:
   - **Operation**: Sum
   - **Input**: Health Samples (from previous step)

### Step 5: Add "Format Date" Action

1. Tap **+** to add another action
2. Search for **"Date"** and add **"Date"** action
3. Set it to **"1 day ago"** (this gets yesterday's date)
4. Add another action: **"Format Date"**
5. Configure it:
   - **Format**: Custom
   - **Custom Format**: `yyyy-MM-dd`

### Step 6: Add "Get Contents of URL" Action (POST Request)

1. Tap **+** to add another action
2. Search for **"Get Contents of URL"**
3. Configure it:
   - **URL**: `https://quest-to-mordor-backend-production.up.railway.app/api/webhooks/apple-health`
   - **Method**: POST
   - **Headers**: Add header
     - **Key**: `X-Apple-Health-API-Key`
     - **Value**: (You'll add this as an input - see Step 7)
     - **Key**: `Content-Type`
     - **Value**: `application/json`
   - **Request Body**: JSON
     - Add a key called `step` with a dictionary value containing:
       - `step_count`: (Statistics Result - the sum from step 4)
       - `recorded_date`: (Formatted Date from step 5)

### Step 7: Add API Key as Import Question

1. Tap the **shortcut name** at the top
2. Tap **"Import Questions"**
3. Add a question:
   - **Text**: "Enter your Quest to Mordor API Key"
   - **Type**: Text
   - **Variable Name**: API Key
4. Use this variable in the X-Apple-Health-API-Key header

### Step 8: Add Notification for Result

1. Tap **+** to add another action
2. Search for **"Show Notification"**
3. Configure it:
   - **Title**: "Steps Synced!"
   - **Body**: Combine the step count with text like "Synced X steps to Quest to Mordor"

### Step 9: Name and Save

1. Tap the shortcut name at the top
2. Rename it to **"Sync Steps to Mordor"**
3. Tap **Done**

## Setting Up Daily Automation

### Step 1: Create Automation

1. In Shortcuts app, tap **Automation** tab at the bottom
2. Tap **+** to create new automation
3. Select **"Time of Day"**

### Step 2: Configure Time

1. Set the time (recommended: 7:00 AM or whenever you wake up)
2. Select **"Daily"**
3. Tap **Next**

### Step 3: Select Shortcut

1. Tap **"Run Shortcut"**
2. Select **"Sync Steps to Mordor"**
3. Tap **Next**

### Step 4: Disable Confirmation

1. **Important**: Turn OFF "Ask Before Running"
2. This allows it to run automatically in the background
3. Tap **Done**

## Testing the Shortcut

1. Open the shortcut manually
2. Enter your API key when prompted (first run only)
3. The shortcut will:
   - Read yesterday's steps from Health app
   - Send them to your Quest to Mordor account
   - Show a notification with the result

## Troubleshooting

### "No Health Samples Found"
- Make sure you have step data for yesterday in the Health app
- Check that the shortcut has permission to access Health data

### "Request Failed"
- Verify your API key is correct
- Check that your API key hasn't been revoked
- Ensure you have an internet connection

### Automation Not Running
- Go to Settings → Shortcuts → Advanced
- Enable "Allow Running Scripts"
- Make sure "Ask Before Running" is OFF for the automation

## JSON Request Format

The shortcut sends this JSON to the webhook:

```json
{
  "step": {
    "step_count": 8500,
    "recorded_date": "2025-01-01"
  }
}
```

## Security Notes

- Your API key is stored locally on your device
- The key is sent only to the Quest to Mordor backend
- You can revoke and regenerate your key anytime in the app
- Rate limit: 10 requests per hour (daily sync uses 1)
