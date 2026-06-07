import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const IconBookmark = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

const IconCheck = () => (
  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function SaveToToolboxButton({ toolName, content }) {
  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [localMessage, setLocalMessage] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    if (!content) return;

    if (!user) {
      alert("Please sign in first (using 'Sign in with Google' at the top) to save this output to your toolbox.");
      return;
    }

    setSaving(true);
    try {
      await addDoc(collection(db, 'saved_items'), {
        userId: user.uid,
        toolName,
        content,
        createdAt: serverTimestamp(),
      });
      setSaved(true);
      setLocalMessage('Saved to Toolbox!');
      setTimeout(() => {
        setSaved(false);
        setLocalMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error saving to Firestore:', err);
      alert('Failed to save to your toolbox. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleSave}
        disabled={saving || !content}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xxs font-bold transition-all border active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
          saved
            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
            : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-750'
        }`}
      >
        {saving ? (
          <svg className="animate-spin h-3.5 w-3.5 text-zinc-300" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : saved ? (
          <IconCheck />
        ) : (
          <IconBookmark />
        )}
        <span>{saving ? 'Saving...' : saved ? 'Saved!' : '💾 Save to Toolbox'}</span>
      </button>

      {/* Local floating toast popup */}
      {localMessage && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-zinc-950 border border-zinc-800 rounded-md text-[10px] font-extrabold text-[#deff9a] whitespace-nowrap shadow-xl animate-fade-in">
          {localMessage}
        </div>
      )}
    </div>
  );
}
