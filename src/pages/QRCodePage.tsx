import { useState, useMemo, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { toPng } from 'html-to-image';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Download, Copy, Trash2, Search, Pencil, Check, X, ImagePlus, Share2 } from 'lucide-react';

interface QRCode {
  id: number;
  label: string;
  upiId: string;
  type: 'Dynamic' | 'Fixed';
  amount?: number;
  color: string;
  logo?: string; // Stored as a base64 data URL
}

const getUpiStringForItem = (qr: QRCode) => {
    const params = new URLSearchParams({
      pa: qr.upiId,
      pn: qr.label || 'Merchant',
    });
    if (qr.type === 'Fixed' && qr.amount) {
      params.set('am', qr.amount.toString());
    }
    params.set('cu', 'INR');
    return `upi://pay?${params.toString()}`;
}

const MotionButton = motion(Button);

const QRCodePage = () => {
  // Form state
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [type, setType] = useState<'Dynamic' | 'Fixed'>('Dynamic');
  const [label, setLabel] = useState('');
  const [qrColor, setQrColor] = useState('#000000');
  const [logoImage, setLogoImage] = useState<string | null>(null);
  
  // App logic state
  const [editingQR, setEditingQR] = useState<QRCode | null>(null);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [selectedQR, setSelectedQR] = useState<QRCode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const qrRef = useRef<HTMLDivElement>(null);

  const [qrCodes, setQrCodes] = useState<QRCode[]>(() => {
    try {
      const savedQRs = localStorage.getItem('qrCodes');
      return savedQRs ? JSON.parse(savedQRs) : [];
    } catch (error) {
      console.error("Failed to parse QR codes from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('qrCodes', JSON.stringify(qrCodes));
    if (!selectedQR && qrCodes.length > 0 && !label) {
      setSelectedQR(qrCodes[0]);
    }
  }, [qrCodes, selectedQR, label]);
  
  const previewData = useMemo(() => {
    const formIsActive = label || upiId;
    if (formIsActive) {
      return { id: 0, label, upiId, type, amount, color: qrColor, logo: logoImage };
    }
    if (selectedQR) {
      return selectedQR;
    }
    return null;
  }, [label, upiId, type, amount, qrColor, logoImage, selectedQR]);

  const upiStringForPreview = useMemo(() => {
    if (!previewData) return '';
    const params = new URLSearchParams({
      pa: previewData.upiId,
      pn: previewData.label || 'Merchant',
    });
    if (previewData.type === 'Fixed' && previewData.amount) {
      params.set('am', previewData.amount.toString());
    }
    params.set('cu', 'INR');
    return `upi://pay?${params.toString()}`;
  }, [previewData]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit
        toast.error("File size exceeds 1MB. Please choose a smaller logo.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoImage(reader.result as string);
        toast.success("Logo added.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = async (format: 'png' | 'svg') => {
    if (!qrRef.current || !previewData) return;
    const filename = `${previewData.label.replace(/\s+/g, '-')}.${format}`;

    try {
      if (format === 'png') {
        const dataUrl = await toPng(qrRef.current, { cacheBust: true });
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        link.click();
      } else { // svg
        const svgElement = qrRef.current.querySelector('svg');
        if (!svgElement) throw new Error("SVG element not found");
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement);
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
      toast.success(`QR Code downloaded as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Download failed:', error);
      toast.error("Failed to download QR Code.");
    }
  };

  const handleShare = async () => {
    if (!qrRef.current || !previewData) return;
    try {
      const dataUrl = await toPng(qrRef.current, { cacheBust: true });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `${previewData.label.replace(/\s+/g, '-')}.png`, { type: blob.type });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `QR Code for ${previewData.label}`,
          text: `Scan this QR code to pay ${previewData.label}.`,
          files: [file],
        });
      } else {
        throw new Error("Sharing not supported.");
      }
    } catch (error) {
      console.error("Share failed:", error);
      toast.error("Could not share QR code. Your browser may not support it.");
    }
  };
  
  const resetForm = () => {
    setLabel('');
    setUpiId('');
    setType('Dynamic');
    setAmount(undefined);
    setQrColor('#000000');
    setEditingQR(null);
    setLogoImage(null);
    setSelectedQR(qrCodes.length > 0 ? qrCodes[0] : null);
  }

  const handleSaveOrUpdate = () => {
    if (!upiId || !label) {
      toast.error("UPI ID and Label are required.");
      return;
    }
    setSaveState('saving');
    const newQRCodeData: QRCode = {
      id: editingQR ? editingQR.id : Date.now(),
      label, upiId, type,
      amount: type === 'Fixed' ? amount : undefined,
      color: qrColor,
      logo: logoImage,
    };
    const updatedQRs = editingQR
      ? qrCodes.map(qr => qr.id === editingQR.id ? newQRCodeData : qr)
      : [newQRCodeData, ...qrCodes];
    
    setQrCodes(updatedQRs);
    toast.success(editingQR ? "QR Code updated!" : "QR Code saved!");
    resetForm();
    setSelectedQR(newQRCodeData);
    
    setTimeout(() => {
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 1500);
    }, 500);
  };

  const handleDelete = (id: number) => {
    const updatedQRs = qrCodes.filter(qr => qr.id !== id);
    setQrCodes(updatedQRs);
    if (editingQR?.id === id) resetForm();
    if (selectedQR?.id === id) {
      setSelectedQR(updatedQRs.length > 0 ? updatedQRs[0] : null);
    }
    toast.info("QR Code deleted.");
  };

  const handleEdit = (qr: QRCode) => {
    setEditingQR(qr);
    setLabel(qr.label);
    setUpiId(qr.upiId);
    setType(qr.type);
    setAmount(qr.amount);
    setQrColor(qr.color);
    setLogoImage(qr.logo || null);
    setSelectedQR(null); // Form takes precedence
  }
  
  const filteredQRCodes = qrCodes.filter(qr =>
    qr.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isFormValid = upiId && label;

  const cardBg = 'bg-slate-900/50';
  const textPrimary = 'text-slate-100';
  const textSecondary = 'text-slate-400';
  const border = 'border-slate-700';
  const inputBg = 'bg-slate-800';

  return (
    <div className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 w-full text-white">
      {/* Left Column: Form */}
      <motion.div layout className={`lg:col-span-1 space-y-6 ${cardBg} p-6 rounded-lg border ${border}`}>
        <fieldset disabled={saveState === 'saving'} className="space-y-6">
          <h2 className={`text-2xl font-bold ${textPrimary}`}>{editingQR ? "Edit QR Code" : "Create QR Code"}</h2>
          
          <div className="space-y-2">
            <Label htmlFor="upiId" className={textSecondary}>UPI ID</Label>
            <Input id="upiId" name="upiId" value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@bank" className={`${inputBg} ${border}`} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="label" className={textSecondary}>Label / Name</Label>
            <Input id="label" name="label" value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g., John Doe" className={`${inputBg} ${border}`} />
          </div>

          <div className="space-y-2">
            <Label className={textSecondary}>Payment Type</Label>
              <ToggleGroup
                  type="single"
                  value={type}
                  onValueChange={(value: 'Dynamic' | 'Fixed') => { if (value) setType(value); }}
                  className="grid grid-cols-2"
              >
                  <ToggleGroupItem value="Fixed" aria-label="Select Fixed Amount" className="data-[state=on]:bg-indigo-500 data-[state=on]:text-white">Fixed Amount</ToggleGroupItem>
                  <ToggleGroupItem value="Dynamic" aria-label="Select Any Amount" className="data-[state=on]:bg-indigo-500 data-[state=on]:text-white">Any Amount</ToggleGroupItem>
              </ToggleGroup>
          </div>

          <AnimatePresence>
            {type === 'Fixed' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2 overflow-hidden"
              >
                <Label htmlFor="amount" className={textSecondary}>Amount (₹)</Label>
                <Input id="amount" name="amount" type="number" value={amount ?? ''} onChange={e => setAmount(e.target.value ? Number(e.target.value) : undefined)} placeholder="e.g., 100" className={`${inputBg} ${border}`} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <Label htmlFor="qrColor" className={textSecondary}>QR Code Color</Label>
            <div className="flex items-center gap-2">
              <Input id="qrColor" type="color" value={qrColor} onChange={e => setQrColor(e.target.value)} className={`${inputBg} ${border} p-1 h-10 w-14 cursor-pointer`} />
              <Input value={qrColor} onChange={e => setQrColor(e.target.value)} placeholder="#000000" className={`${inputBg} ${border} w-full`} />
            </div>
          </div>

          <div className="space-y-2">
            <Label className={textSecondary}>Embed Logo (optional)</Label>
            <Label
              htmlFor="logo-upload"
              className={`mt-1 flex justify-center rounded-lg border-2 border-dashed ${border} px-6 py-8 cursor-pointer hover:border-indigo-500 transition-colors`}
            >
              <div className="text-center">
                <ImagePlus className={`mx-auto h-10 w-10 ${textSecondary}`} />
                <div className="mt-4 flex text-sm leading-6 text-gray-400">
                  <p className="pl-1">{logoImage ? "Click to change logo" : "Click to upload a logo"}</p>
                </div>
                <p className="text-xs leading-5 text-gray-400">PNG, JPG, SVG up to 1MB</p>
              </div>
            </Label>
            <Input id="logo-upload" type="file" accept="image/png, image/jpeg, image/svg+xml" onChange={handleLogoChange} className="sr-only" />

            <AnimatePresence>
            {logoImage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 flex items-center justify-between rounded-lg bg-slate-800 p-2">
                  <div className="flex items-center gap-3">
                    <img src={logoImage} alt="logo preview" className="h-10 w-10 rounded-md object-contain bg-white p-1" />
                    <span className="text-sm font-medium text-slate-300 truncate">Logo ready to be embedded.</span>
                  </div>
                  <MotionButton onClick={() => {
                    setLogoImage(null);
                    const fileInput = document.getElementById('logo-upload') as HTMLInputElement;
                    if (fileInput) fileInput.value = '';
                  }} variant="ghost" size="icon" className="text-slate-400 hover:text-white flex-shrink-0" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <X className="h-5 w-5" />
                  </MotionButton>
                </div>
              </motion.div>
            )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <MotionButton onClick={handleSaveOrUpdate} disabled={!isFormValid || saveState === 'saving'} className="w-full transition-all duration-200 bg-indigo-600 hover:bg-indigo-700 text-white" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              {saveState === 'saving' ? 'Saving...' :
              saveState === 'saved' ? <><Check className="mr-2 h-4 w-4" /> Saved!</> :
              editingQR ? 'Update QR Code' : 'Create & Save QR Code'
              }
            </MotionButton>
            {(editingQR || label || upiId) && (
              <MotionButton onClick={resetForm} variant="secondary" className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <X className="mr-2 h-4 w-4" /> Cancel
              </MotionButton>
            )}
          </div>
        </fieldset>
      </motion.div>
      
      {/* Middle Column: List */}
      <div className={`lg:col-span-1 space-y-4`}>
        <div className={`${cardBg} p-6 rounded-lg border ${border}`}>
          <h2 className={`text-xl font-bold mb-4 ${textPrimary} flex items-center`}><QrCode className="mr-2" />My QR Codes</h2>
          <div className="relative mb-4">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${textSecondary}`} />
            <Input placeholder="Search by label..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`${inputBg} ${border} pl-10`} />
          </div>
          <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-1">
            <AnimatePresence>
              {filteredQRCodes.length > 0 ? filteredQRCodes.map(qr => (
                <motion.div
                  key={qr.id}
                  layout
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
                  onClick={() => { resetForm(); setSelectedQR(qr); }} 
                  className={`group p-3 rounded-lg flex items-center justify-between cursor-pointer transition-all border origin-top ${selectedQR?.id === qr.id ? 'bg-indigo-900/50 border-indigo-500' : 'border-transparent bg-slate-800 hover:bg-slate-700/50'}`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-1 bg-white rounded-md flex-shrink-0">
                        <QRCodeSVG
                            value={getUpiStringForItem(qr)}
                            size={32}
                            bgColor={"#ffffff"}
                            fgColor={qr.color}
                            level={"L"}
                            includeMargin={false}
                            imageSettings={qr.logo ? {
                                src: qr.logo,
                                height: 8,
                                width: 8,
                                excavate: true,
                            } : undefined}
                        />
                    </div>
                    <div className='truncate'>
                      <p className={`${textPrimary} font-semibold truncate`}>{qr.label}</p>
                      <p className={`${textSecondary} text-sm`}>{qr.type}{qr.type === 'Fixed' && qr.amount ? `: ₹${qr.amount}` : ''}</p>
                    </div>
                  </div>
                  <div className={`flex items-center space-x-1 flex-shrink-0 transition-opacity duration-300 ${selectedQR?.id === qr.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <motion.div 
                        onClick={(e) => { e.stopPropagation(); handleEdit(qr); }}
                        className="p-2 rounded-full hover:bg-blue-500/20 cursor-pointer" 
                        aria-label="Edit QR Code"
                        whileHover={{ scale: 1.1 }} 
                        whileTap={{ scale: 0.9 }}
                    >
                        <Pencil size={16} className="text-blue-500" />
                    </motion.div>
                    <motion.div 
                        onClick={(e) => { e.stopPropagation(); handleDelete(qr.id); }}
                        className="p-2 rounded-full hover:bg-red-500/20 cursor-pointer" 
                        aria-label="Delete QR Code"
                        whileHover={{ scale: 1.1 }} 
                        whileTap={{ scale: 0.9 }}
                    >
                        <Trash2 size={16} className="text-red-500" />
                    </motion.div>
                  </div>
                </motion.div>
              )) : <p className={textSecondary}>{searchQuery ? 'No matching QR codes found.' : 'No saved QR codes yet.'}</p>}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Right Column: Preview */}
      <div className="lg:col-span-1">
        <Card className={`${cardBg} border ${border} sticky top-24`}>
          <CardHeader>
            <h2 className={`text-xl font-bold ${textPrimary}`}>Live Preview</h2>
          </CardHeader>
          <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
            {previewData ? (
              <>
                <div ref={qrRef} className="p-4 bg-white rounded-lg inline-block">
                  <QRCodeSVG
                    value={upiStringForPreview}
                    size={256}
                    bgColor={"#ffffff"}
                    fgColor={previewData.color}
                    level={"H"}
                    includeMargin={false}
                    imageSettings={previewData.logo ? {
                        src: previewData.logo,
                        height: 48,
                        width: 48,
                        excavate: true,
                    } : undefined}
                  />
                </div>
                <div className="text-center">
                  <p className={`font-bold text-lg ${textPrimary}`}>{previewData.label}</p>
                  {previewData.type === 'Fixed' && previewData.amount && <p className={`${textSecondary}`}>Amount: ₹{previewData.amount}</p>}
                  <p className={`text-xs ${textSecondary} break-all`}>{previewData.upiId}</p>
                </div>
                <div className="w-full grid grid-cols-2 gap-3 pt-2">
                  <MotionButton onClick={() => handleDownload('png')} variant="outline" className="w-full" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Download className="mr-2 h-4 w-4"/>PNG</MotionButton>
                  <MotionButton onClick={() => handleDownload('svg')} variant="outline" className="w-full" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Download className="mr-2 h-4 w-4"/>SVG</MotionButton>
                </div>
                {navigator.share && <MotionButton onClick={handleShare} variant="outline" className="w-full col-span-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Share2 className="mr-2 h-4 w-4" />Share</MotionButton>}
              </>
            ) : (
              <div className="h-[400px] flex flex-col items-center justify-center text-center animate-pulse">
                  <div className="w-64 h-64 bg-slate-700 rounded-lg"></div>
                  <div className="w-48 h-6 bg-slate-700 rounded-md mt-4"></div>
                  <div className="w-32 h-4 bg-slate-700 rounded-md mt-2"></div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QRCodePage; 