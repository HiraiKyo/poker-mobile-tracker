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
  reload: () => Promise<void>;
  stakes: Stake[];
  reloadStakes: () => Promise<void>;
};

const defaultValue = {
  data: [],
  reload: async () => { throw new Error("Context Provider is not set.") },
  stakes: [],
  reloadStakes: async () => { throw new Error("Context Provider is not set.")},
};
const dataContext = createContext<DataContextValue>(defaultValue);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<SessionWithStake[]>(defaultValue.data);

  const reload = () => new Promise<void>((resolve, reject) => {
    console.log("reloading session[]...");
    database.loadSession((_) => {
      setData(_);
      resolve();
    });
  })

  // ステークス一覧
  const [stakes, setStakes] = useState<Stake[]>(defaultValue.stakes);

  const reloadStakes = () => new Promise<void>((resolve, reject) => {
    console.log("reloading stake[]...");
    database.loadStake((_) => {
      setStakes(_);
      resolve();
    });
  })

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
