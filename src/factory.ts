import { RutterLinkOptions, Rutter } from './types';

export interface RutterFactory {
  open: Function;
  exit: Function;
  destroy: Function;
}

interface FactoryInternalState {
  rutter: Rutter | null;
  open: boolean;
  onExitCallback: Function | null;
}

const renameKeyInObject = (
  o: { [index: string]: any },
  oldKey: string,
  newKey: string
): object => {
  const newObject = {};
  delete Object.assign(newObject, o, { [newKey]: o[oldKey] })[oldKey];
  return newObject;
};

/**
 * Wrap link handler creation and instance to clean up iframe via destroy() method
 */
export const createRutter = (options: RutterLinkOptions) => {
  console.log('SJKDJKFJKDF');
  const state: FactoryInternalState = {
    rutter: null,
    open: false,
    onExitCallback: null,
  };

  // If Rutter is not available, throw an Error
  if (typeof window === 'undefined' || !window.Rutter) {
    throw new Error('Rutter not loaded');
  }

  // const config = renameKeyInObject(options, 'publicKey') as RutterLinkOptions;
  const config = options;

  console.log(options);
  console.log(config);
  state.rutter = window.Rutter.create({
    ...config,
    onExit: (...params: any) => {
      state.open = false;
      config.onExit && config.onExit(...params);
      state.onExitCallback && state.onExitCallback();
    },
  });

  const open = () => {
    if (!state.rutter) {
      return;
    }
    state.open = true;
    state.onExitCallback = null;
    state.rutter.open();
  };

  const exit = (exitOptions: any, callback: Function) => {
    if (!state.open || !state.rutter) {
      callback && callback();
      return;
    }
    state.onExitCallback = callback;
    state.rutter.exit(exitOptions);
    if (exitOptions && exitOptions.force) {
      state.open = false;
    }
  };

  const destroy = () => {
    if (!state.rutter) {
      return;
    }

    state.rutter.destroy();
    state.rutter = null;
  };

  return {
    open,
    exit,
    destroy,
  };
};
