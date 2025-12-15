// Native fetch is available in Node.js 18+

const BASE_URL = 'http://localhost:3000/api/game';
const BOTS = ['User', 'BotB', 'BotC'];
const POLL_INTERVAL = 2000;

async function apiCall(action, payload) {
    try {
        const res = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, payload }),
        });
        return await res.json();
    } catch (e) {
        console.error(`Error calling ${action}:`, e.message);
    }
}

async function getState() {
    try {
        const res = await fetch(BASE_URL);
        return await res.json();
    } catch (e) {
        console.error('Error getting state:', e.message);
    }
}

async function runBot(name) {
    console.log(`${name} started.`);

    // 1. Join
    await apiCall('JOIN', { name });
    console.log(`${name} joined.`);

    setInterval(async () => {
        const state = await getState();
        if (!state) return;

        const myUser = state.users.find(u => u.name === name);
        if (!myUser) {
            console.log(`${name} not found, re-joining...`);
            await apiCall('JOIN', { name });
            return;
        }

        // 2. Submit Gift
        if (state.phase === 'SUBMISSION' && !myUser.hasSubmitted) {
            await apiCall('SUBMIT_GIFT', {
                name,
                hints: [`Hint 1 from ${name}`, `Hint 2 from ${name}`, `Hint 3 from ${name}`]
            });
            console.log(`${name} submitted gift.`);
        }

        // Auto-Start Bidding (if I am the first bot and everyone submitted)
        if (state.phase === 'SUBMISSION' && name === BOTS[0]) {
            const allSubmitted = state.users.every(u => u.hasSubmitted);
            // We need at least 3 users (User + 2 Bots)
            if (allSubmitted && state.users.length >= 3) {
                await apiCall('START_BIDDING', {});
                console.log(`${name} started bidding phase.`);
            }
        }

        // 3. Bidding
        if (state.phase === 'BIDDING') {
            const currentGift = state.gifts[state.currentGiftIndex];

            // Place Bid
            if (!currentGift.winner) {
                const hasBid = currentGift.bids.some(b => b.bidder === name);
                const isProvider = currentGift.provider === name;
                const amIWinner = state.gifts.some(g => g.winner === name);

                if (!hasBid && !isProvider && !amIWinner) {
                    const bidAmount = Math.floor(Math.random() * myUser.tokens);
                    await apiCall('PLACE_BID', { bidder: name, amount: bidAmount });
                    console.log(`${name} bid ${bidAmount} on Gift ${state.currentGiftIndex + 1}.`);
                }
            }

            // Acknowledge Winner
            if (currentGift.winner) {
                if (!currentGift.acknowledgements?.includes(name)) {
                    await apiCall('ACKNOWLEDGE_WINNER', { name });
                    console.log(`${name} acknowledged winner for Gift ${state.currentGiftIndex + 1}.`);
                }
            }
        }

        // 4. Reveal / Rating
        // In interleaved flow:
        // BIDDING (Gift X) -> REVEAL (Gift X) -> BIDDING (Gift X+1) -> ...

        const currentGift = state.gifts[state.currentGiftIndex];
        if (state.phase === 'REVEAL' || state.phase === 'RATING') {
            // Submit Rating
            const isProvider = currentGift.provider === name;
            const hasRated = state.ratings[currentGift.id]?.some(r => r.rater === name);

            if (!isProvider && !hasRated) {
                await apiCall('SUBMIT_RATING', {
                    rater: name,
                    giftId: currentGift.id,
                    scores: { story: 8, utility: 8, attraction: 8 }
                });
                console.log(`${name} rated Gift ${state.currentGiftIndex + 1}.`);
            }

            // Acknowledge Rating (Continue)
            // Only if everyone has rated
            const eligibleRaters = state.users.filter(u => u.name !== currentGift.provider);
            const ratingCount = state.ratings[currentGift.id]?.length || 0;

            if (ratingCount >= eligibleRaters.length) {
                if (!currentGift.ratingAcknowledgements?.includes(name)) {
                    await apiCall('ACKNOWLEDGE_RATING', { name });
                    console.log(`${name} acknowledged rating for Gift ${state.currentGiftIndex + 1}.`);
                }
            }
        }

    }, POLL_INTERVAL + Math.random() * 1000);
}

BOTS.forEach(bot => runBot(bot));
