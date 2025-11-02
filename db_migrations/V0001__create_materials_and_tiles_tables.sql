-- Таблица для плиток
CREATE TABLE IF NOT EXISTS tile_types (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('concrete', 'granite')),
    price_per_unit DECIMAL(10, 2) NOT NULL,
    unit TEXT NOT NULL DEFAULT 'м²',
    image TEXT,
    sizes JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для материалов (поребрики, ограды, памятники)
CREATE TABLE IF NOT EXISTS materials (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL CHECK (category IN ('border', 'fence', 'monument')),
    name TEXT NOT NULL,
    price_per_unit DECIMAL(10, 2) NOT NULL,
    unit TEXT NOT NULL,
    image TEXT,
    material_category TEXT CHECK (material_category IN ('metal', 'granite', 'forged')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_materials_category ON materials(category);
CREATE INDEX IF NOT EXISTS idx_tile_types_category ON tile_types(category);