-- Добавление новой ограды Волна
INSERT INTO t_p8552674_grave_design_tool.materials (id, category, name, price_per_unit, unit, image, material_category) 
VALUES ('volna', 'fence', 'Волна', 2800, 'п.м.', 'https://cdn.poehali.dev/files/8aea57c6-1f38-40ba-9af6-274ccf49fa5a.jpg', 'forged')
ON CONFLICT (id) DO NOTHING;