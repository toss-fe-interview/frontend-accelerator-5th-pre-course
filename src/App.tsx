import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GlobalPortal, GlobalStyles } from "tosslib";
import { Routes } from "./pages/Routes";

const queryClient = new QueryClient();

export function App() {
	return (
		<>
			<GlobalStyles />
			<QueryClientProvider client={queryClient}>
				<GlobalPortal.Provider>
					<Routes />
				</GlobalPortal.Provider>
			</QueryClientProvider>
		</>
	);
}
