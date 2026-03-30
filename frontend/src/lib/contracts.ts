import JudgeAssistantAbi from "../abi/JudgeAssistant.json";
import JudgeAssistantCofheAbi from "../abi/JudgeAssistantCofhe.json";
import EvidenceVaultAbi from "../abi/EvidenceVault.json";
import EvidenceVaultCofheAbi from "../abi/EvidenceVaultCofhe.json";
import PracticeArenaAbi from "../abi/PracticeArena.json";
import PracticeArenaCofheAbi from "../abi/PracticeArenaCofhe.json";
import WinPredictorAbi from "../abi/WinPredictor.json";
import WinPredictorCofheAbi from "../abi/WinPredictorCofhe.json";
import PrecedentEngineAbi from "../abi/PrecedentEngine.json";
import PrecedentEngineCofheAbi from "../abi/PrecedentEngineCofhe.json";

const useCofhe = import.meta.env.VITE_USE_COFHE === "true";

export const CONTRACTS = {
  judgeAssistant: {
    address: (import.meta.env.VITE_JUDGE_ASSISTANT_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`,
    abi: useCofhe ? JudgeAssistantCofheAbi : JudgeAssistantAbi
  },
  winPredictor: {
    address: (import.meta.env.VITE_WIN_PREDICTOR_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`,
    abi: useCofhe ? WinPredictorCofheAbi : WinPredictorAbi
  },
  evidenceVault: {
    address: (import.meta.env.VITE_EVIDENCE_VAULT_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`,
    abi: useCofhe ? EvidenceVaultCofheAbi : EvidenceVaultAbi
  },
  practiceArena: {
    address: (import.meta.env.VITE_PRACTICE_ARENA_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`,
    abi: useCofhe ? PracticeArenaCofheAbi : PracticeArenaAbi
  },
  precedentEngine: {
    address: (import.meta.env.VITE_PRECEDENT_ENGINE_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`,
    abi: useCofhe ? PrecedentEngineCofheAbi : PrecedentEngineAbi
  }
};
