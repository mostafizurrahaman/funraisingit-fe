"use client";

import { persistor, store } from "@/redux/store";
import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";

import { CampaignDraftProvider } from "./CampaignDraftProvider";

interface ProvidersProps {
  children: ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <CampaignDraftProvider>
          {children}
          <Toaster />
        </CampaignDraftProvider>
      </PersistGate>
    </Provider>
  );
};

export default Providers;
