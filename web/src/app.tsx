import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes } from "./routes";

const queryClient = new QueryClient();

export function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Routes />
		</QueryClientProvider>
	);
}
