import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Prvo ucitavanje sessiona
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        // Slusaj promjene logina
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => {
            listener?.subscription.unsubscribe()
        }
    }, [])

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
