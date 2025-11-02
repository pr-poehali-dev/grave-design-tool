-- Вставка начальных данных для плиток
INSERT INTO tile_types (id, name, category, price_per_unit, unit, image, sizes) VALUES
('concrete-brick', 'Кирпич', 'concrete', 1200, 'м²', 'https://cdn.poehali.dev/files/305614c6-1798-43b2-852e-8a4c60339435.png', '[0.3, 0.4, 0.5]'),
('concrete-square', 'Квадрат', 'concrete', 1100, 'м²', 'https://cdn.poehali.dev/files/305614c6-1798-43b2-852e-8a4c60339435.png', '[0.3, 0.4, 0.5]'),
('granite-brick', 'Кирпич', 'granite', 2500, 'м²', 'https://cdn.poehali.dev/files/305614c6-1798-43b2-852e-8a4c60339435.png', '[0.3, 0.4]'),
('granite-square', 'Квадрат', 'granite', 2400, 'м²', 'https://cdn.poehali.dev/files/305614c6-1798-43b2-852e-8a4c60339435.png', '[0.3, 0.4]');

-- Вставка начальных данных для материалов
INSERT INTO materials (id, category, name, price_per_unit, unit, image, material_category) VALUES
-- Поребрики
('concrete-border', 'border', 'Поребрик бетонный', 400, 'п.м.', NULL, NULL),
('granite-border', 'border', 'Поребрик гранитный', 1200, 'п.м.', NULL, NULL),

-- Ограды
('metal', 'fence', 'Ограда металлическая', 1500, 'п.м.', 'https://cdn.poehali.dev/files/94216720-503b-4c1e-bfb1-a7ee16afffbb.jpg', 'metal'),
('granite-fence', 'fence', 'Ограда гранитная', 3500, 'п.м.', 'https://cdn.poehali.dev/projects/d12043e2-62fe-468a-8892-3f4a88c29059/files/9ef3624a-5065-424c-ae70-c89f7ff61856.jpg', 'granite'),
('forged', 'fence', 'Ограда кованая', 2800, 'п.м.', 'https://cdn.poehali.dev/files/5bb1ef3a-aacf-4243-b097-771a31f3ffbc.jpg', 'forged'),

-- Памятники
('monument-40x60', 'monument', 'Памятник 40×60 см', 7000, 'шт', NULL, NULL),
('monument-40x80', 'monument', 'Памятник 40×80 см', 8000, 'шт', NULL, NULL),
('monument-45x90', 'monument', 'Памятник 45×90 см', 9000, 'шт', NULL, NULL),
('monument-100x50', 'monument', 'Памятник 100×50 см', 10000, 'шт', NULL, NULL),
('monument-100x60', 'monument', 'Памятник 100×60 см', 11000, 'шт', NULL, NULL),
('monument-120x60', 'monument', 'Памятник 120×60 см', 12000, 'шт', NULL, NULL);
