import React from 'react';

interface CommonRutterLinkOptions {
  // A function that is called when a user has successfully connecter an Item.
  // The function should expect two arguments, the public_key and a metadata object
  onSuccess: Function;
  // A callback that is called when a user has specifically exited Link flow
  onExit?: Function;
  // A callback that is called when the Link module has finished loading.
  // Calls to RutterLinkHandler.open() prior to the onLoad callback will be
  // delayed until the module is fully loaded.
  onLoad?: Function;
  // A callback that is called during a user's flow in Link.
  onEvent?: Function;
}

export type RutterLinkOptionsWithPublicKey = CommonRutterLinkOptions & {
  // The public_key associated with your account; available from
  // the Rutter dashboard (https://dashboard.Rutter.com)
  publicKey: string;
  platform?: string;
  avoidCDN?: boolean;
};

// Either the publicKey or the token field must be configured. The publicKey
// is deprecated so prefer to initialize Link with a Link Token instead.
export type RutterLinkOptions = RutterLinkOptionsWithPublicKey;

export type RutterLinkPropTypes = RutterLinkOptions & {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export interface Rutter {
  open: Function;
  exit: Function;
  create: Function;
  destroy: Function;
}

declare global {
  interface Window {
    Rutter: Rutter;
  }
}
