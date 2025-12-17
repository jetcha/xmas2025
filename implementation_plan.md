# Goal Description
Display the full bidding history (who bid what) for a gift after the winner is determined. This provides transparency and excitement to the game.

## Proposed Changes
### Frontend
#### [MODIFY] [Bidding.js](file:///c:/Users/CHuang/Documents/%E4%BA%A4%E6%8F%9B%E7%A6%AE%E7%89%A92025/pwa/app/components/Bidding.js)
- In the `currentGift.winner` section, insert a Bidding Results table.
- Functionality:
    - Sort bids by amount (descending).
    - Display columns: "Name", "Amount".
    - Highlight the winner's row (e.g., gold background or bold text).
    - Use existing translation keys where possible, or add generic headers.

#### [MODIFY] [translations.js](file:///c:/Users/CHuang/Documents/%E4%BA%A4%E6%8F%9B%E7%A6%AE%E7%89%A92025/pwa/app/utils/translations.js)
- Add keys for table headers if needed (though `results.name` and `bidding.bid_amount` exist).

## Verification Plan
### Automated Data Setup
- Run `node simulation_test.js` to simulate a game session with bots up to the bidding result phase.
### Manual Verification
- Open `http://localhost:3000` in the browser.
- Join the game as 'User'.
- Proceed through submission.
- In the bidding phase, place a bid.
- Wait for bots to bid and the winner to be announced.
- Verify the "Bidding Results" table appears with correct data.
