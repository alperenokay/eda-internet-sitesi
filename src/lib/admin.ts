import { applicationStatusLabel, isApplicationStatus } from "@/lib/application-status";

export interface AdminBlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  body_md: string;
  cover_image: string | null;
  meta_title: string | null;
  meta_desc: string | null;
  keywords: string | null;
  status: string;
  published_at: Date | null;
  updated_at: Date;
}

export interface BlogPostInput {
  slug: string;
  title: string;
  excerpt: string | null;
  body_md: string;
  cover_image: string | null;
  meta_title: string | null;
  meta_desc: string | null;
  keywords: string | null;
  status: string;
}

export async function fetchAllBlogPostsAdmin(): Promise<AdminBlogPost[]> {
  const { query } = await import("@/lib/db");
  const result = await query<AdminBlogPost>(
    `SELECT id, slug, title, excerpt, body_md, cover_image, meta_title, meta_desc,
            keywords, status, published_at, updated_at
     FROM blog_posts
     ORDER BY updated_at DESC`
  );
  return result.rows;
}

export async function fetchBlogPostByIdAdmin(id: number): Promise<AdminBlogPost | null> {
  const { query } = await import("@/lib/db");
  const result = await query<AdminBlogPost>(
    `SELECT id, slug, title, excerpt, body_md, cover_image, meta_title, meta_desc,
            keywords, status, published_at, updated_at
     FROM blog_posts WHERE id = $1`,
    [id]
  );
  return result.rows[0] ?? null;
}

export async function createBlogPost(input: BlogPostInput): Promise<number> {
  const { query } = await import("@/lib/db");
  const publishedAt = input.status === "published" ? new Date() : null;
  const result = await query<{ id: number }>(
    `INSERT INTO blog_posts
     (slug, title, excerpt, body_md, cover_image, meta_title, meta_desc, keywords, status, published_at, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10, now())
     RETURNING id`,
    [
      input.slug,
      input.title,
      input.excerpt,
      input.body_md,
      input.cover_image,
      input.meta_title,
      input.meta_desc,
      input.keywords,
      input.status,
      publishedAt,
    ]
  );
  return result.rows[0].id;
}

export async function updateBlogPost(id: number, input: BlogPostInput): Promise<void> {
  const { query } = await import("@/lib/db");
  const existing = await fetchBlogPostByIdAdmin(id);
  if (!existing) throw new Error("NOT_FOUND");

  let publishedAt = existing.published_at;
  if (input.status === "published" && !publishedAt) {
    publishedAt = new Date();
  }

  await query(
    `UPDATE blog_posts SET
       slug = $2, title = $3, excerpt = $4, body_md = $5, cover_image = $6,
       meta_title = $7, meta_desc = $8, keywords = $9, status = $10,
       published_at = $11, updated_at = now()
     WHERE id = $1`,
    [
      id,
      input.slug,
      input.title,
      input.excerpt,
      input.body_md,
      input.cover_image,
      input.meta_title,
      input.meta_desc,
      input.keywords,
      input.status,
      publishedAt,
    ]
  );
}

export async function deleteBlogPost(id: number): Promise<boolean> {
  const { query } = await import("@/lib/db");
  const result = await query("DELETE FROM blog_posts WHERE id = $1", [id]);
  return (result.rowCount ?? 0) > 0;
}

export async function slugExists(slug: string, excludeId?: number): Promise<boolean> {
  const { query } = await import("@/lib/db");
  const result = excludeId
    ? await query("SELECT 1 FROM blog_posts WHERE slug = $1 AND id <> $2 LIMIT 1", [slug, excludeId])
    : await query("SELECT 1 FROM blog_posts WHERE slug = $1 LIMIT 1", [slug]);
  return (result.rowCount ?? 0) > 0;
}

export async function fetchAdminDashboardCounts() {
  const { query } = await import("@/lib/db");
  const [analysis, consult, contact, posts] = await Promise.all([
    query<{ count: string }>(
      "SELECT count(*)::text AS count FROM analysis_applications WHERE status = 'new' AND deleted_at IS NULL"
    ),
    query<{ count: string }>(
      "SELECT count(*)::text AS count FROM consultancy_applications WHERE status = 'new' AND deleted_at IS NULL"
    ),
    query<{ count: string }>(
      "SELECT count(*)::text AS count FROM contact_messages WHERE status = 'new' AND deleted_at IS NULL"
    ),
    query<{ count: string }>("SELECT count(*)::text AS count FROM blog_posts"),
  ]);
  return {
    newAnalysis: Number(analysis.rows[0]?.count ?? 0),
    newConsultancy: Number(consult.rows[0]?.count ?? 0),
    newContact: Number(contact.rows[0]?.count ?? 0),
    totalPosts: Number(posts.rows[0]?.count ?? 0),
  };
}

export interface AnalysisApplicationRow {
  id: number;
  analysis_slug: string | null;
  company: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  message: string | null;
  material_type: string | null;
  status: string;
  created_at: Date;
}

export interface ConsultancyApplicationRow {
  id: number;
  company: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  topic: string | null;
  message: string | null;
  status: string;
  created_at: Date;
}

export interface ContactMessageRow {
  id: number;
  full_name: string;
  email: string;
  subject: string | null;
  message: string;
  status: string;
  created_at: Date;
}

export async function fetchAllApplications() {
  const { query } = await import("@/lib/db");
  const [analysis, consult, contact] = await Promise.all([
    query<AnalysisApplicationRow>(
      `SELECT id, analysis_slug, company, full_name, email, phone, message, material_type, status, created_at
       FROM analysis_applications WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT 200`
    ),
    query<ConsultancyApplicationRow>(
      `SELECT id, company, full_name, email, phone, topic, message, status, created_at
       FROM consultancy_applications WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT 200`
    ),
    query<ContactMessageRow>(
      `SELECT id, full_name, email, subject, message, status, created_at
       FROM contact_messages WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT 200`
    ),
  ]);
  return {
    analysis: analysis.rows,
    consultancy: consult.rows,
    contact: contact.rows,
  };
}

export async function updateApplicationStatus(
  table: "analysis" | "consultancy" | "contact",
  id: number,
  status: string
): Promise<boolean> {
  const { query } = await import("@/lib/db");
  const tableName =
    table === "analysis"
      ? "analysis_applications"
      : table === "consultancy"
        ? "consultancy_applications"
        : "contact_messages";
  const result = await query(
    `UPDATE ${tableName} SET status = $2 WHERE id = $1 AND deleted_at IS NULL`,
    [id, status]
  );
  return (result.rowCount ?? 0) > 0;
}

export async function anonymizeApplication(
  table: "analysis" | "consultancy" | "contact",
  id: number
): Promise<boolean> {
  const { query } = await import("@/lib/db");
  const email = `deleted-${id}@anonymized.local`;

  if (table === "analysis") {
    const result = await query(
      `UPDATE analysis_applications SET
         full_name = '[silindi]', email = $2, phone = NULL, company = NULL,
         message = NULL, material_type = NULL, analysis_slug = NULL, ip = NULL,
         deleted_at = now()
       WHERE id = $1 AND deleted_at IS NULL`,
      [id, email]
    );
    return (result.rowCount ?? 0) > 0;
  }

  if (table === "consultancy") {
    const result = await query(
      `UPDATE consultancy_applications SET
         full_name = '[silindi]', email = $2, phone = NULL, company = NULL,
         message = NULL, topic = NULL, ip = NULL, deleted_at = now()
       WHERE id = $1 AND deleted_at IS NULL`,
      [id, email]
    );
    return (result.rowCount ?? 0) > 0;
  }

  const result = await query(
    `UPDATE contact_messages SET
       full_name = '[silindi]', email = $2, subject = NULL, message = '[silindi]',
       ip = NULL, deleted_at = now()
     WHERE id = $1 AND deleted_at IS NULL`,
    [id, email]
  );
  return (result.rowCount ?? 0) > 0;
}

export function formatAdminDate(date: Date): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function statusLabel(status: string): string {
  if (status === "published") return "Yayında";
  if (status === "draft") return "Taslak";
  if (isApplicationStatus(status)) return applicationStatusLabel(status);
  return status;
}
