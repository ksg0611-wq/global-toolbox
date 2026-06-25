import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import SEO from '../components/SEO';

const LIME = '#deff9a';

// ── Icons ───────────────────────────────────────────────────────────────────
const IconGoogle = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const IconFolder = () => (
  <svg className="w-12 h-12 text-zinc-650 dark:text-zinc-600 mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2z" />
  </svg>
);

const IconTrash = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

export default function MyToolbox() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState('');

  // Listen for user login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setItems([]);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch items once user is authenticated
  useEffect(() => {
    if (!user) return;
    fetchSavedItems();
  }, [user]);

  const fetchSavedItems = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'saved_items'),
        where('userId', '==', user.uid)
      );
      const querySnapshot = await getDocs(q);
      const rawList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort locally to bypass the Firestore composite indexing requirement
      rawList.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });

      setItems(rawList);
    } catch (err) {
      console.error('Error fetching items from Firestore:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    }
  };

  const handleCopy = (content, id) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 2000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this saved item?')) return;

    try {
      await deleteDoc(doc(db, 'saved_items', id));
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Error deleting document:', err);
      alert('Failed to delete item. Please try again.');
    }
  };

  const formatDate = (createdAt) => {
    if (!createdAt) return new Date().toLocaleDateString();
    return new Date(createdAt.seconds * 1000).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-[80vh] py-12 bg-gray-50 dark:bg-zinc-955 transition-colors duration-300">
      <SEO
        title="My Saved Toolbox"
        description="View and manage your saved utilities and prompts in your personal toolbox on Global ToolBox."
        url="/my-toolbox"
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="mb-10 text-center md:text-left border-b border-slate-200 dark:border-zinc-800 pb-6">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            My Toolbox
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
            Manage your saved AI outputs, hashtag strategies, and customized templates in one secure dashboard.
          </p>
        </div>

        {/* ── Case 1: Not Authenticated ── */}
        {!user && (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white dark:bg-zinc-900/50 rounded-3xl border border-slate-200/60 dark:border-zinc-800/80 shadow-sm max-w-md mx-auto mt-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-zinc-800 text-indigo-500 dark:text-indigo-400 mb-6 shadow-inner">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">Login Required</h2>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mb-8 leading-relaxed">
              Sign in with your Google account to save your generated copy, hashtags, and pitch ideas directly to your toolbox.
            </p>
            <button
              onClick={handleSignIn}
              className="flex w-full items-center justify-center rounded-xl bg-slate-950 hover:bg-slate-900 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-extrabold py-3.5 px-4 shadow-md transition-all active:scale-98 cursor-pointer text-sm"
            >
              <IconGoogle />
              Sign in with Google
            </button>
          </div>
        )}

        {/* ── Case 2: Authenticated ── */}
        {user && (
          <>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 text-center space-y-4">
                <svg className="animate-spin h-10 w-10 text-indigo-500 dark:text-[#deff9a]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p className="text-zinc-400 text-sm font-semibold">Loading your items...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-white dark:bg-zinc-900/30 rounded-3xl border border-dashed border-slate-250 dark:border-zinc-800">
                <IconFolder />
                <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-300 mb-1">Your Toolbox is empty</h3>
                <p className="text-sm text-slate-400 dark:text-zinc-500 mb-6 max-w-xs leading-relaxed">
                  Start using the AI tools and click the 'Save to Toolbox' button to save your generated results here.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between rounded-2xl bg-white dark:bg-zinc-900/90 border border-slate-200/70 dark:border-zinc-800 p-5 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div>
                      {/* Top Header Card */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <span className="inline-flex rounded-lg bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 text-xxs font-black text-indigo-700 dark:text-indigo-300">
                          {item.toolName}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold mt-0.5">
                          {formatDate(item.createdAt)}
                        </span>
                      </div>

                      {/* Content Section */}
                      <div className="relative">
                        <pre className="text-xs text-slate-700 dark:text-zinc-300 font-sans leading-relaxed select-all overflow-y-auto max-h-[160px] p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-900 whitespace-pre-wrap">
                          {item.content}
                        </pre>
                      </div>
                    </div>

                    {/* Bottom Actions Card */}
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-zinc-900">
                      <button
                        onClick={() => handleCopy(item.content, item.id)}
                        className={`flex-grow py-2 px-3 rounded-lg text-xxs font-bold transition-all border active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 ${
                          copiedId === item.id
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-750'
                        }`}
                      >
                        {copiedId === item.id ? 'Copied!' : '📋 Copy Full'}
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="py-2 px-3.5 rounded-lg border border-red-200/50 hover:bg-red-50/50 hover:border-red-300 text-red-500 dark:border-red-900/40 dark:hover:bg-red-500/10 dark:hover:border-red-900/80 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                        title="Delete from Toolbox"
                      >
                        <IconTrash />
                        <span className="text-xxs font-bold">Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
