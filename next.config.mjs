/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "images.igdb.com",
      },
      {
        // Fotos anexadas pelo admin, guardadas no Supabase Storage
        // (ex: https://<projeto>.supabase.co/storage/v1/object/public/...)
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
