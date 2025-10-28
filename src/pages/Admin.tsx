import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface Material {
  id: string;
  name: string;
  pricePerUnit: number;
  unit: string;
}

const initialMaterials: Record<string, Material[]> = {
  tile: [
    { id: 'granite', name: 'Плитка гранитная', pricePerUnit: 2500, unit: 'м²' },
    { id: 'concrete', name: 'Плитка бетонная', pricePerUnit: 1200, unit: 'м²' },
    { id: 'marble', name: 'Плитка мраморная', pricePerUnit: 3800, unit: 'м²' },
  ],
  border: [
    { id: 'concrete-border', name: 'Поребрик бетонный', pricePerUnit: 400, unit: 'п.м.' },
    { id: 'granite-border', name: 'Поребрик гранитный', pricePerUnit: 1200, unit: 'п.м.' },
  ],
  fence: [
    { id: 'metal', name: 'Ограда металлическая', pricePerUnit: 1500, unit: 'п.м.' },
    { id: 'granite-fence', name: 'Ограда гранитная', pricePerUnit: 3500, unit: 'п.м.' },
    { id: 'forged', name: 'Ограда кованая', pricePerUnit: 2800, unit: 'п.м.' },
  ],
};

const Admin = () => {
  const [materials, setMaterials] = useState<Record<string, Material[]>>(initialMaterials);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const { toast } = useToast();

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
      unit: category === 'tile' ? 'м²' : 'п.м.',
    };
    
    setMaterials(prev => ({
      ...prev,
      [category]: [...prev[category], newMaterial],
    }));
    
    setEditingId(newId);
    setEditingCategory(category);
  };

  const handleDeleteMaterial = (category: string, id: string) => {
    setMaterials(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item.id !== id),
    }));
    
    toast({
      title: 'Материал удалён',
      description: 'Материал успешно удалён из списка',
    });
  };

  const handleSave = () => {
    localStorage.setItem('materials', JSON.stringify(materials));
    setEditingId(null);
    setEditingCategory(null);
    
    toast({
      title: 'Изменения сохранены',
      description: 'Цены и материалы успешно обновлены',
    });
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'tile': return 'Плитка';
      case 'border': return 'Поребрики';
      case 'fence': return 'Ограды';
      default: return category;
    }
  };

  const renderMaterialTable = (category: string) => (
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
              Управление ценами и материалами
            </p>
          </div>
          <Button onClick={() => window.location.href = '/'} variant="outline" className="gap-2">
            <Icon name="ArrowLeft" size={18} />
            К калькулятору
          </Button>
        </header>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Package" size={24} className="text-primary" />
              Управление материалами
            </CardTitle>
            <CardDescription>
              Редактируйте названия, цены и добавляйте новые материалы
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="tile" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="tile" className="gap-2">
                  <Icon name="Grid3x3" size={16} />
                  Плитка
                </TabsTrigger>
                <TabsTrigger value="border" className="gap-2">
                  <Icon name="Square" size={16} />
                  Поребрики
                </TabsTrigger>
                <TabsTrigger value="fence" className="gap-2">
                  <Icon name="Box" size={16} />
                  Ограды
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="tile" className="mt-6">
                {renderMaterialTable('tile')}
              </TabsContent>
              
              <TabsContent value="border" className="mt-6">
                {renderMaterialTable('border')}
              </TabsContent>
              
              <TabsContent value="fence" className="mt-6">
                {renderMaterialTable('fence')}
              </TabsContent>
            </Tabs>

            <Separator className="my-6" />

            <div className="flex justify-end gap-3">
              <Button variant="outline" size="lg">
                Сбросить изменения
              </Button>
              <Button onClick={handleSave} size="lg" className="gap-2">
                <Icon name="Save" size={18} />
                Сохранить все изменения
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6 shadow-lg border-accent/20">
          <CardHeader className="bg-gradient-to-r from-accent/5 to-primary/5">
            <CardTitle className="flex items-center gap-2">
              <Icon name="BarChart3" size={24} className="text-accent" />
              Статистика
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-lg bg-purple-50">
                <div className="text-3xl font-bold text-primary mb-1">
                  {materials.tile.length}
                </div>
                <div className="text-sm text-gray-600">Типов плитки</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-blue-50">
                <div className="text-3xl font-bold text-accent mb-1">
                  {materials.border.length}
                </div>
                <div className="text-sm text-gray-600">Типов поребриков</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-purple-50">
                <div className="text-3xl font-bold text-primary mb-1">
                  {materials.fence.length}
                </div>
                <div className="text-sm text-gray-600">Типов оград</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
