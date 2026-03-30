import { cofhejs, Encryptable } from "cofhejs/web";
import { ethers } from "ethers";

let initialized = false;
let initializing: Promise<void> | null = null;

export const initCofhe = async () => {
  if (initialized) return;
  if (initializing) return initializing;

  initializing = (async () => {
    if (!window.ethereum) {
      throw new Error("No injected wallet found for CoFHE initialization.");
    }
    const provider = new ethers.BrowserProvider(window.ethereum as any);
    const signer = await provider.getSigner();

    await cofhejs.initializeWithEthers({
      ethersProvider: provider,
      ethersSigner: signer,
      environment: "TESTNET"
    });

    initialized = true;
  })();

  return initializing;
};

export const createPermit = async (issuer: string) => {
  await initCofhe();
  return cofhejs.createPermit({
    type: "self",
    issuer
  });
};

export const encryptJudgeInputs = async (
  form: {
    evidenceScore: number;
    priorConvictions: number;
    caseTypeCode: number;
    jurisdiction: number;
    isJuvenile: boolean;
    sensitivity: number;
  },
  onState?: (state: unknown) => void
) => {
  await initCofhe();
  const encrypted = await cofhejs.encrypt(
    [
      Encryptable.uint128(1n),
      Encryptable.uint32(BigInt(form.evidenceScore)),
      Encryptable.uint32(BigInt(form.priorConvictions)),
      Encryptable.uint32(BigInt(form.caseTypeCode)),
      Encryptable.uint32(BigInt(form.jurisdiction)),
      Encryptable.uint8(form.isJuvenile ? 1n : 0n),
      Encryptable.uint8(BigInt(form.sensitivity))
    ] as const,
    onState
  );

  return encrypted.data;
};

export const encryptWinInputs = async (
  form: {
    evidenceScore: number;
    priorConvictions: number;
    caseTypeCode: number;
    jurisdiction: number;
    claimAmount: number;
  },
  onState?: (state: unknown) => void
) => {
  await initCofhe();
  const encrypted = await cofhejs.encrypt(
    [
      Encryptable.uint32(BigInt(form.evidenceScore)),
      Encryptable.uint32(BigInt(form.priorConvictions)),
      Encryptable.uint32(BigInt(form.caseTypeCode)),
      Encryptable.uint32(BigInt(form.jurisdiction)),
      Encryptable.uint32(BigInt(form.claimAmount))
    ] as const,
    onState
  );

  return encrypted.data;
};

export const encryptEvidenceInputs = async (
  form: {
    identityHash: number;
    contentHash: number;
  },
  onState?: (state: unknown) => void
) => {
  await initCofhe();
  const encrypted = await cofhejs.encrypt(
    [
      Encryptable.uint128(BigInt(form.identityHash)),
      Encryptable.uint128(BigInt(form.contentHash))
    ] as const,
    onState
  );

  return encrypted.data;
};

export const encryptPracticeInputs = async (
  form: {
    argumentScore: number;
    precedentScore: number;
    timelinessScore: number;
  },
  onState?: (state: unknown) => void
) => {
  await initCofhe();
  const encrypted = await cofhejs.encrypt(
    [
      Encryptable.uint32(BigInt(form.argumentScore)),
      Encryptable.uint32(BigInt(form.precedentScore)),
      Encryptable.uint32(BigInt(form.timelinessScore))
    ] as const,
    onState
  );

  return encrypted.data;
};

export const encryptPrecedentInputs = async (
  form: {
    caseTypeCode: number;
    jurisdiction: number;
  },
  onState?: (state: unknown) => void
) => {
  await initCofhe();
  const encrypted = await cofhejs.encrypt(
    [
      Encryptable.uint32(BigInt(form.caseTypeCode)),
      Encryptable.uint32(BigInt(form.jurisdiction))
    ] as const,
    onState
  );

  return encrypted.data;
};
