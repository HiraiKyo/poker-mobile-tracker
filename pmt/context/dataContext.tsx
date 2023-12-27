import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { SessionWithStake } from "../types/session";
import { database } from "../app/_layout";
import { Stake } from "../types/stake";

type DataContextValue = {
  data: SessionWithStake[];
  reload: () => void;
  stakes: Stake[];
  reloadStakes: () => void;
};

const defaultValue = {
  data: [],
  reload: () => {},
  stakes: [],
  reloadStakes: () => {},
};
const dataContext = createContext<DataContextValue>(defaultValue);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<SessionWithStake[]>(defaultValue.data);

  const reload = () => {
    console.log("reloading session[]...");
    database.loadSession(setData);
  };

  // ステークス一覧
  const [stakes, setStakes] = useState<Stake[]>(defaultValue.stakes);

  const reloadStakes = () => {
    console.log("reloading stake[]...");
    database.loadStake(setStakes);
  };

  useEffect(() => {
    reload();
    reloadStakes();
  }, []);

  return (
    <dataContext.Provider value={{ data, reload, stakes, reloadStakes }}>
      {children}
    </dataContext.Provider>
  );
};

/**
 * エイリアス宣言
 * @returns
 */
export const useData = () => useContext(dataContext);
