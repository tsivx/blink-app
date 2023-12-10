import { Database } from "./supabase";

export interface AvtorTeacher {
  teacher_name: string;
}

export interface AvtorAuditory {
  auditory_name: string;
}

export interface AvtorLesson {
  subject: string;
  type: string;
  subgroup: number;
  time_start: string;
  time_end: string;
  time: number;
  week: number;
  date: string;
  teachers: AvtorTeacher[];
  auditories: AvtorAuditory[];
}

export interface AvtorDay {
  weekday: number;
  lessons?: AvtorLesson[];
}

export interface AvtorGroup {
  group_name: string;
  course: number;
  faculty: string;
  changes: number;
  days: AvtorDay[];
}

export interface AvtorWeek {
  week_number: number;
  date_start: string;
  date_end: string;
  groups: AvtorGroup[];
}

export type AvtorTimetable = {
  timetable: AvtorWeek[]
}

export type LessonRow = Database['public']['Tables']['lessons']['Row'];
export type WeekRow = Database['public']['Tables']['weeks']['Row'];
export type GroupRow = Database['public']['Tables']['groups']['Row'];
export type TeacherRow = Database['public']['Tables']['teachers']['Row'];
export type AuditoryRow = Database['public']['Tables']['auditories']['Row'];
export type CollegeRow = Database['public']['Tables']['colleges']['Row'];

export interface ExtendedGroupRow extends GroupRow {
  college?: CollegeRow; 
}
export interface ExtendedTeacherRow extends TeacherRow {
  college?: CollegeRow; 
}
export interface ExtendedAuditoryRow extends AuditoryRow {
  college?: CollegeRow; 
}

export interface SubgroupItem {
  number?: number,
  teacher?: TeacherRow,
  auditory?: AuditoryRow,
  group?: GroupRow,
}

export interface ExtendedLessonRow extends LessonRow {
  teacher?: TeacherRow,
  auditory?: AuditoryRow,
  group?: GroupRow,
  subgroups?: SubgroupItem[],
}

export type Weekday = { date: string; lessons: ExtendedLessonRow[] }

export type Entity = GroupRow & TeacherRow & AuditoryRow