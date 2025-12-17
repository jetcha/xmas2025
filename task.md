# Task: UI/UX Overhaul & Language Support

- [x] **Infrastructure Setup**
    - [x] Create `LanguageContext` to manage English/Chinese state.
    - [x] Create `translations.js` dictionary.
    - [x] Update `layout.js` to wrap app in `LanguageProvider`.
- [x] **UI Revamp (Google Play Store Style)**
    - [x] Update `globals.css` with new color palette (Material You inspired) and utility classes.
    - [x] **Login Page**
        - [x] Add Language Switcher (Dropdown/Toggle).
        - [x] Redesign Login Card (Rounded corners, elevation, clean typography).
    - [x] **Main Game Page**
        - [x] Update `page.js` to use `LanguageContext` for text.
        - [x] Redesign Layout (Header, Navigation, Content Area).
    - [x] **Components**
        - [x] `GiftSubmission.js`: Card-based form.
        - [x] `WaitingRoom.js`: List view with avatars/icons.
        - [x] `Bidding.js`: Card-based gift display, clean action buttons.
        - [x] `Reveal.js`: Immersive reveal experience.
        - [x] `Results.js`: Ranked list with clear visual hierarchy.
        - [x] **[NEW] `RulesModal.js`**: Global floating button to view game rules.
- [x] **Verification**
    - [x] Verify Language Switcher persists and updates text.
    - [x] Verify UI responsiveness and aesthetics.
- [x] **Bug Fixes**
    - [x] Fix PWA startup issue (Tailwind v4 compatibility).
    - [x] Improve `clean_restart.bat` to ensure all processes are killed.
    - [x] Fix Game Reset synchronization (force logout all users).
    - [x] Add password protection to Force Reset button (Password: 1123).
- [x] **Hosting Improvements**
    - [x] Create `share_lan.bat` for local Wi-Fi sharing.
    - [x] Create `share_ngrok.bat` for reliable internet sharing.

# Task: Display Bidding Results

- [x] **Data Verification**
    - [x] Check `GameContext.js` to ensure `bids` array contains `{bidder, amount}`.
- [x] **UI Implementation**
    - [x] Update `Bidding.js` to show a list of bidders and their amounts after the winner is determined.
    - [x] Use a clean table design: Bidder Name | Amount.
    - [x] Highlight the winner.
    - [x] **Tie-Breaker**: Display random selection message if tied.
    - [x] **Skip Rule**: If multiple users bid 0, skip the gift and move to end of queue.
