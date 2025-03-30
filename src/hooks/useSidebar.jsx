import { createContext, useState, useContext } from "react";

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isExplored, setIsExplored] = useState(false);

  return (
    <SidebarContext.Provider value={{ isExplored, setIsExplored }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
