import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { projectModel } from '../models/projectModel.js';
import { uploadBufferToCloudinary } from '../lib/cloudinary.js';

const baseSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  techs: z.array(z.string().min(1)).min(1),
  githubUrl: z.string().url(),
  liveUrl: z.string().url().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  featured: z.boolean().optional(),
  order: z.number().int().optional(),
});

const updateSchema = baseSchema.partial();

function coerceFromMultipart(fields: Record<string, unknown>) {
  const parsed: Record<string, unknown> = { ...fields };

  if (typeof parsed.techs === 'string') {
    const raw = parsed.techs as string;
    try {
      const asJson = JSON.parse(raw);
      if (Array.isArray(asJson)) parsed.techs = asJson;
      else parsed.techs = raw.split(',').map((s) => s.trim()).filter(Boolean);
    } catch {
      parsed.techs = raw.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }

  if (typeof parsed.featured === 'string') {
    parsed.featured = parsed.featured === 'true';
  }

  if (typeof parsed.order === 'string') {
    const n = Number(parsed.order);
    parsed.order = Number.isFinite(n) ? n : 0;
  }

  if (parsed.liveUrl === '') parsed.liveUrl = null;
  if (parsed.imageUrl === '') parsed.imageUrl = null;

  return parsed;
}

async function readMultipartPayload(
  request: FastifyRequest,
): Promise<{ fields: Record<string, unknown>; fileBuffer?: Buffer }> {
  const fields: Record<string, unknown> = {};
  let fileBuffer: Buffer | undefined;

  const parts = request.parts();
  for await (const part of parts) {
    if (part.type === 'file') {
      if (part.fieldname === 'image') {
        const chunks: Buffer[] = [];
        for await (const chunk of part.file) chunks.push(chunk as Buffer);
        fileBuffer = Buffer.concat(chunks);
      } else {
        part.file.resume();
      }
    } else {
      fields[part.fieldname] = part.value;
    }
  }

  return { fields, fileBuffer };
}

export const projectController = {
  async list(_request: FastifyRequest, reply: FastifyReply) {
    const projects = await projectModel.list();
    return reply.send(projects);
  },

  async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const project = await projectModel.findById(request.params.id);
    if (!project) return reply.status(404).send({ message: 'Project not found' });
    return reply.send(project);
  },

  async create(request: FastifyRequest, reply: FastifyReply) {
    const isMultipart = request.isMultipart();

    let payload: Record<string, unknown> = {};
    let fileBuffer: Buffer | undefined;

    if (isMultipart) {
      const read = await readMultipartPayload(request);
      payload = coerceFromMultipart(read.fields);
      fileBuffer = read.fileBuffer;
    } else {
      payload = (request.body as Record<string, unknown>) ?? {};
    }

    if (fileBuffer) {
      const uploaded = await uploadBufferToCloudinary(fileBuffer);
      payload.imageUrl = uploaded.url;
    }

    const parsed = baseSchema.safeParse(payload);
    if (!parsed.success) {
      return reply.status(400).send({
        message: 'Invalid payload',
        issues: parsed.error.flatten(),
      });
    }

    const created = await projectModel.create({
      ...parsed.data,
      liveUrl: parsed.data.liveUrl ?? null,
      imageUrl: parsed.data.imageUrl ?? null,
    });
    return reply.status(201).send(created);
  },

  async update(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const existing = await projectModel.findById(id);
    if (!existing) return reply.status(404).send({ message: 'Project not found' });

    const isMultipart = request.isMultipart();
    let payload: Record<string, unknown> = {};
    let fileBuffer: Buffer | undefined;

    if (isMultipart) {
      const read = await readMultipartPayload(request);
      payload = coerceFromMultipart(read.fields);
      fileBuffer = read.fileBuffer;
    } else {
      payload = (request.body as Record<string, unknown>) ?? {};
    }

    if (fileBuffer) {
      const uploaded = await uploadBufferToCloudinary(fileBuffer);
      payload.imageUrl = uploaded.url;
    }

    const parsed = updateSchema.safeParse(payload);
    if (!parsed.success) {
      return reply.status(400).send({
        message: 'Invalid payload',
        issues: parsed.error.flatten(),
      });
    }

    const updated = await projectModel.update(id, parsed.data);
    return reply.send(updated);
  },

  async remove(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const existing = await projectModel.findById(id);
    if (!existing) return reply.status(404).send({ message: 'Project not found' });

    await projectModel.delete(id);
    return reply.status(204).send();
  },
};
