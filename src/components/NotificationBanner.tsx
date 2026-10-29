/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export type NotificationType = 'sucesso' | 'erro' | 'aviso' | 'info';

export interface NotificationState {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
}

interface NotificationBannerProps {
  notification: NotificationState | null;
  onDismiss: () => void;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  notification,
  onDismiss,
}) => {
  if (!notification) return null;

  const styles = {
    sucesso: {
      container: 'bg-emerald-50 border-emerald-300 text-emerald-900',
      icon: <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />,
      closeBtn: 'text-emerald-700 hover:bg-emerald-100',
    },
    erro: {
      container: 'bg-rose-50 border-rose-300 text-rose-900',
      icon: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
      closeBtn: 'text-rose-700 hover:bg-rose-100',
    },
    aviso: {
      container: 'bg-amber-50 border-amber-300 text-amber-900',
      icon: <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />,
      closeBtn: 'text-amber-700 hover:bg-amber-100',
    },
    info: {
      container: 'bg-blue-50 border-blue-300 text-blue-900',
      icon: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
      closeBtn: 'text-blue-700 hover:bg-blue-100',
    },
  }[notification.type];

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`relative flex items-start justify-between gap-3 p-4 rounded-lg border shadow-xs transition-all mb-4 ${styles.container}`}
    >
      <div className="flex items-start gap-3">
        {styles.icon}
        <div className="text-xs sm:text-sm">
          {notification.title && (
            <strong className="block font-semibold mb-0.5">
              {notification.title}
            </strong>
          )}
          <p className="leading-relaxed">{notification.message}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className={`p-1 rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 ${styles.closeBtn}`}
        aria-label="Dispensar notificação"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
