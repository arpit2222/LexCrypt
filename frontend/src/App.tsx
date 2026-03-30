import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useMemo, useState } from "react";
import { keccak256, toBytes } from "viem";
import { useAccount, usePublicClient, useReadContract, useWriteContract } from "wagmi";
import { CONTRACTS } from "./lib/contracts";
import {
  createPermit,
  encryptEvidenceInputs,
  encryptJudgeInputs,
  encryptPracticeInputs,
  encryptPrecedentInputs,
  encryptWinInputs
} from "./lib/cofhe";

const makeCaseId = (address: string | undefined) => {
  const seed = `${address || "anon"}-${Date.now()}`;
  return keccak256(toBytes(seed));
};

const makeIdFromText = (value: string, address: string | undefined) => {
  const trimmed = value.trim();
  if (trimmed.length > 0) {
    return keccak256(toBytes(trimmed));
  }
  return makeCaseId(address);
};

const toCidHash = (value: string) => {
  const trimmed = value.trim();
  if (trimmed.startsWith("0x") && trimmed.length === 66) {
    return trimmed as `0x${string}`;
  }
  return keccak256(toBytes(trimmed));
};

export default function App() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync, isPending } = useWriteContract();
  const useCofhe = import.meta.env.VITE_USE_COFHE === "true";
  const [encryptionState, setEncryptionState] = useState<string | null>(null);

  const [judgeCaseId, setJudgeCaseId] = useState<`0x${string}` | null>(null);
  const [winCaseId, setWinCaseId] = useState<`0x${string}` | null>(null);
  const [evidenceVaultId, setEvidenceVaultId] = useState<`0x${string}` | null>(null);
  const [practiceCaseId, setPracticeCaseId] = useState<`0x${string}` | null>(null);
  const [precedentQueryId, setPrecedentQueryId] = useState<`0x${string}` | null>(null);

  const [judgeForm, setJudgeForm] = useState({
    evidenceScore: 45,
    priorConvictions: 1,
    caseTypeCode: 2,
    jurisdiction: 5,
    isJuvenile: false,
    sensitivity: 3
  });

  const [winForm, setWinForm] = useState({
    evidenceScore: 55,
    priorConvictions: 0,
    caseTypeCode: 1,
    jurisdiction: 2,
    claimAmount: 25
  });

  const [evidenceForm, setEvidenceForm] = useState({
    identityHash: 123,
    contentHash: 456,
    ipfsCid: ""
  });

  const [practiceForm, setPracticeForm] = useState({
    argumentScore: 40,
    precedentScore: 60,
    timelinessScore: 50,
    ipfsCid: ""
  });

  const [precedentAddForm, setPrecedentAddForm] = useState({
    precedentId: "",
    caseTypeCode: 1,
    jurisdiction: 1,
    ipfsCid: ""
  });

  const [precedentSearchForm, setPrecedentSearchForm] = useState({
    caseTypeCode: 1,
    jurisdiction: 1
  });

  const judgeRead = useReadContract({
    ...CONTRACTS.judgeAssistant,
    functionName: "getAnalysisPlain",
    args: judgeCaseId ? [judgeCaseId] : undefined,
    query: { enabled: Boolean(judgeCaseId) }
  });

  const winRead = useReadContract({
    ...CONTRACTS.winPredictor,
    functionName: "getWinProbabilityPlain",
    args: winCaseId ? [winCaseId] : undefined,
    query: { enabled: Boolean(winCaseId) }
  });

  const evidenceRead = useReadContract({
    ...CONTRACTS.evidenceVault,
    functionName: "getEvidencePlain",
    args: evidenceVaultId ? [evidenceVaultId] : undefined,
    query: { enabled: Boolean(evidenceVaultId) }
  });

  const practiceRead = useReadContract({
    ...CONTRACTS.practiceArena,
    functionName: "getAttemptPlain",
    args: practiceCaseId ? [practiceCaseId] : undefined,
    query: { enabled: Boolean(practiceCaseId) }
  });

  const precedentRead = useReadContract({
    ...CONTRACTS.precedentEngine,
    functionName: "getMatchCountPlain",
    args: precedentQueryId ? [precedentQueryId] : undefined,
    query: { enabled: Boolean(precedentQueryId) }
  });

  const judgeResult = useMemo(() => {
    if (!judgeRead.data) return null;
    const [verdictScore, highRisk, timestamp, commitment] = judgeRead.data as readonly [
      bigint,
      bigint,
      bigint,
      `0x${string}`
    ];
    return {
      verdictScore: verdictScore.toString(),
      highRisk: highRisk === 1n ? "Yes" : "No",
      timestamp: new Date(Number(timestamp) * 1000).toLocaleString(),
      commitment
    };
  }, [judgeRead.data]);

  const winResult = useMemo(() => {
    if (!winRead.data) return null;
    return Number(winRead.data as bigint);
  }, [winRead.data]);

  const evidenceResult = useMemo(() => {
    if (!evidenceRead.data) return null;
    const [cidHash, state, commitment, submitter, arbiter] = evidenceRead.data as readonly [
      `0x${string}`,
      bigint,
      `0x${string}`,
      `0x${string}`,
      `0x${string}`
    ];
    return {
      cidHash,
      state: state === 0n ? "SEALED" : "COURT_REVIEW",
      commitment,
      submitter,
      arbiter
    };
  }, [evidenceRead.data]);

  const practiceResult = useMemo(() => {
    if (!practiceRead.data) return null;
    const [totalScore, timestamp, cidHash, submitter] = practiceRead.data as readonly [
      bigint,
      bigint,
      `0x${string}`,
      `0x${string}`
    ];
    return {
      totalScore: totalScore.toString(),
      timestamp: new Date(Number(timestamp) * 1000).toLocaleString(),
      cidHash,
      submitter
    };
  }, [practiceRead.data]);

  const precedentResult = useMemo(() => {
    if (!precedentRead.data) return null;
    return Number(precedentRead.data as bigint);
  }, [precedentRead.data]);

  const submitJudge = async () => {
    const caseId = makeCaseId(address) as `0x${string}`;
    setJudgeCaseId(caseId);

    let permitHash = "0x0000000000000000000000000000000000000000000000000000000000000000";
    let input: any = {
      encCaseDataHash: 1,
      encEvidenceScore: BigInt(judgeForm.evidenceScore),
      encPriorConvictions: BigInt(judgeForm.priorConvictions),
      encCaseTypeCode: BigInt(judgeForm.caseTypeCode),
      encJurisdiction: BigInt(judgeForm.jurisdiction),
      encIsJuvenile: judgeForm.isJuvenile ? 1n : 0n,
      encSensitivityTier: BigInt(judgeForm.sensitivity)
    };

    if (useCofhe && address) {
      const permit = await createPermit(address);
      permitHash = permit.data.getHash();
      const encrypted = await encryptJudgeInputs(judgeForm, (state) => setEncryptionState(String(state)));
      input = {
        encCaseDataHash: encrypted[0],
        encEvidenceScore: encrypted[1],
        encPriorConvictions: encrypted[2],
        encCaseTypeCode: encrypted[3],
        encJurisdiction: encrypted[4],
        encIsJuvenile: encrypted[5],
        encSensitivityTier: encrypted[6]
      };
    }

    await writeContractAsync({
      ...CONTRACTS.judgeAssistant,
      functionName: "analyzeCase",
      args: [
        caseId,
        input,
        permitHash
      ]
    });

    await judgeRead.refetch();
  };

  const submitWin = async () => {
    const caseId = makeCaseId(address) as `0x${string}`;
    setWinCaseId(caseId);

    let permitHash = "0x0000000000000000000000000000000000000000000000000000000000000000";
    let input: any = {
      encEvidenceScore: BigInt(winForm.evidenceScore),
      encPriorConvictions: BigInt(winForm.priorConvictions),
      encCaseTypeCode: BigInt(winForm.caseTypeCode),
      encJurisdiction: BigInt(winForm.jurisdiction),
      encClaimAmount: BigInt(winForm.claimAmount)
    };

    if (useCofhe && address) {
      const permit = await createPermit(address);
      permitHash = permit.data.getHash();
      const encrypted = await encryptWinInputs(winForm, (state) => setEncryptionState(String(state)));
      input = {
        encEvidenceScore: encrypted[0],
        encPriorConvictions: encrypted[1],
        encCaseTypeCode: encrypted[2],
        encJurisdiction: encrypted[3],
        encClaimAmount: encrypted[4]
      };
    }

    await writeContractAsync({
      ...CONTRACTS.winPredictor,
      functionName: "predictWin",
      args: [
        caseId,
        input,
        permitHash
      ]
    });

    await winRead.refetch();
  };

  const submitEvidence = async () => {
    if (!publicClient || !address) return;
    const cidHash = toCidHash(evidenceForm.ipfsCid || "ipfs://demo");

    let inputIdentity: any = BigInt(evidenceForm.identityHash);
    let inputContent: any = BigInt(evidenceForm.contentHash);

    if (useCofhe) {
      const encrypted = await encryptEvidenceInputs(evidenceForm, (state) => setEncryptionState(String(state)));
      inputIdentity = encrypted[0];
      inputContent = encrypted[1];
    }

    const simulation = await publicClient.simulateContract({
      ...CONTRACTS.evidenceVault,
      functionName: "submitEvidence",
      args: [inputIdentity, inputContent, cidHash],
      account: address
    });

    setEvidenceVaultId(simulation.result as `0x${string}`);
    await writeContractAsync(simulation.request);
    await evidenceRead.refetch();
  };

  const submitPractice = async () => {
    const caseId = makeCaseId(address) as `0x${string}`;
    setPracticeCaseId(caseId);
    const cidHash = toCidHash(practiceForm.ipfsCid || "ipfs://practice");

    let permitHash = "0x0000000000000000000000000000000000000000000000000000000000000000";
    let input: any = {
      encArgumentScore: BigInt(practiceForm.argumentScore),
      encPrecedentScore: BigInt(practiceForm.precedentScore),
      encTimelinessScore: BigInt(practiceForm.timelinessScore)
    };

    if (useCofhe && address) {
      const permit = await createPermit(address);
      permitHash = permit.data.getHash();
      const encrypted = await encryptPracticeInputs(practiceForm, (state) => setEncryptionState(String(state)));
      input = {
        encArgumentScore: encrypted[0],
        encPrecedentScore: encrypted[1],
        encTimelinessScore: encrypted[2]
      };
    }

    await writeContractAsync({
      ...CONTRACTS.practiceArena,
      functionName: "submitAttempt",
      args: [caseId, input.encArgumentScore, input.encPrecedentScore, input.encTimelinessScore, cidHash, permitHash]
    });

    await practiceRead.refetch();
  };

  const submitPrecedent = async () => {
    const precedentId = makeIdFromText(precedentAddForm.precedentId, address) as `0x${string}`;
    const cidHash = toCidHash(precedentAddForm.ipfsCid || "ipfs://precedent");

    let input: any = {
      encCaseTypeCode: BigInt(precedentAddForm.caseTypeCode),
      encJurisdiction: BigInt(precedentAddForm.jurisdiction)
    };

    if (useCofhe) {
      const encrypted = await encryptPrecedentInputs(precedentAddForm, (state) => setEncryptionState(String(state)));
      input = {
        encCaseTypeCode: encrypted[0],
        encJurisdiction: encrypted[1]
      };
    }

    await writeContractAsync({
      ...CONTRACTS.precedentEngine,
      functionName: "addPrecedent",
      args: [precedentId, input.encCaseTypeCode, input.encJurisdiction, cidHash]
    });
  };

  const submitPrecedentSearch = async () => {
    const queryId = makeCaseId(address) as `0x${string}`;
    setPrecedentQueryId(queryId);

    let permitHash = "0x0000000000000000000000000000000000000000000000000000000000000000";
    let input: any = {
      encCaseTypeCode: BigInt(precedentSearchForm.caseTypeCode),
      encJurisdiction: BigInt(precedentSearchForm.jurisdiction)
    };

    if (useCofhe && address) {
      const permit = await createPermit(address);
      permitHash = permit.data.getHash();
      const encrypted = await encryptPrecedentInputs(precedentSearchForm, (state) => setEncryptionState(String(state)));
      input = {
        encCaseTypeCode: encrypted[0],
        encJurisdiction: encrypted[1]
      };
    }

    await writeContractAsync({
      ...CONTRACTS.precedentEngine,
      functionName: "searchPrecedents",
      args: [queryId, input.encCaseTypeCode, input.encJurisdiction, permitHash]
    });

    await precedentRead.refetch();
  };

  return (
    <div className="app">
      <div className="header">
        <div>
          <h1>LexCrypt Demo</h1>
          <p className="muted">
            Private justice AI running on encrypted inputs (demo mode).
            {useCofhe ? " CoFHE encryption enabled." : ""}
          </p>
          {useCofhe && encryptionState && (
            <p className="muted">CoFHE encryption state: {encryptionState}</p>
          )}
        </div>
        <ConnectButton />
      </div>

      <div className="card">
        <h2>Judge AI Assistant</h2>
        <p className="muted">Submit encrypted case signals and decrypt the verdict score.</p>
        <div className="grid">
          <div>
            <label>Evidence score (0-100)</label>
            <input
              type="number"
              value={judgeForm.evidenceScore}
              onChange={(e) => setJudgeForm({ ...judgeForm, evidenceScore: Number(e.target.value) })}
            />
          </div>
          <div>
            <label>Prior convictions</label>
            <input
              type="number"
              value={judgeForm.priorConvictions}
              onChange={(e) => setJudgeForm({ ...judgeForm, priorConvictions: Number(e.target.value) })}
            />
          </div>
          <div>
            <label>Case type code</label>
            <input
              type="number"
              value={judgeForm.caseTypeCode}
              onChange={(e) => setJudgeForm({ ...judgeForm, caseTypeCode: Number(e.target.value) })}
            />
          </div>
          <div>
            <label>Jurisdiction code</label>
            <input
              type="number"
              value={judgeForm.jurisdiction}
              onChange={(e) => setJudgeForm({ ...judgeForm, jurisdiction: Number(e.target.value) })}
            />
          </div>
          <div>
            <label>Sensitivity tier (1-5)</label>
            <input
              type="number"
              value={judgeForm.sensitivity}
              onChange={(e) => setJudgeForm({ ...judgeForm, sensitivity: Number(e.target.value) })}
            />
          </div>
          <div>
            <label>Juvenile?</label>
            <select
              value={judgeForm.isJuvenile ? "yes" : "no"}
              onChange={(e) => setJudgeForm({ ...judgeForm, isJuvenile: e.target.value === "yes" })}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
        </div>
        <div className="row" style={{ marginTop: 16 }}>
          <button className="primary" onClick={submitJudge} disabled={!address || isPending}>
            {isPending ? "Submitting..." : "Submit Encrypted Case"}
          </button>
          <button className="secondary" onClick={() => judgeRead.refetch()} disabled={!judgeCaseId}>
            Decrypt Latest Result
          </button>
          {judgeCaseId && <span className="muted">Case ID: {judgeCaseId.slice(0, 10)}...</span>}
        </div>
        {judgeResult && (
          <div className="result">
            <strong>Verdict Score:</strong> {judgeResult.verdictScore} <br />
            <strong>High Risk:</strong> {judgeResult.highRisk} <br />
            <strong>Timestamp:</strong> {judgeResult.timestamp} <br />
            <strong>Commitment:</strong> {judgeResult.commitment.slice(0, 12)}...
          </div>
        )}
      </div>

      <div className="card">
        <h2>Win Probability Engine</h2>
        <p className="muted">Encrypted case factors return a win probability estimate.</p>
        <div className="grid">
          <div>
            <label>Evidence score (0-100)</label>
            <input
              type="number"
              value={winForm.evidenceScore}
              onChange={(e) => setWinForm({ ...winForm, evidenceScore: Number(e.target.value) })}
            />
          </div>
          <div>
            <label>Prior convictions</label>
            <input
              type="number"
              value={winForm.priorConvictions}
              onChange={(e) => setWinForm({ ...winForm, priorConvictions: Number(e.target.value) })}
            />
          </div>
          <div>
            <label>Case type code</label>
            <input
              type="number"
              value={winForm.caseTypeCode}
              onChange={(e) => setWinForm({ ...winForm, caseTypeCode: Number(e.target.value) })}
            />
          </div>
          <div>
            <label>Jurisdiction code</label>
            <input
              type="number"
              value={winForm.jurisdiction}
              onChange={(e) => setWinForm({ ...winForm, jurisdiction: Number(e.target.value) })}
            />
          </div>
          <div>
            <label>Claim amount (scaled)</label>
            <input
              type="number"
              value={winForm.claimAmount}
              onChange={(e) => setWinForm({ ...winForm, claimAmount: Number(e.target.value) })}
            />
          </div>
        </div>
        <div className="row" style={{ marginTop: 16 }}>
          <button className="primary" onClick={submitWin} disabled={!address || isPending}>
            {isPending ? "Submitting..." : "Submit Encrypted Inputs"}
          </button>
          <button className="secondary" onClick={() => winRead.refetch()} disabled={!winCaseId}>
            Decrypt Latest Result
          </button>
          {winCaseId && <span className="muted">Case ID: {winCaseId.slice(0, 10)}...</span>}
        </div>
        {winResult !== null && (
          <div className="result">
            <strong>Win Probability:</strong> {winResult}%
          </div>
        )}
      </div>

      <div className="card">
        <h2>Evidence Vault</h2>
        <p className="muted">Seal evidence with encrypted hashes and an IPFS CID (hashed on-chain).</p>
        <div className="grid">
          <div>
            <label>Identity hash (number)</label>
            <input
              type="number"
              value={evidenceForm.identityHash}
              onChange={(e) => setEvidenceForm({ ...evidenceForm, identityHash: Number(e.target.value) })}
            />
          </div>
          <div>
            <label>Content hash (number)</label>
            <input
              type="number"
              value={evidenceForm.contentHash}
              onChange={(e) => setEvidenceForm({ ...evidenceForm, contentHash: Number(e.target.value) })}
            />
          </div>
          <div>
            <label>IPFS CID or hash</label>
            <input
              type="text"
              placeholder="bafy... or 0x..."
              value={evidenceForm.ipfsCid}
              onChange={(e) => setEvidenceForm({ ...evidenceForm, ipfsCid: e.target.value })}
            />
          </div>
        </div>
        <div className="row" style={{ marginTop: 16 }}>
          <button className="primary" onClick={submitEvidence} disabled={!address || isPending}>
            {isPending ? "Submitting..." : "Submit Evidence"}
          </button>
          <button className="secondary" onClick={() => evidenceRead.refetch()} disabled={!evidenceVaultId}>
            Refresh Result
          </button>
          {evidenceVaultId && <span className="muted">Vault ID: {evidenceVaultId.slice(0, 10)}...</span>}
        </div>
        {evidenceResult && (
          <div className="result">
            <strong>Status:</strong> {evidenceResult.state} <br />
            <strong>CID Hash:</strong> {evidenceResult.cidHash.slice(0, 12)}... <br />
            <strong>Commitment:</strong> {evidenceResult.commitment.slice(0, 12)}...
          </div>
        )}
      </div>

      <div className="card">
        <h2>Practice Arena</h2>
        <p className="muted">Students submit encrypted case answers for scoring.</p>
        <div className="grid">
          <div>
            <label>Argument score</label>
            <input
              type="number"
              value={practiceForm.argumentScore}
              onChange={(e) => setPracticeForm({ ...practiceForm, argumentScore: Number(e.target.value) })}
            />
          </div>
          <div>
            <label>Precedent score</label>
            <input
              type="number"
              value={practiceForm.precedentScore}
              onChange={(e) => setPracticeForm({ ...practiceForm, precedentScore: Number(e.target.value) })}
            />
          </div>
          <div>
            <label>Timeliness score</label>
            <input
              type="number"
              value={practiceForm.timelinessScore}
              onChange={(e) => setPracticeForm({ ...practiceForm, timelinessScore: Number(e.target.value) })}
            />
          </div>
          <div>
            <label>IPFS CID or hash</label>
            <input
              type="text"
              placeholder="bafy... or 0x..."
              value={practiceForm.ipfsCid}
              onChange={(e) => setPracticeForm({ ...practiceForm, ipfsCid: e.target.value })}
            />
          </div>
        </div>
        <div className="row" style={{ marginTop: 16 }}>
          <button className="primary" onClick={submitPractice} disabled={!address || isPending}>
            {isPending ? "Submitting..." : "Submit Attempt"}
          </button>
          <button className="secondary" onClick={() => practiceRead.refetch()} disabled={!practiceCaseId}>
            Refresh Result
          </button>
          {practiceCaseId && <span className="muted">Case ID: {practiceCaseId.slice(0, 10)}...</span>}
        </div>
        {practiceResult && (
          <div className="result">
            <strong>Total Score:</strong> {practiceResult.totalScore} <br />
            <strong>Timestamp:</strong> {practiceResult.timestamp} <br />
            <strong>CID Hash:</strong> {practiceResult.cidHash.slice(0, 12)}...
          </div>
        )}
      </div>

      <div className="card">
        <h2>Precedent Engine - Add</h2>
        <p className="muted">Store encrypted precedent tags + IPFS CID hash.</p>
        <div className="grid">
          <div>
            <label>Precedent ID (optional)</label>
            <input
              type="text"
              placeholder="leave blank to auto-generate"
              value={precedentAddForm.precedentId}
              onChange={(e) => setPrecedentAddForm({ ...precedentAddForm, precedentId: e.target.value })}
            />
          </div>
          <div>
            <label>Case type code</label>
            <input
              type="number"
              value={precedentAddForm.caseTypeCode}
              onChange={(e) => setPrecedentAddForm({ ...precedentAddForm, caseTypeCode: Number(e.target.value) })}
            />
          </div>
          <div>
            <label>Jurisdiction code</label>
            <input
              type="number"
              value={precedentAddForm.jurisdiction}
              onChange={(e) => setPrecedentAddForm({ ...precedentAddForm, jurisdiction: Number(e.target.value) })}
            />
          </div>
          <div>
            <label>IPFS CID or hash</label>
            <input
              type="text"
              placeholder="bafy... or 0x..."
              value={precedentAddForm.ipfsCid}
              onChange={(e) => setPrecedentAddForm({ ...precedentAddForm, ipfsCid: e.target.value })}
            />
          </div>
        </div>
        <div className="row" style={{ marginTop: 16 }}>
          <button className="primary" onClick={submitPrecedent} disabled={!address || isPending}>
            {isPending ? "Submitting..." : "Add Precedent"}
          </button>
        </div>
      </div>

      <div className="card">
        <h2>Precedent Engine - Search</h2>
        <p className="muted">Search encrypted precedent tags and decrypt match count.</p>
        <div className="grid">
          <div>
            <label>Case type code</label>
            <input
              type="number"
              value={precedentSearchForm.caseTypeCode}
              onChange={(e) => setPrecedentSearchForm({ ...precedentSearchForm, caseTypeCode: Number(e.target.value) })}
            />
          </div>
          <div>
            <label>Jurisdiction code</label>
            <input
              type="number"
              value={precedentSearchForm.jurisdiction}
              onChange={(e) => setPrecedentSearchForm({ ...precedentSearchForm, jurisdiction: Number(e.target.value) })}
            />
          </div>
        </div>
        <div className="row" style={{ marginTop: 16 }}>
          <button className="primary" onClick={submitPrecedentSearch} disabled={!address || isPending}>
            {isPending ? "Submitting..." : "Search Precedents"}
          </button>
          <button className="secondary" onClick={() => precedentRead.refetch()} disabled={!precedentQueryId}>
            Refresh Result
          </button>
          {precedentQueryId && <span className="muted">Query ID: {precedentQueryId.slice(0, 10)}...</span>}
        </div>
        {precedentResult !== null && (
          <div className="result">
            <strong>Matches:</strong> {precedentResult}
          </div>
        )}
      </div>
    </div>
  );
}
