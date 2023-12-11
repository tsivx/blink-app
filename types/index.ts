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

export type Weekday = { date: string; lessons: ExtendedLessonRow[] };

export type LessonRow = Database['public']['Tables']['lessons']['Row'];
export type CollegeRow = Database['public']['Tables']['colleges']['Row'];
export type _ProfileRow = Database['public']['Tables']['profiles']['Row'];

export interface ProfileRow extends _ProfileRow {
  pinned?: boolean;
}

export interface SubgroupItem {
  number?: number,
  teacher?: ProfileRow,
  auditory?: ProfileRow,
  group?: ProfileRow,
}

export interface ExtendedLessonRow extends LessonRow {
  teacher?: ProfileRow,
  auditory?: ProfileRow,
  group?: ProfileRow,
  subgroups?: SubgroupItem[],
}
