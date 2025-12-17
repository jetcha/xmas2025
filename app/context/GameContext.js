'use client';
import { createContext, useContext, useState, useEffect, useRef } from 'react';

const GameContext = createContext();

export function GameProvider({ children }) {
    const [state, setState] = useState(null);
    const [user, setUser] = useState(null); // Local user info { name }
    const isJoiningRef = useRef(false);

    const fetchState = async () => {
        try {
            const res = await fetch('/api/game');
            const data = await res.json();
            setState(data);
        } catch (error) {
            console.error('Failed to fetch state:', error);
        }
    };

    const apiCall = async (action, payload) => {
        try {
            const res = await fetch('/api/game', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, payload }),
            });
            const data = await res.json();
            setState(data);
            return data;
        } catch (error) {
            console.error('API call failed:', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('exchange_user_name');
        setUser(null);
    };

    useEffect(() => {
        // Initial fetch
        fetchState();

        // Restore session
        const storedName = localStorage.getItem('exchange_user_name');
        if (storedName) {
            console.log('Restoring session for:', storedName);
            setUser({ name: storedName });
            // Note: We don't auto-join API here because the user might already exist.
            // But if the server restarted (users cleared), the logic below (User not found)
            // will catch it and log them out, which is correct behavior.

            // OPTIONAL: If we want to AUTO-JOIN on refresh if missing from server:
            // We can do that by checking state later. 
            // For now, let's just restore local state so UI works if server has them.
        }

        // Poll every 2s
        const interval = setInterval(fetchState, 2000);
        return () => clearInterval(interval);
    }, []);

    // Check if user has been kicked/reset from server
    useEffect(() => {
        if (state && user && !isJoiningRef.current) {
            const serverUser = state.users.find(u => u.name === user.name);
            if (!serverUser) {
                console.log('User not found in server state (Reset or Kicked). Logging out...');
                logout();
            }
        }
    }, [state, user]);

    const join = async (name) => {
        isJoiningRef.current = true;
        localStorage.setItem('exchange_user_name', name);
        setUser({ name });
        try {
            await apiCall('JOIN', { name });
        } finally {
            isJoiningRef.current = false;
        }
    };

    const submitGift = (hints) => apiCall('SUBMIT_GIFT', { name: user.name, hints });
    const startBidding = () => apiCall('START_BIDDING', {});
    const placeBid = (amount) => apiCall('PLACE_BID', { bidder: user.name, amount });
    const resolveBid = () => apiCall('RESOLVE_BID', {});
    const nextGift = () => apiCall('NEXT_GIFT', {});
    const nextReveal = () => apiCall('NEXT_REVEAL', {});
    const acknowledgeWinner = () => apiCall('ACKNOWLEDGE_WINNER', { name: user.name });
    const acknowledgeRating = () => apiCall('ACKNOWLEDGE_RATING', { name: user.name });
    const submitRating = (giftId, scores) => apiCall('SUBMIT_RATING', { rater: user.name, giftId, scores });
    const finishRating = () => apiCall('FINISH_RATING', {});
    const resetGame = async () => {
        logout();
        await apiCall('RESET', {});
        window.location.reload();
    };

    return (
        <GameContext.Provider value={{
            state,
            user,
            join,
            submitGift,
            startBidding,
            placeBid,
            resolveBid,
            nextGift,
            nextReveal,
            acknowledgeWinner,
            acknowledgeRating,
            submitRating,
            finishRating,
            resetGame,
            logout
        }}>
            {children}
        </GameContext.Provider>
    );
}

export const useGame = () => useContext(GameContext);
