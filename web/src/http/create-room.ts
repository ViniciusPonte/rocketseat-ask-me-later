import { useMutation, useQueryClient } from "@tanstack/react-query";

type CreateRoomRequest = {
  name: string;
  description: string;
};

type CreateRoomResponse = {
  id: string;
};

export async function createRoom(data: CreateRoomRequest) {
  const response = await fetch("http://localhost:3333/rooms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result: CreateRoomResponse = await response.json();

  return result;
}

export function useCreateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-rooms"] });
    },
  });
}
