'use client';
import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';

export default function Bidding() {
    const { state, user, placeBid, resolveBid, nextGift, acknowledgeWinner } = useGame();
    const [bidAmount, setBidAmount] = useState(0);
    const { t } = useLanguage();

    const currentGift = state.gifts[state.currentGiftIndex];
    const currentUser = state.users.find(u => u.name === user.name);

    if (!currentUser) {
        return (
            <div className="flex items-center justify-center min-h-screen text-[var(--md-sys-color-primary)] animate-pulse">
                {t('loading')}
            </div>
        );
    }

    const hasBid = currentGift.bids.some(b => b.bidder === user.name);

    const handleBid = (e) => {
        e.preventDefault();
        if (bidAmount >= 0 && bidAmount <= currentUser.tokens) {
            placeBid(Number(bidAmount));
        }
    };

    // Calculate eligible bidders
    const allWinners = state.gifts.map(g => g.winner).filter(w => w);
    const eligibleBidders = state.users.filter(u =>
        !allWinners.includes(u.name) &&
        u.name !== currentGift.provider
    );
    const isWinner = allWinners.includes(user.name);
    const isProvider = currentGift.provider === user.name;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[var(--md-sys-color-background)]">
            <div className="card max-w-md w-full animate-fade-in relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-[var(--md-sys-color-primary)]"></div>

                <div className="flex justify-between items-center mb-6">
                    <span className="text-[var(--md-sys-color-on-surface-variant)] font-medium">
                        {t('bidding.current_gift')} #{state.currentGiftIndex + 1}
                    </span>
                    <span className="text-[var(--md-sys-color-primary)] font-bold bg-[var(--md-sys-color-primary-container)] px-3 py-1 rounded-lg text-sm">
                        {t('bidding.your_tokens')}: {currentUser.tokens}
                    </span>
                </div>

                <div className="bg-[var(--md-sys-color-surface-variant)] p-6 rounded-xl mb-8 border border-[var(--md-sys-color-outline)]/20">
                    <h3 className="text-lg font-bold mb-4 text-center text-[var(--md-sys-color-on-surface)]">{t('bidding.hints')}</h3>
                    <ul className="space-y-4 text-center">
                        {currentGift.hints.map((hint, i) => (
                            <li key={i} className="text-lg text-[var(--md-sys-color-on-surface-variant)] italic">"{hint}"</li>
                        ))}
                    </ul>
                </div>

                {/* Bid Count Display - Only show if no winner yet */}
                {!currentGift.winner && (
                    <div className="text-center mb-6">
                        <p className="text-sm text-[var(--md-sys-color-on-surface-variant)]">
                            {t('bidding.history')}: <span className="text-[var(--md-sys-color-primary)] font-bold">{currentGift.bids.length}</span> / {eligibleBidders.length}
                        </p>
                        {eligibleBidders.length === 0 && (
                            <button
                                onClick={resolveBid}
                                className="mt-4 px-4 py-2 bg-[var(--md-sys-color-error)] text-[var(--md-sys-color-on-error)] rounded-lg text-sm font-bold shadow-sm hover:brightness-90 transition-all"
                            >
                                {t('bidding.force_end')}
                            </button>
                        )}
                    </div>
                )}

                {currentGift.winner ? (
                    <div className="text-center mb-6 animate-fade-in">
                        <p className="text-[var(--md-sys-color-on-surface-variant)] mb-2">{t('reveal.winner')}</p>
                        <p className="text-3xl font-bold text-[var(--md-sys-color-tertiary)]">{currentGift.winner}</p>
                        {currentGift.winner === user.name && (
                            <p className="text-sm text-[var(--md-sys-color-tertiary)] mt-2 font-medium">{t('bidding.winner_msg')}</p>
                        )}

                        {/* Reason & Rankings */}
                        <div className="mt-6 p-4 bg-[var(--md-sys-color-surface-variant)]/50 rounded-xl border border-[var(--md-sys-color-outline)]/20">
                            <p className="text-sm text-[var(--md-sys-color-on-surface-variant)] mb-2">{currentGift.reason}</p>
                            <div className="flex flex-col gap-2 mt-3">
                                {currentGift.rankings && currentGift.rankings.map((bid, idx) => (
                                    <div key={idx} className="flex justify-between text-sm px-4 py-2 bg-[var(--md-sys-color-surface)] rounded-lg shadow-sm">
                                        <span className="text-[var(--md-sys-color-on-surface)]">#{idx + 1} {bid.bidder}</span>
                                        <span className="text-[var(--md-sys-color-primary)] font-bold">{bid.amount}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    isWinner ? (
                        <div className="text-center p-6 bg-[var(--md-sys-color-surface-variant)]/30 border border-[var(--md-sys-color-outline)]/20 rounded-xl">
                            <p className="text-[var(--md-sys-color-on-surface-variant)] font-medium">{t('bidding.already_won')}</p>
                        </div>
                    ) : isProvider ? (
                        <div className="text-center p-6 bg-[var(--md-sys-color-surface-variant)]/30 border border-[var(--md-sys-color-outline)]/20 rounded-xl">
                            <p className="text-[var(--md-sys-color-on-surface-variant)] font-medium">{t('bidding.own_gift')}</p>
                        </div>
                    ) : !hasBid ? (
                        <form onSubmit={handleBid} className="flex flex-col gap-4">
                            <label className="text-sm text-[var(--md-sys-color-on-surface-variant)] text-center">{t('bidding.place_bid')}</label>
                            <input
                                type="number"
                                min="0"
                                max={currentUser.tokens}
                                value={bidAmount}
                                onChange={(e) => setBidAmount(e.target.value)}
                                className="input-field text-center text-2xl font-bold tracking-widest"
                            />
                            <button type="submit" className="btn-primary w-full shadow-lg shadow-[var(--md-sys-color-primary)]/20">
                                {t('bidding.bid_button')}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center p-6 bg-[var(--md-sys-color-primary-container)]/30 border border-[var(--md-sys-color-primary)]/20 rounded-xl">
                            <p className="text-[var(--md-sys-color-primary)] font-bold text-lg">{t('bidding.placed')}</p>
                            <p className="text-sm text-[var(--md-sys-color-on-surface-variant)] mt-1">{t('submit.waiting')}</p>
                        </div>
                    )
                )}

                {/* Acknowledgement UI */}
                {currentGift.winner && (
                    <div className="mt-8 pt-6 border-t border-[var(--md-sys-color-outline)]/20">
                        {!currentGift.acknowledgements?.includes(user.name) ? (
                            <button
                                onClick={acknowledgeWinner}
                                className="btn-primary w-full shadow-lg shadow-[var(--md-sys-color-primary)]/20"
                            >
                                {t('bidding.winner_ack')}
                            </button>
                        ) : (
                            <div className="text-center">
                                <p className="text-[var(--md-sys-color-on-surface-variant)] mb-2">{t('submit.waiting')}</p>
                                <div className="w-full bg-[var(--md-sys-color-surface-variant)] rounded-full h-2">
                                    <div
                                        className="bg-[var(--md-sys-color-primary)] h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${((currentGift.acknowledgements?.length || 0) / state.users.length) * 100}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-[var(--md-sys-color-on-surface-variant)] mt-2">
                                    {t('bidding.waiting_list')} {state.users.filter(u => !currentGift.acknowledgements?.includes(u.name)).map(u => u.name).join(', ')}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
