import { useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Compass, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PageNotFound({}) {
    const location = useLocation();
    const pageName = location.pathname.substring(1);

    const { data: authData, isFetched } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            try {
                const user = await base44.auth.me();
                return { user, isAuthenticated: true };
            } catch (error) {
                return { user: null, isAuthenticated: false };
            }
        }
    });

    return (
        <div className="min-h-dvh flex items-center justify-center p-6 bg-background">
            <div className="max-w-app w-full text-center">
                <div className="w-16 h-16 rounded-full bg-[#A1846B]/10 flex items-center justify-center mx-auto mb-5">
                    <Compass className="w-7 h-7 text-[#A1846B]" strokeWidth={1.5} />
                </div>
                <h1 className="font-display font-semibold text-5xl text-foreground">404</h1>
                <div className="h-0.5 w-12 bg-border mx-auto my-4" />
                <h2 className="font-display font-bold text-lg text-foreground">Page not found</h2>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    The page <span className="font-medium text-foreground">"{pageName}"</span> could not be found in this application.
                </p>

                {isFetched && authData.isAuthenticated && authData.user?.role === 'admin' && (
                    <div className="mt-6 p-4 bg-muted rounded-2xl border border-border text-left">
                        <p className="text-sm font-medium text-foreground">Admin note</p>
                        <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                            This page may not be implemented yet. Ask the builder to create it in the chat.
                        </p>
                    </div>
                )}

                <Button onClick={() => (window.location.href = '/')} className="mt-6 h-11 px-5">
                    <ArrowLeft className="w-4 h-4 mr-1.5" strokeWidth={1.5} />
                    Go home
                </Button>
            </div>
        </div>
    );
}