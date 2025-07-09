import { useQuery } from "@tanstack/react-query";

type GetRoomQuestionsAPIResponse = Array<{
  id: string;
  question: string;
  answer: string | null;
  createdAt: string;
}>;

export async function getRoomQuestions(roomId: string) {
  const response = await fetch(
    `http://localhost:3333/rooms/${roomId}/questions`
  );
  const data: GetRoomQuestionsAPIResponse = await response.json();

  return data;
}

export function useRoomQuestions(roomId: string) {
  return useQuery({
    queryKey: ["get-questions", roomId],
    queryFn: () => getRoomQuestions(roomId),
  });
}
