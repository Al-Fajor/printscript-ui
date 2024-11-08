import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

export const useAuthToken = () => {
    const { getAccessTokenSilently } = useAuth0();
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const fetchToken = async () => {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    redirect_uri: window.location.origin,
                    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                    scope: "read:snippets write:snippets"
                }
            });
            setToken(token);
        };

        fetchToken();
    }, [getAccessTokenSilently]);
    localStorage.setItem('authAccessToken', token!)
    return token;
};