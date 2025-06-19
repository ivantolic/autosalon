import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    // Dohvati/provjeri profil i postavi rolu
    const getOrCreateProfile = async (sessionUser) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', sessionUser.id)
                .single();

            if (data && data.role) {
                setRole(data.role);
            } else {
                // Prvi login: napravi profil
                const { error: insertError } = await supabase
                    .from('profiles')
                    .insert({ id: sessionUser.id, role: 'user' });
                if (!insertError) setRole('user');
                else setRole(null);
            }
        } catch (err) {
            setRole(null);
        }
    };

    // Prvi load: cekaj da user i rola budu setani prije nego maknes loading!
    useEffect(() => {
        let ignore = false;

        async function init() {
            const { data: { session } } = await supabase.auth.getSession();
            const sessionUser = session?.user ?? null;
            setUser(sessionUser);
            if (sessionUser) {
                await getOrCreateProfile(sessionUser); // cekaj
            } else {
                setRole(null);
            }
            if (!ignore) setLoading(false); // loading se mice tek kad imamo user & role
        }
        init();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            const sessionUser = session?.user ?? null;
            setUser(sessionUser);
            if (sessionUser) getOrCreateProfile(sessionUser);
            else setRole(null);
        });

        return () => {
            ignore = true;
            listener?.subscription.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setRole(null);
        setLoading(false);
    };

    return (
        <AuthContext.Provider value={{ user, role, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
