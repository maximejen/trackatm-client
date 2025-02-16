import React from "react";
import DropdownAlert from "react-native-dropdownalert";

const AlertContext = React.createContext(null);

const AlertContextProvider = ({ children }) => {
  const alertRef = React.useRef(null);

  const ctx = React.useMemo(() => {
    return {
      alert: (data) => {
        console.log('ALERT IS CALLED', data);
        alertRef.current?.(data);
      },
    };
  }, []);

  return (
    <AlertContext.Provider value={ctx}>
      {children}
      <DropdownAlert
        type="alert"
        alert={(func) => {
          alertRef.current = func;
        }}
      />
    </AlertContext.Provider>
  );
};

export default AlertContextProvider;

export const useAlertContext = () => React.useContext(AlertContext);
