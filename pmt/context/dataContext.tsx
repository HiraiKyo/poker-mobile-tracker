import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { SessionWithStake } from "../types/session";
import { database } from "../app/_layout";

type DataContextValue = {
  data: SessionWithStake[];
  reload: () => void;
};

const defaultValue = {
  data: [],
  reload: () => {},
};
const dataContext = createContext<DataContextValue>(defaultValue);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<SessionWithStake[]>([]);

  const reload = () => {
    console.log("reloading...");
    database.loadSession(setData);
  };
  useEffect(() => {
    reload();
  }, []);

  return (
    <dataContext.Provider value={{ data, reload }}>
      {children}
    </dataContext.Provider>
  );
};

/**
 * エイリアス宣言
 * @returns
 */
export const useData = () => useContext(dataContext);
