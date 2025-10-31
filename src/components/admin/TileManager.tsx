import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TileType } from './types';

interface TileManagerProps {
  tileTypes: TileType[];
  editingTileId: string | null;
  onTileChange: (id: string, field: keyof TileType, value: any) => void;
  onAddSize: (tileId: string, size: number) => void;
  onRemoveSize: (tileId: string, sizeIndex: number) => void;
  onAddTile: () => void;
  onDeleteTile: (id: string) => void;
  onSaveTiles: () => void;
  setEditingTileId: (id: string | null) => void;
}

export const TileManager = ({
  tileTypes,
  editingTileId,
  onTileChange,
  onAddSize,
  onRemoveSize,
  onAddTile,
  onDeleteTile,
  onSaveTiles,
  setEditingTileId,
}: TileManagerProps) => {
  const [newSize, setNewSize] = useState<Record<string, string>>({});

  const concreteTiles = tileTypes.filter(t => t.category === 'concrete');
  const graniteTiles = tileTypes.filter(t => t.category === 'granite');

  const renderTileCard = (tile: TileType) => (
    <Card key={tile.id} className="shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{tile.name}</h3>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={editingTileId === tile.id ? 'default' : 'outline'}
                onClick={() => setEditingTileId(editingTileId === tile.id ? null : tile.id)}
              >
                <Icon name={editingTileId === tile.id ? 'Check' : 'Pencil'} size={16} />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDeleteTile(tile.id)}
              >
                <Icon name="Trash2" size={16} />
              </Button>
            </div>
          </div>

          {editingTileId === tile.id ? (
            <div className="space-y-4">
              <div>
                <Label>Название</Label>
                <Input
                  value={tile.name}
                  onChange={(e) => onTileChange(tile.id, 'name', e.target.value)}
                />
              </div>

              <div>
                <Label>Категория</Label>
                <Select
                  value={tile.category}
                  onValueChange={(value: 'concrete' | 'granite') => onTileChange(tile.id, 'category', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="concrete">Бетон</SelectItem>
                    <SelectItem value="granite">Гранит</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Цена за {tile.unit}</Label>
                <Input
                  type="number"
                  value={tile.pricePerUnit}
                  onChange={(e) => onTileChange(tile.id, 'pricePerUnit', Number(e.target.value))}
                />
              </div>

              <div>
                <Label>URL изображения</Label>
                <Input
                  value={tile.image}
                  onChange={(e) => onTileChange(tile.id, 'image', e.target.value)}
                />
              </div>

              <div>
                <Label>Размеры (м)</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tile.sizes.map((size, index) => (
                    <div key={index} className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-md">
                      <span>{size} м</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-5 w-5 p-0"
                        onClick={() => onRemoveSize(tile.id, index)}
                      >
                        <Icon name="X" size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {[0.3, 0.4, 0.5].map((size) => (
                      <Button
                        key={size}
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (!tile.sizes.includes(size)) {
                            onAddSize(tile.id, size);
                          }
                        }}
                        disabled={tile.sizes.includes(size)}
                        className="gap-1"
                      >
                        <Icon name="Plus" size={14} />
                        {size} м ({size * 100} × {size * 100} см)
                      </Button>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="Другой размер"
                      value={newSize[tile.id] || ''}
                      onChange={(e) => setNewSize(prev => ({ ...prev, [tile.id]: e.target.value }))}
                      className="flex-1"
                    />
                    <Button
                      onClick={() => {
                        const size = parseFloat(newSize[tile.id] || '0');
                        if (size > 0) {
                          onAddSize(tile.id, size);
                          setNewSize(prev => ({ ...prev, [tile.id]: '' }));
                        }
                      }}
                    >
                      <Icon name="Plus" size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-sm text-gray-600">
              <p>Цена: {tile.pricePerUnit} ₽/{tile.unit}</p>
              <p>Размеры: {tile.sizes.join(', ')} м</p>
              <p>Категория: {tile.category === 'concrete' ? 'Бетон' : 'Гранит'}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Бетонные плитки</h3>
        <Button onClick={onAddTile} className="gap-2">
          <Icon name="Plus" size={18} />
          Добавить плитку
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {concreteTiles.map(renderTileCard)}
      </div>

      <div className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Гранитные плитки</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {graniteTiles.map(renderTileCard)}
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <Button onClick={onSaveTiles} size="lg" className="gap-2">
          <Icon name="Save" size={18} />
          Сохранить изменения
        </Button>
      </div>
    </div>
  );
};