import { createContext, ReactNode, useState, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";

interface typeContext {
  isloggedIn?: any;
  setIsLoggedIn?: any;
  userExistsInSpace?: any;
  setuserExistsInSpace?: any;
  SelectedChannel?: any;
  setSelectedChannel?: any;
}

const AuthContext = createContext<typeContext>({});

export default AuthContext;

interface Props {
  children?: ReactNode;
}

interface userExistsInSpace {
  spaceName: string;
  spaceImage: string;
  space_id: any;
}

export const AuthProvider = ({ children }: Props) => {
  const [isloggedIn, setIsLoggedIn] = useState<Boolean | null>(null);
  const [userExistsInSpace, setuserExistsInSpace] =
    useState<userExistsInSpace | null>(null);

  // Selected channel item
  const [SelectedChannel, setSelectedChannel] = useState({
    Bool: false,
    key: 0,
    Name: null,
  });

  let contextData = {
    isloggedIn: isloggedIn,
    setIsLoggedIn: setIsLoggedIn,
    userExistsInSpace: userExistsInSpace,
    setuserExistsInSpace: setuserExistsInSpace,
    SelectedChannel: SelectedChannel,
    setSelectedChannel: setSelectedChannel,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
