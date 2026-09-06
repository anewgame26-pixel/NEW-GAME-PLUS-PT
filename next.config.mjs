/** @type {import('next').NextConfig} */
const nextConfig = {
  // "Uma Hora Com..." passou a chamar-se "Vale a pena?" — isto garante
  // que quem tiver o link antigo guardado/partilhado (jornais, redes
  // sociais, Google) continua a chegar ao artigo certo, sem 404.
  async redirects() {
    return [
      {
        source: "/uma-hora-com",
        destination: "/vale-a-pena",
        permanent: true,
      },
      {
        source: "/uma-hora-com/:slug",
        destination: "/vale-a-pena/:slug",
        permanent: true,
      },
    ];
  },
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
