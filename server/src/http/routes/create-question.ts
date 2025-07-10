import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";
import z from "zod/v4";
import { generateAnswer, generateEmbeddings } from "../../services/gemini.ts";
import { and, eq, sql } from "drizzle-orm";

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

      // comparar proximidade de vetores:  <=>

      const embeddings = await generateEmbeddings(question);

      const embeddingsAsString = `[${embeddings.join(",")}]`;

      const chunks = await db
        .select({
          id: schema.audioChunks.id,
          transcription: schema.audioChunks.transcription,
          similarity: sql<number>`1 - (${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector)`,
        })
        .from(schema.audioChunks)
        .where(
          and(
            eq(schema.audioChunks.roomId, roomId),
            sql`1 - (${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector) > 0.7`
          )
        )
        .orderBy(
          sql`1 - (${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector)`
        )
        .limit(3);

      console.log(chunks);

      let answer: string | null = null;

      if (chunks.length > 0) {
        const transcriptions = chunks.map((chunk) => chunk.transcription);

        answer = await generateAnswer(question, transcriptions);
      }

      const results = await db
        .insert(schema.questions)
        .values({
          roomId,
          question,
          answer,
        })
        .returning();

      const insertedQuestion = results[0];

      if (!insertedQuestion) {
        throw new Error("Failed to create new question.");
      }

      return reply
        .status(201)
        .send({ questionId: insertedQuestion.id, answer });
    }
  );
};
