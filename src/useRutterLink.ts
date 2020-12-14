import { useEffect, useState } from 'react';
import useScript from 'react-script-hook';

import { createRutter, RutterFactory } from './factory';
import { RutterLinkOptions, RutterLinkOptionsWithPublicKey } from './types';

const RUTTER_LINK_STABLE_URL =
  'https://unpkg.com/@rutter/rutter-link-js@latest';

const noop = () => {};

/**
 * This hook loads Rutter script and manages the Rutter Link creation for you.
 * You get easy open & exit methods to call and loading & error states.
 *
 * This will destroy the Rutter UI on un-mounting so it's up to you to be
 * graceful to the user.
 *
 * A new Rutter instance is created every time the token and products options change.
 * It's up to you to prevent unnecessary re-creations on re-render.
 */
export const useRutterLink = (options: RutterLinkOptions) => {
  // Asynchronously load the rutter/link/stable url into the DOM
  const [loading, error] = useScript({
    src: RUTTER_LINK_STABLE_URL,
    checkForExisting: true,
  });

  // internal state
  const [rutter, setRutter] = useState<RutterFactory | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const products = ((options as RutterLinkOptionsWithPublicKey).product || [])
    .slice()
    .sort()
    .join(',');

  const [rutterLoaderLoaded, setRutterLoaderLoaded] = useState(false);

  console.log(options);

  useEffect(() => {
    // If the link.js script is still loading, return prematurely
    if (loading) {
      return;
    }

    // do the rutter loader side effect
    (window as any).RutterLoader.loadScript(() => {
      setRutterLoaderLoaded(true);
    });

    if (!rutterLoaderLoaded) {
      return;
    }

    if (error || !window.Rutter) {
      // eslint-disable-next-line no-console
      console.error('Error loading Rutter', error);
      return;
    }

    // if an old rutter instance exists, destroy it before
    // creating a new one
    if (rutter != null) {
      rutter.exit({ force: true }, () => rutter.destroy());
    }

    const next = createRutter({
      ...options,
      onLoad: () => {
        setIframeLoaded(true);
        options.onLoad && options.onLoad();
      },
    });

    setRutter(next);

    // destroy the Rutter iframe factory
    return () => next.exit({ force: true }, () => next.destroy());
  }, [loading, error, options.token, products, rutterLoaderLoaded]);

  return {
    error,
    ready: !loading || iframeLoaded,
    exit: rutter ? rutter.exit : noop,
    open: rutter ? rutter.open : noop,
  };
};
