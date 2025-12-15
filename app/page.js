'use client';
import { useGame } from './context/GameContext';
import { useLanguage } from './context/LanguageContext';
import Login from './components/Login';
import GiftSubmission from './components/GiftSubmission';
import WaitingRoom from './components/WaitingRoom';
import Bidding from './components/Bidding';
import Reveal from './components/Reveal';
import Results from './components/Results';

export default function Home() {
  const { state, user } = useGame();
  const { t } = useLanguage();

  if (!state) return <div className="flex items-center justify-center min-h-screen text-[var(--md-sys-color-primary)] animate-pulse">{t('loading')}</div>;
  if (!user) return <Login />;

  let content;
  // Phase Routing
  switch (state.phase) {
    case 'SUBMISSION':
      const currentUser = state.users.find(u => u.name === user.name);
      if (currentUser && currentUser.hasSubmitted) {
        content = <WaitingRoom />;
      } else {
        content = <GiftSubmission />;
      }
      break;

    case 'BIDDING':
      content = <Bidding />;
      break;

    case 'REVEAL':
    case 'RATING':
      content = <Reveal />;
      break;

    case 'RESULTS':
      content = <Results />;
      break;

    default:
      content = <div className="text-white">{t('unknown_phase')}: {state.phase}</div>;
  }

  return (
    <>
      {content}
    </>
  );
}
