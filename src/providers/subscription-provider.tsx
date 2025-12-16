import { createContext, useContext, useState } from "react";

type SubscriptionContextType = {
  hasAccess: boolean;
  grantAccess: () => void;
};

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [hasAccess, setHasAccess] = useState(false);

  const grantAccess = () => setHasAccess(true);

  return (
    <SubscriptionContext.Provider value={{ hasAccess, grantAccess }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error("useSubscription must be used inside SubscriptionProvider");
  return ctx;
}
