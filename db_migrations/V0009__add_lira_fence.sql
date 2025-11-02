-- Добавление новой ограды Лира
INSERT INTO t_p8552674_grave_design_tool.materials (id, category, name, price_per_unit, unit, image, material_category) 
VALUES ('lira', 'fence', 'Лира', 2900, 'п.м.', 'https://cdn.poehali.dev/files/4ba858ec-1002-480a-81d8-9f676359bd5c.jpg', 'forged')
ON CONFLICT (id) DO NOTHING;