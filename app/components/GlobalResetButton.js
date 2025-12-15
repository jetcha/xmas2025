'use client';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';

export default function GlobalResetButton() {
    const { resetGame } = useGame();
    const { t } = useLanguage();

    const handleForceReset = () => {
        if (confirm(t('reset.confirm_1'))) {
            if (confirm(t('reset.confirm_2'))) {
                const password = prompt(t('reset.password_prompt'));
                if (password === '1123') {
                    resetGame();
                } else {
                    alert(t('reset.password_error'));
                }
            }
        }
    };

    return (
        <button
            onClick={handleForceReset}
            className="fixed top-4 left-4 px-4 py-2 bg-[var(--md-sys-color-error)] text-[var(--md-sys-color-on-error)] rounded-full shadow-lg hover:brightness-90 transition-all flex items-center gap-2 font-bold z-[99999]"
            title={t('reset.button')}
            style={{ zIndex: 99999 }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            <span className="hidden sm:inline">{t('reset.button')}</span>
        </button>
    );
}
