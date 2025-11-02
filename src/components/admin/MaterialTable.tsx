import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Material } from './types';

interface MaterialTableProps {
  category: string;
  materials: Material[];
  editingId: string | null;
  editingCategory: string | null;
  onPriceChange: (category: string, id: string, newPrice: number) => void;
  onNameChange: (category: string, id: string, newName: string) => void;
  onImageChange: (category: string, id: string, newImage: string) => void;
  onAddMaterial: (category: string, data: any) => void;
  onDeleteMaterial: (category: string, id: string) => void;
  setEditingId: (id: string | null) => void;
  setEditingCategory: (category: string | null) => void;
}

interface NewMaterialForm {
  name: string;
  price: number;
  image: string;
  category: 'metal' | 'granite' | 'forged';
}

export const MaterialTable = ({
  category,
  materials,
  editingId,
  editingCategory,
  onPriceChange,
  onNameChange,
  onImageChange,
  onAddMaterial,
  onDeleteMaterial,
  setEditingId,
  setEditingCategory,
}: MaterialTableProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMaterial, setNewMaterial] = useState<NewMaterialForm>({
    name: '',
    price: 0,
    image: '',
    category: 'metal'
  });

  const startEdit = (id: string, cat: string) => {
    setEditingId(id);
    setEditingCategory(cat);
  };

  const finishEdit = () => {
    setEditingId(null);
    setEditingCategory(null);
  };

  const handleAddMaterial = () => {
    if (newMaterial.name.trim()) {
      onAddMaterial(category, newMaterial);
      setNewMaterial({ name: '', price: 0, image: '', category: 'metal' });
      setShowAddForm(false);
    }
  };

  const showImages = category === 'fence';
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          <Button
            size="sm"
            variant={viewMode === 'cards' ? 'default' : 'ghost'}
            onClick={() => setViewMode('cards')}
            className="gap-2"
          >
            <Icon name="LayoutGrid" size={16} />
            Карточки
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            onClick={() => setViewMode('table')}
            className="gap-2"
          >
            <Icon name="Table" size={16} />
            Таблица
          </Button>
        </div>
      </div>

      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {materials.map((material) => (
            <Card key={material.id} className="shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{material.name}</h3>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => editingId === material.id ? finishEdit() : startEdit(material.id, category)}
                      >
                        <Icon name={editingId === material.id ? "Check" : "Pencil"} size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onDeleteMaterial(category, material.id)}
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </div>

                  {editingId === material.id && editingCategory === category ? (
                    <div className="space-y-4">

                      <div>
                        <Label>Название</Label>
                        <Input
                          value={material.name}
                          onChange={(e) => onNameChange(category, material.id, e.target.value)}
                        />
                      </div>

                      <div>
                        <Label>Цена за {material.unit}</Label>
                        <Input
                          type="number"
                          value={material.pricePerUnit}
                          onChange={(e) => onPriceChange(category, material.id, Number(e.target.value))}
                        />
                      </div>

                      {showImages && (
                        <>
                          <div>
                            <Label>URL изображения</Label>
                            <Input
                              value={material.image || ''}
                              onChange={(e) => onImageChange(category, material.id, e.target.value)}
                              placeholder="https://..."
                            />
                            {material.image && (
                              <p className="text-xs text-gray-500 mt-1">Превью обновится автоматически</p>
                            )}
                          </div>

                          <div>
                            <Label>Категория</Label>
                            <Select
                              value={material.category || 'metal'}
                              onValueChange={(value: 'metal' | 'granite' | 'forged') => 
                                onImageChange(category, material.id, material.image || '')
                              }
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
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {showImages && material.image && (
                        <div className="flex justify-center">
                          <img 
                            src={material.image} 
                            alt={material.name}
                            className="w-full h-40 object-contain rounded-lg border border-gray-200"
                          />
                        </div>
                      )}
                      <div className="space-y-2 text-sm text-gray-600">
                        <p className="text-lg font-semibold text-gray-900">{material.pricePerUnit.toLocaleString('ru-RU')} ₽/{material.unit}</p>
                        {material.category && (
                          <p>Категория: {material.category === 'metal' ? 'Металлическая' : material.category === 'granite' ? 'Гранитная' : 'Кованая'}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Table>
        <TableHeader>
          <TableRow>
            {showImages && <TableHead className="w-[100px]">Изображение</TableHead>}
            <TableHead className={showImages ? "w-[40%]" : "w-[50%]"}>Название</TableHead>
            <TableHead className="w-[30%]">Цена</TableHead>
            <TableHead className="w-[20%] text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.map((material) => (
            <TableRow key={material.id}>
              {showImages && (
                <TableCell>
                  {editingId === material.id && editingCategory === category ? (
                    <div className="space-y-2">
                      {material.image && (
                        <img 
                          src={material.image} 
                          alt={material.name}
                          className="w-20 h-16 object-cover rounded-md border border-gray-200"
                        />
                      )}
                      <Input
                        value={material.image || ''}
                        onChange={(e) => onImageChange(category, material.id, e.target.value)}
                        placeholder="URL изображения"
                        className="text-xs"
                      />
                    </div>
                  ) : (
                    material.image && (
                      <img 
                        src={material.image} 
                        alt={material.name}
                        className="w-20 h-16 object-cover rounded-md border border-gray-200"
                      />
                    )
                  )}
                </TableCell>
              )}
              <TableCell>
                {editingId === material.id && editingCategory === category ? (
                  <Input
                    value={material.name}
                    onChange={(e) => onNameChange(category, material.id, e.target.value)}
                    className="max-w-md"
                  />
                ) : (
                  <span className="font-medium">{material.name}</span>
                )}
              </TableCell>
              <TableCell>
                {editingId === material.id && editingCategory === category ? (
                  <div className="flex items-center gap-2 max-w-xs">
                    <Input
                      type="number"
                      value={material.pricePerUnit}
                      onChange={(e) => onPriceChange(category, material.id, Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-500 whitespace-nowrap">₽/{material.unit}</span>
                  </div>
                ) : (
                  <span>{material.pricePerUnit.toLocaleString('ru-RU')} ₽/{material.unit}</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {editingId === material.id && editingCategory === category ? (
                    <Button
                      size="sm"
                      onClick={finishEdit}
                      variant="default"
                    >
                      <Icon name="Check" size={16} />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => startEdit(material.id, category)}
                      variant="outline"
                    >
                      <Icon name="Pencil" size={16} />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDeleteMaterial(category, material.id)}
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      )}
      
      {showAddForm ? (
        <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Icon name="Plus" size={20} />
            Добавить новый материал
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Название *</Label>
              <Input
                value={newMaterial.name}
                onChange={(e) => setNewMaterial(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Название материала"
              />
            </div>

            <div className="space-y-2">
              <Label>Цена за {category === 'monument' ? 'шт' : 'п.м.'} *</Label>
              <Input
                type="number"
                value={newMaterial.price}
                onChange={(e) => setNewMaterial(prev => ({ ...prev, price: Number(e.target.value) }))}
                placeholder="0"
              />
            </div>

            {showImages && (
              <>
                <div className="space-y-2">
                  <Label>URL изображения</Label>
                  <Input
                    value={newMaterial.image}
                    onChange={(e) => setNewMaterial(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://..."
                  />
                  {newMaterial.image && (
                    <div className="mt-2">
                      <img 
                        src={newMaterial.image} 
                        alt="Предпросмотр"
                        className="w-32 h-24 object-cover rounded-md border border-gray-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Категория</Label>
                  <Select
                    value={newMaterial.category}
                    onValueChange={(value: 'metal' | 'granite' | 'forged') => 
                      setNewMaterial(prev => ({ ...prev, category: value }))
                    }
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
              </>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <Button onClick={() => setShowAddForm(false)} variant="outline">
              <Icon name="X" size={18} />
              Отмена
            </Button>
            <Button onClick={handleAddMaterial} className="gap-2" disabled={!newMaterial.name.trim()}>
              <Icon name="Check" size={18} />
              Добавить
            </Button>
          </div>
        </div>
      ) : (
        <Button onClick={() => setShowAddForm(true)} variant="outline" className="gap-2">
          <Icon name="Plus" size={18} />
          Добавить материал
        </Button>
      )}
    </div>
  );
};