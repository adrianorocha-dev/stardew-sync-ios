import { makeRedirectUri } from "expo-auth-session";
import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { getBaseUrl } from "./getBaseURL";

import type { Provider } from "~/server/auth";

const TOKEN_STORAGE_KEY = "session-token";

type AuthContextData = {
  isLoading: boolean;
  isSignedIn: boolean;
  getToken: () => Promise<string | null>;
  signInWithOAuth: (provider: Provider) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const useAuth = () => {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return auth;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  const getToken = useCallback(async () => {
    if (sessionToken) {
      return sessionToken;
    }

    return await SecureStore.getItemAsync(TOKEN_STORAGE_KEY);
  }, [sessionToken]);

  const signInWithOAuth = useCallback(async (provider: Provider) => {
    const redirectUrl = makeRedirectUri();
    console.log({ redirectUrl });

    const oAuthUrl = new URL(`${getBaseUrl()}/api/auth/${provider}`);

    const sessionToken = await SecureStore.getItemAsync(TOKEN_STORAGE_KEY);
    if (sessionToken) {
      oAuthUrl.searchParams.set("sessionToken", sessionToken);
    }

    console.log({ oAuthUrl: oAuthUrl.toString() });

    const result = await WebBrowser.openAuthSessionAsync(
      oAuthUrl.toString(),
      redirectUrl,
    );

    if (result.type !== "success") {
      console.log("auth result:", result);
      return;
    }

    const url = Linking.parse(result.url);
    console.log({ url });

    const resultingSessionToken = url.queryParams?.token?.toString();
    if (!resultingSessionToken) {
      console.error("session token not found");
      return;
    }

    setSessionToken(resultingSessionToken);
    await SecureStore.setItemAsync(TOKEN_STORAGE_KEY, resultingSessionToken);
  }, []);

  const signOut = useCallback(async () => {
    const response = await fetch(`${getBaseUrl()}/api/auth/sign-out`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    if (!response.ok) {
      console.error("sign out error:", await response.text());
      return;
    }

    await SecureStore.deleteItemAsync(TOKEN_STORAGE_KEY);
    setSessionToken(null);
  }, []);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const sessionToken = await SecureStore.getItemAsync(TOKEN_STORAGE_KEY);
      if (sessionToken) {
        setSessionToken(sessionToken);
      }
      setIsLoading(false);
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isSignedIn: !!sessionToken,
        getToken,
        signInWithOAuth,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
