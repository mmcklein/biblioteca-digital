import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { CatalogService } from '../../core/catalog.service';
import { CURRICULAR_AREAS, DOCUMENT_FORMATS, DOCUMENT_TYPES, GRADES, areaById, gradeLabel, type CurricularArea } from '../../core/curriculum';
import { INSTITUTION } from '../../core/institution';
import type { DifficultyLevel, LibraryResource, ResourceFormat, ResourceKind, ResourceStatus } from '../../core/resources';
import { ROLE_LABELS, type User, type UserRole } from '../../core/user.model';

type AdminTab = 'resumen' | 'usuarios' | 'materiales' | 'actividades' | 'areas' | 'auditoria';

@Component({
  selector: 'app-admin',
  imports: [FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {
  protected readonly auth = inject(AuthService);
  protected readonly catalog = inject(CatalogService);

  protected readonly institution = INSTITUTION;
  protected readonly roleLabels = ROLE_LABELS;
  protected readonly areas = CURRICULAR_AREAS;
  protected readonly grades = GRADES;
  protected readonly docTypes = DOCUMENT_TYPES;
  protected readonly docFormats = DOCUMENT_FORMATS;
  protected readonly areaById = areaById;
  protected readonly gradeLabel = gradeLabel;

  protected readonly currentTab = signal<AdminTab>('resumen');

  // --- Filtros de tablas ---
  protected userFilterRole = signal<string>('');
  protected userSearch = signal<string>('');
  protected materialSearch = signal<string>('');
  protected materialAreaFilter = signal<string>('');
  protected materialStatusFilter = signal<string>('');

  // --- Modales y Formularios ---
  protected showUserModal = signal(false);
  protected editingUser = signal<User | null>(null);
  protected userForm = {
    username: '',
    name: '',
    role: 'DOCENTE' as UserRole,
    email: '',
    areaId: 0,
    grade: 1,
  };

  protected showMaterialModal = signal(false);
  protected editingMaterial = signal<LibraryResource | null>(null);
  protected materialForm = {
    title: '',
    areaId: 0,
    grade: 1 as 1 | 2 | 3 | 4 | 5,
    format: 'PDF' as ResourceFormat,
    type: 'Libro' as ResourceKind,
    description: '',
    author: '',
    featured: false,
    duration: '',
    status: 'publicado' as ResourceStatus,
  };

  protected showAreaModal = signal(false);
  protected editingArea = signal<CurricularArea | null>(null);
  protected areaForm = {
    name: '',
    icon: '',
    description: '',
  };

  protected alertMessage = signal<string | null>(null);

  // --- Listas computadas ---
  protected readonly filteredUsers = computed(() => {
    const q = this.userSearch().trim().toLowerCase();
    const role = this.userFilterRole();

    return this.auth.users().filter((user) => {
      const matchQuery = !q || user.name.toLowerCase().includes(q) || user.username.toLowerCase().includes(q);
      const matchRole = !role || user.role === role;
      return matchQuery && matchRole;
    });
  });

  protected readonly allMaterials = computed(() => {
    const q = this.materialSearch().trim().toLowerCase();
    const area = this.materialAreaFilter();
    const status = this.materialStatusFilter();

    return this.catalog.allResourcesList().filter((res) => {
      const matchQuery = !q || res.title.toLowerCase().includes(q) || res.author.toLowerCase().includes(q);
      const matchArea = !area || String(res.areaId) === area;
      const matchStatus = !status || res.status === status;
      return matchQuery && matchArea && matchStatus;
    });
  });

  protected readonly activityResources = computed(() => {
    return this.catalog.allResourcesList().filter((res) => res.type === 'Actividad');
  });

  protected setTab(tab: AdminTab): void {
    this.currentTab.set(tab);
    this.alertMessage.set(null);
  }

  // --- Acciones de Usuarios ---
  protected openNewUserModal(): void {
    this.editingUser.set(null);
    this.userForm = {
      username: '',
      name: '',
      role: 'DOCENTE',
      email: '',
      areaId: 0,
      grade: 1,
    };
    this.showUserModal.set(true);
  }

  protected editUser(user: User): void {
    this.editingUser.set(user);
    this.userForm = {
      username: user.username,
      name: user.name,
      role: user.role,
      email: user.email ?? '',
      areaId: user.areaId ?? 0,
      grade: user.grade ?? 1,
    };
    this.showUserModal.set(true);
  }

  protected saveUser(): void {
    try {
      if (this.editingUser()) {
        this.auth.updateUser(this.editingUser()!.id, {
          name: this.userForm.name,
          role: this.userForm.role,
          email: this.userForm.email || undefined,
          areaId: this.userForm.role === 'DOCENTE' ? this.userForm.areaId : undefined,
          grade: this.userForm.role === 'ESTUDIANTE' ? this.userForm.grade : undefined,
        });
        this.showAlert(`Usuario "${this.userForm.name}" actualizado con éxito.`);
      } else {
        this.auth.createUser({
          username: this.userForm.username,
          name: this.userForm.name,
          role: this.userForm.role,
          email: this.userForm.email,
          areaId: this.userForm.role === 'DOCENTE' ? this.userForm.areaId : undefined,
          grade: this.userForm.role === 'ESTUDIANTE' ? this.userForm.grade : undefined,
        });
        this.showAlert(`Usuario "${this.userForm.username}" registrado exitosamente.`);
      }
      this.showUserModal.set(false);
    } catch (err: any) {
      alert(err.message || 'Error al guardar usuario');
    }
  }

  protected toggleUserStatus(user: User): void {
    this.auth.toggleUserActive(user.id);
    this.showAlert(`Estado de cuenta de "${user.username}" actualizado.`);
  }

  protected changeUserRole(userId: number, role: UserRole): void {
    this.auth.assignRole(userId, role);
    this.showAlert(`Rol actualizado a ${this.roleLabels[role]}.`);
  }

  // --- Acciones de Materiales ---
  protected openNewMaterialModal(): void {
    this.editingMaterial.set(null);
    this.materialForm = {
      title: '',
      areaId: 0,
      grade: 1,
      format: 'PDF',
      type: 'Libro',
      description: '',
      author: 'Docente responsable',
      featured: false,
      duration: '',
      status: 'publicado',
    };
    this.showMaterialModal.set(true);
  }

  protected editMaterial(resource: LibraryResource): void {
    this.editingMaterial.set(resource);
    this.materialForm = {
      title: resource.title,
      areaId: resource.areaId,
      grade: resource.grade,
      format: resource.format,
      type: resource.type,
      description: resource.description,
      author: resource.author,
      featured: resource.featured,
      duration: resource.duration ?? '',
      status: resource.status,
    };
    this.showMaterialModal.set(true);
  }

  protected saveMaterial(): void {
    if (!this.materialForm.title.trim()) {
      alert('Por favor indica el título del material.');
      return;
    }

    if (this.editingMaterial()) {
      this.catalog.updateResource(this.editingMaterial()!.id, {
        title: this.materialForm.title.trim(),
        areaId: Number(this.materialForm.areaId),
        grade: Number(this.materialForm.grade) as 1 | 2 | 3 | 4 | 5,
        format: this.materialForm.format,
        type: this.materialForm.type,
        description: this.materialForm.description.trim(),
        author: this.materialForm.author.trim(),
        featured: this.materialForm.featured,
        duration: this.materialForm.duration.trim() || undefined,
        status: this.materialForm.status,
      }, this.auth.currentUser()?.name ?? 'Administrador');
      this.showAlert(`Material "${this.materialForm.title}" actualizado.`);
    } else {
      this.catalog.createResource({
        title: this.materialForm.title.trim(),
        areaId: Number(this.materialForm.areaId),
        grade: Number(this.materialForm.grade) as 1 | 2 | 3 | 4 | 5,
        format: this.materialForm.format,
        type: this.materialForm.type,
        description: this.materialForm.description.trim(),
        author: this.materialForm.author.trim() || (this.auth.currentUser()?.name ?? 'Equipo Pedagógico'),
        featured: this.materialForm.featured,
        duration: this.materialForm.duration.trim() || undefined,
        status: this.materialForm.status,
      }, this.auth.currentUser()?.name ?? 'Administrador');
      this.showAlert(`Nuevo material "${this.materialForm.title}" registrado en el catálogo.`);
    }

    this.showMaterialModal.set(false);
  }

  protected toggleMaterialStatus(resource: LibraryResource): void {
    const newStatus: ResourceStatus = resource.status === 'publicado' ? 'retirado' : 'publicado';
    this.catalog.setResourceStatus(resource.id, newStatus, this.auth.currentUser()?.name ?? 'Administrador');
    this.showAlert(`El recurso ha sido ${newStatus === 'publicado' ? 'publicado' : 'retirado'} del catálogo público.`);
  }

  protected deleteMaterial(resource: LibraryResource): void {
    if (confirm(`¿Estás seguro de eliminar "${resource.title}"? Esta acción retirará el material permanentemente.`)) {
      this.catalog.deleteResource(resource.id, this.auth.currentUser()?.name ?? 'Administrador');
      this.showAlert(`Material eliminado.`);
    }
  }

  // --- Acciones de Áreas Curriculares ---
  protected editArea(area: CurricularArea): void {
    this.editingArea.set(area);
    this.areaForm = {
      name: area.name,
      icon: area.icon,
      description: area.description ?? '',
    };
    this.showAreaModal.set(true);
  }

  protected saveArea(): void {
    if (!this.editingArea()) return;
    this.catalog.updateArea(this.editingArea()!.id, {
      name: this.areaForm.name.trim(),
      icon: this.areaForm.icon.trim(),
      description: this.areaForm.description.trim(),
    }, this.auth.currentUser()?.name ?? 'Administrador');
    this.showAreaModal.set(false);
    this.showAlert(`Área "${this.areaForm.name}" actualizada con éxito.`);
  }

  // --- Respaldo ---
  protected downloadBackup(): void {
    const jsonStr = this.catalog.exportBackupJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `respaldo-biblioteca-bastidas-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.showAlert('Archivo de respaldo local generado y descargado.');
  }

  private showAlert(msg: string): void {
    this.alertMessage.set(msg);
    setTimeout(() => {
      this.alertMessage.set(null);
    }, 4500);
  }
}
