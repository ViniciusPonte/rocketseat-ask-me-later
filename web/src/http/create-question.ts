import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { GetRoomQuestionsAPIResponse } from "./get-room-questions";

type CreateQuestionRequest = {
  question: string;
  roomId: string;
};

type CreateQuestionResponse = {
  questionId: string;
  answer: string | null;
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
    /* onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-questions", roomId] });
    }, */
    onMutate: ({ question }) => {
      const questions = queryClient.getQueryData<GetRoomQuestionsAPIResponse>([
        "get-questions",
        roomId,
      ]);

      const questionsArray = questions ?? [];

      const newQuestion = {
        id: crypto.randomUUID(),
        question,
        answer: null,
        createdAt: new Date().toISOString(),
        isGeneratingAnswer: true,
      };

      queryClient.setQueryData<GetRoomQuestionsAPIResponse>(
        ["get-questions", roomId],
        [newQuestion, ...questionsArray]
      );

      return { newQuestion, questions };
    },
    onSuccess(data, _variables, context) {
      queryClient.setQueryData<GetRoomQuestionsAPIResponse>(
        ["get-questions", roomId],
        (questions) => {
          if (!questions || !context?.newQuestion) {
            return questions;
          }

          return questions.map((question) => {
            if (question.id === context.newQuestion.id) {
              return {
                ...context.newQuestion,
                id: data.questionId,
                answer: data.answer,
                isGeneratingAnswer: false,
              };
            }

            return question;
          });
        }
      );
    },

    onError(_error, _variables, context) {
      if (context?.questions) {
        queryClient.setQueryData<GetRoomQuestionsAPIResponse>(
          ["get-questions", roomId],
          context.questions
        );
      }
    },
  });
}
