export type UserRole = 'ADMINISTRADOR' | 'DOCENTE' | 'ESTUDIANTE' | 'PADRE_FAMILIA';

export interface User {
  id: number;
  username: string;
  name: string;
  role: UserRole;
  active: boolean;
  email?: string;
  phone?: string;
  readingInterests?: string[];
  areaId?: number; // Para docentes asignados a un área curricular
  grade?: number;  // Para estudiantes
  createdAt: string;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMINISTRADOR: 'Administrador',
  DOCENTE: 'Docente',
  ESTUDIANTE: 'Estudiante',
  PADRE_FAMILIA: 'Padre de Familia',
};

export const INITIAL_USERS: User[] = [
  {
    id: 1,
    username: 'admin',
    name: 'Lic. Raúl Mendoza Díaz',
    role: 'ADMINISTRADOR',
    active: true,
    email: 'direccion@bastidas.edu.pe',
    createdAt: '2026-03-01',
  },
  {
    id: 2,
    username: 'prof.carlos',
    name: 'Prof. Carlos Hurtado Valer',
    role: 'DOCENTE',
    active: true,
    email: 'carlos.hurtado@bastidas.edu.pe',
    areaId: 0, // Matemática
    createdAt: '2026-03-02',
  },
  {
    id: 3,
    username: 'prof.maria',
    name: 'Prof. María Quispe Rojas',
    role: 'DOCENTE',
    active: true,
    email: 'maria.quispe@bastidas.edu.pe',
    areaId: 1, // Comunicación
    createdAt: '2026-03-02',
  },
  {
    id: 4,
    username: 'estudiante.juan',
    name: 'Pepe Huamán Bastidas',
    role: 'ESTUDIANTE',
    active: true,
    grade: 3,
    createdAt: '2026-03-10',
  },
  {
    id: 5,
    username: 'padre.rosa',
    name: 'Sra. Rosa Palomino Sánchez',
    role: 'PADRE_FAMILIA',
    active: true,
    createdAt: '2026-03-12',
  },
];

