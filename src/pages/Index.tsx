import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import funcUrls from '@/func2url.json';

const API_URL = funcUrls.materials;

interface Material {
  id: string;
  name: string;
  pricePerUnit: number;
  unit: string;
  image?: string;
}

interface TileType {
  id: string;
  name: string;
  category: 'concrete' | 'granite';
  pricePerUnit: number;
  unit: string;
  image: string;
  sizes: number[]; // доступные размеры в метрах
}

interface FenceType extends Material {
  category: 'metal' | 'granite' | 'forged';
}

const tileTypes: TileType[] = [
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
    id: 'concrete-california', 
    name: 'Калифорния', 
    category: 'concrete',
    pricePerUnit: 1300, 
    unit: 'м²',
    image: 'https://cdn.poehali.dev/files/24dae1ac-594b-4d3c-9426-bfd31588f002.png',
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
    { 
      id: 'metal', 
      name: 'Ограда металлическая', 
      pricePerUnit: 1500, 
      unit: 'п.м.',
      image: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=400&h=300&fit=crop',
      category: 'metal'
    },
    { 
      id: 'granite-fence', 
      name: 'Ограда гранитная', 
      pricePerUnit: 3500, 
      unit: 'п.м.',
      image: 'https://images.unsplash.com/photo-1603042891252-f8499fc1fe48?w=400&h=300&fit=crop',
      category: 'granite'
    },
    { 
      id: 'forged', 
      name: 'Ограда кованая', 
      pricePerUnit: 2800, 
      unit: 'п.м.',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      category: 'forged'
    },
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

interface CalculationItem {
  name: string;
  quantity: number;
  unit: string;
  price: number;
  total: number;
}

const Index = () => {
  const [materialsData, setMaterialsData] = useState<Record<string, Material[]>>(materials);
  const [tileTypesData, setTileTypesData] = useState<TileType[]>(tileTypes);
  const [length, setLength] = useState<number>(2);
  const [lengthInput, setLengthInput] = useState<string>('2');
  const [width, setWidth] = useState<number>(2.5);
  const [widthInput, setWidthInput] = useState<string>('2.5');
  const [omostkaWidth, setOmostkaWidth] = useState<number>(0.3);
  const [omostkaWidthInput, setOmostkaWidthInput] = useState<string>('0.3');
  const [borderWidth, setBorderWidth] = useState<number>(0.2);
  const [borderWidthInput, setBorderWidthInput] = useState<string>('0.2');
  const [selectedTile, setSelectedTile] = useState<string>('granite');
  const [selectedBorder, setSelectedBorder] = useState<string>('concrete-border');
  const [selectedFence, setSelectedFence] = useState<string>('metal');
  const [selectedMonument, setSelectedMonument] = useState<string>('monument-40x80');
  const [monumentCount, setMonumentCount] = useState<number>(1);
  const [monumentCountInput, setMonumentCountInput] = useState<string>('1');
  const [monumentPosition, setMonumentPosition] = useState<string>('center');
  const [includeOmostka, setIncludeOmostka] = useState<boolean>(false);
  const [includeBorder, setIncludeBorder] = useState<boolean>(true);
  const [includeFence, setIncludeFence] = useState<boolean>(true);
  const [includeMonument, setIncludeMonument] = useState<boolean>(true);
  const [includeTile, setIncludeTile] = useState<boolean>(true);
  const [includeCrumb, setIncludeCrumb] = useState<boolean>(true);
  const [crumbKgPerM2, setCrumbKgPerM2] = useState<number>(50);
  const [crumbKgPerM2Input, setCrumbKgPerM2Input] = useState<string>('50');
  const [crumbPricePerKg, setCrumbPricePerKg] = useState<number>(15);
  const [crumbPricePerKgInput, setCrumbPricePerKgInput] = useState<string>('15');
  const [tileSize, setTileSize] = useState<number>(0.4);
  const [tilePattern, setTilePattern] = useState<string>('standard');
  const [tileCategory, setTileCategory] = useState<'concrete' | 'granite'>('concrete');
  const [selectedTileType, setSelectedTileType] = useState<string>('concrete-brick');
  const [fenceCategory, setFenceCategory] = useState<'metal' | 'granite' | 'forged'>('metal');
  const [useCustomMonumentPrice, setUseCustomMonumentPrice] = useState<boolean>(false);
  const [customMonumentPrice, setCustomMonumentPrice] = useState<number>(0);
  const [customMonumentPriceInput, setCustomMonumentPriceInput] = useState<string>('0');
  const [tileCutReserve, setTileCutReserve] = useState<number>(10);
  const [tileCutReserveInput, setTileCutReserveInput] = useState<string>('10');
  
  const [calculation, setCalculation] = useState<CalculationItem[]>([]);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(`${API_URL}?type=all`);
        const data = await response.json();
        
        if (data.materials) {
          console.log('📦 Загружены материалы из API:', data.materials);
          setMaterialsData(data.materials);
        }
        
        if (data.tiles && data.tiles.length > 0) {
          console.log('🔲 Загружены плитки из API:', data.tiles);
          setTileTypesData(data.tiles);
        }
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };

    loadData();

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('👁️ Страница стала видимой, обновляю данные...');
        loadData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    calculateCost();
  }, [length, width, omostkaWidth, selectedTileType, selectedBorder, selectedFence, selectedMonument, monumentCount, includeOmostka, includeBorder, includeFence, includeMonument, includeTile, includeCrumb, crumbKgPerM2, crumbPricePerKg, tileSize, materialsData, borderWidth, tileCutReserve, tileTypesData, useCustomMonumentPrice, customMonumentPrice]);

  const generatePDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    let yPosition = margin;

    const visualElement = document.getElementById('visualization-svg');
    if (visualElement) {
      const canvas = await html2canvas(visualElement, { 
        scale: 2, 
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        logging: false
      });
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pageWidth - 2 * margin;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
      yPosition += imgHeight + 5;
    }

    if (yPosition > pageHeight - 100) {
      pdf.addPage();
      yPosition = margin;
    }

    const tableElement = document.getElementById('calculation-table');
    if (tableElement) {
      const canvas = await html2canvas(tableElement, { 
        scale: 2, 
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        logging: false
      });
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pageWidth - 2 * margin;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      if (yPosition + imgHeight > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      
      pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
    }

    pdf.save(`smeta-blagoustroistvo-${new Date().getTime()}.pdf`);
  };

  const calculateCost = () => {
    const items: CalculationItem[] = [];
    
    const currentTile = tileTypesData.find(t => t.id === selectedTileType);
    if (!currentTile) return;
    
    const effectiveBorderWidth = includeBorder ? borderWidth : 0;
    const innerLength = length - 2 * effectiveBorderWidth;
    const innerWidth = width - 2 * effectiveBorderWidth;
    const tileArea = includeBorder ? innerLength * innerWidth : length * width;
    const tileMaterial = tileTypesData.find(t => t.id === selectedTileType);
    
    if (includeTile && tileMaterial) {
      const tileSizeM2 = tileSize * tileSize;
      const tileAreaWithReserve = tileArea * (1 + tileCutReserve / 100);
      const tileCount = Math.ceil(tileAreaWithReserve / tileSizeM2);
      const tileSizeCm = Math.round(tileSize * 100);
      const categoryName = tileMaterial.category === 'granite' ? 'гранитная' : 'бетонная';
      items.push({
        name: `Плитка ${categoryName} "${tileMaterial.name}"`,
        quantity: parseFloat(tileAreaWithReserve.toFixed(2)),
        unit: tileMaterial.unit,
        price: tileMaterial.pricePerUnit,
        total: parseFloat((tileAreaWithReserve * tileMaterial.pricePerUnit).toFixed(2)),
      });
      items.push({
        name: `└─ Количество плиток ${tileSizeCm}×${tileSizeCm} см (с запасом ${tileCutReserve}%)`,
        quantity: tileCount,
        unit: 'шт',
        price: 0,
        total: 0,
      });
    }

    const effectiveOmostkaWidth = includeOmostka ? omostkaWidth : 0;
    const outerLength = length + 2 * effectiveOmostkaWidth;
    const outerWidth = width + 2 * effectiveOmostkaWidth;
    const outerArea = outerLength * outerWidth;
    const fullInnerArea = length * width;
    const omostkaArea = outerArea - fullInnerArea;
    
    if (includeOmostka && omostkaArea > 0) {
      items.push({
        name: 'Отмостка',
        quantity: parseFloat(omostkaArea.toFixed(2)),
        unit: tileMaterial.unit,
        price: tileMaterial.pricePerUnit,
        total: parseFloat((omostkaArea * tileMaterial.pricePerUnit).toFixed(2)),
      });
    }

    const perimeterLength = includeOmostka ? outerLength : length;
    const perimeterWidth = includeOmostka ? outerWidth : width;
    const perimeter = 2 * (perimeterLength + perimeterWidth);

    if (includeBorder && materialsData.border.find(m => m.id === selectedBorder)) {
      const borderMaterial = materialsData.border.find(m => m.id === selectedBorder)!;
      items.push({
        name: borderMaterial.name,
        quantity: parseFloat(perimeter.toFixed(2)),
        unit: borderMaterial.unit,
        price: borderMaterial.pricePerUnit,
        total: parseFloat((perimeter * borderMaterial.pricePerUnit).toFixed(2)),
      });
    }

    if (includeFence && materialsData.fence.find(m => m.id === selectedFence)) {
      const fenceMaterial = materialsData.fence.find(m => m.id === selectedFence)!;
      items.push({
        name: fenceMaterial.name,
        quantity: parseFloat(perimeter.toFixed(2)),
        unit: fenceMaterial.unit,
        price: fenceMaterial.pricePerUnit,
        total: parseFloat((perimeter * fenceMaterial.pricePerUnit).toFixed(2)),
      });
    }

    if (includeMonument && materialsData.monument && materialsData.monument.find(m => m.id === selectedMonument)) {
      const monumentMaterial = materialsData.monument.find(m => m.id === selectedMonument)!;
      const monumentPrice = useCustomMonumentPrice ? customMonumentPrice : monumentMaterial.pricePerUnit;
      
      items.push({
        name: useCustomMonumentPrice 
          ? `Памятник нетиповой (с установкой)`
          : `${monumentMaterial.name} (с установкой)`,
        quantity: monumentCount,
        unit: monumentMaterial.unit,
        price: monumentPrice,
        total: parseFloat((monumentCount * monumentPrice).toFixed(2)),
      });
    }

    if (includeCrumb) {
      const crumbArea = includeOmostka ? outerArea : tileArea;
      const crumbQuantityKg = crumbArea * crumbKgPerM2;
      items.push({
        name: 'Крошка гранитная',
        quantity: parseFloat(crumbArea.toFixed(2)),
        unit: 'м²',
        price: crumbKgPerM2 * crumbPricePerKg,
        total: parseFloat((crumbQuantityKg * crumbPricePerKg).toFixed(2)),
      });
      items.push({
        name: '└─ Вес крошки',
        quantity: parseFloat(crumbQuantityKg.toFixed(2)),
        unit: 'кг',
        price: 0,
        total: 0,
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

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="length" className="flex items-center gap-2">
                    <Icon name="ArrowLeftRight" size={16} />
                    Ширина (м)
                  </Label>
                  <Input
                    id="length"
                    type="number"
                    step="0.1"
                    min="0.5"
                    value={lengthInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      setLengthInput(val);
                      if (val === '' || val === '-') {
                        setLength(0);
                        return;
                      }
                      const num = parseFloat(val);
                      if (!isNaN(num)) {
                        setLength(num);
                      }
                    }}
                    className="text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="width" className="flex items-center gap-2">
                    <Icon name="ArrowUpDown" size={16} />
                    Длина (м)
                  </Label>
                  <Input
                    id="width"
                    type="number"
                    step="0.1"
                    min="0.5"
                    value={widthInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      setWidthInput(val);
                      if (val === '' || val === '-') {
                        setWidth(0);
                        return;
                      }
                      const num = parseFloat(val);
                      if (!isNaN(num)) {
                        setWidth(num);
                      }
                    }}
                    className="text-lg"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4 p-4 rounded-lg border-2 border-indigo-100 bg-indigo-50/30">
                <div className="flex items-center justify-between">
                  <Label htmlFor="tile" className="flex items-center gap-2 text-base font-semibold">
                    <Icon name="Grid3x3" size={20} />
                    Плитка {Math.round(tileSize * 100)}×{Math.round(tileSize * 100)} см
                  </Label>
                  <Button
                    variant={includeTile ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setIncludeTile(!includeTile);
                      if (!includeTile) setIncludeCrumb(false);
                    }}
                  >
                    {includeTile ? 'Включена' : 'Выключена'}
                  </Button>
                </div>
                {includeTile && (
                  <>
                    <div className="space-y-3">
                      <Label className="text-sm text-muted-foreground">
                        Материал плитки
                      </Label>
                      <div className="flex gap-2">
                        <Button
                          variant={tileCategory === 'concrete' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            setTileCategory('concrete');
                            const firstConcrete = tileTypesData.find(t => t.category === 'concrete');
                            if (firstConcrete) {
                              setSelectedTileType(firstConcrete.id);
                              setSelectedTile('concrete');
                              if (!firstConcrete.sizes.includes(tileSize)) {
                                setTileSize(firstConcrete.sizes[0]);
                              }
                            }
                          }}
                          className="flex-1"
                        >
                          Бетонная
                        </Button>
                        <Button
                          variant={tileCategory === 'granite' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            setTileCategory('granite');
                            const firstGranite = tileTypesData.find(t => t.category === 'granite');
                            if (firstGranite) {
                              setSelectedTileType(firstGranite.id);
                              setSelectedTile('granite');
                              if (!firstGranite.sizes.includes(tileSize)) {
                                setTileSize(firstGranite.sizes[0]);
                              }
                            }
                          }}
                          className="flex-1"
                        >
                          Гранитная
                        </Button>
                      </div>
                    </div>

                    {(() => {
                      const currentTile = tileTypesData.find(t => t.id === selectedTileType);
                      const availableTiles = tileTypesData.filter(t => t.category === tileCategory);
                      
                      return (
                        <>
                          <div className="space-y-3">
                            <Label className="text-sm text-muted-foreground">
                              Вид плитки
                            </Label>
                            <div className="grid grid-cols-2 gap-3">
                              {availableTiles.map((tile) => (
                                <div
                                  key={tile.id}
                                  onClick={() => {
                                    setSelectedTileType(tile.id);
                                    setSelectedTile(tile.category);
                                    if (!tile.sizes.includes(tileSize)) {
                                      setTileSize(tile.sizes[0]);
                                    }
                                  }}
                                  className={`cursor-pointer bg-white border-2 rounded-lg p-3 space-y-2 transition-all hover:shadow-md ${
                                    selectedTileType === tile.id 
                                      ? 'border-indigo-500 ring-2 ring-indigo-200' 
                                      : 'border-gray-200 hover:border-indigo-300'
                                  }`}
                                >
                                  <div className="flex items-center justify-center">
                                    <img 
                                      src={tile.image}
                                      alt={tile.name}
                                      className="w-20 h-20 rounded object-cover"
                                    />
                                  </div>
                                  <p className="text-center text-sm font-semibold text-gray-800">{tile.name}</p>
                                  <p className="text-xs text-center text-gray-500">{tile.pricePerUnit} ₽/м²</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {currentTile && (
                            <div className="space-y-2">
                              <Label htmlFor="tile-size" className="text-sm text-muted-foreground">
                                Размер плитки
                              </Label>
                              <div className="flex gap-2 flex-wrap">
                                {currentTile.sizes.map((size) => {
                                  const sizeCm = Math.round(size * 100);
                                  return (
                                    <Button
                                      key={size}
                                      variant={tileSize === size ? 'default' : 'outline'}
                                      size="sm"
                                      onClick={() => setTileSize(size)}
                                      className="flex-1"
                                    >
                                      {sizeCm}×{sizeCm} см
                                    </Button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })()}
                    <div className="space-y-2">
                      <Label htmlFor="tile-cut-reserve" className="text-sm text-muted-foreground flex items-center gap-2">
                        <Icon name="Scissors" size={14} />
                        Запас на подрезку (%)
                      </Label>
                      <Input
                        id="tile-cut-reserve"
                        type="number"
                        step="1"
                        min="0"
                        max="50"
                        value={tileCutReserveInput}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTileCutReserveInput(val);
                          if (val === '' || val === '-') {
                            setTileCutReserve(0);
                            return;
                          }
                          const num = parseFloat(val);
                          if (!isNaN(num)) {
                            setTileCutReserve(num);
                          }
                        }}
                        className="text-sm"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-4 p-4 rounded-lg border-2 border-purple-100 bg-purple-50/30">
                <div className="flex items-center justify-between">
                  <Label htmlFor="border" className="flex items-center gap-2 text-base font-semibold">
                    <Icon name="Square" size={20} />
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
                  <>
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
                    <div className="space-y-2">
                      <Label htmlFor="border-width" className="text-sm text-muted-foreground">
                        Ширина поребрика (м)
                      </Label>
                      <Input
                        id="border-width"
                        type="number"
                        step="0.05"
                        min="0.1"
                        max="1"
                        value={borderWidthInput}
                        onChange={(e) => {
                          const val = e.target.value;
                          setBorderWidthInput(val);
                          if (val === '' || val === '-') {
                            setBorderWidth(0.1);
                            return;
                          }
                          const num = parseFloat(val);
                          if (!isNaN(num)) {
                            setBorderWidth(num);
                          }
                        }}
                        className="text-sm"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-4 p-4 rounded-lg border-2 border-purple-100 bg-purple-50/30">
                <div className="flex items-center justify-between">
                  <Label htmlFor="omostka" className="flex items-center gap-2 text-base font-semibold">
                    <Icon name="Layers" size={20} />
                    Отмостка
                  </Label>
                  <Button
                    variant={includeOmostka ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setIncludeOmostka(!includeOmostka)}
                  >
                    {includeOmostka ? 'Включена' : 'Выключена'}
                  </Button>
                </div>
              </div>

              <div className="space-y-4 p-4 rounded-lg border-2 border-gray-200 bg-gray-50/30">
                <div className="flex items-center justify-between">
                  <Label htmlFor="fence" className="flex items-center gap-2 text-base font-semibold">
                    <Icon name="FenceIcon" size={20} fallback="Box" />
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
                  <>
                    <div className="space-y-3">
                      <Label className="text-sm text-muted-foreground">
                        Материал ограды
                      </Label>
                      <div className="flex gap-2">
                        <Button
                          variant={fenceCategory === 'metal' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            setFenceCategory('metal');
                            const firstMetal = materialsData.fence.find(f => (f as any).category === 'metal');
                            if (firstMetal) {
                              setSelectedFence(firstMetal.id);
                            }
                          }}
                          className="flex-1"
                        >
                          Металлическая
                        </Button>
                        <Button
                          variant={fenceCategory === 'granite' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            setFenceCategory('granite');
                            const firstGranite = materialsData.fence.find(f => (f as any).category === 'granite');
                            if (firstGranite) {
                              setSelectedFence(firstGranite.id);
                            }
                          }}
                          className="flex-1"
                        >
                          Гранитная
                        </Button>
                        <Button
                          variant={fenceCategory === 'forged' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            setFenceCategory('forged');
                            const firstForged = materialsData.fence.find(f => (f as any).category === 'forged');
                            if (firstForged) {
                              setSelectedFence(firstForged.id);
                            }
                          }}
                          className="flex-1"
                        >
                          Кованая
                        </Button>
                      </div>
                    </div>

                    {(() => {
                      const selectedFenceMaterial = materialsData.fence.find(f => f.id === selectedFence);
                      const availableFences = materialsData.fence.filter(f => (f as any).category === fenceCategory);
                      
                      console.log('🔍 Фильтрация оград:');
                      console.log('  Выбранная категория:', fenceCategory);
                      console.log('  Все ограды:', materialsData.fence);
                      console.log('  Доступные ограды:', availableFences);
                      
                      return (
                        <>
                          <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">
                              {availableFences.length > 1 ? `Все варианты (${availableFences.length})` : 'Доступные ограды'}
                            </Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {availableFences.map((mat) => (
                                <div
                                  key={mat.id}
                                  onClick={() => setSelectedFence(mat.id)}
                                  className={`cursor-pointer bg-white border-2 rounded-lg p-3 space-y-2 transition-all hover:shadow-md ${
                                    selectedFence === mat.id 
                                      ? 'border-indigo-500 ring-2 ring-indigo-200 shadow-lg' 
                                      : 'border-gray-200 hover:border-gray-400'
                                  }`}
                                >
                                  {mat.image ? (
                                    <div className="flex items-center justify-center">
                                      <img 
                                        src={mat.image}
                                        alt={mat.name}
                                        className="w-full h-24 rounded object-contain"
                                      />
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-center h-24 bg-gray-100 rounded">
                                      <Icon name="Image" size={32} className="text-gray-400" />
                                    </div>
                                  )}
                                  <p className="text-center text-sm font-semibold text-gray-800 line-clamp-2">{mat.name}</p>
                                  <p className="text-xs text-center text-indigo-600 font-medium">{mat.pricePerUnit} ₽/{mat.unit}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </>
                )}
              </div>

              <div className="space-y-4 p-4 rounded-lg border-2 border-slate-200 bg-slate-50/30">
                <div className="flex items-center justify-between">
                  <Label htmlFor="monument" className="flex items-center gap-2 text-base font-semibold">
                    <Icon name="Landmark" size={20} />
                    Установка памятника
                  </Label>
                  <Button
                    variant={includeMonument ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setIncludeMonument(!includeMonument)}
                  >
                    {includeMonument ? 'Включен' : 'Выключен'}
                  </Button>
                </div>
                {includeMonument && (
                  <>
                    <Select value={selectedMonument} onValueChange={setSelectedMonument}>
                      <SelectTrigger id="monument">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(materialsData.monument || []).map((mat) => (
                          <SelectItem key={mat.id} value={mat.id}>
                            {mat.name} — {mat.pricePerUnit} ₽/{mat.unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="monument-count" className="flex items-center gap-2">
                          <Icon name="Hash" size={16} />
                          Количество
                        </Label>
                        <Select value={monumentCount.toString()} onValueChange={(val) => setMonumentCount(parseInt(val))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 памятник</SelectItem>
                            <SelectItem value="2">2 памятника</SelectItem>
                            <SelectItem value="3">3 памятника</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="monument-position" className="flex items-center gap-2">
                          <Icon name="AlignCenter" size={16} />
                          Положение
                        </Label>
                        <Select value={monumentPosition} onValueChange={setMonumentPosition}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">Слева</SelectItem>
                            <SelectItem value="center">По центру</SelectItem>
                            <SelectItem value="right">Справа</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2 font-medium">
                          <Icon name="Ruler" size={16} />
                          Нетиповой размер
                        </Label>
                        <Button
                          variant={useCustomMonumentPrice ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setUseCustomMonumentPrice(!useCustomMonumentPrice)}
                        >
                          {useCustomMonumentPrice ? 'Включен' : 'Выключен'}
                        </Button>
                      </div>
                      
                      {useCustomMonumentPrice && (
                        <div className="space-y-2 p-3 rounded-lg bg-gray-50 border border-gray-200">
                          <Label htmlFor="custom-monument-price" className="text-sm text-muted-foreground">
                            Цена с установкой (₽/шт)
                          </Label>
                          <Input
                            id="custom-monument-price"
                            type="number"
                            step="100"
                            value={customMonumentPriceInput}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCustomMonumentPriceInput(val);
                              if (val === '' || val === '-') {
                                setCustomMonumentPrice(0);
                                return;
                              }
                              const num = parseFloat(val);
                              if (!isNaN(num)) {
                                setCustomMonumentPrice(num);
                              }
                            }}
                            className="text-lg"
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-4 p-4 rounded-lg border-2 border-amber-100 bg-amber-50/30">
                <div className="flex items-center justify-between">
                  <Label htmlFor="crumb" className="flex items-center gap-2 text-base font-semibold">
                    <Icon name="Sparkles" size={20} />
                    Крошка гранитная
                  </Label>
                  <Button
                    variant={includeCrumb ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setIncludeCrumb(!includeCrumb);
                      if (!includeCrumb) setIncludeTile(false);
                    }}
                  >
                    {includeCrumb ? 'Включена' : 'Выключена'}
                  </Button>
                </div>
                {includeCrumb && (
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="space-y-1">
                      <Label htmlFor="crumbKg" className="text-xs text-muted-foreground">
                        Расход (кг/м²)
                      </Label>
                      <Input
                        id="crumbKg"
                        type="number"
                        step="1"
                        min="1"
                        value={crumbKgPerM2Input}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCrumbKgPerM2Input(val);
                          if (val === '' || val === '-') {
                            setCrumbKgPerM2(0);
                            return;
                          }
                          const num = parseFloat(val);
                          if (!isNaN(num)) {
                            setCrumbKgPerM2(num);
                          }
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="crumbPrice" className="text-xs text-muted-foreground">
                        Цена за кг (₽)
                      </Label>
                      <Input
                        id="crumbPrice"
                        type="number"
                        step="1"
                        min="1"
                        value={crumbPricePerKgInput}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCrumbPricePerKgInput(val);
                          if (val === '' || val === '-') {
                            setCrumbPricePerKg(0);
                            return;
                          }
                          const num = parseFloat(val);
                          if (!isNaN(num)) {
                            setCrumbPricePerKg(num);
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="Eye" size={24} className="text-accent" />
                    Визуализация
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {(length * width).toFixed(2)} м²
                    </div>
                    <div className="text-xs text-muted-foreground font-normal">
                      Площадь участка
                    </div>
                    <div className="text-sm text-muted-foreground font-semibold mt-1">
                      {length.toFixed(2)} × {width.toFixed(2)} м
                    </div>
                  </div>
                </CardTitle>
                <CardDescription>
                  Вид участка сверху
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div id="visualization-svg" className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-4 flex items-center justify-center min-h-[600px] relative">
                  <svg
                    viewBox="0 0 600 600"
                    className="w-full h-full"
                  >
                    <defs>
                      {(() => {
                        const scale = 480 / Math.max(length, width);
                        const borderPixels = includeBorder ? borderWidth * scale : 0;
                        const innerLength = includeBorder ? length - 2 * borderWidth : length;
                        const innerWidth = includeBorder ? width - 2 * borderWidth : width;
                        const innerPixelsWidth = innerLength * scale;
                        const innerPixelsHeight = innerWidth * scale;
                        const patternWidth = (tileSize / innerLength) * innerPixelsWidth;
                        const patternHeight = (tileSize / innerWidth) * innerPixelsHeight;
                        
                        return (
                          <pattern 
                            id="tilePattern" 
                            patternUnits="userSpaceOnUse" 
                            width={patternWidth} 
                            height={patternHeight}
                            x={60 + borderPixels}
                            y={60 + borderPixels}
                          >
                            <rect 
                              width={patternWidth - 1} 
                              height={patternHeight - 1} 
                              fill="#e0e7ff" 
                              stroke="#a5b4fc" 
                              strokeWidth="1"
                            />
                          </pattern>
                        );
                      })()}
                      <pattern id="sandPattern" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
                        <rect width="6" height="6" fill="#fbbf24"/>
                        <circle cx="1" cy="1" r="0.4" fill="#f59e0b" opacity="0.6"/>
                        <circle cx="4" cy="3" r="0.3" fill="#d97706" opacity="0.5"/>
                        <circle cx="2" cy="5" r="0.3" fill="#f59e0b" opacity="0.4"/>
                        <circle cx="5" cy="2" r="0.4" fill="#d97706" opacity="0.5"/>
                      </pattern>
                      <pattern id="omostkaPattern" x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse">
                        <rect width="14" height="14" fill="#f3e8ff" stroke="#e9d5ff" strokeWidth="1"/>
                      </pattern>
                      <pattern id="concreteTexture" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                        <rect width="8" height="8" fill="#9ca3af"/>
                        <circle cx="2" cy="2" r="0.5" fill="#6b7280" opacity="0.4"/>
                        <circle cx="5" cy="4" r="0.5" fill="#6b7280" opacity="0.3"/>
                        <circle cx="6" cy="6" r="0.5" fill="#4b5563" opacity="0.5"/>
                        <circle cx="3" cy="7" r="0.5" fill="#6b7280" opacity="0.3"/>
                        <circle cx="7" cy="1" r="0.5" fill="#4b5563" opacity="0.4"/>
                      </pattern>
                      <pattern id="crumbPattern" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
                        <rect width="4" height="4" fill="#78716c"/>
                        <circle cx="0.5" cy="0.5" r="0.3" fill="#57534e" opacity="0.8"/>
                        <circle cx="2" cy="1" r="0.25" fill="#a8a29e" opacity="0.7"/>
                        <circle cx="3.2" cy="2.5" r="0.35" fill="#44403c" opacity="0.6"/>
                        <circle cx="1" cy="3" r="0.2" fill="#292524" opacity="0.9"/>
                        <circle cx="3" cy="0.3" r="0.3" fill="#a8a29e" opacity="0.5"/>
                        <circle cx="1.5" cy="1.8" r="0.25" fill="#57534e" opacity="0.7"/>
                        <circle cx="2.8" cy="3.5" r="0.2" fill="#292524" opacity="0.8"/>
                      </pattern>
                    </defs>

                    {includeFence && (
                      <rect
                        x={60 - (includeOmostka ? omostkaWidth * 120 : 0) - 15}
                        y={60 - (includeOmostka ? omostkaWidth * 120 : 0) - 15}
                        width={(480 * length / Math.max(length, width)) + (includeOmostka ? omostkaWidth * 240 : 0) + 30}
                        height={(480 * width / Math.max(length, width)) + (includeOmostka ? omostkaWidth * 240 : 0) + 30}
                        fill="none"
                        stroke="#1e293b"
                        strokeWidth="6"
                        strokeDasharray="15,8"
                        rx="8"
                      />
                    )}

                    {includeOmostka && (() => {
                      const tileWidth = 480 * length / Math.max(length, width);
                      const tileHeight = 480 * width / Math.max(length, width);
                      const outerLength = length + 2 * omostkaWidth;
                      const outerWidth = width + 2 * omostkaWidth;
                      const omostkaArea = outerLength * outerWidth - length * width;
                      
                      return (
                        <>
                          <rect
                            x={60 - omostkaWidth * 120}
                            y={60 - omostkaWidth * 120}
                            width={tileWidth + omostkaWidth * 240}
                            height={tileHeight + omostkaWidth * 240}
                            fill="url(#omostkaPattern)"
                            stroke="none"
                            rx="6"
                          />
                          <line 
                            x1={60 - omostkaWidth * 120} 
                            y1={60 - omostkaWidth * 120 - 10} 
                            x2="60" 
                            y2={60 - omostkaWidth * 120 - 10} 
                            stroke="#9333ea" 
                            strokeWidth="2"
                          />
                          <text 
                            x={60 - omostkaWidth * 60} 
                            y={60 - omostkaWidth * 120 - 15} 
                            textAnchor="middle" 
                            className="text-sm fill-purple-700 font-semibold"
                          >
                            {omostkaWidth} м
                          </text>
                          <text 
                            x={60 - omostkaWidth * 120 + (tileWidth + omostkaWidth * 240) / 2} 
                            y={60 - omostkaWidth * 60} 
                            textAnchor="middle" 
                            className="text-base fill-purple-700 font-bold"
                            style={{ paintOrder: 'stroke', stroke: 'white', strokeWidth: 3 }}
                          >
                            Отмостка: {omostkaArea.toFixed(2)} м²
                          </text>
                        </>
                      );
                    })()}

                    <rect
                      x="60"
                      y="60"
                      width={480 * length / Math.max(length, width)}
                      height={480 * width / Math.max(length, width)}
                      fill={includeTile ? "url(#tilePattern)" : includeCrumb ? "url(#crumbPattern)" : "url(#sandPattern)"}
                      stroke="#6366f1"
                      strokeWidth="4"
                      rx="4"
                    />

                    {includeBorder && (() => {
                      const scale = 480 / Math.max(length, width);
                      const borderPixels = borderWidth * scale;
                      const tileWidth = 480 * length / Math.max(length, width);
                      const tileHeight = 480 * width / Math.max(length, width);
                      
                      const innerLength = length - 2 * borderWidth;
                      const innerWidth = width - 2 * borderWidth;
                      const tileAreaInner = innerLength * innerWidth;
                      const borderArea = length * width - tileAreaInner;
                      
                      return (
                        <>
                          <rect
                            x={60}
                            y={60}
                            width={tileWidth}
                            height={borderPixels}
                            fill="url(#concreteTexture)"
                            stroke="#4b5563"
                            strokeWidth="2"
                          />
                          <rect
                            x={60}
                            y={60 + tileHeight - borderPixels}
                            width={tileWidth}
                            height={borderPixels}
                            fill="url(#concreteTexture)"
                            stroke="#4b5563"
                            strokeWidth="2"
                          />
                          <rect
                            x={60}
                            y={60 + borderPixels}
                            width={borderPixels}
                            height={tileHeight - borderPixels * 2}
                            fill="url(#concreteTexture)"
                            stroke="#4b5563"
                            strokeWidth="2"
                          />
                          <rect
                            x={60 + tileWidth - borderPixels}
                            y={60 + borderPixels}
                            width={borderPixels}
                            height={tileHeight - borderPixels * 2}
                            fill="url(#concreteTexture)"
                            stroke="#4b5563"
                            strokeWidth="2"
                          />
                          
                          <rect
                            x={60 + borderPixels}
                            y={60 + borderPixels}
                            width={tileWidth - borderPixels * 2}
                            height={tileHeight - borderPixels * 2}
                            fill={includeTile ? "url(#tilePattern)" : includeCrumb ? "url(#crumbPattern)" : "url(#sandPattern)"}
                            stroke="none"
                          />
                          
                          <line 
                            x1="60" 
                            y1={60 + borderPixels / 2} 
                            x2={60 + borderPixels} 
                            y2={60 + borderPixels / 2} 
                            stroke="#f59e0b" 
                            strokeWidth="2.5"
                          />
                          <text 
                            x={60 + borderPixels / 2} 
                            y={60 + borderPixels / 2 - 3} 
                            textAnchor="middle" 
                            className="text-xs fill-amber-600 font-bold"
                          >
                            {borderWidth}м
                          </text>
                          
                          <text 
                            x={60 + tileWidth / 2} 
                            y={60 + borderPixels / 2 + 4} 
                            textAnchor="middle" 
                            className="text-sm fill-gray-700 font-bold bg-white"
                            style={{ paintOrder: 'stroke', stroke: 'white', strokeWidth: 3 }}
                          >
                            Поребрик: {borderArea.toFixed(2)} м²
                          </text>
                          
                          {includeTile ? (
                            <>
                              <text 
                                x={60 + tileWidth / 2} 
                                y={60 + tileHeight - 25} 
                                textAnchor="middle" 
                                className="text-sm fill-indigo-700 font-bold"
                                style={{ paintOrder: 'stroke', stroke: 'white', strokeWidth: 4 }}
                              >
                                Плитка: {tileAreaInner.toFixed(2)} м² · ≈{Math.ceil(tileAreaInner / (tileSize * tileSize))} шт ({Math.round(tileSize * 100)}×{Math.round(tileSize * 100)} см)
                              </text>

                            </>
                          ) : includeCrumb ? (
                            <>
                              <text 
                                x={60 + tileWidth / 2} 
                                y={60 + tileHeight - 35} 
                                textAnchor="middle" 
                                className="text-lg fill-stone-700 font-bold"
                                style={{ paintOrder: 'stroke', stroke: 'white', strokeWidth: 4 }}
                              >
                                Крошка: {tileAreaInner.toFixed(2)} м²
                              </text>
                              <text 
                                x={60 + tileWidth / 2} 
                                y={60 + tileHeight - 15} 
                                textAnchor="middle" 
                                className="text-sm fill-stone-600 font-semibold"
                                style={{ paintOrder: 'stroke', stroke: 'white', strokeWidth: 3 }}
                              >
                                ≈{Math.ceil(tileAreaInner * crumbKgPerM2)} кг
                              </text>
                            </>
                          ) : (
                            <text 
                              x={60 + tileWidth / 2} 
                              y={60 + tileHeight - 25} 
                              textAnchor="middle" 
                              className="text-lg fill-amber-600 font-bold"
                              style={{ paintOrder: 'stroke', stroke: 'white', strokeWidth: 4 }}
                            >
                              Песок: {tileAreaInner.toFixed(2)} м²
                            </text>
                          )}
                        </>
                      );
                    })()}
                    
                    {!includeBorder && (
                      <>
                        {includeTile ? (
                          <>
                            <text 
                              x={60 + (480 * length / Math.max(length, width)) / 2} 
                              y={60 + (480 * width / Math.max(length, width)) - 35} 
                              textAnchor="middle" 
                              className="text-lg fill-indigo-700 font-bold"
                              style={{ paintOrder: 'stroke', stroke: 'white', strokeWidth: 4 }}
                            >
                              Плитка: {(length * width).toFixed(2)} м²
                            </text>
                            <text 
                              x={60 + (480 * length / Math.max(length, width)) / 2} 
                              y={60 + (480 * width / Math.max(length, width)) - 15} 
                              textAnchor="middle" 
                              className="text-sm fill-indigo-600 font-semibold"
                              style={{ paintOrder: 'stroke', stroke: 'white', strokeWidth: 3 }}
                            >
                              ≈{Math.ceil((length * width) / (tileSize * tileSize))} шт ({Math.round(tileSize * 100)}×{Math.round(tileSize * 100)} см)
                            </text>
                          </>
                        ) : includeCrumb ? (
                          <>
                            <text 
                              x={60 + (480 * length / Math.max(length, width)) / 2} 
                              y={60 + (480 * width / Math.max(length, width)) - 35} 
                              textAnchor="middle" 
                              className="text-lg fill-stone-700 font-bold"
                              style={{ paintOrder: 'stroke', stroke: 'white', strokeWidth: 4 }}
                            >
                              Крошка: {(length * width).toFixed(2)} м²
                            </text>
                            <text 
                              x={60 + (480 * length / Math.max(length, width)) / 2} 
                              y={60 + (480 * width / Math.max(length, width)) - 15} 
                              textAnchor="middle" 
                              className="text-sm fill-stone-600 font-semibold"
                              style={{ paintOrder: 'stroke', stroke: 'white', strokeWidth: 3 }}
                            >
                              ≈{Math.ceil((length * width) * crumbKgPerM2)} кг
                            </text>
                          </>
                        ) : (
                          <text 
                            x={60 + (480 * length / Math.max(length, width)) / 2} 
                            y={60 + (480 * width / Math.max(length, width)) - 25} 
                            textAnchor="middle" 
                            className="text-lg fill-amber-600 font-bold"
                            style={{ paintOrder: 'stroke', stroke: 'white', strokeWidth: 4 }}
                          >
                            Песок: {(length * width).toFixed(2)} м²
                          </text>
                        )}
                      </>
                    )}

                    {includeMonument && (() => {
                      const monumentRealWidth = 0.6;
                      const monumentRealHeight = 1.23;
                      const scale = 480 / Math.max(length, width);
                      const monumentWidth = monumentRealWidth * scale;
                      const monumentHeight = monumentRealHeight * scale;
                      const tileWidth = 480 * length / Math.max(length, width);
                      const tileHeight = 480 * width / Math.max(length, width);
                      
                      const borderPixels = includeBorder ? borderWidth * scale : 0;
                      const innerTileWidth = tileWidth - 2 * borderPixels;
                      const innerTileHeight = tileHeight - 2 * borderPixels;
                      
                      const monumentSpacing = 80;
                      const totalMonumentsWidth = monumentWidth * monumentCount + (monumentCount - 1) * monumentSpacing;
                      let startX = 60 + borderPixels;
                      
                      if (monumentPosition === 'center') {
                        startX = 60 + borderPixels + (innerTileWidth - totalMonumentsWidth) / 2;
                      } else if (monumentPosition === 'left') {
                        startX = 60 + borderPixels + 20;
                      } else if (monumentPosition === 'right') {
                        startX = 60 + borderPixels + innerTileWidth - totalMonumentsWidth - 20;
                      }
                      
                      const monuments = [];
                      const monumentMargin = 20;
                      
                      for (let i = 0; i < monumentCount; i++) {
                        const x = startX + i * (monumentWidth + monumentSpacing);
                        const y = 60 + borderPixels + monumentMargin;
                        
                        monuments.push(
                          <g key={i}>
                            <image
                              href="https://cdn.poehali.dev/files/a518ee57-bdc9-49c8-b4b6-cd71611ef7a7.png"
                              x={x}
                              y={y}
                              width={monumentWidth}
                              height={monumentHeight}
                              preserveAspectRatio="none"
                            />
                            <text
                              x={x + monumentWidth / 2}
                              y={y + monumentHeight / 2}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="text-xs fill-white font-bold"
                              style={{ textShadow: '0 0 3px black, 0 0 3px black' }}
                            >
                              {i + 1}
                            </text>
                          </g>
                        );
                      }
                      return monuments;
                    })()}

                    <text x={60 + (240 * length / Math.max(length, width))} y="40" textAnchor="middle" className="text-lg fill-gray-800 font-bold">
                      {length} м
                    </text>
                    <line x1="60" y1="50" x2={60 + (480 * length / Math.max(length, width))} y2="50" stroke="#374151" strokeWidth="3" markerEnd="url(#arrowhead)"/>
                    
                    <text x="40" y={60 + (240 * width / Math.max(length, width))} textAnchor="middle" className="text-lg fill-gray-800 font-bold" transform={`rotate(-90 40 ${60 + (240 * width / Math.max(length, width))})`}>
                      {width} м
                    </text>
                    <line x1="50" y1="60" x2="50" y2={60 + (480 * width / Math.max(length, width))} stroke="#374151" strokeWidth="3"/>
                  </svg>
                </div>
                
                <Separator className="my-6" />
                
                {includeFence && (() => {
                  const selectedFenceMaterial = materialsData.fence.find(f => f.id === selectedFence);
                  
                  return selectedFenceMaterial ? (
                    <div className="mb-6 p-4 rounded-lg border-2 border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100">
                      <h3 className="font-semibold text-sm text-gray-900 mb-3 flex items-center gap-2">
                        <Icon name="FenceIcon" size={16} fallback="Box" />
                        Выбранная ограда
                      </h3>
                      <div className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-sm">
                        {selectedFenceMaterial.image ? (
                          <img 
                            src={selectedFenceMaterial.image}
                            alt={selectedFenceMaterial.name}
                            className="w-20 h-20 rounded-lg object-contain border-2 border-gray-200 shadow-md flex-shrink-0"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-lg border-2 border-gray-200 shadow-md flex-shrink-0 bg-gray-100 flex items-center justify-center">
                            <Icon name="Image" size={24} className="text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-semibold text-gray-900">{selectedFenceMaterial.name}</p>
                          <p className="text-sm text-gray-600 mt-1">{selectedFenceMaterial.pricePerUnit} ₽/{selectedFenceMaterial.unit}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Периметр: {(2 * (length + width)).toFixed(2)} п.м.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}
                
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-gray-900">Отображение элементов:</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={includeTile ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setIncludeTile(!includeTile);
                        if (!includeTile) setIncludeCrumb(false);
                      }}
                      className="justify-start gap-2"
                    >
                      <div className="w-4 h-4 bg-indigo-600 rounded flex-shrink-0"></div>
                      Плитка
                    </Button>
                    
                    <Button
                      variant={includeBorder ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setIncludeBorder(!includeBorder)}
                      className="justify-start gap-2"
                    >
                      <div className="w-4 h-4 border-2 border-purple-600 rounded flex-shrink-0"></div>
                      Поребрик
                    </Button>
                    
                    <Button
                      variant={includeFence ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setIncludeFence(!includeFence)}
                      className="justify-start gap-2"
                    >
                      <div className="w-4 h-4 border-2 border-dashed border-gray-800 rounded flex-shrink-0"></div>
                      Ограда
                    </Button>
                    
                    <Button
                      variant={includeOmostka ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setIncludeOmostka(!includeOmostka)}
                      className="justify-start gap-2"
                    >
                      <div className="w-4 h-4 bg-purple-200 border border-purple-300 rounded flex-shrink-0"></div>
                      Отмостка
                    </Button>
                    
                    <Button
                      variant={includeMonument ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setIncludeMonument(!includeMonument)}
                      className="justify-start gap-2"
                    >
                      <div className="w-4 h-4 bg-gray-800 rounded flex-shrink-0"></div>
                      Памятник
                    </Button>
                    
                    <Button
                      variant={includeCrumb ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setIncludeCrumb(!includeCrumb);
                        if (!includeCrumb) setIncludeTile(false);
                      }}
                      className="justify-start gap-2"
                    >
                      <Icon name="Sparkles" size={16} className="flex-shrink-0" />
                      Крошка
                    </Button>
                  </div>
                  
                  {includeOmostka && (
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Площадь плитки</div>
                        <div className="text-lg font-bold text-primary">{Number((length * width).toFixed(2))} м²</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Площадь отмостки</div>
                        <div className="text-lg font-bold text-accent">
                          {Number(((length + 2 * omostkaWidth) * (width + 2 * omostkaWidth) - length * width).toFixed(2))} м²
                        </div>
                      </div>
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
                <div id="calculation-table">
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
                      <TableRow key={index} className={item.price === 0 ? 'bg-muted/30' : ''}>
                        <TableCell className={`font-medium ${item.price === 0 ? 'text-muted-foreground text-sm' : ''}`}>
                          {item.name}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.quantity} {item.unit}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.price > 0 ? `${item.price} ₽` : '—'}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {item.total > 0 ? `${item.total.toLocaleString('ru-RU')} ₽` : '—'}
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
                </div>

                <div className="mt-6 flex gap-3">
                  <Button onClick={generatePDF} className="flex-1 gap-2" size="lg">
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