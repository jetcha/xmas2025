
const fs = require('fs');

const BASE_URL = 'http://localhost:3000/api/game';
const LOG_FILE = 'test_output.log';

// Configuration
const CONFIG = {
    totalBots: 12, // Test with 10+ users
    lateJoinerIndex: 11, // Bot_11 joins late
    lateJoinDelay: 10000, // 10 seconds delay (likely during SUBMISSION or just after)
    dropoutIndex: 5,     // Bot_5 drops out
    dropoutStart: 20000, // Drops out at 20s (likely during BIDDING)
    dropoutDuration: 15000, // Returns after 15s
    pollInterval: 1500,
};

// Clear log file
fs.writeFileSync(LOG_FILE, '');

function log(msg) {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const logLine = `[${timestamp}] ${msg}`;
    console.log(logLine);
    fs.appendFileSync(LOG_FILE, logLine + '\n');
}

async function apiCall(action, payload) {
    try {
        const res = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, payload }),
        });
        return await res.json();
    } catch (e) {
        log(`Error calling ${action}: ${e.message}`);
        return null;
    }
}

async function getState() {
    try {
        const res = await fetch(BASE_URL);
        return await res.json();
    } catch (e) {
        log(`Error getting state: ${e.message}`);
        return null;
    }
}

class Bot {
    constructor(index) {
        this.index = index;
        this.name = `Bot_${index}`;
        this.active = true;
        this.running = false;
        this.hasJoined = false;
    }

    async start() {
        if (this.running) return;
        this.running = true;
        log(`${this.name} starting loop...`);

        // Initial Join
        await this.join();

        this.loop();
    }

    stop() {
        this.active = false;
        log(`${this.name} STOPPED (Simulating dropout).`);
    }

    resume() {
        this.active = true;
        log(`${this.name} RESUMED (Simulating return).`);
    }

    async join() {
        await apiCall('JOIN', { name: this.name });
        this.hasJoined = true;
        log(`${this.name} joined.`);
    }

    async loop() {
        if (!this.running) return;

        if (this.active) {
            try {
                await this.act();
            } catch (e) {
                log(`${this.name} error in loop: ${e.message}`);
            }
        }

        setTimeout(() => this.loop(), CONFIG.pollInterval + Math.random() * 500);
    }

    async act() {
        const state = await getState();
        if (!state) return;

        const myUser = state.users.find(u => u.name === this.name);

        // Auto-rejoin if server reset or lost
        if (!myUser) {
            if (this.hasJoined) {
                log(`${this.name} not found in state, re-joining...`);
                await this.join();
            }
            return;
        }

        // 1. SUBMISSION
        if (state.phase === 'SUBMISSION') {
            if (!myUser.hasSubmitted) {
                await apiCall('SUBMIT_GIFT', {
                    name: this.name,
                    hints: [`Hint 1 from ${this.name}`, `Hint 2 from ${this.name}`]
                });
                log(`${this.name} submitted gift.`);
            }

            // Admin Bot (Bot_0) triggers start
            // Wait for at least (totalBots - 1) because one might be late
            // Or just wait for everyone currently joined?
            // Let's make Bot_0 aggressive: if everyone joined has submitted, and count > 3, start.
            if (this.index === 0) {
                const allSubmitted = state.users.every(u => u.hasSubmitted);
                // We want to test late joiner, so let's NOT wait for the late joiner if they haven't joined yet.
                // But if we start too early, late joiner misses submission.
                // Let's wait until we have at least (totalBots - 1) users.
                const expectedUsers = CONFIG.totalBots - (CONFIG.lateJoinerIndex < CONFIG.totalBots ? 1 : 0);

                if (allSubmitted && state.users.length >= 3 && state.users.length >= expectedUsers) {
                    // Add a small delay to let others settle?
                    // await new Promise(r => setTimeout(r, 1000));
                    await apiCall('START_BIDDING', {});
                    log(`${this.name} STARTED BIDDING PHASE.`);
                }
            }
        }

        // 2. BIDDING
        if (state.phase === 'BIDDING') {
            const currentGift = state.gifts[state.currentGiftIndex];
            if (!currentGift) return;

            // Place Bid
            if (!currentGift.winner) {
                const hasBid = currentGift.bids.some(b => b.bidder === this.name);
                const isProvider = currentGift.provider === this.name;
                const amIWinner = state.gifts.some(g => g.winner === this.name);

                // Strategy: Always bid 1 if eligible, to ensure progress
                if (!hasBid && !isProvider && !amIWinner) {
                    const bidAmount = Math.floor(Math.random() * Math.min(3, myUser.tokens));
                    await apiCall('PLACE_BID', { bidder: this.name, amount: bidAmount });
                    log(`${this.name} bid ${bidAmount} on Gift ${state.currentGiftIndex + 1}.`);
                }
            }

            // Acknowledge Winner
            if (currentGift.winner) {
                if (!currentGift.acknowledgements?.includes(this.name)) {
                    await apiCall('ACKNOWLEDGE_WINNER', { name: this.name });
                    // log(`${this.name} ack winner.`);
                }
            }
        }

        // 3. REVEAL / RATING
        if (state.phase === 'REVEAL' || state.phase === 'RATING') {
            const currentGift = state.gifts[state.currentGiftIndex];
            if (!currentGift) return;

            // Submit Rating
            const isProvider = currentGift.provider === this.name;
            const hasRated = state.ratings[currentGift.id]?.some(r => r.rater === this.name);

            if (!isProvider && !hasRated) {
                await apiCall('SUBMIT_RATING', {
                    rater: this.name,
                    giftId: currentGift.id,
                    scores: { story: 5, utility: 5, attraction: 5 }
                });
                log(`${this.name} rated Gift ${state.currentGiftIndex + 1}.`);
            }

            // Acknowledge Rating
            // Only if everyone has rated (Client side logic usually waits, but here we can just ack whenever)
            // But the server logic for 'ACKNOWLEDGE_RATING' auto-advances when everyone acks.
            // So we should ack.

            // Wait until ratings are done? 
            // The server doesn't enforce "all rated" before "ack accepted", 
            // but the client UI usually shows "Waiting for ratings..."
            // Let's just ack immediately to keep it moving, assuming the "Wait" is UI only.
            // Wait, server: "Auto-Advance if everyone acknowledged".
            // So if I ack early, it's fine.

            if (!currentGift.ratingAcknowledgements?.includes(this.name)) {
                await apiCall('ACKNOWLEDGE_RATING', { name: this.name });
                // log(`${this.name} ack rating.`);
            }
        }

        // 4. RESULTS
        if (state.phase === 'RESULTS') {
            // Test done?
            // log(`${this.name} sees RESULTS.`);
        }
    }
}

async function runTest() {
    log('=== STARTING ADVANCED USER TEST ===');

    // 1. Reset Game
    log('Resetting game state...');
    await apiCall('RESET', {});

    const bots = [];
    for (let i = 0; i < CONFIG.totalBots; i++) {
        bots.push(new Bot(i));
    }

    // 2. Start initial bots
    log(`Starting ${CONFIG.totalBots} bots...`);
    bots.forEach(bot => {
        if (bot.index !== CONFIG.lateJoinerIndex) {
            bot.start();
        }
    });

    // 3. Schedule Late Joiner
    setTimeout(() => {
        log(`>>> LATE JOINER: ${bots[CONFIG.lateJoinerIndex].name} joining now!`);
        bots[CONFIG.lateJoinerIndex].start();
    }, CONFIG.lateJoinDelay);

    // 4. Schedule Dropout
    setTimeout(() => {
        log(`>>> DROPOUT: ${bots[CONFIG.dropoutIndex].name} dropping out!`);
        bots[CONFIG.dropoutIndex].stop();
    }, CONFIG.dropoutStart);

    // 5. Schedule Return
    setTimeout(() => {
        log(`>>> RETURN: ${bots[CONFIG.dropoutIndex].name} returning!`);
        bots[CONFIG.dropoutIndex].resume();
    }, CONFIG.dropoutStart + CONFIG.dropoutDuration);

    // 6. Monitor Loop
    setInterval(async () => {
        const state = await getState();
        if (state) {
            const users = state.users.length;
            const phase = state.phase;
            const giftIdx = state.currentGiftIndex;
            const gift = state.gifts[giftIdx];
            const bids = gift ? gift.bids.length : 0;
            const acks = gift ? (gift.acknowledgements?.length || 0) : 0;

            log(`[MONITOR] Phase: ${phase} | Users: ${users} | Gift: ${giftIdx + 1} | Bids: ${bids} | Acks: ${acks}`);
        }
    }, 2000);

    // Auto-exit after 60 seconds
    setTimeout(() => {
        log('=== TEST COMPLETE (Timeout) ===');
        process.exit(0);
    }, 60000);
}

runTest();
