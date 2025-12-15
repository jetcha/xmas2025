'use client';
import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';

export default function GiftSubmission() {
    const [hints, setHints] = useState(['', '', '']);
    const { submitGift } = useGame();
    const { t } = useLanguage();

    const handleChange = (index, value) => {
        const newHints = [...hints];
        newHints[index] = value;
        setHints(newHints);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (hints.every(h => h.trim())) submitGift(hints);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[var(--md-sys-color-background)]">
            <div className="card max-w-md w-full animate-fade-in relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-[var(--md-sys-color-secondary)]"></div>

                <h2 className="text-2xl font-bold mb-2 text-[var(--md-sys-color-on-surface)] text-center">
                    {t('submit.title')}
                </h2>
                <p className="mb-6 text-[var(--md-sys-color-on-surface-variant)] text-center">
                    {t('submit.hint_placeholder')}
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {hints.map((hint, i) => (
                        <div key={i} className="relative">
                            <label className="text-xs font-bold text-[var(--md-sys-color-primary)] ml-4 mb-1 block">
                                {t('submit.hint_label', i + 1)}
                            </label>
                            <input
                                type="text"
                                value={hint}
                                onChange={(e) => handleChange(i, e.target.value)}
                                placeholder={t('submit.hint_placeholder')}
                                className="input-field"
                                required
                            />
                        </div>
                    ))}
                    <button type="submit" className="btn-primary mt-4 w-full shadow-lg shadow-[var(--md-sys-color-primary)]/20">
                        {t('submit.button')}
                    </button>
                </form>
            </div>
        </div>
    );
}
