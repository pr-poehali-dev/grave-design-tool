-- Добавление новой ограды Вензель
INSERT INTO t_p8552674_grave_design_tool.materials (id, category, name, price_per_unit, unit, image, material_category) 
VALUES ('venzel', 'fence', 'Вензель', 3000, 'п.м.', 'https://cdn.poehali.dev/files/9cf0d896-ed46-4814-b2b8-2e1fe43bb754.jpg', 'forged')
ON CONFLICT (id) DO NOTHING;