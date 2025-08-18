
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle, AlertCircle, Info, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'tip';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  autoHide?: boolean;
  duration?: number;
}

const NotificationSystem: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Initialize with some sample notifications
    const initialNotifications: Notification[] = [
    {
      id: '1',
      type: 'tip',
      title: 'نصيحة مهمة',
      message: 'تأكد من ملء جميع المعلومات المطلوبة بدقة للحصول على أفضل نتائج التحليل',
      timestamp: new Date(Date.now() - 5 * 60000), // 5 minutes ago
      read: false,
      autoHide: false
    },
    {
      id: '2',
      type: 'info',
      title: 'معلومة مفيدة',
      message: 'يمكنك حفظ تقدمك والعودة لإكمال التطبيق لاحقاً',
      timestamp: new Date(Date.now() - 15 * 60000), // 15 minutes ago
      read: false,
      autoHide: false
    }];


    setNotifications(initialNotifications);
    setUnreadCount(initialNotifications.filter((n) => !n.read).length);

    // Add dynamic notifications based on user interaction
    const addContextualNotification = () => {
      const contextualNotifications = [
      {
        type: 'tip' as const,
        title: 'نصيحة للتحسين',
        message: 'استخدم كلمات مفتاحية واضحة في وصف خبراتك لتحسين نتائج التحليل'
      },
      {
        type: 'info' as const,
        title: 'هل تعلم؟',
        message: 'المرشحون الذين يكملون جميع المراحل لديهم فرص أكبر بنسبة 75% للحصول على مقابلة'
      },
      {
        type: 'success' as const,
        title: 'أداء ممتاز!',
        message: 'تقدمك في التطبيق يظهر التزاماً قوياً ومهنية عالية'
      }];


      const randomNotification = contextualNotifications[Math.floor(Math.random() * contextualNotifications.length)];

      addNotification(randomNotification);
    };

    // Add notifications periodically
    const interval = setInterval(addContextualNotification, 60000); // Every minute

    return () => clearInterval(interval);
  }, []);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };

    setNotifications((prev) => [newNotification, ...prev]);
    setUnreadCount((prev) => prev + 1);

    if (notification.autoHide) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, notification.duration || 5000);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => {
      const notification = prev.find((n) => n.id === id);
      if (notification && !notification.read) {
        setUnreadCount((count) => Math.max(0, count - 1));
      }
      return prev.filter((n) => n.id !== id);
    });
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
    prev.map((notification) =>
    notification.id === id ?
    { ...notification, read: true } :
    notification
    )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
    prev.map((notification) => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
    setIsOpen(false);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'info':return <Info className="w-5 h-5 text-blue-600" />;
      case 'tip':return <Lightbulb className="w-5 h-5 text-purple-600" />;
      default:return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':return 'border-green-200 bg-green-50';
      case 'warning':return 'border-yellow-200 bg-yellow-50';
      case 'info':return 'border-blue-200 bg-blue-50';
      case 'tip':return 'border-purple-200 bg-purple-50';
      default:return 'border-gray-200 bg-gray-50';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / 60000);

    if (diffInMinutes < 1) return 'الآن';
    if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;
    if (diffInMinutes < 1440) return `منذ ${Math.floor(diffInMinutes / 60)} ساعة`;
    return `منذ ${Math.floor(diffInMinutes / 1440)} يوم`;
  };

  // Expose addNotification globally for other components to use
  useEffect(() => {
    (window as any).addNotification = addNotification;
    return () => {
      delete (window as any).addNotification;
    };
  }, []);

  return (
    <div className="relative">
      {/* Notification Bell */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}>

        <Bell className="w-6 h-6" />
        <AnimatePresence>
          {unreadCount > 0 &&
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">

              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.div>
          }
        </AnimatePresence>
      </motion.button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen &&
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="absolute top-full right-0 mt-2 w-80 max-h-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">

            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">الإشعارات</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 &&
                <Button
                  onClick={markAllAsRead}
                  variant="ghost"
                  size="sm"
                  className="text-xs text-blue-600 hover:text-blue-800">

                      تعيين الكل كمقروء
                    </Button>
                }
                  <Button
                  onClick={clearAll}
                  variant="ghost"
                  size="sm"
                  className="text-xs text-gray-500 hover:text-gray-700">

                    مسح الكل
                  </Button>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ?
            <div className="px-4 py-8 text-center text-gray-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>لا توجد إشعارات جديدة</p>
                </div> :

            <div className="py-2">
                  {notifications.map((notification, index) =>
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`px-4 py-3 border-b border-gray-100 last:border-b-0 ${
                notification.read ? 'opacity-60' : ''}`
                }>

                      <div className={`p-3 rounded-lg border ${getNotificationColor(notification.type)}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-800 text-sm">
                                {notification.title}
                              </h4>
                              <p className="text-gray-600 text-xs mt-1 leading-relaxed">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-500">
                                  {formatTimeAgo(notification.timestamp)}
                                </span>
                                {!notification.read &&
                          <Button
                            onClick={() => markAsRead(notification.id)}
                            variant="ghost"
                            size="sm"
                            className="text-xs text-blue-600 hover:text-blue-800 p-0 h-auto">

                                    تعيين كمقروء
                                  </Button>
                          }
                              </div>
                            </div>
                          </div>
                          <Button
                      onClick={() => removeNotification(notification.id)}
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto text-gray-400 hover:text-gray-600">

                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
              )}
                </div>
            }
            </div>
          </motion.div>
        }
      </AnimatePresence>

      {/* Click outside to close */}
      {isOpen &&
      <div
        className="fixed inset-0 z-40"
        onClick={() => setIsOpen(false)} />

      }
    </div>);

};

// Custom hook for other components to use notifications
export const useNotifications = () => {
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    if ((window as any).addNotification) {
      (window as any).addNotification(notification);
    }
  };

  return { addNotification };
};

export default NotificationSystem;