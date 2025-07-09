import { useMutation, useQueryClient } from "@tanstack/react-query";

type CreateQuestionRequest = {
  question: string;
  roomId: string;
};

type CreateQuestionResponse = {
  questionId: string;
};

export async function createQuestion({
  question,
  roomId,
}: CreateQuestionRequest) {
  const response = await fetch(
    `http://localhost:3333/rooms/${roomId}/questions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    }
  );

  const result: CreateQuestionResponse = await response.json();

  return result;
}

export function useCreateQuestion(roomId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { question: string }) =>
      createQuestion({ ...data, roomId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-questions", roomId] });
    },
  });
}
