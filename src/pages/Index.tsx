import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Material {
  id: string;
  name: string;
  pricePerUnit: number;
  unit: string;
}

const materials: Record<string, Material[]> = {
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

interface CalculationItem {
  name: string;
  quantity: number;
  unit: string;
  price: number;
  total: number;
}

const Index = () => {
  const [materialsData, setMaterialsData] = useState<Record<string, Material[]>>(materials);
  const [length, setLength] = useState<number>(2);
  const [width, setWidth] = useState<number>(1.8);
  const [omostkaWidth, setOmostkaWidth] = useState<number>(0.3);
  const [selectedTile, setSelectedTile] = useState<string>('granite');
  const [selectedBorder, setSelectedBorder] = useState<string>('concrete-border');
  const [selectedFence, setSelectedFence] = useState<string>('metal');
  const [includeBorder, setIncludeBorder] = useState<boolean>(true);
  const [includeFence, setIncludeFence] = useState<boolean>(true);
  
  const [calculation, setCalculation] = useState<CalculationItem[]>([]);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const savedMaterials = localStorage.getItem('materials');
    if (savedMaterials) {
      setMaterialsData(JSON.parse(savedMaterials));
    }
  }, []);

  useEffect(() => {
    calculateCost();
  }, [length, width, omostkaWidth, selectedTile, selectedBorder, selectedFence, includeBorder, includeFence, materialsData]);

  const calculateCost = () => {
    const items: CalculationItem[] = [];
    
    if (!materialsData.tile.find(m => m.id === selectedTile)) return;
    
    const tileArea = length * width;
    const tileMaterial = materialsData.tile.find(m => m.id === selectedTile)!;
    items.push({
      name: tileMaterial.name,
      quantity: parseFloat(tileArea.toFixed(2)),
      unit: tileMaterial.unit,
      price: tileMaterial.pricePerUnit,
      total: parseFloat((tileArea * tileMaterial.pricePerUnit).toFixed(2)),
    });

    const outerLength = length + 2 * omostkaWidth;
    const outerWidth = width + 2 * omostkaWidth;
    const outerArea = outerLength * outerWidth;
    const omostkaArea = outerArea - tileArea;
    
    if (omostkaArea > 0) {
      items.push({
        name: 'Отмостка',
        quantity: parseFloat(omostkaArea.toFixed(2)),
        unit: tileMaterial.unit,
        price: tileMaterial.pricePerUnit,
        total: parseFloat((omostkaArea * tileMaterial.pricePerUnit).toFixed(2)),
      });
    }

    const omostkaPerimeter = 2 * (outerLength + outerWidth);

    if (includeBorder && materialsData.border.find(m => m.id === selectedBorder)) {
      const borderMaterial = materialsData.border.find(m => m.id === selectedBorder)!;
      items.push({
        name: borderMaterial.name,
        quantity: parseFloat(omostkaPerimeter.toFixed(2)),
        unit: borderMaterial.unit,
        price: borderMaterial.pricePerUnit,
        total: parseFloat((omostkaPerimeter * borderMaterial.pricePerUnit).toFixed(2)),
      });
    }

    if (includeFence && materialsData.fence.find(m => m.id === selectedFence)) {
      const fenceMaterial = materialsData.fence.find(m => m.id === selectedFence)!;
      items.push({
        name: fenceMaterial.name,
        quantity: parseFloat(omostkaPerimeter.toFixed(2)),
        unit: fenceMaterial.unit,
        price: fenceMaterial.pricePerUnit,
        total: parseFloat((omostkaPerimeter * fenceMaterial.pricePerUnit).toFixed(2)),
      });
    }

    setCalculation(items);
    setTotal(parseFloat(items.reduce((sum, item) => sum + item.total, 0).toFixed(2)));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-12 animate-fade-in">
          <div className="flex justify-end mb-4">
            <Button onClick={() => window.location.href = '/admin'} variant="outline" className="gap-2">
              <Icon name="Settings" size={18} />
              Админ-панель
            </Button>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Калькулятор благоустройства
          </h1>
          <p className="text-lg text-gray-600">
            Рассчитайте стоимость материалов и визуализируйте проект
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Calculator" size={24} className="text-primary" />
                Параметры участка
              </CardTitle>
              <CardDescription>
                Введите размеры и выберите материалы
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="length" className="flex items-center gap-2">
                    <Icon name="Move" size={16} />
                    Длина (м)
                  </Label>
                  <Input
                    id="length"
                    type="number"
                    step="0.1"
                    min="0.5"
                    value={length}
                    onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                    className="text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="width" className="flex items-center gap-2">
                    <Icon name="Move" size={16} className="rotate-90" />
                    Ширина (м)
                  </Label>
                  <Input
                    id="width"
                    type="number"
                    step="0.1"
                    min="0.5"
                    value={width}
                    onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                    className="text-lg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="omostka" className="flex items-center gap-2">
                  <Icon name="Layers" size={16} />
                  Ширина отмостки (м)
                </Label>
                <Input
                  id="omostka"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={omostkaWidth}
                  onChange={(e) => setOmostkaWidth(parseFloat(e.target.value) || 0)}
                  className="text-lg"
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="tile" className="flex items-center gap-2">
                  <Icon name="Grid3x3" size={16} />
                  Тип плитки
                </Label>
                <Select value={selectedTile} onValueChange={setSelectedTile}>
                  <SelectTrigger id="tile">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {materialsData.tile.map((mat) => (
                      <SelectItem key={mat.id} value={mat.id}>
                        {mat.name} — {mat.pricePerUnit} ₽/{mat.unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="border" className="flex items-center gap-2">
                    <Icon name="Square" size={16} />
                    Поребрик
                  </Label>
                  <Button
                    variant={includeBorder ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setIncludeBorder(!includeBorder)}
                  >
                    {includeBorder ? 'Включен' : 'Выключен'}
                  </Button>
                </div>
                {includeBorder && (
                  <Select value={selectedBorder} onValueChange={setSelectedBorder}>
                    <SelectTrigger id="border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {materialsData.border.map((mat) => (
                        <SelectItem key={mat.id} value={mat.id}>
                          {mat.name} — {mat.pricePerUnit} ₽/{mat.unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="fence" className="flex items-center gap-2">
                    <Icon name="FenceIcon" size={16} fallback="Box" />
                    Ограда
                  </Label>
                  <Button
                    variant={includeFence ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setIncludeFence(!includeFence)}
                  >
                    {includeFence ? 'Включена' : 'Выключена'}
                  </Button>
                </div>
                {includeFence && (
                  <Select value={selectedFence} onValueChange={setSelectedFence}>
                    <SelectTrigger id="fence">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {materialsData.fence.map((mat) => (
                        <SelectItem key={mat.id} value={mat.id}>
                          {mat.name} — {mat.pricePerUnit} ₽/{mat.unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Eye" size={24} className="text-accent" />
                  Визуализация
                </CardTitle>
                <CardDescription>
                  Вид участка сверху
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-8 flex items-center justify-center min-h-[400px]">
                  <svg
                    viewBox="0 0 400 400"
                    className="w-full max-w-lg"
                  >
                    <defs>
                      <pattern id="tilePattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <rect width="19" height="19" fill="#e0e7ff" stroke="#c7d2fe" strokeWidth="1"/>
                      </pattern>
                      <pattern id="omostkaPattern" x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse">
                        <rect width="14" height="14" fill="#f3e8ff" stroke="#e9d5ff" strokeWidth="1"/>
                      </pattern>
                    </defs>

                    <rect
                      x={100 - omostkaWidth * 30}
                      y={100 - omostkaWidth * 30}
                      width={(200 * length / 2) + omostkaWidth * 60}
                      height={(200 * width / 2) + omostkaWidth * 60}
                      fill="url(#omostkaPattern)"
                      stroke="#8B5CF6"
                      strokeWidth="3"
                      rx="4"
                    />
                    
                    <rect
                      x="100"
                      y="100"
                      width={200 * length / 2}
                      height={200 * width / 2}
                      fill="url(#tilePattern)"
                      stroke="#6366f1"
                      strokeWidth="2"
                      rx="2"
                    />

                    {includeFence && (
                      <rect
                        x={100 - omostkaWidth * 30 - 5}
                        y={100 - omostkaWidth * 30 - 5}
                        width={(200 * length / 2) + omostkaWidth * 60 + 10}
                        height={(200 * width / 2) + omostkaWidth * 60 + 10}
                        fill="none"
                        stroke="#1e293b"
                        strokeWidth="4"
                        strokeDasharray="8,4"
                        rx="6"
                      />
                    )}

                    <text x={100 + (100 * length / 2)} y="85" textAnchor="middle" className="text-sm fill-gray-800 font-semibold">
                      {length} м
                    </text>
                    <line x1="100" y1="90" x2={100 + (200 * length / 2)} y2="90" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                    
                    <text x="85" y={100 + (100 * width / 2)} textAnchor="middle" className="text-sm fill-gray-800 font-semibold" transform={`rotate(-90 85 ${100 + (100 * width / 2)})`}>
                      {width} м
                    </text>
                    <line x1="90" y1="100" x2="90" y2={100 + (200 * width / 2)} stroke="#374151" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm">
                    <div className="w-6 h-6 border-2 border-indigo-300" style={{background: 'url(#tilePattern)'}}></div>
                    <span className="text-gray-700 font-medium">Плитка</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm">
                    <div className="w-6 h-6 bg-purple-200 border border-purple-300 rounded"></div>
                    <span className="text-gray-700 font-medium">Отмостка</span>
                  </div>
                  {includeBorder && (
                    <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm">
                      <div className="w-6 h-6 border-3 border-purple-600 rounded"></div>
                      <span className="text-gray-700 font-medium">Поребрик</span>
                    </div>
                  )}
                  {includeFence && (
                    <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm">
                      <div className="w-6 h-6 border-2 border-dashed border-gray-800 rounded"></div>
                      <span className="text-gray-700 font-medium">Ограда</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-primary/20">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                <CardTitle className="flex items-center gap-2">
                  <Icon name="FileText" size={24} className="text-primary" />
                  Смета расходов
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Материал</TableHead>
                      <TableHead className="text-center">Кол-во</TableHead>
                      <TableHead className="text-right">Цена</TableHead>
                      <TableHead className="text-right">Сумма</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {calculation.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-center">
                          {item.quantity} {item.unit}
                        </TableCell>
                        <TableCell className="text-right">{item.price} ₽</TableCell>
                        <TableCell className="text-right font-semibold">
                          {item.total.toLocaleString('ru-RU')} ₽
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-primary/5 font-bold">
                      <TableCell colSpan={3} className="text-lg">Итого:</TableCell>
                      <TableCell className="text-right text-lg text-primary">
                        {total.toLocaleString('ru-RU')} ₽
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <div className="mt-6 flex gap-3">
                  <Button className="flex-1 gap-2" size="lg">
                    <Icon name="Download" size={18} />
                    Скачать PDF
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2" size="lg">
                    <Icon name="Send" size={18} />
                    Отправить заявку
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;