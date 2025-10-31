import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { TileManager } from '@/components/admin/TileManager';
import { MaterialTable } from '@/components/admin/MaterialTable';
import { Material, TileType, initialTileTypes, initialMaterials } from '@/components/admin/types';

const Admin = () => {
  const [tileTypes, setTileTypes] = useState<TileType[]>([]);
  const [materials, setMaterials] = useState<Record<string, Material[]>>(initialMaterials);
  const [editingTileId, setEditingTileId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedTiles = localStorage.getItem('tileTypes');
      if (savedTiles) {
        const parsed = JSON.parse(savedTiles);
        setTileTypes(parsed);
      } else {
        setTileTypes(initialTileTypes);
        localStorage.setItem('tileTypes', JSON.stringify(initialTileTypes));
      }
    } catch (error) {
      console.error('Ошибка загрузки плиток:', error);
      setTileTypes(initialTileTypes);
      localStorage.setItem('tileTypes', JSON.stringify(initialTileTypes));
    }

    try {
      const savedMaterials = localStorage.getItem('materials');
      if (savedMaterials) {
        const parsed = JSON.parse(savedMaterials);
        
        const validMaterials = {
          border: Array.isArray(parsed.border) ? parsed.border : initialMaterials.border,
          fence: Array.isArray(parsed.fence) ? parsed.fence : initialMaterials.fence,
          monument: Array.isArray(parsed.monument) ? parsed.monument : initialMaterials.monument,
        };
        
        if (validMaterials.fence) {
          validMaterials.fence = validMaterials.fence.map((fence: Material) => {
            if (fence.image && (fence.image.includes('storage.yandexcloud.net') || fence.image.length > 1000)) {
              const initialFence = initialMaterials.fence.find(f => f.id === fence.id);
              return { ...fence, image: initialFence?.image || '' };
            }
            return fence;
          });
        }
        
        setMaterials(validMaterials);
        localStorage.setItem('materials', JSON.stringify(validMaterials));
      } else {
        setMaterials(initialMaterials);
        localStorage.setItem('materials', JSON.stringify(initialMaterials));
      }
    } catch (error) {
      console.error('Ошибка загрузки материалов:', error);
      setMaterials(initialMaterials);
      localStorage.setItem('materials', JSON.stringify(initialMaterials));
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
      unit: category === 'monument' ? 'шт' : 'п.м.',
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Панель управления</h1>
              <p className="text-gray-600">Управление материалами и ценами</p>
            </div>
          </div>

          <Separator className="mb-6" />

          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={() => {
                if (confirm('Вы уверены? Все данные будут сброшены к начальным значениям.')) {
                  localStorage.removeItem('tileTypes');
                  localStorage.removeItem('materials');
                  window.location.reload();
                }
              }} 
              variant="destructive" 
              className="gap-2"
            >
              <Icon name="RotateCcw" size={18} />
              Сбросить всё
            </Button>
            <Button onClick={() => window.location.href = '/'} variant="outline" className="gap-2">
              <Icon name="ArrowLeft" size={18} />
              К калькулятору
            </Button>
          </div>
        </header>

        <Tabs defaultValue="tiles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100">
            <TabsTrigger value="tiles" className="gap-2 data-[state=active]:bg-white">
              <Icon name="Grid3x3" size={16} />
              Плитки
            </TabsTrigger>
            <TabsTrigger value="border" className="gap-2 data-[state=active]:bg-white">
              <Icon name="Frame" size={16} />
              Поребрики
            </TabsTrigger>
            <TabsTrigger value="fence" className="gap-2 data-[state=active]:bg-white">
              <Icon name="Home" size={16} />
              Ограды
            </TabsTrigger>
            <TabsTrigger value="monument" className="gap-2 data-[state=active]:bg-white">
              <Icon name="Square" size={16} />
              Памятники
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tiles" className="min-h-[400px]">
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
                <TileManager
                  tileTypes={tileTypes}
                  editingTileId={editingTileId}
                  onTileChange={handleTileChange}
                  onAddSize={handleAddSize}
                  onRemoveSize={handleRemoveSize}
                  onAddTile={handleAddTile}
                  onDeleteTile={handleDeleteTile}
                  onSaveTiles={handleSaveTiles}
                  setEditingTileId={setEditingTileId}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="border" className="min-h-[400px]">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Поребрики</CardTitle>
              </CardHeader>
              <CardContent>
                <MaterialTable
                  category="border"
                  materials={materials.border}
                  editingId={editingId}
                  editingCategory={editingCategory}
                  onPriceChange={handlePriceChange}
                  onNameChange={handleNameChange}
                  onAddMaterial={handleAddMaterial}
                  onDeleteMaterial={handleDeleteMaterial}
                  setEditingId={setEditingId}
                  setEditingCategory={setEditingCategory}
                />
                <div className="flex justify-end mt-6">
                  <Button onClick={handleSaveMaterials} size="lg" className="gap-2">
                    <Icon name="Save" size={18} />
                    Сохранить изменения
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fence" className="min-h-[400px]">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Ограды</CardTitle>
              </CardHeader>
              <CardContent>
                <MaterialTable
                  category="fence"
                  materials={materials.fence}
                  editingId={editingId}
                  editingCategory={editingCategory}
                  onPriceChange={handlePriceChange}
                  onNameChange={handleNameChange}
                  onAddMaterial={handleAddMaterial}
                  onDeleteMaterial={handleDeleteMaterial}
                  setEditingId={setEditingId}
                  setEditingCategory={setEditingCategory}
                />
                <div className="flex justify-end mt-6">
                  <Button onClick={handleSaveMaterials} size="lg" className="gap-2">
                    <Icon name="Save" size={18} />
                    Сохранить изменения
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monument" className="min-h-[400px]">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Памятники</CardTitle>
              </CardHeader>
              <CardContent>
                <MaterialTable
                  category="monument"
                  materials={materials.monument}
                  editingId={editingId}
                  editingCategory={editingCategory}
                  onPriceChange={handlePriceChange}
                  onNameChange={handleNameChange}
                  onAddMaterial={handleAddMaterial}
                  onDeleteMaterial={handleDeleteMaterial}
                  setEditingId={setEditingId}
                  setEditingCategory={setEditingCategory}
                />
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
