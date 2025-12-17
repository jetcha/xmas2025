# Walkthrough - Display Bidding Results

I have implemented a new feature to display the full bidding history after a winner is determined for a gift.

## Changes
### Frontend
- **Modified `Bidding.js`**:
    - Added a table to display all bids for the current gift.
    - The table appears only after the winner is announced.
    - Bids are sorted by amount (highest first).
    - The winner is highlighted with a gold background and a 👑 icon.
    - **Tie Breaker**: Added a notification if the winner was chosen randomly due to a tie.
    - **Skip Rule**: If multiple players tie with 0 tokens, the gift is marked as "Skipped" (流標) and moved to the end of the queue.
- **Modified `Results.js`**:
    - **[NEW] Restart Confirmation**: Clicking "Restart Game" now triggers a pop-up confirmation dialog ("Are you sure?") to prevent accidental resets.
- **[NEW] Global Features**:
    - Added a Floating Action Button (FAB) with a ❓ icon in the bottom-right corner.
    - Clicking it opens a "Game Rules" modal.
    - **Updated Rules Content**:
        - **Objective**: "Use bidding to get the gift you want."
        - **Hints**: "Be tempting but don't lie."
        - **Rating**: Defined Story (Theme fit), Utility (1-10 scale), and Attraction (Visuals/Smell).
    - **Session Persistence**:
        - Refreshing the browser no longer logs you out immediately if the server session is valid.
        - The app automatically restores your session from local storage.
    - **Join Protection**:
        - Joining the game is only allowed during the "Submission" phase.
        - Once "Start Bidding" is clicked, new users cannot join.

## Verification Results
### Automated Simulation
- Ran `node simulation_test.js` successfully.
- Confirmed that the game flow proceeds correctly.

### Manual Verification Steps
1. Open the app (`http://localhost:3000`).
2. Complete a game until the Results screen.
3. **Verify Restart**:
    - Click "Restart Game".
    - A dialog should appear asking for confirmation.
    - Click "Cancel" -> Dialog closes, game stays.
    - Click "Yes" -> Game resets to Login screen.

## How to Play via Home Wi-Fi
1. Ensure your PC and Phone are connected to the **same Wi-Fi network**.
2. On your PC, double-click `share_lan.bat` in the project folder.
3. Look for the **IPv4 Address** (e.g., `192.168.1.105`).
4. On your Phone, open a browser (Chrome/Safari).
5. Enter the address: `http://<YOUR_IP>:3000` (e.g., `http://192.168.1.105:3000`).
6. You should see the login screen!

<div align="center">
  <p><em>(Screenshots would go here in a real scenario)</em></p>
</div>
