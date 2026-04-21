export interface Project {
  id: string;
  name: string;
  description: string;
  techs: string[];
  githubUrl: string;
  liveUrl?: string | null;
  imageUrl?: string | null;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface ProjectFormData {
  name: string;
  description: string;
  techs: string;
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  order: number;
  imageFile?: File | null;
}
