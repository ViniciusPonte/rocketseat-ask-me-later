import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";
import z from "zod/v4";

const questionSchema = z.object({
  question: z.string().min(1),
});

const paramsSchema = z.object({
  roomId: z.string(),
});

export const createQuestionRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    "/rooms/:roomId/questions",
    {
      schema: {
        body: questionSchema,
        params: paramsSchema,
      },
    },
    async (request, reply) => {
      const { question } = request.body;
      const { roomId } = request.params;

      const results = await db
        .insert(schema.questions)
        .values({
          roomId,
          question,
        })
        .returning();

      const insertedQuestion = results[0];

      if (!insertedQuestion) {
        throw new Error("Failed to create new question.");
      }

      return reply.status(201).send({ questionId: insertedQuestion.id });
    }
  );
};
