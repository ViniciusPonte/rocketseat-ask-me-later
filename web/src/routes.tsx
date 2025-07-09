import {
  BrowserRouter,
  Route,
  Routes as RouterDomRoutes,
} from "react-router-dom";
import { CreateRoom } from "./pages/create-room";
import { Room } from "./pages/room";
import { RecordRoomAudio } from "./pages/record-room-audio";

export function Routes() {
  return (
    <BrowserRouter>
      <RouterDomRoutes>
        <Route index element={<CreateRoom />} />
        <Route element={<Room />} path="/room/:id" />
        <Route element={<RecordRoomAudio />} path="/room/:id/audio" />
      </RouterDomRoutes>
    </BrowserRouter>
  );
}
