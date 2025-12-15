'use client';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';

export default function WaitingRoom() {
    const { state, user, startBidding } = useGame();
    const { t } = useLanguage();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[var(--md-sys-color-background)]">
            <div className="card max-w-md w-full text-center animate-fade-in relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-[var(--md-sys-color-tertiary)]"></div>

                <h2 className="text-2xl font-bold mb-2 text-[var(--md-sys-color-on-surface)]">
                    {t('waiting.title')}
                </h2>
                <p className="text-[var(--md-sys-color-on-surface-variant)] mb-6">
                    {t('waiting.subtitle')}
                </p>

                <div className="grid grid-cols-3 gap-3 mb-8">
                    {state.users.map((u, i) => (
                        <div key={i} className={`flex flex-col items-center p-2 rounded-xl border transition-all ${u.hasSubmitted ? 'bg-[var(--md-sys-color-primary-container)] border-[var(--md-sys-color-primary)]' : 'bg-[var(--md-sys-color-surface-variant)] border-transparent'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 font-bold text-lg ${u.hasSubmitted ? 'bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)]' : 'bg-[var(--md-sys-color-outline)] text-[var(--md-sys-color-on-surface)]'}`}>
                                {u.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-xs font-medium truncate w-full text-[var(--md-sys-color-on-surface)]">
                                {u.name}
                            </span>
                        </div>
                    ))}
                </div>

                <p className="text-[var(--md-sys-color-on-surface-variant)] mb-6 text-sm">
                    {t('waiting.joined_users')}: {state.users.length} | {t('submit.waiting')}
                </p>

                {state.users.every(u => u.hasSubmitted) ? (
                    <button onClick={startBidding} className="btn-primary w-full shadow-lg shadow-[var(--md-sys-color-primary)]/20">
                        {t('waiting.start_button')}
                    </button>
                ) : (
                    <div className="p-4 bg-[var(--md-sys-color-surface-variant)]/50 rounded-xl border border-[var(--md-sys-color-outline)]/20">
                        <p className="text-[var(--md-sys-color-on-surface-variant)] text-sm">{t('submit.waiting')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
