-- Замена изображения кованой ограды на новое (Дуга)
UPDATE t_p8552674_grave_design_tool.materials 
SET image = 'https://cdn.poehali.dev/files/ced5a75e-f42f-4544-ac36-023cf59e10d6.jpg',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'forged' AND category = 'fence';