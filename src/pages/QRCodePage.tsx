import { useState, useMemo, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { toPng } from 'html-to-image';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Download, Copy, Trash2, Search, Pencil, Check, X, ImagePlus, Share2, Languages, BarChart3, TrendingUp, Users, CreditCard } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supportedLngs } from '../i18n';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import QRCodeStyling, { DotType, CornerSquareType } from 'qr-code-styling';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { motion, AnimatePresence } from 'framer-motion';
import QRAnalytics from '@/components/QRAnalytics';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Event tracking interfaces
interface ScanEvent {
  id: string;
  timestamp: string;
  deviceInfo?: {
    userAgent: string;
    platform: string;
    language: string;
  };
  location?: {
    latitude?: number;
    longitude?: number;
    city?: string;
    country?: string;
  };
  ipAddress?: string;
  referrer?: string;
}

interface PaymentEvent {
  id: string;
  timestamp: string;
  amount: number;
  status: 'success' | 'failed' | 'pending';
  transactionId?: string;
  paymentMethod?: string;
  failureReason?: string;
  deviceInfo?: {
    userAgent: string;
    platform: string;
  };
}

interface QRCode {
  id: number;
  label: string;
  upiId: string;
  type: 'Dynamic' | 'Fixed';
  amount?: number;
  color: string;
  logo?: string; // Stored as a base64 data URL
  dotStyle?: DotType;
  cornerStyle?: CornerSquareType;
  displayText?: string;
  // Enhanced tracking fields
  createdAt: string;
  lastScannedAt?: string;
  totalAmount?: number; // Total amount received
  successfulPayments?: number;
  failedPayments?: number;
  scanHistory?: ScanEvent[];
  paymentHistory?: PaymentEvent[];
  uniqueScanners?: number; // Track unique devices/users
  conversionRate?: number; // Percentage of scans that led to payments
}

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const { theme } = useOutletContext<{ theme: 'light' | 'dark' }>();

  const triggerStyle = theme === 'dark'
    ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100';
  
  const popoverContentStyle = theme === 'dark'
    ? 'bg-slate-800 border-slate-700 text-slate-100'
    : 'bg-white border-slate-200 text-slate-900';
    
  const itemStyle = theme === 'dark'
    ? 'hover:bg-slate-700 text-slate-100'
    : 'hover:bg-slate-100 text-slate-900';
    
  const selectedItemStyle = theme === 'dark'
    ? 'bg-slate-700 font-semibold'
    : 'bg-slate-100 font-semibold';

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className={`flex items-center gap-2 border ${triggerStyle}`}>
          <Languages className="h-4 w-4" />
          <span>{supportedLngs[i18n.language as keyof typeof supportedLngs]}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`w-48 p-1 border ${popoverContentStyle}`}>
        {Object.entries(supportedLngs).map(([code, name]) => (
          <Button
            key={code}
            variant="ghost"
            className={`w-full justify-start ${itemStyle} ${i18n.language === code ? selectedItemStyle : ''}`}
            onClick={() => i18n.changeLanguage(code)}
          >
            {name}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  );
};

const qrStylingOptions = {
  dots: ['rounded', 'dots', 'classy', 'classy-rounded', 'square', 'extra-rounded'],
  corners: ['dot', 'square', 'extra-rounded'],
};

const QRCodePage = () => {
  const { t } = useTranslation();
  // Form state
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [type, setType] = useState<'Dynamic' | 'Fixed'>('Dynamic');
  const [label, setLabel] = useState('');
  const [qrColor, setQrColor] = useState('#000000');
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [dotStyle, setDotStyle] = useState<DotType>('square');
  const [cornerStyle, setCornerStyle] = useState<CornerSquareType>('square');
  const [upiIdError, setUpiIdError] = useState<string | null>(null);
  const [displayText, setDisplayText] = useState('');
  
  // App logic state
  const [editingQR, setEditingQR] = useState<QRCode | null>(null);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [selectedQR, setSelectedQR] = useState<QRCode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const qrRef = useRef<HTMLDivElement>(null);
  const qrRefContainer = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [qrCodes, setQrCodes] = useState<QRCode[]>(() => {
    try {
      const savedQRs = localStorage.getItem('qrCodes');
      return savedQRs ? JSON.parse(savedQRs) : [];
    } catch (error) {
      console.error("Failed to parse QR codes from localStorage", error);
      return [];
    }
  });

  const previewData = useMemo(() => {
    const formIsActive = label || upiId || displayText;
    if (formIsActive) {
      return { id: 0, label, upiId, type, amount, color: qrColor, logo: logoImage, dotStyle, cornerStyle, displayText };
    }
    if (selectedQR) {
      return selectedQR;
    }
    return null;
  }, [label, upiId, type, amount, qrColor, logoImage, dotStyle, cornerStyle, selectedQR, displayText]);

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

  const validateUpiId = (id: string) => {
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    if (!id) {
      setUpiIdError(null);
      return;
    }
    if (!upiRegex.test(id)) {
      setUpiIdError('Invalid UPI ID format. Should be like name@bank.');
    } else {
      setUpiIdError(null);
    }
  };

  const handleUpiIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUpiId = e.target.value;
    setUpiId(newUpiId);
    validateUpiId(newUpiId);
  };

  const qrCode = useMemo(() => new QRCodeStyling({
    width: 256,
    height: 256,
    type: 'svg',
    data: upiStringForPreview || undefined,
    image: undefined, // Logo is now displayed outside
    dotsOptions: {
      color: previewData?.color || '#000000',
      type: previewData?.dotStyle || 'square',
    },
    cornersSquareOptions: {
      type: previewData?.cornerStyle || 'square',
      color: previewData?.color || '#000000',
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.4,
      margin: 4,
    },
  }), [previewData, upiStringForPreview]);

  useEffect(() => {
    localStorage.setItem('qrCodes', JSON.stringify(qrCodes));
    if (previewData) {
      qrCode.update({ data: upiStringForPreview });
    }
  }, [qrCodes, upiStringForPreview, previewData, qrCode]);
  
  useEffect(() => {
    if (qrRef.current) {
      qrRef.current.innerHTML = '';
      qrCode.append(qrRef.current);
    }
  }, [qrCode]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoImage(reader.result as string);
        toast.success(t("toasts.logoAdded"));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = async (format: 'png' | 'svg') => {
    if (!previewData) return;
    const filename = `${previewData.label.replace(/\s+/g, '-') || 'qrcode'}`;
    qrCode.download({ name: filename, extension: format });
    toast.success(t("toasts.downloadSuccess", { format: format.toUpperCase() }));
  };

  const handleShare = async () => {
    if (!previewData) return;
    try {
      const rawData = await qrCode.getRawData('png');
      if (!rawData) throw new Error("Could not generate QR code data.");
      
      const blob = rawData instanceof Blob ? rawData : new Blob([rawData], { type: 'image/png' });
      
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
      toast.error(t("toasts.shareFailed"));
    }
  };
  
  // Copies the generated UPI payment link to the clipboard
  const handleCopyLink = async () => {
    if (!previewData) return;
    try {
      await navigator.clipboard.writeText(upiStringForPreview);
      toast.success(t('toasts.linkCopied'));
    } catch (err) {
      console.error('Copy failed:', err);
      toast.error(t('toasts.copyFailed'));
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
    setDotStyle('square');
    setCornerStyle('square');
    setSelectedQR(null);
    setUpiIdError(null);
    setDisplayText('');
  }

  const handleSelectQR = (qr: QRCode) => {
    resetForm();
    setSelectedQR(qr);
  };

  const handleSaveOrUpdate = () => {
    if (upiIdError) {
      toast.error(upiIdError);
      return;
    }
    if (!upiId || !label) {
      toast.error(t("toasts.requiredFields"));
      return;
    }
    setSaveState('saving');
    const newQRCodeData: QRCode = {
      id: editingQR ? editingQR.id : Date.now(),
      label, upiId, type,
      amount: type === 'Fixed' ? amount : undefined,
      color: qrColor,
      logo: logoImage,
      dotStyle: dotStyle,
      cornerStyle: cornerStyle,
      displayText: displayText,
      createdAt: new Date().toISOString(),
      totalAmount: type === 'Fixed' ? amount : undefined,
      successfulPayments: type === 'Fixed' ? (amount ? 1 : 0) : undefined,
      failedPayments: type === 'Fixed' ? (amount ? 0 : 1) : undefined,
      scanHistory: [],
      paymentHistory: [],
      uniqueScanners: 1,
      conversionRate: type === 'Fixed' ? (amount ? 100 : 0) : undefined,
    };
    const updatedQRs = editingQR
      ? qrCodes.map(qr => qr.id === editingQR.id ? newQRCodeData : qr)
      : [newQRCodeData, ...qrCodes];
    
    setQrCodes(updatedQRs);
    toast.success(editingQR ? t("toasts.qrUpdated") : t("toasts.qrSaved"));
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
    toast.info(t("toasts.qrDeleted"));
  };

  const handleEdit = (qr: QRCode) => {
    setEditingQR(qr);
    setLabel(qr.label);
    setUpiId(qr.upiId);
    validateUpiId(qr.upiId);
    setType(qr.type);
    setAmount(qr.amount);
    setQrColor(qr.color);
    setLogoImage(qr.logo || null);
    setDotStyle(qr.dotStyle || 'square');
    setCornerStyle(qr.cornerStyle || 'square');
    setSelectedQR(null);
    setUpiIdError(null);
    setDisplayText(qr.displayText || '');
  }
  
  const filteredQRCodes = qrCodes.filter(qr =>
    qr.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper to build UPI URI for small preview thumbnails
  const buildUpiString = (data: QRCode) => {
    const params = new URLSearchParams({
      pa: data.upiId,
      pn: data.label || 'Merchant',
    });
    if (data.type === 'Fixed' && data.amount) {
      params.set('am', data.amount.toString());
    }
    params.set('cu', 'INR');
    return `upi://pay?${params.toString()}`;
  };

  const isFormValid = upiId && label;

  const { theme } = useOutletContext<{ theme: 'light' | 'dark' }>();
  // Theme-based variables
  const mainBg = ''; // No outer background
  const cardBg = theme === 'dark' ? 'bg-white/10 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-lg';
  const border = theme === 'dark' ? 'border-slate-700' : 'border-slate-200';
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-[#23263a]';
  const textSecondary = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const inputBg = theme === 'dark' ? 'bg-slate-700 text-slate-100 placeholder-slate-400' : 'bg-white text-gray-800 placeholder-gray-400';
  const placeholderBg = theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200';
  // Additional derived styles
  const listBg = theme === 'dark' ? 'bg-slate-800' : 'bg-white';
  const listHoverBg = theme === 'dark' ? 'hover:bg-slate-700/50' : 'hover:bg-gray-100';
  const selectedBg = theme === 'dark' ? 'bg-indigo-900/50' : 'bg-indigo-100';
  const secondaryButton = theme === 'dark'
    ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
    : 'bg-gray-200 hover:bg-gray-300 text-gray-700';
  const previewButton = theme === 'dark'
    ? 'bg-slate-700 border-slate-600 hover:bg-slate-600 text-slate-200'
    : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-800';
  const fileButton = theme === 'dark' ? 'bg-[#23263a] border-gray-700 text-slate-200 hover:bg-[#181c2a] hover:text-white' : 'bg-white border-[#ececf6] text-[#7c3aed] hover:bg-[#f3f4f6] hover:text-[#23263a]';

  const handleDownloadPDF = async () => {
    if (!qrRefContainer.current || !previewData) {
      toast.error(t("toasts.pdfError"));
      return;
    }
    
    toast.info(t("toasts.generatingPdf"));

    try {
      const canvas = await html2canvas(qrRefContainer.current, {
        scale: 3, // Higher scale for better quality
        backgroundColor: null, // Use element's background
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width + 80, canvas.height + 120] // format based on content
      });

      // Header
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('YourPay', 40, 40);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'normal');
      pdf.text(previewData.label, 40, 60);
      
      // QR Code Image
      pdf.addImage(imgData, 'PNG', 40, 80, canvas.width, canvas.height);
      
      // Footer
      pdf.setFontSize(12);
      pdf.setTextColor(100);
      pdf.text(`UPI ID: ${previewData.upiId}`, 40, canvas.height + 100);
      
      const filename = `${previewData.label.replace(/\s+/g, '-') || 'qrcode'}-poster.pdf`;
      pdf.save(filename);
      
      toast.success(t("toasts.pdfSuccess"));
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error(t("toasts.pdfError"));
    }
  };

  const handleCopyUpiId = async (e: React.MouseEvent, upiId: string) => {
    e.stopPropagation(); // Prevent card selection
    try {
      await navigator.clipboard.writeText(upiId);
      toast.success(t('toasts.upiIdCopied'));
    } catch (err) {
      console.error('Copy failed:', err);
      toast.error(t('toasts.copyFailed'));
    }
  };

  return (
    <div className={`p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto ${mainBg} ${textPrimary}`}>
      {/* Left Column: Form */}
      <div className={`lg:col-span-1 space-y-6 ${cardBg} p-6 rounded-lg border ${border}`}>
        <div className="flex justify-between items-center">
          <h2 className={`text-2xl font-bold ${textPrimary}`}>{editingQR ? t("qrCodePage.editTitle") : t("qrCodePage.createTitle")}</h2>
          <LanguageSwitcher />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="upiId" className={textSecondary}>{t("qrCodePage.upiIdLabel")}</Label>
          <Input id="upiId" name="upiId" value={upiId} onChange={handleUpiIdChange} placeholder={t("qrCodePage.upiIdPlaceholder")} className={`${inputBg} ${border} ${upiIdError ? 'border-red-500' : ''}`} />
          {upiIdError && <p className="text-red-500 text-xs mt-1">{upiIdError}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="label" className={textSecondary}>{t("qrCodePage.nameLabel")}</Label>
          <Input id="label" name="label" value={label} onChange={e => setLabel(e.target.value)} placeholder={t("qrCodePage.namePlaceholder")} className={`${inputBg} ${border}`} />
              </div>

        <div className="space-y-2">
           <Label className={textSecondary}>{t("qrCodePage.paymentTypeLabel")}</Label>
            <ToggleGroup
                type="single"
                value={type}
                onValueChange={(value: 'Dynamic' | 'Fixed') => { if (value) setType(value); }}
                className="grid grid-cols-2"
            >
                <ToggleGroupItem value="Fixed" aria-label={t("qrCodePage.fixedAmount")} className={`border ${border} data-[state=on]:bg-indigo-500 data-[state=on]:border-indigo-500 data-[state=on]:text-white`}>{t("qrCodePage.fixedAmount")}</ToggleGroupItem>
                <ToggleGroupItem value="Dynamic" aria-label={t("qrCodePage.anyAmount")} className={`border ${border} data-[state=on]:bg-indigo-500 data-[state=on]:border-indigo-500 data-[state=on]:text-white`}>{t("qrCodePage.anyAmount")}</ToggleGroupItem>
            </ToggleGroup>
        </div>

        {type === 'Fixed' && (
          <div className="space-y-2">
            <Label htmlFor="amount" className={textSecondary}>{t("qrCodePage.amountLabel")}</Label>
            <Input id="amount" name="amount" type="number" value={amount ?? ''} onChange={e => setAmount(e.target.value ? Number(e.target.value) : undefined)} placeholder={t("qrCodePage.amountPlaceholder")} className={`${inputBg} ${border}`} />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="qrColor" className={textSecondary}>{t("qrCodePage.colorLabel")}</Label>
          <div className="flex items-center gap-2">
            <Input id="qrColor" type="color" value={qrColor} onChange={e => setQrColor(e.target.value)} className={`${inputBg} ${border} p-1 h-10 w-14 cursor-pointer`} />
            <Input value={qrColor} onChange={e => setQrColor(e.target.value)} placeholder="#000000" className={`${inputBg} ${border} w-full`} />
              </div>
            </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dotStyle" className={textSecondary}>{t("qrCodePage.dotStyle")}</Label>
            <Select value={dotStyle} onValueChange={(value) => setDotStyle(value as DotType)}>
              <SelectTrigger id="dotStyle" className={`${inputBg} ${border}`}>
                <SelectValue placeholder={t("qrCodePage.dotStylePlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {qrStylingOptions.dots.map(style => (
                  <SelectItem key={style} value={style}>{style}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cornerStyle" className={textSecondary}>{t("qrCodePage.cornerStyle")}</Label>
            <Select value={cornerStyle} onValueChange={(value) => setCornerStyle(value as CornerSquareType)}>
              <SelectTrigger id="cornerStyle" className={`${inputBg} ${border}`}>
                <SelectValue placeholder={t("qrCodePage.cornerStylePlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {qrStylingOptions.corners.map(style => (
                  <SelectItem key={style} value={style}>{style}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
              </div>

        <div className="space-y-2">
          <Label className={textSecondary}>{t("qrCodePage.logoLabel")}</Label>
          <div className="flex flex-col gap-2">
                <input
              id="logo"
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/svg+xml"
              onChange={handleLogoChange}
              className="hidden"
              tabIndex={-1}
            />
            <div className="flex gap-2 items-center">
              <Button
                type="button"
                variant="outline"
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${fileButton}`}
                onClick={() => fileInputRef.current?.click()}
                aria-label={t("qrCodePage.chooseLogo")}
              >
                <ImagePlus className="h-5 w-5" />
                <span>{logoImage ? t("qrCodePage.changeLogo") : t("qrCodePage.chooseLogo")}</span>
              </Button>
              {logoImage && (
                <Button onClick={() => setLogoImage(null)} variant="ghost" size="icon" aria-label={t("qrCodePage.logoLabel")}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            {logoImage && (
              <div className="flex items-center gap-2 mt-1">
                <img src={logoImage} alt="Logo preview" className={`w-8 h-8 rounded object-contain border ${theme === 'dark' ? 'bg-slate-700 border-slate-600' : 'bg-gray-100 border-gray-300'}`} />
                <span className="text-xs text-slate-400 truncate max-w-[120px]">{t("qrCodePage.logoSelected")}</span>
              </div>
            )}
                </div>
              </div>

        <div className="space-y-2">
          <Label htmlFor="displayText" className={textSecondary}>{t("qrCodePage.displayTextLabel")}</Label>
          <Input id="displayText" name="displayText" value={displayText} onChange={e => setDisplayText(e.target.value)} placeholder={t("qrCodePage.displayTextPlaceholder")} className={`${inputBg} ${border}`} />
            </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleSaveOrUpdate} disabled={!isFormValid || saveState === 'saving'} className="w-full transition-all duration-200 bg-indigo-600 hover:bg-indigo-700 text-white">
            {saveState === 'saving' ? t("qrCodePage.savingButton") :
             saveState === 'saved' ? <><Check className="mr-2 h-4 w-4" /> {t("qrCodePage.savedButton")}</> :
             editingQR ? t("qrCodePage.updateButton") : t("qrCodePage.saveButton")
            }
          </Button>
          {(editingQR || label || upiId) && (
            <Button onClick={resetForm} variant="secondary" className={`w-full ${secondaryButton}`}>
              <X className="mr-2 h-4 w-4" /> {t("qrCodePage.cancelButton")}
            </Button>
          )}
        </div>
      </div>
      
      {/* Middle Column: List */}
      <div className={`lg:col-span-1 space-y-4`}>
        <div className={`${cardBg} p-6 rounded-lg border ${border}`}>
          <h2 className={`text-xl font-bold mb-4 ${textPrimary} flex items-center`}><QrCode className="mr-2" />{t("qrCodePage.myQRCodesTitle")}</h2>
          <div className="relative mb-4">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${textSecondary}`} />
            <Input placeholder={t("qrCodePage.searchPlaceholder")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`${inputBg} ${border} pl-10 rounded-md`} />
          </div>
          <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-1">
            <AnimatePresence>
              {filteredQRCodes.length > 0 ? filteredQRCodes.map((qr, index) => (
                <motion.div
                  key={qr.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  onClick={() => handleSelectQR(qr)} 
                  className={`p-3 rounded-lg flex items-center justify-between cursor-pointer transition-all border ${selectedQR?.id === qr.id ? `${selectedBg} border-indigo-500` : `border-transparent ${listBg} ${listHoverBg}`}`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex items-center justify-center min-w-[40px] h-[40px] rounded overflow-hidden">
                      <QRCodeSVG value={buildUpiString(qr)} size={40} bgColor="transparent" fgColor={theme === 'dark' ? qr.color === '#000000' ? '#ffffff' : qr.color : qr.color } />
              </div>
                    <div className='truncate'>
                      <p className={`${textPrimary} font-semibold truncate`}>{qr.label}</p>
                      <p className={`${textSecondary} text-sm truncate`}>{qr.upiId}</p>
              </div>
            </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <motion.div whileHover={{ scale: 1.1 }} className="flex items-center">
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={(e) => handleCopyUpiId(e, qr.upiId)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); handleEdit(qr); }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className={`max-w-4xl max-h-[90vh] overflow-y-auto ${cardBg} ${textPrimary} border-none`}>
                          <DialogHeader>
                            <DialogTitle className={`flex items-center gap-2 ${textPrimary}`}>
                              <BarChart3 className="h-5 w-5" />
                              {t('analytics.title')} - {qr.label}
                            </DialogTitle>
                          </DialogHeader>
                          <QRAnalytics 
                            qrCode={qr} 
                            theme={theme} 
                          />
                        </DialogContent>
                      </Dialog>
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); handleDelete(qr.id); }}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              )) : (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={textSecondary}>
                  {searchQuery ? t("qrCodePage.noCodesFound") : t("qrCodePage.noSavedCodes")}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Right Column: Preview */}
      <div className="lg:col-span-1">
        <Card className={`${cardBg} border ${border} sticky top-24`}>
          <CardHeader className="p-4">
            <h3 className={`text-lg font-semibold ${textPrimary}`}>{t('qrCodePage.previewTitle')}</h3>
          </CardHeader>
          <CardContent className="p-4 flex flex-col items-center gap-4">
            <AnimatePresence>
              {previewData ? (
                <motion.div
                  key={previewData.id || 'form-preview'}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="w-full flex flex-col items-center"
                >
                  <div className="text-center p-4 bg-white rounded-lg" ref={qrRefContainer}>
                    <div ref={qrRef} className="mx-auto" />
                    {(previewData.logo || previewData.displayText) && (
                      <div className="mt-4 flex flex-col items-center gap-2">
                        {previewData.logo && (
                          <img src={previewData.logo} alt="Logo" className="h-12 w-12 object-contain" />
                        )}
                        {previewData.displayText && (
                          <p className={`font-semibold text-lg text-black`}>{previewData.displayText}</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="w-full grid grid-cols-2 gap-3 pt-4">
                     <Button onClick={() => handleDownload('png')} variant="outline" className={`w-full ${previewButton}`}><Download className="mr-2 h-4 w-4"/>{t("qrCodePage.downloadPng")}</Button>
                     <Button onClick={() => handleDownload('svg')} variant="outline" className={`w-full ${previewButton}`}><Download className="mr-2 h-4 w-4"/>{t("qrCodePage.downloadSvg")}</Button>
                     <Button onClick={handleDownloadPDF} variant="outline" className={`w-full col-span-2 ${previewButton}`}><Download className="mr-2 h-4 w-4"/>{t("buttons.downloadPdf")}</Button>
                  </div>
                   {navigator.share && (
                     <Button onClick={handleShare} variant="outline" className={`w-full col-span-2 mt-3 ${previewButton}`}>
                       <Share2 className="mr-2 h-4 w-4" />{t("qrCodePage.share")}
                     </Button>
                   )}
                   <Button onClick={handleCopyLink} variant="outline" className={`w-full col-span-2 mt-3 ${previewButton}`}>
                     <Copy className="mr-2 h-4 w-4" />{t("qrCodePage.copyLink")}
                   </Button>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[256px] w-[256px] bg-gray-200 dark:bg-slate-700 rounded-lg flex flex-col items-center justify-center text-center p-4">
                  <QrCode className="h-16 w-16 text-gray-400 dark:text-slate-500 mb-4" />
                  <p className={textSecondary}>{t('qrCodePage.noPreview')}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QRCodePage; 