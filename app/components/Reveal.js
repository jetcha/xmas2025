'use client';
import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';

export default function Reveal() {
    const { state, user, submitRating, acknowledgeRating } = useGame();
    const [scores, setScores] = useState({ story: 5, utility: 5, attraction: 5 });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { t } = useLanguage();

    const currentGift = state.gifts[state.currentGiftIndex];
    const isProvider = currentGift.provider === user.name;

    // Check if user already rated this gift
    const hasRated = state.ratings[currentGift.id]?.some(r => r.rater === user.name);

    const handleRate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        await submitRating(currentGift.id, scores);
        setIsSubmitting(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[var(--md-sys-color-background)]">
            <div className="card max-w-md w-full animate-fade-in relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-[var(--md-sys-color-tertiary)]"></div>

                <div className="text-center mb-6">
                    <h2 className="text-xl text-[var(--md-sys-color-on-surface-variant)] font-medium">{t('bidding.current_gift')} #{state.currentGiftIndex + 1}</h2>
                    <h1 className="text-4xl font-bold text-[var(--md-sys-color-primary)] mt-2">{currentGift.provider}</h1>
                    <p className="text-sm text-[var(--md-sys-color-on-surface-variant)] mt-1">{t('bidding.provider')}</p>
                </div>

                <div className="bg-[var(--md-sys-color-surface-variant)] p-6 rounded-xl mb-8 border border-[var(--md-sys-color-outline)]/20">
                    <h3 className="text-lg font-bold mb-4 text-center text-[var(--md-sys-color-on-surface)]">{t('bidding.hints')}</h3>
                    <ul className="space-y-2 text-center text-[var(--md-sys-color-on-surface-variant)] italic">
                        {currentGift.hints.map((hint, i) => (
                            <li key={i}>"{hint}"</li>
                        ))}
                    </ul>
                    <div className="mt-6 pt-4 border-t border-[var(--md-sys-color-outline)]/20 text-center">
                        <p className="text-[var(--md-sys-color-on-surface-variant)] text-sm mb-1">{t('reveal.winner')}</p>
                        <p className="text-2xl font-bold text-[var(--md-sys-color-tertiary)]">{currentGift.winner}</p>
                    </div>
                </div>

                {/* Story Prompt */}
                <div className="mb-8 text-center">
                    <p className="text-[var(--md-sys-color-primary)] font-medium animate-pulse text-lg">
                        {isProvider ? t('reveal.tell_story') : t('reveal.listening')}
                    </p>
                </div>

                {/* Rating Form */}
                {!isProvider && (
                    !hasRated ? (
                        <form onSubmit={handleRate} className="flex flex-col gap-6">
                            <h3 className="text-lg font-bold text-center text-[var(--md-sys-color-on-surface)]">{t('reveal.rating_title')}</h3>

                            <div className="space-y-2">
                                <label className="flex justify-between text-sm text-[var(--md-sys-color-on-surface-variant)]">
                                    <span>{t('reveal.story')}</span>
                                    <span className="font-bold text-[var(--md-sys-color-primary)]">{scores.story}</span>
                                </label>
                                <input
                                    type="range" min="1" max="10" value={scores.story}
                                    onChange={(e) => setScores({ ...scores, story: Number(e.target.value) })}
                                    className="w-full accent-[var(--md-sys-color-primary)] h-2 bg-[var(--md-sys-color-surface-variant)] rounded-lg appearance-none cursor-pointer"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex justify-between text-sm text-[var(--md-sys-color-on-surface-variant)]">
                                    <span>{t('reveal.utility')}</span>
                                    <span className="font-bold text-[var(--md-sys-color-primary)]">{scores.utility}</span>
                                </label>
                                <input
                                    type="range" min="1" max="10" value={scores.utility}
                                    onChange={(e) => setScores({ ...scores, utility: Number(e.target.value) })}
                                    className="w-full accent-[var(--md-sys-color-primary)] h-2 bg-[var(--md-sys-color-surface-variant)] rounded-lg appearance-none cursor-pointer"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="flex justify-between text-sm text-[var(--md-sys-color-on-surface-variant)]">
                                    <span>{t('reveal.attraction')}</span>
                                    <span className="font-bold text-[var(--md-sys-color-primary)]">{scores.attraction}</span>
                                </label>
                                <input
                                    type="range" min="1" max="10" value={scores.attraction}
                                    onChange={(e) => setScores({ ...scores, attraction: Number(e.target.value) })}
                                    className="w-full accent-[var(--md-sys-color-primary)] h-2 bg-[var(--md-sys-color-surface-variant)] rounded-lg appearance-none cursor-pointer"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn-primary mt-4 w-full disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[var(--md-sys-color-primary)]/20"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? t('loading') : t('reveal.submit_rating')}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center p-6 bg-[var(--md-sys-color-primary-container)]/30 border border-[var(--md-sys-color-primary)]/20 rounded-xl">
                            <p className="text-[var(--md-sys-color-primary)] font-bold text-lg">{t('reveal.rated')}</p>
                            <p className="text-sm text-[var(--md-sys-color-on-surface-variant)] mt-1">{t('reveal.waiting_ratings')}</p>
                        </div>
                    )
                )}

                {/* Waiting Status Display */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-[var(--md-sys-color-on-surface-variant)] mb-2">
                        {t('reveal.waiting_list')} {state.users.filter(u => u.name !== currentGift.provider && !(state.ratings[currentGift.id]?.some(r => r.rater === u.name))).map(u => u.name).join(', ')}
                    </p>
                    <div className="w-full bg-[var(--md-sys-color-surface-variant)] rounded-full h-1 mt-2">
                        <div
                            className="bg-[var(--md-sys-color-primary)] h-1 rounded-full transition-all duration-500"
                            style={{ width: `${((state.ratings[currentGift.id]?.length || 0) / (state.users.length - 1)) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Continue Button for Synchronization */}
                {(state.ratings[currentGift.id]?.length >= state.users.length - 1) && (
                    <div className="mt-8 pt-6 border-t border-[var(--md-sys-color-outline)]/20 animate-fade-in">
                        {!currentGift.ratingAcknowledgements?.includes(user.name) ? (
                            <button
                                onClick={acknowledgeRating}
                                className="btn-primary w-full shadow-lg shadow-[var(--md-sys-color-primary)]/20"
                            >
                                {t('reveal.ack_rating')}
                            </button>
                        ) : (
                            <div className="text-center">
                                <p className="text-[var(--md-sys-color-on-surface-variant)] mb-2">{t('submit.waiting')}</p>
                                <div className="w-full bg-[var(--md-sys-color-surface-variant)] rounded-full h-2">
                                    <div
                                        className="bg-[var(--md-sys-color-primary)] h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${((currentGift.ratingAcknowledgements?.length || 0) / state.users.length) * 100}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-[var(--md-sys-color-on-surface-variant)] mt-2">
                                    {t('reveal.waiting_list')} {state.users.filter(u => !currentGift.ratingAcknowledgements?.includes(u.name)).map(u => u.name).join(', ')}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {isProvider && (
                    <div className="text-center p-6 bg-[var(--md-sys-color-surface-variant)]/30 border border-[var(--md-sys-color-outline)]/20 rounded-xl mt-4">
                        <p className="text-[var(--md-sys-color-on-surface-variant)] font-medium">{t('reveal.own_gift')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
