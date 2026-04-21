import { prismaMongo } from '../lib/prismaMongo.js';

export type ProjectCreateInput = {
  name: string;
  description: string;
  techs: string[];
  githubUrl: string;
  liveUrl?: string | null;
  imageUrl?: string | null;
  featured?: boolean;
  order?: number;
};

export type ProjectUpdateInput = Partial<ProjectCreateInput>;

export const projectModel = {
  list() {
    return prismaMongo.project.findMany({
      orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
    });
  },

  findById(id: string) {
    return prismaMongo.project.findUnique({ where: { id } });
  },

  create(data: ProjectCreateInput) {
    return prismaMongo.project.create({ data });
  },

  update(id: string, data: ProjectUpdateInput) {
    return prismaMongo.project.update({ where: { id }, data });
  },

  delete(id: string) {
    return prismaMongo.project.delete({ where: { id } });
  },
};
