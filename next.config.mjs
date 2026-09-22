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
    // Por omissão, o Next.js gera até 16 tamanhos diferentes por imagem
    // (8 "de ecrã" + 8 "pequenos"), e cada combinação nova conta como
    // uma transformação no limite da Vercel. Reduzir para um conjunto
    // mais pequeno, escolhido a partir dos tamanhos que o site realmente
    // usa, corta bastante esse número sem perda visível de qualidade.
    deviceSizes: [640, 828, 1200, 1920],
    imageSizes: [64, 128, 256, 384],
    // Mantém cada imagem já transformada em cache muito mais tempo (31
    // dias), para deixar de gastar transformações novas em pedidos
    // repetidos da mesma imagem no mesmo tamanho.
    minimumCacheTTL: 2678400,
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
