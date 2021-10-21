import React from "react";
import { AsyncListData } from '@react-stately/data'
import { iCoa, iJournal } from "../components/interfaces";


export interface JournalContextParam {
  coa: AsyncListData<iCoa>;
  journal: AsyncListData<iJournal>;
  source: {
    searchJournal: (txt: string, isClear: boolean) => void;
    setSelected: React.Dispatch<React.SetStateAction<number>>;
    getSelected: number;
    isJournalSaved: boolean;
    update: (id: number, data: iJournal, callback: (res: iJournal | undefined) => void) => void;
    insert: (data: iJournal, callback: (res: iJournal | undefined) => void) => void;
    remove: (id: number, callback: (res: iJournal | undefined) => void) => void;
    gotoPage: (page: string) => void
  }
  // journal: {
  //   prop: hookJournalData,
  //   setItem: React.Dispatch<React.SetStateAction<iJournal>>;
  //   getItem: (id: number) => iJournal;
  //   update: (id: number, j: iJournal, callback: (data: iJournal | undefined) => void) => void;
  //   insert: (j: iJournal, callback: (data: iJournal | undefined) => void) => void;
  //   delete: (id: number, callback: (data: iJournal | undefined) => void) => void;
  // };
  // journalDetail: {
  //   getItem: (id: number) => iJournalDetail;
  //   setItem: React.Dispatch<React.SetStateAction<iJournalDetail>>;
  //   update: (id: number, j: iJournal, callback: (data: iJournalDetail | undefined) => void) => void;
  //   insert: (j: iJournal, callback: (data: iJournalDetail | undefined) => void) => void;
  //   delete: (id: number, callback: (data: iJournalDetail | undefined) => void) => void;
  // };
}

const JournalContext = React.createContext<JournalContextParam>(
  {} as JournalContextParam
);

export const JournalProvider = JournalContext.Provider;
export default JournalContext;