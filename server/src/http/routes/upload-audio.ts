import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";
import z from "zod/v4";
import { generateEmbeddings, transcribeAudio } from "../../services/gemini.ts";

/* const questionSchema = z.object({
  question: z.string().min(1),
}); */

const paramsSchema = z.object({
  roomId: z.string(),
});

export const uploadAudioRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    "/rooms/:roomId/audio",
    {
      schema: {
        params: paramsSchema,
      },
    },
    async (request, reply) => {
      const { roomId } = request.params;
      const audio = await request.file();

      if (!audio) {
        throw new Error("Audio is required");
      }

      // 1. Transcrever o audio
      // 2. Gerar o vetor semantico / embeddings
      // 3. Armazenar os vetores no banco de dados

      const audioBuffer = await audio.toBuffer(); // toBuffer serve basicamente para nao trabalharmos com Streams, e sim com o audio ja finalizado.
      const audioAsBase64 = audioBuffer.toString("base64");

      const transcription = await transcribeAudio(
        audioAsBase64,
        audio.mimetype
      );

      const embeddings = await generateEmbeddings(transcription);

      const result = await db
        .insert(schema.audioChunks)
        .values({
          roomId,
          transcription,
          embeddings,
        })
        .returning();

      const chunk = result[0];

      if (!chunk) {
        throw new Error("Erro ao salvar chunk de audio");
      }

      return reply.status(201).send({ chunkId: chunk.id });
    }
  );
};
