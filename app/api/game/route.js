import { NextResponse } from 'next/server';

// Global In-Memory State
let gameState = {
    phase: 'SUBMISSION', // SUBMISSION, BIDDING, REVEAL, RATING, RESULTS
    users: [], // { name, tokens: 10, hasSubmitted: false }
    gifts: [], // { id, hints: [], provider: name, winner: null, bids: [], rankings: [], reason: '', acknowledgements: [], ratingAcknowledgements: [] }
    currentGiftIndex: 0,
    ratings: {}, // { giftId: [{ rater: name, story, utility, attraction }] }
};

export async function GET() {
    return NextResponse.json(gameState);
}

export async function POST(request) {
    const body = await request.json();
    const { action, payload } = body;

    switch (action) {
        case 'JOIN':
            if (!gameState.users.find(u => u.name === payload.name)) {
                gameState.users.push({ name: payload.name, tokens: 10, hasSubmitted: false });
            }
            break;

        case 'SUBMIT_GIFT':
            const { name, hints } = payload;

            // Auto-join if user missing (e.g. after reset)
            let user = gameState.users.find(u => u.name === name);
            if (!user) {
                user = { name, tokens: 10, hasSubmitted: false };
                gameState.users.push(user);
            }

            // Check if user already submitted
            if (gameState.gifts.find(g => g.provider === name)) {
                return NextResponse.json({ error: 'Already submitted' }, { status: 400 });
            }
            gameState.gifts.push({
                id: Math.random().toString(36).substr(2, 9),
                hints,
                provider: name,
                winner: null,
                bids: [],
                rankings: [],
                reason: '',
                acknowledgements: [],
                ratingAcknowledgements: []
            });
            user.hasSubmitted = true;
            break;

        case 'START_BIDDING':
            // Validation: All users must have submitted
            if (!gameState.users.every(u => u.hasSubmitted)) {
                return NextResponse.json({ error: 'Not all users have submitted gifts' }, { status: 400 });
            }
            gameState.phase = 'BIDDING';
            // Shuffle gifts
            gameState.gifts.sort(() => Math.random() - 0.5);
            break;

        case 'PLACE_BID':
            const { bidder, amount } = payload;
            const currentGift = gameState.gifts[gameState.currentGiftIndex];
            const bidderUser = gameState.users.find(u => u.name === bidder);

            // 1. Check if user has already won a gift
            const allWinners = gameState.gifts.map(g => g.winner).filter(w => w);
            if (allWinners.includes(bidder)) {
                return NextResponse.json({ error: 'You have already won a gift' }, { status: 400 });
            }

            // 2. Check if user is the provider
            if (currentGift.provider === bidder) {
                return NextResponse.json({ error: 'You cannot bid on your own gift' }, { status: 400 });
            }

            // 3. Place Bid
            // Allow 0 amount
            if (bidderUser && bidderUser.tokens >= amount && amount >= 0) {
                // Check if already bid
                if (currentGift.bids.find(b => b.bidder === bidder)) {
                    return NextResponse.json({ error: 'Already bid' }, { status: 400 });
                }

                bidderUser.tokens -= amount;
                currentGift.bids.push({ bidder, amount });

                // 4. Auto-Resolve Check
                // Eligible bidders = All users - Winners - Provider
                const eligibleBidders = gameState.users.filter(u =>
                    !allWinners.includes(u.name) &&
                    u.name !== currentGift.provider
                );

                // If all eligible bidders have bid, resolve immediately
                if (currentGift.bids.length >= eligibleBidders.length) {
                    resolveGift(currentGift, gameState.users);
                }
            }
            break;

        case 'ACKNOWLEDGE_WINNER':
            const { name: ackName } = payload;
            const giftToAck = gameState.gifts[gameState.currentGiftIndex];
            if (!giftToAck.acknowledgements) giftToAck.acknowledgements = [];

            if (!giftToAck.acknowledgements.includes(ackName)) {
                giftToAck.acknowledgements.push(ackName);
            }

            // Auto-Advance if everyone acknowledged
            if (giftToAck.acknowledgements.length >= gameState.users.length) {
                // Go to REVEAL for the CURRENT gift
                gameState.phase = 'REVEAL';
                console.log('All winner acknowledgements received. Advancing to REVEAL for gift:', gameState.currentGiftIndex);
            }
            break;

        case 'RESOLVE_BID':
            const giftToResolve = gameState.gifts[gameState.currentGiftIndex];
            resolveGift(giftToResolve, gameState.users);
            break;

        case 'NEXT_GIFT':
            if (gameState.currentGiftIndex < gameState.gifts.length - 1) {
                gameState.currentGiftIndex++;
            } else {
                gameState.phase = 'REVEAL';
                gameState.currentGiftIndex = 0;
            }
            break;

        case 'NEXT_REVEAL':
            if (gameState.currentGiftIndex < gameState.gifts.length - 1) {
                gameState.currentGiftIndex++;
            } else {
                gameState.phase = 'RATING';
            }
            break;

        case 'SUBMIT_RATING':
            const { rater, giftId, scores } = payload;
            if (!gameState.ratings[giftId]) gameState.ratings[giftId] = [];

            // Check if already rated
            if (!gameState.ratings[giftId].find(r => r.rater === rater)) {
                gameState.ratings[giftId].push({ rater, ...scores });
            }
            // NO AUTO-ADVANCE HERE!
            break;

        case 'ACKNOWLEDGE_RATING':
            const { name: ratingAckName } = payload;
            const giftForRatingAck = gameState.gifts[gameState.currentGiftIndex];
            if (!giftForRatingAck.ratingAcknowledgements) giftForRatingAck.ratingAcknowledgements = [];

            if (!giftForRatingAck.ratingAcknowledgements.includes(ratingAckName)) {
                giftForRatingAck.ratingAcknowledgements.push(ratingAckName);
            }

            // Auto-Advance if everyone acknowledged
            if (giftForRatingAck.ratingAcknowledgements.length >= gameState.users.length) {
                console.log('All ratings acknowledged. Current Index:', gameState.currentGiftIndex, 'Total Gifts:', gameState.gifts.length);
                if (gameState.currentGiftIndex < gameState.gifts.length - 1) {
                    // Go to BIDDING for the NEXT gift
                    gameState.currentGiftIndex++;
                    gameState.phase = 'BIDDING';
                    console.log('Advancing to next gift BIDDING. New Index:', gameState.currentGiftIndex);
                } else {
                    gameState.phase = 'RESULTS';
                    console.log('All gifts finished. Advancing to RESULTS.');
                }
            }
            break;

        case 'FINISH_RATING':
            gameState.phase = 'RESULTS';
            break;

        case 'RESET':
            gameState = {
                phase: 'SUBMISSION',
                users: [],
                gifts: [],
                currentGiftIndex: 0,
                ratings: {},
            };
            break;
    }

    return NextResponse.json(gameState);
}

// Helper Function to Resolve Gift
function resolveGift(gift, users) {
    if (gift.winner) return; // Already resolved

    if (gift.bids.length > 0) {
        // 1. Sort bids for ranking
        gift.rankings = [...gift.bids].sort((a, b) => b.amount - a.amount);

        // 2. Find Max Bid
        const maxBid = gift.rankings[0].amount;
        const potentialWinners = gift.rankings.filter(b => b.amount === maxBid);

        // 3. Pick Winner
        const winnerObj = potentialWinners[Math.floor(Math.random() * potentialWinners.length)];
        gift.winner = winnerObj.bidder;

        // 4. Generate Reason
        const bidDetails = gift.rankings.map(b => `${b.bidder} (${b.amount})`).join(', ');
        if (potentialWinners.length > 1) {
            const tiedNames = potentialWinners.map(w => w.bidder).join(', ');
            gift.reason = `最高出價為 ${maxBid} (${tiedNames})。隨機選中: ${gift.winner}。`;

            // 5. Mercy Rule
            // If someone tied for max bid but lost, AND has 0 tokens, give 1 token back.
            potentialWinners.forEach(loser => {
                if (loser.bidder !== gift.winner) {
                    const loserUser = users.find(u => u.name === loser.bidder);
                    if (loserUser && loserUser.tokens === 0) {
                        loserUser.tokens = 1;
                        gift.reason += ` (補償 ${loser.bidder} 1 枚代幣)`;
                    }
                }
            });
        } else {
            gift.reason = `最高出價者為 ${gift.winner} (${maxBid})。`;
        }
    } else {
        gift.winner = 'NO_BIDDER';
        gift.reason = '無人下標';
    }
}
