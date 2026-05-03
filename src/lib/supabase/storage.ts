import { createServiceClient } from "./server";

/**
 * Supabase Storage bucket yapılandırması.
 * Bu bucket'ları Supabase Dashboard > Storage'tan oluştur (veya `setupBuckets` ile programatik).
 */
export const BUCKETS = {
  /** Firma logoları, kapak fotoğrafları, galeri — public */
  FIRM_MEDIA: "firm-media",
  /** Kullanıcı avatar — public */
  AVATARS: "avatars",
  /** Yorum fotoğrafları — public */
  REVIEW_PHOTOS: "review-photos",
  /** Firma kayıt belgeleri (vergi levhası vb.) — private */
  FIRM_DOCUMENTS: "firm-documents",
  /** Blog kapak görselleri — public */
  BLOG: "blog",
} as const;

export type BucketName = (typeof BUCKETS)[keyof typeof BUCKETS];

/**
 * Bir buket içine dosya yükle, public URL döndür.
 */
export async function uploadFile(opts: {
  bucket: BucketName;
  path: string;
  file: File | Blob | ArrayBuffer | Buffer;
  contentType?: string;
  upsert?: boolean;
}): Promise<{ path: string; publicUrl: string }> {
  const supabase = createServiceClient();
  const { data, error } = await supabase.storage.from(opts.bucket).upload(opts.path, opts.file, {
    contentType: opts.contentType,
    upsert: opts.upsert ?? true,
    cacheControl: "31536000",
  });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data: pub } = supabase.storage.from(opts.bucket).getPublicUrl(data.path);
  return { path: data.path, publicUrl: pub.publicUrl };
}

export async function deleteFile(bucket: BucketName, path: string): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw new Error(`Delete failed: ${error.message}`);
}

/**
 * Yetkilendirilmiş özel dosyalar için zaman sınırlı imzalı URL.
 */
export async function getSignedUrl(
  bucket: BucketName,
  path: string,
  expiresIn = 60 * 10,
): Promise<string> {
  const supabase = createServiceClient();
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn);
  if (error) throw new Error(`Sign failed: ${error.message}`);
  return data.signedUrl;
}

/**
 * Idempotent setup: Buket'leri yoksa oluşturur. Deployment sırasında bir kere çağrılabilir.
 */
export async function setupBuckets(): Promise<void> {
  const supabase = createServiceClient();
  const buckets: Array<{ name: BucketName; isPublic: boolean }> = [
    { name: BUCKETS.FIRM_MEDIA, isPublic: true },
    { name: BUCKETS.AVATARS, isPublic: true },
    { name: BUCKETS.REVIEW_PHOTOS, isPublic: true },
    { name: BUCKETS.FIRM_DOCUMENTS, isPublic: false },
    { name: BUCKETS.BLOG, isPublic: true },
  ];

  for (const b of buckets) {
    const { error } = await supabase.storage.createBucket(b.name, {
      public: b.isPublic,
      fileSizeLimit: 10 * 1024 * 1024,
    });
    if (error && !error.message.includes("already exists")) {
      console.warn(`Bucket ${b.name}: ${error.message}`);
    }
  }
}
