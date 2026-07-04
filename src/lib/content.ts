import { query } from "@/lib/db";
import {
  CONTENT_DEFAULTS,
  CONTENT_REGISTRY,
  type ContentKey,
  type ContentMap,
  type GlobalContent,
  isContentKey,
} from "@/lib/content-defaults";
import { SITE_URL, BRAND_SHORT } from "@/lib/site";

interface SiteContentRow {
  content_key: string;
  data: unknown;
  updated_at: Date;
}

export type SiteInfo = {
  url: string;
  domain: string;
  apexDomain: string;
  brandShort: string;
  brandFull: string;
  attorney: string;
  email: string;
  phone: string;
  address: string;
  mapEmbedUrl: string;
  mapsDirectionsUrl: string;
  workingHours: string;
  cities: string[];
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Varsayılanları koruyarak DB verisini birleştirir. Diziler tamamen override edilir. */
export function mergeContent<T>(defaults: T, stored: unknown): T {
  if (stored === null || stored === undefined) return defaults;
  if (Array.isArray(defaults)) {
    return (Array.isArray(stored) ? stored : defaults) as T;
  }
  if (!isPlainObject(defaults) || !isPlainObject(stored)) {
    return (stored as T) ?? defaults;
  }
  const result: Record<string, unknown> = { ...defaults };
  for (const key of Object.keys(stored)) {
    const defVal = (defaults as Record<string, unknown>)[key];
    const storedVal = stored[key];
    if (Array.isArray(defVal)) {
      result[key] = Array.isArray(storedVal) ? storedVal : defVal;
    } else if (isPlainObject(defVal) && isPlainObject(storedVal)) {
      result[key] = mergeContent(defVal, storedVal);
    } else if (storedVal !== undefined) {
      result[key] = storedVal;
    }
  }
  return result as T;
}

async function fetchStoredContent(key: ContentKey): Promise<unknown | null> {
  try {
    const result = await query<SiteContentRow>(
      "SELECT data FROM site_content WHERE content_key = $1 LIMIT 1",
      [key]
    );
    return result.rows[0]?.data ?? null;
  } catch (err) {
    console.warn(`[content] ${key} okunamadı:`, err);
    return null;
  }
}

export async function getContent<K extends ContentKey>(key: K): Promise<ContentMap[K]> {
  const defaults = CONTENT_DEFAULTS[key];
  const stored = await fetchStoredContent(key);
  return mergeContent(defaults, stored);
}

export async function getSite(): Promise<SiteInfo> {
  const global = await getContent("global");
  return buildSiteFromGlobal(global);
}

export function buildSiteFromGlobal(global: GlobalContent): SiteInfo {
  return {
    url: SITE_URL,
    domain: "www.sagirhukuk.net",
    apexDomain: "sagirhukuk.net",
    brandShort: BRAND_SHORT,
    brandFull: global.brandFull,
    attorney: global.attorney,
    email: global.email,
    phone: global.phone,
    address: global.address,
    mapEmbedUrl: global.mapEmbedUrl,
    mapsDirectionsUrl: global.mapsDirectionsUrl,
    workingHours: global.workingHours,
    cities: ["İzmir"],
  };
}

export interface ContentListItem {
  key: ContentKey;
  label: string;
  description: string;
  publicPath?: string;
  updatedAt: Date | null;
}

export async function listContentForAdmin(): Promise<ContentListItem[]> {
  let updatedMap = new Map<string, Date>();
  try {
    const result = await query<{ content_key: string; updated_at: Date }>(
      "SELECT content_key, updated_at FROM site_content ORDER BY content_key"
    );
    updatedMap = new Map(result.rows.map((row) => [row.content_key, row.updated_at]));
  } catch (err) {
    console.warn("[content] liste okunamadı:", err);
  }

  return (Object.keys(CONTENT_REGISTRY) as ContentKey[]).map((key) => ({
    key,
    label: CONTENT_REGISTRY[key].label,
    description: CONTENT_REGISTRY[key].description,
    publicPath: CONTENT_REGISTRY[key].publicPath,
    updatedAt: updatedMap.get(key) ?? null,
  }));
}

export async function saveContent(
  key: ContentKey,
  data: unknown,
  adminId: number
): Promise<void> {
  const defaults = CONTENT_DEFAULTS[key];
  const merged = mergeContent(defaults, data);
  await query(
    `INSERT INTO site_content (content_key, data, updated_at, updated_by)
     VALUES ($1, $2::jsonb, now(), $3)
     ON CONFLICT (content_key) DO UPDATE
     SET data = EXCLUDED.data, updated_at = now(), updated_by = EXCLUDED.updated_by`,
    [key, JSON.stringify(merged), adminId]
  );
}

export function parseContentKey(raw: string | undefined): ContentKey | null {
  if (!raw || !isContentKey(raw)) return null;
  return raw;
}

export function applyKvkkPlaceholders(
  md: string,
  vars: Record<string, string>
): string {
  let out = md;
  for (const [name, value] of Object.entries(vars)) {
    out = out.replaceAll(`{{${name}}}`, value);
  }
  return out;
}
