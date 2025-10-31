export interface Material {
  id: string;
  name: string;
  pricePerUnit: number;
  unit: string;
  image?: string;
  category?: 'metal' | 'granite' | 'forged';
}

export interface TileType {
  id: string;
  name: string;
  category: 'concrete' | 'granite';
  pricePerUnit: number;
  unit: string;
  image: string;
  sizes: number[];
}

export const initialTileTypes: TileType[] = [
  { 
    id: 'concrete-brick', 
    name: 'Кирпич', 
    category: 'concrete',
    pricePerUnit: 1200, 
    unit: 'м²',
    image: 'https://cdn.poehali.dev/files/305614c6-1798-43b2-852e-8a4c60339435.png',
    sizes: [0.3, 0.4, 0.5]
  },
  { 
    id: 'concrete-square', 
    name: 'Квадрат', 
    category: 'concrete',
    pricePerUnit: 1100, 
    unit: 'м²',
    image: 'https://cdn.poehali.dev/files/305614c6-1798-43b2-852e-8a4c60339435.png',
    sizes: [0.3, 0.4, 0.5]
  },
  { 
    id: 'granite-brick', 
    name: 'Кирпич', 
    category: 'granite',
    pricePerUnit: 2500, 
    unit: 'м²',
    image: 'https://cdn.poehali.dev/files/305614c6-1798-43b2-852e-8a4c60339435.png',
    sizes: [0.3, 0.4]
  },
  { 
    id: 'granite-square', 
    name: 'Квадрат', 
    category: 'granite',
    pricePerUnit: 2400, 
    unit: 'м²',
    image: 'https://cdn.poehali.dev/files/305614c6-1798-43b2-852e-8a4c60339435.png',
    sizes: [0.3, 0.4]
  },
];

export const initialMaterials: Record<string, Material[]> = {
  border: [
    { id: 'concrete-border', name: 'Поребрик бетонный', pricePerUnit: 400, unit: 'п.м.' },
    { id: 'granite-border', name: 'Поребрик гранитный', pricePerUnit: 1200, unit: 'п.м.' },
  ],
  fence: [
    { id: 'metal', name: 'Ограда металлическая', pricePerUnit: 1500, unit: 'п.м.', image: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=200&h=200&fit=crop', category: 'metal' },
    { id: 'granite-fence', name: 'Ограда гранитная', pricePerUnit: 3500, unit: 'п.м.', image: 'https://images.unsplash.com/photo-1603042891252-f8499fc1fe48?w=200&h=200&fit=crop', category: 'granite' },
    { id: 'forged', name: 'Ограда кованая', pricePerUnit: 2800, unit: 'п.м.', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop', category: 'forged' },
  ],
  monument: [
    { id: 'monument-40x60', name: 'Памятник 40×60 см', pricePerUnit: 7000, unit: 'шт' },
    { id: 'monument-40x80', name: 'Памятник 40×80 см', pricePerUnit: 8000, unit: 'шт' },
    { id: 'monument-45x90', name: 'Памятник 45×90 см', pricePerUnit: 9000, unit: 'шт' },
    { id: 'monument-100x50', name: 'Памятник 100×50 см', pricePerUnit: 10000, unit: 'шт' },
    { id: 'monument-100x60', name: 'Памятник 100×60 см', pricePerUnit: 11000, unit: 'шт' },
    { id: 'monument-120x60', name: 'Памятник 120×60 см', pricePerUnit: 12000, unit: 'шт' },
  ],
};
