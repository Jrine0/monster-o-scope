import { apiClient } from "@/lib/api-client";

/* ─────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────── */

export interface StudentUser {
  id: string;
  email: string | null;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  school_id: string | null;
  roles: string[];
  is_active: boolean;
  is_verified: boolean;
  is_onboarded: boolean;
  is_superuser: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  student_id: string | null;
}

export interface SubtopicSummary {
  id: string;
  title: string;
  display_order: number;
}

export interface ChapterSummary {
  id: string;
  chapter_number: number;
  title: string;
  description: string | null;
  display_order: number;
  subtopics: SubtopicSummary[];
}

export interface SubjectTree {
  subject: string;
  chapters: ChapterSummary[];
}

export interface GradeTree {
  grade: number;
  subjects: SubjectTree[];
}

export interface LibraryItemSummary {
  id: string;
  subtopic_id: string;
  subtopic_title: string;
  content_type: string;
  title: string;
  mime_type: string;
  language: string;
  version: number;
  is_current: boolean;
  is_published: boolean;
  tags: unknown[];
  published_at: string | null;
  created_at: string;
}

export interface LibraryItemDetail extends LibraryItemSummary {
  description: string | null;
  file_size_bytes: number;
  metadata: Record<string, unknown>;
  version_notes: string | null;
  superseded_by_id: string | null;
  download_url: string;
}

export interface AccessedLibraryItem {
  id: string;
  title: string;
  content_type: string;
  mime_type: string;
  subtopic_id: string;
  subtopic_title: string;
  language: string;
  is_published: boolean;
  published_at: string | null;
}

export interface AccessedMaterial {
  id: string;
  title: string;
  content_type: string;
  source_type: string;
  notes: string | null;
  is_deleted: boolean;
}

export interface StudentAccessedContent {
  access_id: string;
  accessed_at: string;
  last_accessed_at: string;
  source_type: string;
  progress_type: string;
  progress: Record<string, unknown> | null;
  library_item: AccessedLibraryItem | null;
  material: AccessedMaterial | null;
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
}

export interface UserUpdate {
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}

/* ─────────────────────────────────────────────────────────
   Auth
───────────────────────────────────────────────────────── */

/** GET /auth/me */
export async function fetchMe(): Promise<StudentUser> {
  const res = await apiClient.get<{ data: StudentUser }>("/auth/me");
  return res.data.data;
}

/** PATCH /auth/me */
export async function updateMe(data: UserUpdate): Promise<StudentUser> {
  const res = await apiClient.patch<{ data: StudentUser }>("/auth/me", data);
  return res.data.data;
}

/* ─────────────────────────────────────────────────────────
   Library Structure (public — no auth required)
───────────────────────────────────────────────────────── */

/** GET /v1/library/structure */
export async function fetchLibraryStructure(): Promise<GradeTree[]> {
  const res = await apiClient.get<{ data: { grades: GradeTree[] } }>(
    "/v1/library/structure",
  );
  return res.data.data.grades;
}

/* ─────────────────────────────────────────────────────────
   Library Content
───────────────────────────────────────────────────────── */

export interface ListContentParams {
  grade?: number;
  subject?: string;
  chapter_id?: string;
  subtopic_id?: string;
  content_type?: string;
  page?: number;
  per_page?: number;
}

/** GET /v1/library/content */
export async function listLibraryContent(params: ListContentParams = {}) {
  const res = await apiClient.get<{
    data: LibraryItemSummary[];
    meta: PaginationMeta;
  }>("/v1/library/content", { params });
  return res.data;
}

/** GET /v1/library/content/{item_id} */
export async function getLibraryItem(
  itemId: string,
): Promise<LibraryItemDetail> {
  const res = await apiClient.get<{ data: LibraryItemDetail }>(
    `/v1/library/content/${itemId}`,
  );
  return res.data.data;
}

export interface DownloadUrl {
  download_url: string;
  expires_at: string;
}

/** GET /v1/library/content/{item_id}/download?format=pdf|docx */
export async function getLibraryDownloadUrl(
  itemId: string,
  format: "pdf" | "docx",
): Promise<DownloadUrl> {
  const res = await apiClient.get<{ data: DownloadUrl }>(
    `/v1/library/content/${itemId}/download`,
    { params: { format } },
  );
  return res.data.data;
}

/* ─────────────────────────────────────────────────────────
   Student Content History
───────────────────────────────────────────────────────── */

export interface AccessedContentParams {
  page?: number;
  per_page?: number;
  source_type?: string;
  content_type?: string;
}

/** GET /v1/students/me/accessed-content */
export async function listAccessedContent(
  params: AccessedContentParams = {},
) {
  const res = await apiClient.get<{
    data: StudentAccessedContent[];
    meta: PaginationMeta;
  }>("/v1/students/me/accessed-content", { params });
  return res.data;
}
