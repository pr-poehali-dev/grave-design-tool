-- Добавление новой ограды Прямоугольник с изображением
INSERT INTO t_p8552674_grave_design_tool.materials (id, category, name, price_per_unit, unit, image, material_category) 
VALUES ('rectangle-pattern', 'fence', 'Прямоугольник', 1600, 'п.м.', 'https://cdn.poehali.dev/files/ddf65e88-38b6-4e2c-8524-9c2680778eca.jpg', 'metal')
ON CONFLICT (id) DO NOTHING;