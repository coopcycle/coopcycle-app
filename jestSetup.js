/* global jest */

jest.mock('react-native/Libraries/AppState/AppState', () => ({
  currentState: 'active',
  addEventListener: jest.fn(),
}));

jest.mock('react-native-localize', () => ({
  findBestLanguageTag: () => ({ languageTag: 'en' }),
}));

jest.mock('expo-file-system', () => ({
  createUploadTask: jest.fn(),
  FileSystemUploadType: {
    MULTIPART: 1,
  },
  FileSystemSessionType: {
    BACKGROUND: 0,
  },
}));

jest.mock('expo-file-system/legacy', () => ({
  getInfoAsync: jest.fn().mockResolvedValue({ exists: false }),
  makeDirectoryAsync: jest.fn().mockResolvedValue(undefined),
  copyAsync: jest.fn().mockResolvedValue(undefined),
  deleteAsync: jest.fn().mockResolvedValue(undefined),
  documentDirectory: 'file:///mocked/document/directory/',
}));

jest.mock('@react-native-firebase/analytics', () => ({
  logEvent: jest.fn(),
  setUserProperty: jest.fn(),
}));

jest.mock('@react-native-firebase/messaging', () => ({}));

jest.mock('react-native-background-geolocation', () => ({
  // v5 replaced the DESIRED_ACCURACY_* / LOG_LEVEL_* statics with named enum
  // exports, and ready()/start()/stop()/changePace() are promise-only.
  DesiredAccuracy: {
    Navigation: -2,
    High: -1,
    Medium: 10,
    Low: 100,
    VeryLow: 1000,
    Lowest: 3000,
  },
  LogLevel: {
    Off: 0,
    Error: 1,
    Warning: 2,
    Info: 3,
    Debug: 4,
    Verbose: 5,
  },
  onEnabledChange: jest.fn(),
  ready: jest.fn(() => Promise.resolve({ enabled: false })),
  start: jest.fn(() => Promise.resolve({ enabled: true })),
  stop: jest.fn(() => Promise.resolve({ enabled: false })),
  removeListeners: jest.fn(),
  changePace: jest.fn(() => Promise.resolve({ enabled: true })),
}));

jest.mock('@stripe/stripe-react-native', () => ({}));

jest.mock('react-native-share', () => ({}));

// esc-pos-encoder@2 pulls in the native `canvas` module, whose prebuilt
// binary isn't available in the test env. It's only used for thermal-printer
// encoding, so stub it with a chainable no-op encoder.
jest.mock('esc-pos-encoder', () => {
  const makeEncoder = () =>
    new Proxy(
      {},
      {
        get: (_target, prop) =>
          prop === 'encode'
            ? () => new Uint8Array()
            : () => makeEncoder(),
      },
    );
  const EscPosEncoder = jest.fn().mockImplementation(() => makeEncoder());
  return { __esModule: true, default: EscPosEncoder };
});

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

jest.mock('react-native/Libraries/AppState/AppState', () => ({
  __esModule: true,
  default: {
    currentState: 'active',
    addEventListener: jest.fn(),
  },
}))

// https://github.com/expo/expo/issues/39922

// undo the ts-side mock
jest.unmock("expo-file-system");

// mock the parts from native modules
jest.mock("expo-file-system/src/ExpoFileSystem", () => {
  return {
    __esModule: true,
    default: {
      // this class is extended by the ts File-class
      FileSystemFile: class {
        uri: string;
        constructor(uri: string) {
          this.uri = uri;
        }
        validatePath() {}
      },
      // this class is extended by the ts Directory-class
      FileSystemDirectory: class {
        uri: string;
        constructor(uri: string) {
          this.uri = uri;
        }
        validatePath() {}
      },
      documentDirectory: "file:///mocked/document/directory/",
    },
  };
});

// hacky fixture creation code to create files and directories with specific names
const createFile = (name: string, list: string[]) => {
  return new (class extends File {
    exists = list.includes(name);
    get parentDirectory(): Directory {
      return new (class extends Directory {
        list() {
          return list.map((it) => new File(it));
        }
      })();
    }
  })(name);
};
