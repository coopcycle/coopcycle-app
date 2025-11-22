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

jest.mock('@react-native-firebase/analytics', () => ({
  logEvent: jest.fn(),
  setUserProperty: jest.fn(),
}));

jest.mock('@react-native-firebase/messaging', () => ({}));

jest.mock('react-native-background-geolocation', () => ({
  DESIRED_ACCURACY_HIGH: -1,
  LOG_LEVEL_VERBOSE: 5,
  LOG_LEVEL_OFF: 0,
  onEnabledChange: jest.fn(),
  ready: jest.fn(),
  start: jest.fn(),
  stop: jest.fn(),
  removeListeners: jest.fn(),
  changePace: jest.fn(),
}));

jest.mock('@stripe/stripe-react-native', () => ({}));

jest.mock('react-native-share', () => ({}));

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

jest.mock('expo/fetch', () => ({
  fetch: jest.fn(),
}));

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
