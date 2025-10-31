import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Material {
  id: string;
  name: string;
  pricePerUnit: number;
  unit: string;
  image?: string;
  category?: 'metal' | 'granite' | 'forged';
}

interface TileType {
  id: string;
  name: string;
  category: 'concrete' | 'granite';
  pricePerUnit: number;
  unit: string;
  image: string;
  sizes: number[];
}

const initialTileTypes: TileType[] = [
  { 
    id: 'concrete-brick', 
    name: 'Кирпич', 
    category: 'concrete',
    pricePerUnit: 1200, 
    unit: 'м²',
    image: 'https://cdn.poehali.dev/files/305614c6-1798-43b2-852e-8a4c60339435.png',
    sizes: [0.3, 0.4, 0.5]
  },
  { 
    id: 'concrete-square', 
    name: 'Квадрат', 
    category: 'concrete',
    pricePerUnit: 1100, 
    unit: 'м²',
    image: 'https://cdn.poehali.dev/files/305614c6-1798-43b2-852e-8a4c60339435.png',
    sizes: [0.3, 0.4, 0.5]
  },
  { 
    id: 'granite-brick', 
    name: 'Кирпич', 
    category: 'granite',
    pricePerUnit: 2500, 
    unit: 'м²',
    image: 'https://cdn.poehali.dev/files/305614c6-1798-43b2-852e-8a4c60339435.png',
    sizes: [0.3, 0.4]
  },
  { 
    id: 'granite-square', 
    name: 'Квадрат', 
    category: 'granite',
    pricePerUnit: 2400, 
    unit: 'м²',
    image: 'https://cdn.poehali.dev/files/305614c6-1798-43b2-852e-8a4c60339435.png',
    sizes: [0.3, 0.4]
  },
];

const initialMaterials: Record<string, Material[]> = {
  border: [
    { id: 'concrete-border', name: 'Поребрик бетонный', pricePerUnit: 400, unit: 'п.м.' },
    { id: 'granite-border', name: 'Поребрик гранитный', pricePerUnit: 1200, unit: 'п.м.' },
  ],
  fence: [
    { id: 'metal', name: 'Ограда металлическая', pricePerUnit: 1500, unit: 'п.м.', image: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=400&h=300&fit=crop', category: 'metal' },
    { id: 'granite-fence', name: 'Ограда гранитная', pricePerUnit: 3500, unit: 'п.м.', image: 'https://images.unsplash.com/photo-1603042891252-f8499fc1fe48?w=400&h=300&fit=crop', category: 'granite' },
    { id: 'forged', name: 'Ограда кованая', pricePerUnit: 2800, unit: 'п.м.', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', category: 'forged' },
  ],
  monument: [
    { id: 'monument-40x60', name: 'Памятник 40×60 см', pricePerUnit: 7000, unit: 'шт' },
    { id: 'monument-40x80', name: 'Памятник 40×80 см', pricePerUnit: 8000, unit: 'шт' },
    { id: 'monument-45x90', name: 'Памятник 45×90 см', pricePerUnit: 9000, unit: 'шт' },
    { id: 'monument-100x50', name: 'Памятник 100×50 см', pricePerUnit: 10000, unit: 'шт' },
    { id: 'monument-100x60', name: 'Памятник 100×60 см', pricePerUnit: 11000, unit: 'шт' },
    { id: 'monument-120x60', name: 'Памятник 120×60 см', pricePerUnit: 12000, unit: 'шт' },
  ],
};

const Admin = () => {
  const [tileTypes, setTileTypes] = useState<TileType[]>([]);
  const [materials, setMaterials] = useState<Record<string, Material[]>>(initialMaterials);
  const [editingTileId, setEditingTileId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedTiles = localStorage.getItem('tileTypes');
    if (savedTiles) {
      setTileTypes(JSON.parse(savedTiles));
    } else {
      setTileTypes(initialTileTypes);
    }

    const savedMaterials = localStorage.getItem('materials');
    if (savedMaterials) {
      const parsed = JSON.parse(savedMaterials);
      console.log('📦 Admin: Загружены материалы из localStorage:', parsed);
      setMaterials(parsed);
    } else {
      console.log('📦 Admin: Использую начальные материалы:', initialMaterials);
      setMaterials(initialMaterials);
    }
  }, []);

  const handleTileChange = (id: string, field: keyof TileType, value: any) => {
    setTileTypes(prev => prev.map(tile =>
      tile.id === id ? { ...tile, [field]: value } : tile
    ));
  };

  const handleAddSize = (tileId: string, size: number) => {
    setTileTypes(prev => prev.map(tile =>
      tile.id === tileId ? { ...tile, sizes: [...tile.sizes, size].sort((a, b) => a - b) } : tile
    ));
  };

  const handleRemoveSize = (tileId: string, sizeIndex: number) => {
    setTileTypes(prev => prev.map(tile =>
      tile.id === tileId ? { ...tile, sizes: tile.sizes.filter((_, i) => i !== sizeIndex) } : tile
    ));
  };

  const handleAddTile = () => {
    const newId = `tile-${Date.now()}`;
    const newTile: TileType = {
      id: newId,
      name: 'Новая плитка',
      category: 'concrete',
      pricePerUnit: 1000,
      unit: 'м²',
      image: 'https://cdn.poehali.dev/files/305614c6-1798-43b2-852e-8a4c60339435.png',
      sizes: [0.4]
    };
    
    setTileTypes(prev => [...prev, newTile]);
    setEditingTileId(newId);
  };

  const handleDeleteTile = (id: string) => {
    if (tileTypes.length <= 1) {
      toast({
        title: 'Невозможно удалить',
        description: 'Должна остаться хотя бы одна плитка',
        variant: 'destructive',
      });
      return;
    }
    
    setTileTypes(prev => prev.filter(tile => tile.id !== id));
    
    toast({
      title: 'Плитка удалена',
      description: 'Плитка успешно удалена из списка',
    });
  };

  const handleSaveTiles = () => {
    localStorage.setItem('tileTypes', JSON.stringify(tileTypes));
    setEditingTileId(null);
    
    toast({
      title: 'Изменения сохранены',
      description: 'Плитки успешно обновлены',
    });
  };

  const handlePriceChange = (category: string, id: string, newPrice: number) => {
    setMaterials(prev => ({
      ...prev,
      [category]: prev[category].map(item =>
        item.id === id ? { ...item, pricePerUnit: newPrice } : item
      ),
    }));
  };

  const handleNameChange = (category: string, id: string, newName: string) => {
    setMaterials(prev => ({
      ...prev,
      [category]: prev[category].map(item =>
        item.id === id ? { ...item, name: newName } : item
      ),
    }));
  };

  const handleAddMaterial = (category: string) => {
    const newId = `new-${Date.now()}`;
    const newMaterial: Material = {
      id: newId,
      name: 'Новый материал',
      pricePerUnit: 0,
      unit: 'п.м.',
      ...(category === 'fence' && { category: 'metal' as const, image: 'https://cdn.poehali.dev/files/305614c6-1798-43b2-852e-8a4c60339435.png' })
    };
    
    setMaterials(prev => ({
      ...prev,
      [category]: [...prev[category], newMaterial],
    }));
    
    setEditingId(newId);
    setEditingCategory(category);
  };

  const handleDeleteMaterial = (category: string, id: string) => {
    if (materials[category].length <= 1) {
      toast({
        title: 'Невозможно удалить',
        description: 'Должен остаться хотя бы один материал в категории',
        variant: 'destructive',
      });
      return;
    }
    
    setMaterials(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item.id !== id),
    }));
    
    toast({
      title: 'Материал удалён',
      description: 'Материал успешно удалён из списка',
    });
  };

  const handleSaveMaterials = () => {
    localStorage.setItem('materials', JSON.stringify(materials));
    setEditingId(null);
    setEditingCategory(null);
    
    toast({
      title: 'Изменения сохранены',
      description: 'Материалы успешно обновлены',
    });
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'border': return 'Поребрики';
      case 'fence': return 'Ограды';
      case 'monument': return 'Памятники';
      default: return category;
    }
  };

  const renderTileManager = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Управление плитками</h3>
        <Button onClick={handleAddTile} size="sm" className="gap-2">
          <Icon name="Plus" size={16} />
          Добавить плитку
        </Button>
      </div>
      
      <div className="grid gap-6">
        {tileTypes.map((tile) => (
          <Card key={tile.id} className={editingTileId === tile.id ? 'border-2 border-indigo-500' : ''}>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <img 
                      src={tile.image} 
                      alt={tile.name}
                      className="w-40 h-40 rounded-lg shadow-md object-cover border-2 border-gray-200"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Изображение плитки</Label>
                    <div className="flex gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              handleTileChange(tile.id, 'image', reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="cursor-pointer"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Выберите файл изображения (JPG, PNG)
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Или введите URL</Label>
                    <Input
                      value={tile.image}
                      onChange={(e) => handleTileChange(tile.id, 'image', e.target.value)}
                      placeholder="https://cdn.poehali.dev/files/..."
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Название</Label>
                    <Input
                      value={tile.name}
                      onChange={(e) => handleTileChange(tile.id, 'name', e.target.value)}
                      placeholder="Название плитки"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Материал</Label>
                    <Select
                      value={tile.category}
                      onValueChange={(value: 'concrete' | 'granite') => 
                        handleTileChange(tile.id, 'category', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="concrete">Бетонная</SelectItem>
                        <SelectItem value="granite">Гранитная</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Цена за м²</Label>
                    <Input
                      type="number"
                      value={tile.pricePerUnit}
                      onChange={(e) => handleTileChange(tile.id, 'pricePerUnit', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Доступные размеры (в метрах)</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tile.sizes.map((size, index) => (
                        <div key={index} className="flex items-center gap-1 bg-indigo-100 px-3 py-1 rounded-full">
                          <span className="text-sm font-medium">{Math.round(size * 100)}×{Math.round(size * 100)} см</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveSize(tile.id, index)}
                            className="h-5 w-5 p-0 hover:bg-red-200"
                          >
                            <Icon name="X" size={12} />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Select
                        onValueChange={(value) => handleAddSize(tile.id, parseFloat(value))}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Добавить размер" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0.2">20×20 см</SelectItem>
                          <SelectItem value="0.3">30×30 см</SelectItem>
                          <SelectItem value="0.4">40×40 см</SelectItem>
                          <SelectItem value="0.5">50×50 см</SelectItem>
                          <SelectItem value="0.6">60×60 см</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => handleDeleteTile(tile.id)}
                      variant="destructive"
                      size="sm"
                      className="gap-2"
                    >
                      <Icon name="Trash2" size={16} />
                      Удалить
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSaveTiles} size="lg" className="gap-2">
          <Icon name="Save" size={18} />
          Сохранить все изменения
        </Button>
      </div>
    </div>
  );

  const renderMaterialTable = (category: string) => {
    const showImages = category === 'fence';
    
    console.log('🔍 Рендер материалов для категории:', category);
    console.log('📊 Все материалы:', materials);
    console.log('📊 Материалы категории:', materials[category]);
    
    if (!materials[category] || materials[category].length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <p>Нет материалов в этой категории</p>
          <Button onClick={() => handleAddMaterial(category)} className="mt-4 gap-2">
            <Icon name="Plus" size={16} />
            Добавить первый материал
          </Button>
        </div>
      );
    }
    
    if (showImages) {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{getCategoryName(category)}</h3>
            <Button onClick={() => handleAddMaterial(category)} size="sm" className="gap-2">
              <Icon name="Plus" size={16} />
              Добавить
            </Button>
          </div>
          
          <div className="grid gap-4">
            {materials[category].map((material) => (
              <Card key={material.id} className={editingId === material.id && editingCategory === category ? 'border-2 border-indigo-500' : ''}>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      {material.image && (
                        <div className="flex items-center justify-center">
                          <img 
                            src={material.image} 
                            alt={material.name}
                            className="w-32 h-32 rounded-lg shadow-md object-contain border-2 border-gray-200"
                          />
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <Label>Изображение</Label>
                        <div className="flex gap-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setMaterials(prev => ({
                                    ...prev,
                                    [category]: prev[category].map(m => 
                                      m.id === material.id ? { ...m, image: reader.result as string } : m
                                    )
                                  }));
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="cursor-pointer"
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          Выберите файл изображения
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Или введите URL</Label>
                        <Input
                          value={material.image || ''}
                          onChange={(e) => {
                            setMaterials(prev => ({
                              ...prev,
                              [category]: prev[category].map(m => 
                                m.id === material.id ? { ...m, image: e.target.value } : m
                              )
                            }));
                          }}
                          placeholder="https://cdn.poehali.dev/files/..."
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label>Название</Label>
                        <Input
                          value={material.name}
                          onChange={(e) => handleNameChange(category, material.id, e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Тип ограды</Label>
                        <Select
                          value={material.category || 'metal'}
                          onValueChange={(value: 'metal' | 'granite' | 'forged') => {
                            setMaterials(prev => ({
                              ...prev,
                              [category]: prev[category].map(m => 
                                m.id === material.id ? { ...m, category: value } : m
                              )
                            }));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="metal">Металлическая</SelectItem>
                            <SelectItem value="granite">Гранитная</SelectItem>
                            <SelectItem value="forged">Кованая</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Единица измерения</Label>
                        <Input
                          value={material.unit}
                          disabled
                          className="bg-gray-50"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Цена (₽)</Label>
                        <Input
                          type="number"
                          value={material.pricePerUnit}
                          onChange={(e) => handlePriceChange(category, material.id, parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={() => handleDeleteMaterial(category, material.id)}
                          variant="destructive"
                          size="sm"
                          className="gap-2"
                        >
                          <Icon name="Trash2" size={16} />
                          Удалить
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }
    
    return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{getCategoryName(category)}</h3>
        <Button onClick={() => handleAddMaterial(category)} size="sm" className="gap-2">
          <Icon name="Plus" size={16} />
          Добавить
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Название</TableHead>
            <TableHead>Единица</TableHead>
            <TableHead className="text-right">Цена (₽)</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials[category].map((material) => (
            <TableRow key={material.id}>
              <TableCell>
                {editingId === material.id && editingCategory === category ? (
                  <Input
                    value={material.name}
                    onChange={(e) => handleNameChange(category, material.id, e.target.value)}
                    className="max-w-xs"
                  />
                ) : (
                  <span className="font-medium">{material.name}</span>
                )}
              </TableCell>
              <TableCell>
                <span className="text-muted-foreground">{material.unit}</span>
              </TableCell>
              <TableCell className="text-right">
                {editingId === material.id && editingCategory === category ? (
                  <Input
                    type="number"
                    value={material.pricePerUnit}
                    onChange={(e) => handlePriceChange(category, material.id, parseFloat(e.target.value) || 0)}
                    className="max-w-[120px] ml-auto"
                  />
                ) : (
                  <span className="font-semibold">{material.pricePerUnit.toLocaleString('ru-RU')} ₽</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {editingId === material.id && editingCategory === category ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingId(null);
                        setEditingCategory(null);
                      }}
                    >
                      <Icon name="Check" size={16} />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingId(material.id);
                        setEditingCategory(category);
                      }}
                    >
                      <Icon name="Pencil" size={16} />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteMaterial(category, material.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Icon name="Settings" size={36} className="text-primary" />
              Панель администратора
            </h1>
            <p className="text-lg text-gray-600">
              Управление плитками и материалами
            </p>
          </div>
          <Button onClick={() => window.location.href = '/'} variant="outline" className="gap-2">
            <Icon name="ArrowLeft" size={18} />
            К калькулятору
          </Button>
        </header>

        <Tabs defaultValue="tiles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tiles" className="gap-2">
              <Icon name="Grid3x3" size={16} />
              Плитки
            </TabsTrigger>
            <TabsTrigger value="border" className="gap-2">
              <Icon name="Frame" size={16} />
              Поребрики
            </TabsTrigger>
            <TabsTrigger value="fence" className="gap-2">
              <Icon name="Shield" size={16} />
              Ограды
            </TabsTrigger>
            <TabsTrigger value="monument" className="gap-2">
              <Icon name="Square" size={16} />
              Памятники
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tiles">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Grid3x3" size={24} className="text-primary" />
                  Управление плитками
                </CardTitle>
                <CardDescription>
                  Добавляйте, редактируйте и удаляйте плитки
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderTileManager()}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="border">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Поребрики</CardTitle>
              </CardHeader>
              <CardContent>
                {renderMaterialTable('border')}
                <div className="flex justify-end mt-6">
                  <Button onClick={handleSaveMaterials} size="lg" className="gap-2">
                    <Icon name="Save" size={18} />
                    Сохранить изменения
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fence">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Ограды</CardTitle>
                  <Button 
                    onClick={() => {
                      setMaterials(prev => {
                        const updated = {
                          ...prev,
                          fence: initialMaterials.fence
                        };
                        localStorage.setItem('materials', JSON.stringify(updated));
                        return updated;
                      });
                      toast({
                        title: 'Данные сброшены',
                        description: 'Ограды возвращены к начальным значениям с изображениями',
                      });
                    }}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Icon name="RotateCcw" size={16} />
                    Сбросить к начальным
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {renderMaterialTable('fence')}
                <div className="flex justify-end mt-6">
                  <Button onClick={handleSaveMaterials} size="lg" className="gap-2">
                    <Icon name="Save" size={18} />
                    Сохранить изменения
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monument">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Памятники</CardTitle>
              </CardHeader>
              <CardContent>
                {renderMaterialTable('monument')}
                <div className="flex justify-end mt-6">
                  <Button onClick={handleSaveMaterials} size="lg" className="gap-2">
                    <Icon name="Save" size={18} />
                    Сохранить изменения
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;