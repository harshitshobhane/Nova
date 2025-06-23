import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  CreditCard, 
  Eye, 
  DollarSign,
  Calendar,
  MapPin,
  Smartphone,
  Globe,
  RefreshCw,
  Download,
  Share2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { DotType, CornerSquareType } from 'qr-code-styling';
import QRTrackingService, { QRCodeAnalytics as QRAnalyticsData } from '@/services/qrTrackingService';

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
  logo?: string;
  dotStyle?: DotType;
  cornerStyle?: CornerSquareType;
  displayText?: string;
  createdAt: string;
  lastScannedAt?: string;
  totalAmount?: number;
  successfulPayments?: number;
  failedPayments?: number;
  scanHistory?: ScanEvent[];
  paymentHistory?: PaymentEvent[];
  uniqueScanners?: number;
  conversionRate?: number;
}

interface QRAnalyticsProps {
  qrCode: QRCode;
  theme: 'light' | 'dark';
}

const trackingService = QRTrackingService.getInstance();

const QRAnalytics: React.FC<QRAnalyticsProps> = ({ qrCode, theme }) => {
  const { t } = useTranslation();
  
  const [isTracking, setIsTracking] = useState(trackingService.isTrackingEnabled(qrCode.id));
  const [analyticsData, setAnalyticsData] = useState<QRAnalyticsData | null>(() => trackingService.getAnalytics(qrCode.id));
  const [activeTab, setActiveTab] = useState<'overview' | 'scans' | 'payments' | 'devices'>('overview');

  const handleUpdate = useCallback((newAnalytics: QRAnalyticsData) => {
    setAnalyticsData(prevData => {
      if (prevData && newAnalytics.totalScans > prevData.totalScans) {
        toast.info(t('analytics.newScanDetected'));
      }
      return newAnalytics;
    });
  }, [t]);

  useEffect(() => {
    trackingService.subscribe(qrCode.id, handleUpdate);
    
    // Ensure we have the latest data on mount, in case it was updated in the background
    const initialData = trackingService.getAnalytics(qrCode.id);
    if (initialData) {
      setAnalyticsData(initialData);
    }

    return () => {
      trackingService.unsubscribe(qrCode.id, handleUpdate);
    };
  }, [qrCode.id, handleUpdate]);

  // Theme-aware styles
  const cardBg = theme === 'dark' ? 'bg-[#23263a]' : 'bg-white';
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-slate-300' : 'text-slate-600';
  const border = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  // Analytics calculations
  const totalScans = analyticsData?.totalScans || 0;
  const totalPayments = analyticsData?.paymentHistory?.length || 0;
  const successfulPayments = analyticsData?.successfulPayments || 0;
  const totalAmount = analyticsData?.totalAmount || 0;
  const conversionRate = analyticsData?.conversionRate || 0;
  const uniqueScanners = analyticsData?.uniqueScanners || 0;

  // Device analytics
  const deviceStats = analyticsData?.deviceBreakdown || {};

  // Location analytics
  const locationStats = analyticsData?.locationBreakdown || {};

  // Time-based analytics
  const scansByDay = analyticsData?.timeBreakdown || {};

  const startTracking = () => {
    trackingService.startTracking(qrCode.id);
    setIsTracking(true);
    toast.success(t('analytics.trackingStarted'));
  };

  const stopTracking = () => {
    trackingService.stopTracking(qrCode.id);
    setIsTracking(false);
    toast.success(t('analytics.trackingStopped'));
  };

  const handleSimulatePayment = () => {
    // A payment is always preceded by a scan
    trackingService.recordScan(qrCode.id, {});

    // Then, record the payment
    const paymentAmount = qrCode.type === 'Fixed' && qrCode.amount ? qrCode.amount : Math.floor(Math.random() * (500 - 50 + 1)) + 50;
    trackingService.recordPayment(qrCode.id, {
      amount: paymentAmount,
      status: 'success',
      transactionId: `txn_sim_${Date.now()}`
    });
    toast.success(`Simulated payment of ₹${paymentAmount} recorded.`);
  };

  const exportAnalytics = () => {
    const data = {
      qrCode: qrCode.label,
      analytics: {
        totalScans,
        totalPayments,
        successfulPayments,
        totalAmount,
        conversionRate,
        deviceStats,
        locationStats,
        scansByDay,
      },
      scanHistory: analyticsData?.scanHistory,
      paymentHistory: analyticsData?.paymentHistory,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${qrCode.label}-analytics.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success(t('analytics.exportSuccess'));
  };

  return (
    <div className="space-y-6">
      {/* Header with tracking controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-2xl font-bold ${textPrimary}`}>{t('analytics.title')}</h2>
          <p className={textSecondary}>{t(isTracking ? 'analytics.trackingActiveSubtitle' : 'analytics.trackingInactiveSubtitle')}</p>
        </div>
        <div className="flex gap-2">
          {isTracking && (
            <Button onClick={handleSimulatePayment} variant="default" className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
              <DollarSign className="h-4 w-4" />
              {t('analytics.simulatePayment')}
            </Button>
          )}
          <Button
            onClick={isTracking ? stopTracking : startTracking}
            variant={isTracking ? "destructive" : "default"}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isTracking ? 'animate-spin' : ''}`} />
            {isTracking ? t('analytics.stopTracking') : t('analytics.startTracking')}
          </Button>
          <Button 
            onClick={exportAnalytics} 
            variant="secondary" 
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {t('analytics.export')}
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={`flex space-x-1 p-1 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}>
        {[
          { key: 'overview', icon: BarChart3, label: t('analytics.overview') },
          { key: 'scans', icon: Eye, label: t('analytics.scans') },
          { key: 'payments', icon: CreditCard, label: t('analytics.payments') },
          { key: 'devices', icon: Smartphone, label: t('analytics.devices') },
        ].map(({ key, icon: Icon, label }) => (
          <Button
            key={key}
            onClick={() => setActiveTab(key as any)}
            variant={activeTab === key ? "default" : "ghost"}
            size="sm"
            className="flex items-center gap-2"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className={`${cardBg} border ${border}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${textSecondary}`}>
                {t('analytics.totalScans')}
              </CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${textPrimary}`}>{totalScans}</div>
              <p className={`text-xs ${textSecondary}`}>
                {t('analytics.lastScan')}: {analyticsData?.lastScannedAt ? new Date(analyticsData.lastScannedAt).toLocaleDateString() : t('analytics.never')}
              </p>
            </CardContent>
          </Card>

          <Card className={`${cardBg} border ${border}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${textSecondary}`}>
                {t('analytics.successfulPayments')}
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${textPrimary}`}>{successfulPayments}</div>
              <p className={`text-xs ${textSecondary}`}>
                {t('analytics.totalAmount')}: ₹{totalAmount.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card className={`${cardBg} border ${border}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${textSecondary}`}>
                {t('analytics.conversionRate')}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${textPrimary}`}>{conversionRate.toFixed(1)}%</div>
              <Progress value={conversionRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card className={`${cardBg} border ${border}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${textSecondary}`}>
                {t('analytics.uniqueScanners')}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${textPrimary}`}>{uniqueScanners}</div>
              <p className={`text-xs ${textSecondary}`}>
                {t('analytics.uniqueDevices')}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Scans Tab */}
      {activeTab === 'scans' && (
        <div className="space-y-4">
          <Card className={`${cardBg} border ${border}`}>
            <CardHeader>
              <CardTitle className={textPrimary}>{t('analytics.recentScans')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {analyticsData?.scanHistory?.slice(-10).reverse().map((scan) => (
                  <div key={scan.id} className={`flex items-center justify-between p-3 rounded-lg border ${border}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className={`font-medium ${textPrimary}`}>
                          {scan.location?.city || 'Unknown Location'}
                        </p>
                        <p className={`text-sm ${textSecondary}`}>
                          {new Date(scan.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm ${textSecondary}`}>{scan.deviceInfo?.platform}</p>
                      <Badge variant="secondary">{scan.location?.ipAddress}</Badge>
                    </div>
                  </div>
                ))}
                {(!analyticsData?.scanHistory || analyticsData.scanHistory.length === 0) && (
                  <p className={`text-center py-8 ${textSecondary}`}>{t('analytics.noScansYet')}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <Card className={`${cardBg} border ${border}`}>
            <CardHeader>
              <CardTitle className={textPrimary}>{t('analytics.paymentHistory')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {analyticsData?.paymentHistory?.slice(-10).reverse().map((payment) => (
                  <div key={payment.id} className={`flex items-center justify-between p-3 rounded-lg border ${border}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        payment.status === 'success' ? 'bg-green-500' : 
                        payment.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></div>
                      <div>
                        <p className={`font-medium ${textPrimary}`}>₹{payment.amount}</p>
                        <p className={`text-sm ${textSecondary}`}>
                          {new Date(payment.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={payment.status === 'success' ? 'default' : 'destructive'}>
                        {payment.status}
                      </Badge>
                      {payment.transactionId && (
                        <p className={`text-xs ${textSecondary} mt-1`}>{payment.transactionId}</p>
                      )}
                    </div>
                  </div>
                ))}
                {(!analyticsData?.paymentHistory || analyticsData.paymentHistory.length === 0) && (
                  <p className={`text-center py-8 ${textSecondary}`}>{t('analytics.noPaymentsYet')}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Devices Tab */}
      {activeTab === 'devices' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className={`${cardBg} border ${border}`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${textPrimary}`}>
                <Smartphone className="h-5 w-5" />
                {t('analytics.deviceBreakdown')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(deviceStats).map(([platform, count]) => (
                  <div key={platform} className="flex items-center justify-between">
                    <span className={textSecondary}>{platform}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(count / totalScans) * 100}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-medium ${textPrimary}`}>{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className={`${cardBg} border ${border}`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${textPrimary}`}>
                <Globe className="h-5 w-5" />
                {t('analytics.locationBreakdown')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(locationStats).map(([country, count]) => (
                  <div key={country} className="flex items-center justify-between">
                    <span className={textSecondary}>{country}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${(count / totalScans) * 100}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-medium ${textPrimary}`}>{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default QRAnalytics; 