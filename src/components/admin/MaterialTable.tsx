import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Material } from './types';

interface MaterialTableProps {
  category: string;
  materials: Material[];
  editingId: string | null;
  editingCategory: string | null;
  onPriceChange: (category: string, id: string, newPrice: number) => void;
  onNameChange: (category: string, id: string, newName: string) => void;
  onAddMaterial: (category: string) => void;
  onDeleteMaterial: (category: string, id: string) => void;
  setEditingId: (id: string | null) => void;
  setEditingCategory: (category: string | null) => void;
}

export const MaterialTable = ({
  category,
  materials,
  editingId,
  editingCategory,
  onPriceChange,
  onNameChange,
  onAddMaterial,
  onDeleteMaterial,
  setEditingId,
  setEditingCategory,
}: MaterialTableProps) => {
  const startEdit = (id: string, cat: string) => {
    setEditingId(id);
    setEditingCategory(cat);
  };

  const finishEdit = () => {
    setEditingId(null);
    setEditingCategory(null);
  };

  const showImages = category === 'fence';

  return (
    <div className="space-y-4">
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
                  {material.image && (
                    <img 
                      src={material.image} 
                      alt={material.name}
                      className="w-20 h-16 object-cover rounded-md border border-gray-200"
                    />
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
      <Button onClick={() => onAddMaterial(category)} variant="outline" className="gap-2">
        <Icon name="Plus" size={18} />
        Добавить материал
      </Button>
    </div>
  );
};