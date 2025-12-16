# Implementation Plan - UI/UX Overhaul & Language Support

# Goal Description
Implement a language switcher (English/Chinese) on the login page that persists throughout the application. Revamp the entire UI to follow Google Play Store (Material Design 3) aesthetics, replacing old-style tables and buttons with modern cards, rounded corners, and a vibrant color palette.

## User Review Required
> [!IMPORTANT]
> The UI will be significantly changed. The "old style" tables will be replaced by card lists, which is better for mobile but a major visual shift.

## Proposed Changes

### Infrastructure
#### [NEW] [LanguageContext.js](file:///c:/Users/CHuang/Documents/交換禮物2025/pwa/app/context/LanguageContext.js)
- Create a React Context to manage `language` state ('zh-TW' | 'en').
- Provide a `t(key)` function for translation.
- Persist language preference in `localStorage`.

#### [NEW] [translations.js](file:///c:/Users/CHuang/Documents/交換禮物2025/pwa/app/utils/translations.js)
- Dictionary object containing all text strings for both languages.

#### [MODIFY] [layout.js](file:///c:/Users/CHuang/Documents/交換禮物2025/pwa/app/layout.js)
- Wrap the application with `LanguageProvider`.

### UI Revamp (Global)
#### [MODIFY] [globals.css](file:///c:/Users/CHuang/Documents/交換禮物2025/pwa/app/globals.css)
- Define new CSS variables for Material You colors (Primary, OnPrimary, Surface, OnSurface, etc.).
- Add utility classes for `card`, `btn-primary`, `btn-secondary`, `btn-text`.
- Update body background to a light/gray surface color instead of plain white/black.

### Components
#### [MODIFY] [Login.js](file:///c:/Users/CHuang/Documents/交換禮物2025/pwa/app/components/Login.js)
- Add a language toggle button (icon or text) in the top-right corner.
- Update form styling to use the new `card` and `input` styles.

#### [MODIFY] [page.js](file:///c:/Users/CHuang/Documents/交換禮物2025/pwa/app/page.js)
- Use `useLanguage` hook to translate top-level text.

#### [MODIFY] [GiftSubmission.js](file:///c:/Users/CHuang/Documents/交換禮物2025/pwa/app/components/GiftSubmission.js)
- Convert form to a clean card layout.
- Use floating labels or modern input styles.

#### [MODIFY] [WaitingRoom.js](file:///c:/Users/CHuang/Documents/交換禮物2025/pwa/app/components/WaitingRoom.js)
- Display users as a grid of avatars/cards instead of a list.

#### [MODIFY] [Bidding.js](file:///c:/Users/CHuang/Documents/交換禮物2025/pwa/app/components/Bidding.js)
- Show the current gift as a "Featured Card".
- Display bids as a horizontal scroll or clean list below.

#### [MODIFY] [Reveal.js](file:///c:/Users/CHuang/Documents/交換禮物2025/pwa/app/components/Reveal.js)
- Use animations for the reveal.

#### [MODIFY] [Results.js](file:///c:/Users/CHuang/Documents/交換禮物2025/pwa/app/components/Results.js)
- Display rankings as a leaderboard list.

## Verification Plan

### Automated Tests
- None (UI changes are hard to unit test without existing setup).

### Manual Verification
1.  **Language Switch**:
    -   Open app, see Login page.
    -   Toggle Language -> Text should change immediately.
    -   Reload page -> Language choice should persist.
2.  **UI Aesthetics**:
    -   Check Login page: Is it centered, card-style?
    -   Check Game Flow: Do buttons look "clickable" and modern? Are tables gone?
3.  **Responsiveness**:
    -   Resize window to mobile size -> Layout should adapt (cards stack).
