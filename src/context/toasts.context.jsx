import { Toast } from "primereact/toast";
import { createContext, useContext, useRef } from "react";

const ToastsContext = createContext();

export default function ToastsWrapper({ children }) {
  const toast = useRef(undefined);

  function showToast({ severity, summary, detail, life }) {
    if (toast.current) toast.current.show({ severity, summary, detail, life });
  }

  return (
    <ToastsContext.Provider value={{ showToast }}>
      <Toast ref={toast} />
      {children}
    </ToastsContext.Provider>
  );
}

export function useToasts() {
  return useContext(ToastsContext);
}
