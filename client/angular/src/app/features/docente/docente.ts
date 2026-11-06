import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { CatalogService } from '../../core/catalog.service';
import {
  CURRICULAR_AREAS,
  DOCUMENT_FORMATS,
  DOCUMENT_TYPES,
  GRADES,
  areaById,
  gradeLabel,
} from '../../core/curriculum';
import { INSTITUTION } from '../../core/institution';
import type {
  DifficultyLevel,
  LibraryResource,
  ResourceFormat,
  ResourceKind,
  ResourceStatus,
} from '../../core/resources';

type DocenteTab = 'materiales' | 'actividades' | 'catalogo';

@Component({
  selector: 'app-docente',
  imports: [FormsModule],
  templateUrl: './docente.html',
  styleUrl: './docente.scss',
})
export class Docente {
  protected readonly auth = inject(AuthService);
  protected readonly catalog = inject(CatalogService);

  protected readonly institution = INSTITUTION;
  protected readonly areas = CURRICULAR_AREAS;
  protected readonly grades = GRADES;
  protected readonly docTypes = DOCUMENT_TYPES;
  protected readonly docFormats = DOCUMENT_FORMATS;
  protected readonly areaById = areaById;
  protected readonly gradeLabel = gradeLabel;

  protected readonly currentTab = signal<DocenteTab>('materiales');
  protected alertMessage = signal<string | null>(null);

  // --- Filtros ---
  protected materialSearch = signal('');
  protected materialGradeFilter = signal('');
  protected materialStatusFilter = signal('');
  protected catalogSearch = signal('');
  protected catalogAreaFilter = signal('');

  // --- Modales ---
  protected showUploadModal = signal(false);
  protected editingResource = signal<LibraryResource | null>(null);
  protected resourceForm = {
    title: '',
    areaId: 0,
    grade: 1 as 1 | 2 | 3 | 4 | 5,
    format: 'PDF' as ResourceFormat,
    type: 'Guía' as ResourceKind,
    description: '',
    duration: '',
    status: 'publicado' as ResourceStatus,
    fileName: '',
  };

  protected showReplaceFileModal = signal(false);
  protected replacingResource = signal<LibraryResource | null>(null);
  protected newFileName = '';
  protected newFileFormat: ResourceFormat = 'PDF';

  protected showActivityModal = signal(false);
  protected editingActivity = signal<LibraryResource | null>(null);
  protected activityForm = {
    title: '',
    grade: 1 as 1 | 2 | 3 | 4 | 5,
    difficulty: 'Intermedio' as DifficultyLevel,
    duration: '40 min',
    description: '',
    stepsInput: '',
    assignedGrades: [1] as number[],
    status: 'publicado' as ResourceStatus,
  };

  protected showAssignModal = signal(false);
  protected assigningActivity = signal<LibraryResource | null>(null);
  protected selectedGradesForAssign = signal<number[]>([]);

  // Datos del docente conectado
  protected readonly currentTeacher = computed(() => this.auth.currentUser());
  protected readonly teacherArea = computed(() => {
    const areaId = this.currentTeacher()?.areaId;
    return areaId !== undefined ? areaById(areaId) : undefined;
  });

  // Lista de materiales que pertenecen exclusivamente a este docente
  protected readonly myMaterials = computed(() => {
    const username = this.currentTeacher()?.username ?? '';
    const q = this.materialSearch().trim().toLowerCase();
    const grade = this.materialGradeFilter();
    const status = this.materialStatusFilter();

    return this.catalog.teacherResources(username).filter((res) => {
      if (res.type === 'Actividad') return false; // Las actividades tienen su propia pestaña
      const matchQuery = !q || res.title.toLowerCase().includes(q) || res.description.toLowerCase().includes(q);
      const matchGrade = !grade || String(res.grade) === grade;
      const matchStatus = !status || res.status === status;
      return matchQuery && matchGrade && matchStatus;
    });
  });

  // Lista de actividades que pertenecen exclusivamente a este docente
  protected readonly myActivities = computed(() => {
    const username = this.currentTeacher()?.username ?? '';
    return this.catalog.teacherResources(username).filter((res) => res.type === 'Actividad');
  });

  // Catálogo general escolar disponible para consulta del docente
  protected readonly availableCatalog = computed(() => {
    const q = this.catalogSearch().trim().toLowerCase();
    const area = this.catalogAreaFilter();

    return this.catalog.allResourcesList().filter((res) => {
      if (res.status === 'retirado') return false;
      const matchQuery = !q || res.title.toLowerCase().includes(q) || res.author.toLowerCase().includes(q);
      const matchArea = !area || String(res.areaId) === area;
      return matchQuery && matchArea;
    });
  });

  protected setTab(tab: DocenteTab): void {
    this.currentTab.set(tab);
    this.alertMessage.set(null);
  }

  // --- Subir / Editar Material Propio ---
  protected openUploadModal(): void {
    this.editingResource.set(null);
    const defaultArea = this.currentTeacher()?.areaId ?? 0;
    this.resourceForm = {
      title: '',
      areaId: defaultArea,
      grade: 1,
      format: 'PDF',
      type: 'Guía',
      description: '',
      duration: '',
      status: 'publicado',
      fileName: 'material_docente.pdf',
    };
    this.showUploadModal.set(true);
  }

  protected editMyMaterial(res: LibraryResource): void {
    this.editingResource.set(res);
    this.resourceForm = {
      title: res.title,
      areaId: res.areaId,
      grade: res.grade,
      format: res.format,
      type: res.type,
      description: res.description,
      duration: res.duration ?? '',
      status: res.status,
      fileName: res.fileName ?? '',
    };
    this.showUploadModal.set(true);
  }

  protected saveMyMaterial(): void {
    const teacher = this.currentTeacher();
    if (!teacher) return;

    if (!this.resourceForm.title.trim()) {
      alert('Por favor especifica un título para el material.');
      return;
    }

    try {
      if (this.editingResource()) {
        this.catalog.updateTeacherResource(
          this.editingResource()!.id,
          {
            title: this.resourceForm.title.trim(),
            areaId: Number(this.resourceForm.areaId),
            grade: Number(this.resourceForm.grade) as 1 | 2 | 3 | 4 | 5,
            format: this.resourceForm.format,
            type: this.resourceForm.type,
            description: this.resourceForm.description.trim(),
            duration: this.resourceForm.duration.trim() || undefined,
            status: this.resourceForm.status,
            fileName: this.resourceForm.fileName.trim() || undefined,
          },
          teacher,
        );
        this.showAlert(`Material "${this.resourceForm.title}" modificado exitosamente.`);
      } else {
        this.catalog.createTeacherResource(
          {
            title: this.resourceForm.title.trim(),
            areaId: Number(this.resourceForm.areaId),
            grade: Number(this.resourceForm.grade) as 1 | 2 | 3 | 4 | 5,
            format: this.resourceForm.format,
            type: this.resourceForm.type,
            description: this.resourceForm.description.trim(),
            duration: this.resourceForm.duration.trim() || undefined,
            status: this.resourceForm.status,
            fileName: this.resourceForm.fileName.trim() || undefined,
            author: teacher.name,
            featured: false,
          },
          teacher,
        );
        this.showAlert(`Nuevo material subido e integrado a tu colección.`);
      }

      this.showUploadModal.set(false);
    } catch (err: any) {
      alert(err.message || 'Error al guardar');
    }
  }

  protected toggleMyMaterialStatus(res: LibraryResource): void {
    const teacher = this.currentTeacher();
    if (!teacher) return;

    try {
      const nextStatus = res.status === 'publicado' ? 'retirado' : 'publicado';
      this.catalog.setTeacherResourceStatus(res.id, nextStatus, teacher);
      this.showAlert(`El material ha sido ${nextStatus === 'publicado' ? 'publicado' : 'retirado'}.`);
    } catch (err: any) {
      alert(err.message || 'Error');
    }
  }

  protected deleteMyMaterial(res: LibraryResource): void {
    const teacher = this.currentTeacher();
    if (!teacher) return;

    if (confirm(`¿Estás seguro de eliminar "${res.title}" de tus materiales?`)) {
      try {
        this.catalog.deleteTeacherResource(res.id, teacher);
        this.showAlert(`Material eliminado correctamente.`);
      } catch (err: any) {
        alert(err.message || 'Error al eliminar');
      }
    }
  }

  // --- Reemplazar Archivo ---
  protected openReplaceFileModal(res: LibraryResource): void {
    this.replacingResource.set(res);
    this.newFileName = `nuevo_${res.fileName || 'archivo'}`;
    this.newFileFormat = res.format;
    this.showReplaceFileModal.set(true);
  }

  protected confirmReplaceFile(): void {
    const teacher = this.currentTeacher();
    const res = this.replacingResource();
    if (!teacher || !res) return;

    try {
      this.catalog.replaceTeacherFile(res.id, this.newFileName.trim(), this.newFileFormat, teacher);
      this.showAlert(`Archivo de "${res.title}" reemplazado exitosamente.`);
      this.showReplaceFileModal.set(false);
    } catch (err: any) {
      alert(err.message || 'Error al reemplazar');
    }
  }

  // --- Actividades Educativas ---
  protected openActivityModal(): void {
    this.editingActivity.set(null);
    this.activityForm = {
      title: '',
      grade: 1,
      difficulty: 'Intermedio',
      duration: '40 min',
      description: '',
      stepsInput: '1. Lectura del texto propuesto\n2. Resolver preguntas guiadas\n3. Redactar conclusiones',
      assignedGrades: [1],
      status: 'publicado',
    };
    this.showActivityModal.set(true);
  }

  protected editMyActivity(act: LibraryResource): void {
    this.editingActivity.set(act);
    this.activityForm = {
      title: act.title,
      grade: act.grade,
      difficulty: act.difficulty ?? 'Intermedio',
      duration: act.duration ?? '40 min',
      description: act.description,
      stepsInput: (act.steps ?? []).join('\n'),
      assignedGrades: act.assignedGrades ?? [act.grade],
      status: act.status,
    };
    this.showActivityModal.set(true);
  }

  protected saveMyActivity(): void {
    const teacher = this.currentTeacher();
    if (!teacher) return;

    if (!this.activityForm.title.trim()) {
      alert('Por favor indica un título para la actividad.');
      return;
    }

    const steps = this.activityForm.stepsInput
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const defaultArea = teacher.areaId ?? 0;

    try {
      if (this.editingActivity()) {
        this.catalog.updateTeacherResource(
          this.editingActivity()!.id,
          {
            title: this.activityForm.title.trim(),
            grade: this.activityForm.grade,
            difficulty: this.activityForm.difficulty,
            duration: this.activityForm.duration.trim(),
            description: this.activityForm.description.trim(),
            steps,
            assignedGrades: this.activityForm.assignedGrades,
            status: this.activityForm.status,
          },
          teacher,
        );
        this.showAlert(`Actividad "${this.activityForm.title}" actualizada.`);
      } else {
        this.catalog.createTeacherResource(
          {
            title: this.activityForm.title.trim(),
            areaId: defaultArea,
            grade: this.activityForm.grade,
            format: 'PDF',
            type: 'Actividad',
            description: this.activityForm.description.trim(),
            duration: this.activityForm.duration.trim(),
            difficulty: this.activityForm.difficulty,
            steps,
            assignedGrades: this.activityForm.assignedGrades,
            status: this.activityForm.status,
            author: teacher.name,
            featured: false,
          },
          teacher,
        );
        this.showAlert(`Nueva actividad creada y asignada.`);
      }

      this.showActivityModal.set(false);
    } catch (err: any) {
      alert(err.message || 'Error al guardar actividad');
    }
  }

  // --- Asignar Actividad a Grados ---
  protected openAssignModal(act: LibraryResource): void {
    this.assigningActivity.set(act);
    this.selectedGradesForAssign.set([...(act.assignedGrades ?? [act.grade])]);
    this.showAssignModal.set(true);
  }

  protected toggleAssignGrade(grade: number): void {
    const current = new Set(this.selectedGradesForAssign());
    if (current.has(grade)) {
      current.delete(grade);
    } else {
      current.add(grade);
    }
    this.selectedGradesForAssign.set(Array.from(current));
  }

  protected isGradeAssigned(grade: number): boolean {
    return this.selectedGradesForAssign().includes(grade);
  }

  protected confirmAssign(): void {
    const teacher = this.currentTeacher();
    const act = this.assigningActivity();
    if (!teacher || !act) return;

    if (this.selectedGradesForAssign().length === 0) {
      alert('Debes seleccionar al menos un grado para asignar la actividad.');
      return;
    }

    try {
      this.catalog.assignTeacherActivity(act.id, this.selectedGradesForAssign(), teacher);
      this.showAlert(`Actividad asignada a: ${this.selectedGradesForAssign().map(this.gradeLabel).join(', ')}.`);
      this.showAssignModal.set(false);
    } catch (err: any) {
      alert(err.message || 'Error al asignar');
    }
  }

  private showAlert(msg: string): void {
    this.alertMessage.set(msg);
    setTimeout(() => {
      this.alertMessage.set(null);
    }, 4500);
  }
}

