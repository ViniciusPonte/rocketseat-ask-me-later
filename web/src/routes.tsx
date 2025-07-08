import {
	BrowserRouter,
	Route,
	Routes as RouterDomRoutes,
} from "react-router-dom";
import { CreateRoom } from "./pages/create-room";
import { Room } from "./pages/room";

export function Routes() {
	return (
		<BrowserRouter>
			<RouterDomRoutes>
				<Route index element={<CreateRoom />} />
				<Route element={<Room />} path="/room/:id" />
			</RouterDomRoutes>
		</BrowserRouter>
	);
}
