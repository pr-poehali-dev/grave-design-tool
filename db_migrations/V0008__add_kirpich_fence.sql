-- Добавление новой ограды Кирпич
INSERT INTO t_p8552674_grave_design_tool.materials (id, category, name, price_per_unit, unit, image, material_category) 
VALUES ('kirpich', 'fence', 'Кирпич', 1700, 'п.м.', 'https://cdn.poehali.dev/files/9cda7993-213d-4373-80ef-1a66fa890e94.jpg', 'metal')
ON CONFLICT (id) DO NOTHING;