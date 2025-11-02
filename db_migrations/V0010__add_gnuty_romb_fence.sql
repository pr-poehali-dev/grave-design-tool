-- Добавление новой ограды Гнутый ромб
INSERT INTO t_p8552674_grave_design_tool.materials (id, category, name, price_per_unit, unit, image, material_category) 
VALUES ('gnuty-romb', 'fence', 'Гнутый ромб', 1800, 'п.м.', 'https://cdn.poehali.dev/files/0120f3c3-5d02-45bf-96c7-ba60a25ff5d6.jpg', 'metal')
ON CONFLICT (id) DO NOTHING;