import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getProfile = async (sessionUser) => {
            const { data, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', sessionUser.id)
                .single();

            if (data) setRole(data.role);
            else setRole(null); // fallback
        };

        supabase.auth.getSession().then(({ data: { session } }) => {
            const sessionUser = session?.user ?? null;
            setUser(sessionUser);
            if (sessionUser) getProfile(sessionUser);
            setLoading(false);
        });

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            const sessionUser = session?.user ?? null;
            setUser(sessionUser);
            if (sessionUser) getProfile(sessionUser);
            else setRole(null);
        });

        return () => {
            listener?.subscription.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ user, role, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
