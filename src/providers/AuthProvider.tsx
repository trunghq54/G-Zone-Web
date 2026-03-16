import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { getUser, setUser, removeUser } from "@/lib/user";
import { loginApi } from "@/features/auth/api/auth-api";
import {
  getAccountMe,
  getAvatarImage,
} from "@/features/accounts/api/account-api";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: any | null;
  avatarUrl: string | null;
  login: (email, password) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUserState] = useState<any | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAndSetAvatar = useCallback(async (profile: any) => {
    // This function now uses a functional update to safely clean up the previous URL
    const setNewUrl = (newUrl: string | null) => {
      setAvatarUrl((prevUrl) => {
        if (prevUrl && prevUrl.startsWith("blob:")) {
          URL.revokeObjectURL(prevUrl);
        }
        return newUrl;
      });
    };

    const avatarPath = profile?.["avatar-url"];
    const isInvalidAvatarPath =
      !avatarPath ||
      avatarPath === "string" ||
      avatarPath === "/string" ||
      avatarPath === "null";

    if (isInvalidAvatarPath) {
      setNewUrl(null);
      return;
    }

    try {
      const blob = await getAvatarImage(avatarPath);
      const newAvatarUrl = URL.createObjectURL(blob);
      setNewUrl(newAvatarUrl);
    } catch (error) {
      console.error("Failed to fetch avatar:", error);
      setNewUrl(null);
    }
  }, []); // Now has no dependencies, is stable.

  const logout = useCallback(() => {
    setAvatarUrl((prevUrl) => {
      if (prevUrl && prevUrl.startsWith("blob:")) {
        URL.revokeObjectURL(prevUrl);
      }
      return null;
    });
    removeUser();
    setUserState(null);
    navigate("/login");
  }, [navigate]);

  const refreshUser = useCallback(async () => {
    setLoading(true);
    try {
      const freshUser = await getAccountMe();
      const currentUser = getUser(); // Get existing to preserve tokens
      
      const mergedUser = {
        ...currentUser, // Keep accessToken and other existing fields
        ...freshUser,   // Update with fresh profile data
      };
      
      setUser(mergedUser); // Update user in localStorage
      setUserState(mergedUser);
      await fetchAndSetAvatar(freshUser);
    } catch (error) {
      console.error("Failed to refresh user, logging out.", error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [fetchAndSetAvatar, logout]);

  useEffect(() => {
    const storedUser = getUser();
    if (storedUser) {
      setUserState(storedUser);
      refreshUser();
    } else {
      setLoading(false);
    }
  }, [refreshUser]);

  const login = useCallback(
    async (email, password) => {
      try {
        const userData = await loginApi(email, password);
        setUser(userData); // Store the initial user data (like tokens)
        setUserState(userData); // Set the user state
        
        // Navigate based on role
        const role = userData?.role || userData?.Role;
        if (role && role.toLowerCase() === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } catch (error) {
        throw error;
      }
    },
    [navigate]
  );

  const isAuthenticated = user !== null;

  // REMOVED auto navigate("/")
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate("/");
  //   }
  // }, [isAuthenticated, navigate]);

  const contextValue = useMemo(
    () => ({
      user,
      avatarUrl,
      login,
      logout,
      refreshUser,
      isAuthenticated,
    }),
    [user, avatarUrl, login, logout, refreshUser, isAuthenticated]
  );

  if (loading) {
    return null; // Render nothing while we're fetching the initial user state
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
