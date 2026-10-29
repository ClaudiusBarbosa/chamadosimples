/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SupportLevel, SUPPORT_LEVELS_INFO } from '../types/ticket';

interface SupportLevelBadgeProps {
  level: SupportLevel;
  showDescription?: boolean;
}

export const SupportLevelBadge: React.FC<SupportLevelBadgeProps> = ({
  level,
  showDescription = false,
}) => {
  const info = SUPPORT_LEVELS_INFO[level];

  return (
    <div className="inline-flex items-center gap-1.5">
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${info.badgeColor}`}
        title={info.description}
        aria-label={info.name}
      >
        {level}
      </span>
      {showDescription && (
        <span className="text-xs text-slate-600 font-medium">
          {level === 'N1' && 'Suporte técnico 1º nível'}
          {level === 'N2' && 'Dev & suporte 2º nível'}
          {level === 'N3' && 'Segurança & infra 3º nível'}
        </span>
      )}
    </div>
  );
};
