import { isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { INITIAL_USERS, type User, type UserRole } from '../user.model';

const STORAGE_KEY = 'bastidas_current_user';
const USERS_STORAGE_KEY = 'bastidas_users_list';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  // Lista de usuarios gestionables por el Administrador
  private readonly usersState = signal<User[]>(this.loadUsers());

  // Usuario autenticado actual (por defecto inicia con el Administrador para pruebas directas)
  private readonly currentUserState = signal<User | null>(this.loadCurrentUser());

  readonly users = computed(() => this.usersState());
  readonly currentUser = computed(() => this.currentUserState());
  readonly currentRole = computed<UserRole | null>(() => this.currentUserState()?.role ?? null);

  readonly isAuthenticated = computed(() => this.currentUserState() !== null && this.currentUserState()!.active);
  readonly isAdmin = computed(() => this.isAuthenticated() && this.currentRole() === 'ADMINISTRADOR');
  readonly isDocente = computed(() => this.isAuthenticated() && this.currentRole() === 'DOCENTE');
  readonly isEstudiante = computed(() => this.isAuthenticated() && this.currentRole() === 'ESTUDIANTE');
  readonly isPadre = computed(() => this.isAuthenticated() && this.currentRole() === 'PADRE_FAMILIA');

  loginAs(user: User): boolean {
    if (!user.active) {
      return false;
    }
    this.currentUserState.set(user);
    if (this.isBrowser) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } catch {
        // Ignorar errores de almacenamiento local
      }
    }
    return true;
  }

  loginWithUsername(username: string): boolean {
    const user = this.usersState().find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.active,
    );
    if (user) {
      return this.loginAs(user);
    }
    return false;
  }

  logout(): void {
    this.currentUserState.set(null);
    if (this.isBrowser) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignorar
      }
    }
  }

  // --- Operaciones de Administración de Usuarios ---

  createUser(data: {
    username: string;
    name: string;
    role: UserRole;
    email?: string;
    areaId?: number;
    grade?: number;
  }): User {
    const trimmedUsername = data.username.trim().toLowerCase();
    const existing = this.usersState().find((u) => u.username.toLowerCase() === trimmedUsername);
    if (existing) {
      throw new Error(`El nombre de usuario "${data.username}" ya está registrado.`);
    }

    const nextId = this.usersState().reduce((max, u) => Math.max(max, u.id), 0) + 1;
    const now = new Date().toISOString().split('T')[0];

    const newUser: User = {
      id: nextId,
      username: trimmedUsername,
      name: data.name.trim(),
      role: data.role,
      active: true,
      email: data.email?.trim() || undefined,
      areaId: data.areaId,
      grade: data.grade,
      createdAt: now,
    };

    const updated = [...this.usersState(), newUser];
    this.saveUsers(updated);
    return newUser;
  }

  updateUser(id: number, changes: Partial<Omit<User, 'id' | 'createdAt'>>): void {
    const updated = this.usersState().map((user) => {
      if (user.id === id) {
        return { ...user, ...changes };
      }
      return user;
    });
    this.saveUsers(updated);

    // Si se modificó el usuario actualmente autenticado, actualizarlo
    if (this.currentUserState()?.id === id) {
      const activeUser = updated.find((u) => u.id === id) ?? null;
      this.currentUserState.set(activeUser);
      if (this.isBrowser && activeUser) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(activeUser));
      }
    }
  }

  toggleUserActive(id: number): void {
    const user = this.usersState().find((u) => u.id === id);
    if (!user) return;
    this.updateUser(id, { active: !user.active });
  }

  assignRole(id: number, newRole: UserRole): void {
    this.updateUser(id, { role: newRole });
  }

  deleteUser(id: number): void {
    // Evitar eliminar al último administrador
    const userToDelete = this.usersState().find((u) => u.id === id);
    if (userToDelete?.role === 'ADMINISTRADOR') {
      const adminCount = this.usersState().filter((u) => u.role === 'ADMINISTRADOR').length;
      if (adminCount <= 1) {
        throw new Error('No es posible eliminar al único administrador del sistema.');
      }
    }

    const updated = this.usersState().filter((u) => u.id !== id);
    this.saveUsers(updated);

    if (this.currentUserState()?.id === id) {
      this.logout();
    }
  }

  private saveUsers(list: User[]): void {
    this.usersState.set(list);
    if (this.isBrowser) {
      try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(list));
      } catch {
        // Ignorar
      }
    }
  }

  private loadUsers(): User[] {
    if (this.isBrowser) {
      try {
        const raw = localStorage.getItem(USERS_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {
        // Ignorar
      }
    }
    return INITIAL_USERS;
  }

  private loadCurrentUser(): User | null {
    if (this.isBrowser) {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            return parsed as User;
          }
        }
      } catch {
        // Ignorar
      }
    }
    // Por defecto, iniciamos con el usuario Administrador para conveniencia de desarrollo y pruebas
    return INITIAL_USERS[0];
  }
}

