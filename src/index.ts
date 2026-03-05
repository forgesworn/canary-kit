// src/index.ts
export {
  WORDLIST,
  WORDLIST_SIZE,
  getWord,
  indexOf,
} from './wordlist.js'

export {
  getCounter,
  counterToBytes,
  DEFAULT_ROTATION_INTERVAL,
} from './counter.js'

export {
  deriveVerificationWord,
  deriveVerificationPhrase,
  deriveDuressWord,
  deriveDuressPhrase,
  deriveCurrentWord,
} from './derive.js'

export {
  verifyWord,
  type VerifyResult,
  type VerifyStatus,
} from './verify.js'

export {
  createGroup,
  getCurrentWord,
  getCurrentDuressWord,
  advanceCounter,
  reseed,
  addMember,
  removeMember,
  syncCounter,
  type GroupConfig,
  type GroupState,
} from './group.js'

export {
  PRESETS,
  type PresetName,
  type GroupPreset,
} from './presets.js'

export {
  deriveBeaconKey,
  encryptBeacon,
  decryptBeacon,
  buildDuressAlert,
  encryptDuressAlert,
  decryptDuressAlert,
  type BeaconPayload,
  type DuressAlert,
  type DuressLocation,
} from './beacon.js'

// --- CANARY Protocol (universal API) ---
export {
  MAX_TOLERANCE,
  deriveTokenBytes,
  deriveToken,
  deriveDuressTokenBytes,
  deriveDuressToken,
  verifyToken,
  deriveLivenessToken,
  type TokenVerifyResult,
  type VerifyOptions,
} from './token.js'

export {
  encodeAsWords,
  encodeAsPin,
  encodeAsHex,
  encodeToken,
  type TokenEncoding,
  DEFAULT_ENCODING,
} from './encoding.js'
