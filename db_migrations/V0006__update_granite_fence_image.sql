-- Замена изображения гранитной ограды на новое (Ромб)
UPDATE t_p8552674_grave_design_tool.materials 
SET image = 'https://cdn.poehali.dev/files/a32799bc-bea3-44be-a58a-4e12439316b7.jpg',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'granite-fence' AND category = 'fence';