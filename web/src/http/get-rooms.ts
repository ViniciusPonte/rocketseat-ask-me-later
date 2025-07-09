import { useQuery } from "@tanstack/react-query";

type GetRoomsAPIResponse = Array<{
  id: string;
  name: string;
  questionsCount: number;
  createdAt: string;
}>;

export async function getRooms() {
  const response = await fetch("http://localhost:3333/rooms");
  const data: GetRoomsAPIResponse = await response.json();

  return data;
}

export function useRooms() {
  return useQuery({
    queryKey: ["get-rooms"],
    queryFn: getRooms,
  });
}
