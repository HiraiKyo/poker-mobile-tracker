import { STAKES_CODE_ALL } from "../components/StakeSelector";
import { Stake } from "../types/stake";

export const stakeCombinedName = ({ stake }: { stake: Stake }) => {
  // 総計ラベル
  if (stake.stakes_code === -1) {
    return "総計";
  }

  const { provider, stakes_name, sb, bb } = stake;
  const currency = "$";
  return `${provider} ${stakes_name} ${currency}${sb}-${currency}${bb}`;
};
