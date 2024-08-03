import React, {
	Dispatch,
	PropsWithChildren,
	createContext,
	useContext,
	useEffect,
	useState
} from "react";
import { User, getCurrentUser } from "../services/api";

type GlobalContextType = {
	isLoggedIn: boolean;
	setIsLoggedIn: Dispatch<React.SetStateAction<boolean>>;
	user: User | null;
	setUser: Dispatch<React.SetStateAction<User | null>>;
	isLoading: boolean;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function useGlobalContext() {
	const context = useContext<GlobalContextType | undefined>(GlobalContext);
	if (!context) throw new Error("useGlobalContext must be used within a GlobalProvider");

	return context;
}

export default function GlobalProvider({ children }: PropsWithChildren) {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		init();
		async function init() {
			try {
				const user = await getCurrentUser();
				if (user) {
					setIsLoggedIn(true);
					setUser(user);
				} else {
					setIsLoggedIn(false);
					setUser(null);
				}
			} catch (error) {
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		}
	}, []);

	return (
		<GlobalContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser, isLoading }}>
			{children}
		</GlobalContext.Provider>
	);
}
