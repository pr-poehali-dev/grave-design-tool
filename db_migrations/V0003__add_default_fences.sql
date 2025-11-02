-- Добавление стандартных оград в базу данных
INSERT INTO t_p8552674_grave_design_tool.materials (id, category, name, price_per_unit, unit, image, material_category) 
VALUES 
  ('metal', 'fence', 'Ограда металлическая', 1500, 'п.м.', 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=400&h=300&fit=crop', 'metal'),
  ('rectangle', 'fence', 'Прямоугольник', 1600, 'п.м.', 'https://cdn.poehali.dev/files/e119c09c-972b-45cc-8386-59e231618a23.jpg', 'metal'),
  ('granite-fence', 'fence', 'Ограда гранитная', 3500, 'п.м.', 'https://images.unsplash.com/photo-1603042891252-f8499fc1fe48?w=400&h=300&fit=crop', 'granite'),
  ('forged', 'fence', 'Ограда кованая', 2800, 'п.м.', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', 'forged')
ON CONFLICT (id) DO NOTHING;