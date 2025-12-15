'use client';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';

export default function Results() {
    const { state, resetGame } = useGame();
    const { t } = useLanguage();

    const calculateTotalScore = (giftId) => {
        const giftRatings = state.ratings[giftId] || [];
        if (giftRatings.length === 0) return 0;
        return giftRatings.reduce((sum, r) => sum + r.story + r.utility + r.attraction, 0);
    };

    const results = state.gifts.map(g => ({
        ...g,
        totalScore: calculateTotalScore(g.id)
    })).sort((a, b) => b.totalScore - a.totalScore);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[var(--md-sys-color-background)]">
            <div className="card max-w-md w-full animate-fade-in relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-[var(--md-sys-color-primary)]"></div>

                <h1 className="text-3xl font-bold mb-8 text-[var(--md-sys-color-primary)] text-center">{t('results.title')}</h1>

                <div className="space-y-6">
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-[var(--md-sys-color-on-surface-variant)] mb-4 border-b border-[var(--md-sys-color-outline)]/20 pb-2">{t('results.rank')}</h2>
                        {results.map((gift, i) => (
                            <div key={gift.id} className={`flex justify-between items-center py-3 px-4 rounded-xl mb-2 transition-all ${i < 3 ? 'bg-[var(--md-sys-color-primary-container)] border border-[var(--md-sys-color-primary)]' : 'bg-[var(--md-sys-color-surface-variant)]'}`}>
                                <div className="flex items-center gap-4">
                                    <span className={`font-bold text-lg w-8 h-8 flex items-center justify-center rounded-full ${i === 0 ? 'bg-yellow-500 text-black' : i === 1 ? 'bg-slate-300 text-black' : i === 2 ? 'bg-amber-700 text-white' : 'text-[var(--md-sys-color-on-surface-variant)]'}`}>
                                        {i + 1}
                                    </span>
                                    <span className="font-medium text-[var(--md-sys-color-on-surface)]">{gift.provider}</span>
                                </div>
                                <span className="font-mono font-bold text-[var(--md-sys-color-primary)] text-lg">{gift.totalScore}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center mt-8">
                    <p className="text-[var(--md-sys-color-on-surface-variant)] mb-6">{t('app.title')}</p>
                    <button onClick={resetGame} className="btn-secondary w-full">
                        {t('results.restart')}
                    </button>
                </div>
            </div>
        </div>
    );
}
