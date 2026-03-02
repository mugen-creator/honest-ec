import { Product, Category, Brand } from "@/types/product";

export const categories: Category[] = [
  { id: "cat-1", name: "時計", slug: "watches" },
  { id: "cat-2", name: "バッグ", slug: "bags" },
  { id: "cat-3", name: "アクセサリー", slug: "accessories" },
];

export const brands: Brand[] = [
  { id: "brand-1", name: "ROLEX", slug: "rolex" },
  { id: "brand-2", name: "OMEGA", slug: "omega" },
  { id: "brand-3", name: "LOUIS VUITTON", slug: "louis-vuitton" },
  { id: "brand-4", name: "HERMES", slug: "hermes" },
  { id: "brand-5", name: "CHANEL", slug: "chanel" },
  { id: "brand-6", name: "CARTIER", slug: "cartier" },
];

export const mockProducts: Product[] = [
  {
    id: "prod-1",
    name: "ROLEX デイトナ 116500LN ホワイト",
    description: `ロレックスの代名詞ともいえるコスモグラフ デイトナ。
2016年に発表された現行モデル116500LNは、セラクロムベゼルを採用し、
傷がつきにくく退色しないという特徴を持っています。

ホワイトダイアルはスポーティーでありながらエレガントな印象を与え、
ビジネスシーンからカジュアルまで幅広いシーンで活躍します。

【付属品】
- 箱
- 保証書（2023年購入）
- コマ調整用リンク`,
    price: 5980000,
    brand: brands[0],
    category: categories[0],
    condition: "A",
    serialNumber: "7XXXXXXX",
    certificate: "ロレックス正規店保証書付き",
    stock: 1,
    isPublished: true,
    images: [
      {
        id: "img-1-1",
        url: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800",
        alt: "ROLEX デイトナ 正面",
        sortOrder: 0,
      },
      {
        id: "img-1-2",
        url: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800",
        alt: "ROLEX デイトナ 側面",
        sortOrder: 1,
      },
    ],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "prod-2",
    name: "OMEGA スピードマスター プロフェッショナル",
    description: `1969年、人類初の月面着陸で着用された伝説的なタイムピース。
NASA公認の宇宙飛行士用腕時計として、その信頼性は折り紙付きです。

手巻きキャリバー1861を搭載し、クラシカルな魅力を今に伝えます。

【付属品】
- 箱
- 保証書
- 取扱説明書`,
    price: 780000,
    brand: brands[1],
    category: categories[0],
    condition: "S",
    serialNumber: null,
    certificate: "オメガ正規代理店保証書付き",
    stock: 1,
    isPublished: true,
    images: [
      {
        id: "img-2-1",
        url: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800",
        alt: "OMEGA スピードマスター",
        sortOrder: 0,
      },
    ],
    createdAt: "2024-01-14T10:00:00Z",
    updatedAt: "2024-01-14T10:00:00Z",
  },
  {
    id: "prod-3",
    name: "LOUIS VUITTON ネヴァーフル MM モノグラム",
    description: `ルイ・ヴィトンを代表するトートバッグ「ネヴァーフル」。
その名の通り、たくさん入れても満杯にならない大容量が魅力です。

モノグラム・キャンバスは耐久性に優れ、長くご愛用いただけます。
サイドのレースを絞ることでシルエットの変化も楽しめます。

【付属品】
- 保存袋
- ポーチ`,
    price: 198000,
    brand: brands[2],
    category: categories[1],
    condition: "A",
    serialNumber: null,
    certificate: null,
    stock: 1,
    isPublished: true,
    images: [
      {
        id: "img-3-1",
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800",
        alt: "LOUIS VUITTON ネヴァーフル",
        sortOrder: 0,
      },
    ],
    createdAt: "2024-01-13T10:00:00Z",
    updatedAt: "2024-01-13T10:00:00Z",
  },
  {
    id: "prod-4",
    name: "HERMES バーキン 25 トゴ ゴールド",
    description: `エルメスの最高峰バッグ「バーキン」の25cmサイズ。
上質なトゴレザーを使用し、適度な硬さとしなやかさを兼ね備えています。

ゴールドカラーは定番中の定番で、どんなコーディネートにも合わせやすく、
長く愛用できる一生もののバッグです。

【付属品】
- 箱
- 保存袋
- カデナ
- クロシェット
- レインカバー`,
    price: 2580000,
    brand: brands[3],
    category: categories[1],
    condition: "NEW",
    serialNumber: null,
    certificate: "エルメス正規店レシート付き",
    stock: 1,
    isPublished: true,
    images: [
      {
        id: "img-4-1",
        url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800",
        alt: "HERMES バーキン",
        sortOrder: 0,
      },
    ],
    createdAt: "2024-01-12T10:00:00Z",
    updatedAt: "2024-01-12T10:00:00Z",
  },
  {
    id: "prod-5",
    name: "CARTIER ラブブレスレット イエローゴールド",
    description: `カルティエのアイコン的存在「ラブブレスレット」。
専用のドライバーでネジを締めて装着するユニークなデザインは、
永遠の愛の象徴として世界中で愛されています。

18Kイエローゴールドの温かみのある輝きが手元を上品に彩ります。

【付属品】
- 箱
- 保証書
- ドライバー`,
    price: 850000,
    brand: brands[5],
    category: categories[2],
    condition: "A",
    serialNumber: null,
    certificate: "カルティエ国際保証書付き",
    stock: 1,
    isPublished: true,
    images: [
      {
        id: "img-5-1",
        url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800",
        alt: "CARTIER ラブブレスレット",
        sortOrder: 0,
      },
    ],
    createdAt: "2024-01-11T10:00:00Z",
    updatedAt: "2024-01-11T10:00:00Z",
  },
  {
    id: "prod-6",
    name: "CHANEL マトラッセ チェーンショルダー ラムスキン",
    description: `シャネルを代表するマトラッセシリーズのチェーンショルダーバッグ。
柔らかなラムスキンに施されたキルティングステッチが特徴的です。

CCターンロックとチェーンストラップはゴールドカラーで統一され、
エレガントな装いを演出します。

【付属品】
- 箱
- 保存袋
- ギャランティカード`,
    price: 680000,
    brand: brands[4],
    category: categories[1],
    condition: "B",
    serialNumber: null,
    certificate: null,
    stock: 1,
    isPublished: true,
    images: [
      {
        id: "img-6-1",
        url: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800",
        alt: "CHANEL マトラッセ",
        sortOrder: 0,
      },
    ],
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
  },
];

export function getProductById(id: string): Product | undefined {
  return mockProducts.find((p) => p.id === id);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return mockProducts.filter((p) => p.category.slug === categorySlug && p.isPublished);
}

export function getProductsByBrand(brandSlug: string): Product[] {
  return mockProducts.filter((p) => p.brand.slug === brandSlug && p.isPublished);
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return mockProducts.filter(
    (p) =>
      p.isPublished &&
      (p.name.toLowerCase().includes(lowerQuery) ||
        p.brand.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery))
  );
}
