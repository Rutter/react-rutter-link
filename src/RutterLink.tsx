import React from 'react';

import { RutterLinkPropTypes } from './types';
import { useRutterLink } from './useRutterLink';

export const RutterLink: React.FC<RutterLinkPropTypes> = props => {
  const { children, style, className, ...config } = props;
  const { error, open } = useRutterLink({ ...config });

  return (
    <button
      disabled={Boolean(error)}
      type="button"
      className={className}
      style={{
        padding: '6px 4px',
        outline: 'none',
        background: '#FFFFFF',
        border: '2px solid #F1F1F1',
        borderRadius: '4px',
        ...style,
      }}
      onClick={() => open()}
    >
      {children}
    </button>
  );
};

RutterLink.displayName = 'RutterLink';
