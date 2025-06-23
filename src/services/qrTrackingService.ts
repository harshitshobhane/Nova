// QR Code Tracking Service
// This service handles real-time tracking of QR code scans and payments

export interface ScanEvent {
  id: string;
  qrCodeId: number;
  timestamp: string;
  deviceInfo?: {
    userAgent: string;
    platform: string;
    language: string;
    screenResolution?: string;
    timezone?: string;
  };
  location?: {
    latitude?: number;
    longitude?: number;
    city?: string;
    country?: string;
    ipAddress?: string;
  };
  referrer?: string;
  sessionId?: string;
  isUnique?: boolean;
}

export interface PaymentEvent {
  id: string;
  qrCodeId: number;
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
  payerInfo?: {
    name?: string;
    phone?: string;
    email?: string;
  };
}

export interface QRCodeAnalytics {
  qrCodeId: number;
  totalScans: number;
  uniqueScanners: number;
  totalPayments: number;
  successfulPayments: number;
  failedPayments: number;
  totalAmount: number;
  conversionRate: number;
  averageAmount?: number;
  lastScannedAt?: string;
  createdAt: string;
  scanHistory: ScanEvent[];
  paymentHistory: PaymentEvent[];
  deviceBreakdown: Record<string, number>;
  locationBreakdown: Record<string, number>;
  timeBreakdown: Record<string, number>;
}

class QRTrackingService {
  private static instance: QRTrackingService;
  private scanEvents: Map<number, ScanEvent[]> = new Map();
  private paymentEvents: Map<number, PaymentEvent[]> = new Map();
  private analytics: Map<number, QRCodeAnalytics> = new Map();
  private isTracking: boolean = false;
  private trackingIntervals: Map<number, NodeJS.Timeout> = new Map();
  private subscribers: Map<number, ((analytics: QRCodeAnalytics) => void)[]> = new Map();

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): QRTrackingService {
    if (!QRTrackingService.instance) {
      QRTrackingService.instance = new QRTrackingService();
    }
    return QRTrackingService.instance;
  }

  public subscribe(qrCodeId: number, callback: (analytics: QRCodeAnalytics) => void): void {
    const existingSubscribers = this.subscribers.get(qrCodeId) || [];
    this.subscribers.set(qrCodeId, [...existingSubscribers, callback]);
  }

  public unsubscribe(qrCodeId: number, callback: (analytics: QRCodeAnalytics) => void): void {
    const existingSubscribers = this.subscribers.get(qrCodeId) || [];
    this.subscribers.set(qrCodeId, existingSubscribers.filter(cb => cb !== callback));
  }

  // Start tracking for a specific QR code
  public startTracking(qrCodeId: number): void {
    if (this.trackingIntervals.has(qrCodeId)) {
      return; // Already tracking
    }

    // Mark this QR code as being tracked, but don't start any intervals.
    // The key in the map indicates that tracking is active.
    this.trackingIntervals.set(qrCodeId, null as any); // Using null as a placeholder
    this.saveToStorage();
  }

  // Stop tracking for a specific QR code
  public stopTracking(qrCodeId: number): void {
    // The interval reference might be null, which is fine.
    const interval = this.trackingIntervals.get(qrCodeId);
    if (interval) {
      clearInterval(interval);
    }
    this.trackingIntervals.delete(qrCodeId);
    this.saveToStorage();
  }

  // Record a scan event
  public recordScan(qrCodeId: number, scanData: Partial<ScanEvent>): ScanEvent {
    const scanEvent: ScanEvent = {
      id: this.generateId(),
      qrCodeId,
      timestamp: new Date().toISOString(),
      deviceInfo: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        ...scanData.deviceInfo,
      },
      location: {
        ipAddress: '192.168.1.1', // In real app, get from server
        city: 'Mumbai', // In real app, get from IP geolocation
        country: 'India',
        ...scanData.location,
      },
      referrer: document.referrer,
      sessionId: this.getSessionId(),
      isUnique: this.isUniqueScanner(qrCodeId),
      ...scanData,
    };

    const scans = this.scanEvents.get(qrCodeId) || [];
    scans.push(scanEvent);
    this.scanEvents.set(qrCodeId, scans);

    this.updateAnalytics(qrCodeId);
    this.saveToStorage();

    return scanEvent;
  }

  // Record a payment event
  public recordPayment(qrCodeId: number, paymentData: Partial<PaymentEvent>): PaymentEvent {
    const paymentEvent: PaymentEvent = {
      id: this.generateId(),
      qrCodeId,
      timestamp: new Date().toISOString(),
      amount: 0,
      status: 'pending',
      deviceInfo: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        ...paymentData.deviceInfo,
      },
      ...paymentData,
    };

    const payments = this.paymentEvents.get(qrCodeId) || [];
    payments.push(paymentEvent);
    this.paymentEvents.set(qrCodeId, payments);

    this.updateAnalytics(qrCodeId);
    this.saveToStorage();

    return paymentEvent;
  }

  // Get analytics for a QR code
  public getAnalytics(qrCodeId: number): QRCodeAnalytics | null {
    return this.analytics.get(qrCodeId) || null;
  }

  // Get all analytics
  public getAllAnalytics(): QRCodeAnalytics[] {
    return Array.from(this.analytics.values());
  }

  // Export analytics data
  public exportAnalytics(qrCodeId: number): string {
    const analytics = this.getAnalytics(qrCodeId);
    if (!analytics) {
      throw new Error('Analytics not found for QR code');
    }

    return JSON.stringify(analytics, null, 2);
  }

  // Simulate a scan event (for demo purposes) - THIS METHOD WILL BE REMOVED

  // Update analytics for a QR code
  private updateAnalytics(qrCodeId: number): void {
    const scans = this.scanEvents.get(qrCodeId) || [];
    const payments = this.paymentEvents.get(qrCodeId) || [];

    const totalScans = scans.length;
    const uniqueScanners = new Set(scans.map(s => s.sessionId)).size;
    const totalPayments = payments.length;
    const successfulPayments = payments.filter(p => p.status === 'success').length;
    const failedPayments = payments.filter(p => p.status === 'failed').length;
    const totalAmount = payments
      .filter(p => p.status === 'success')
      .reduce((sum, p) => sum + p.amount, 0);
    const conversionRate = totalScans > 0 ? (successfulPayments / totalScans) * 100 : 0;
    const averageAmount = successfulPayments > 0 ? totalAmount / successfulPayments : 0;

    // Device breakdown
    const deviceBreakdown = scans.reduce((acc, scan) => {
      const platform = scan.deviceInfo?.platform || 'Unknown';
      acc[platform] = (acc[platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Location breakdown
    const locationBreakdown = scans.reduce((acc, scan) => {
      const country = scan.location?.country || 'Unknown';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Time breakdown (by day)
    const timeBreakdown = scans.reduce((acc, scan) => {
      const date = new Date(scan.timestamp).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const analytics: QRCodeAnalytics = {
      qrCodeId,
      totalScans,
      uniqueScanners,
      totalPayments,
      successfulPayments,
      failedPayments,
      totalAmount,
      conversionRate,
      averageAmount,
      lastScannedAt: scans.length > 0 ? scans[scans.length - 1].timestamp : undefined,
      createdAt: scans.length > 0 ? scans[0].timestamp : new Date().toISOString(),
      scanHistory: scans,
      paymentHistory: payments,
      deviceBreakdown,
      locationBreakdown,
      timeBreakdown,
    };

    this.analytics.set(qrCodeId, analytics);

    // Notify subscribers
    const qrSubscribers = this.subscribers.get(qrCodeId);
    if (qrSubscribers) {
      qrSubscribers.forEach(callback => callback(analytics));
    }
  }

  // Check if scanner is unique
  private isUniqueScanner(qrCodeId: number): boolean {
    const scans = this.scanEvents.get(qrCodeId) || [];
    const sessionId = this.getSessionId();
    return !scans.some(scan => scan.sessionId === sessionId);
  }

  // Generate unique ID
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Get or create session ID
  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('qr_session_id');
    if (!sessionId) {
      sessionId = this.generateId();
      sessionStorage.setItem('qr_session_id', sessionId);
    }
    return sessionId;
  }

  // Save data to localStorage
  private saveToStorage(): void {
    try {
      localStorage.setItem('qr_tracking_events', JSON.stringify({
        scanEvents: Object.fromEntries(this.scanEvents),
        paymentEvents: Object.fromEntries(this.paymentEvents),
        analytics: Object.fromEntries(this.analytics),
        trackingIntervals: Array.from(this.trackingIntervals.keys()),
      }));
    } catch (error) {
      console.error('Failed to save tracking data:', error);
    }
  }

  // Load data from localStorage
  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem('qr_tracking_events');
      if (data) {
        const parsed = JSON.parse(data);
        this.scanEvents = new Map(Object.entries(parsed.scanEvents || {}).map(([key, value]) => [Number(key), value as ScanEvent[]]));
        this.paymentEvents = new Map(Object.entries(parsed.paymentEvents || {}).map(([key, value]) => [Number(key), value as PaymentEvent[]]));
        this.analytics = new Map(Object.entries(parsed.analytics || {}).map(([key, value]) => [Number(key), value as QRCodeAnalytics]));
        
        // Restore the tracking state without starting simulations
        const trackedQRCodes = parsed.trackingIntervals || [];
        trackedQRCodes.forEach((qrCodeId: number) => {
          this.trackingIntervals.set(qrCodeId, null as any);
        });
      }
    } catch (error) {
      console.error('Failed to load tracking data:', error);
    }
  }

  // Clear all data
  public clearData(): void {
    this.scanEvents.clear();
    this.paymentEvents.clear();
    this.analytics.clear();
    this.trackingIntervals.forEach(interval => clearInterval(interval));
    this.trackingIntervals.clear();
    this.isTracking = false;
    localStorage.removeItem('qr_tracking_events');
  }

  // Get tracking status
  public isTrackingEnabled(qrCodeId: number): boolean {
    return this.trackingIntervals.has(qrCodeId);
  }

  // Get overall tracking status
  public getOverallTrackingStatus(): boolean {
    return this.isTracking;
  }
}

export default QRTrackingService; 