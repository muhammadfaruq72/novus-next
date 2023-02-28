import { createContext, ReactNode, useState, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";

interface typeContext {
  isloggedIn?: any;
  setIsLoggedIn?: any;
  userExistsInSpace?: any;
  setuserExistsInSpace?: any;
  SelectedChannel?: any;
  setSelectedChannel?: any;
  setDeleteMembercount?: any;
  DeleteMembercount?: any;
  LoggedUser?: any;
  setLoggedUser?: any;
  selectedImages?: any;
  setSelectedImages?: any;
  selectedFilesArray?: any;
  setSelectedFilesArray?: any;
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

interface File {
  name: string;
  lastModified: number;
  webkitRelativePath: string;
  size: number;
  type: string;
}

interface ImagesOBJ {
  Imagename?: string;
  originalImage: string;
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
    isPublic: null,
  });

  // useEffect(() => {
  //   console.log("...SelectedChannel", SelectedChannel);
  // }, [SelectedChannel]);

  const [DeleteMembercount, setDeleteMembercount] = useState(0);

  const [LoggedUser, setLoggedUser] = useState({
    username: null,
    isAdmin: null,
  });

  const [selectedImages, setSelectedImages] = useState(Array<ImagesOBJ>);
  const [selectedFilesArray, setSelectedFilesArray] = useState<File[]>([]);

  let contextData = {
    isloggedIn: isloggedIn,
    setIsLoggedIn: setIsLoggedIn,
    userExistsInSpace: userExistsInSpace,
    setuserExistsInSpace: setuserExistsInSpace,
    SelectedChannel: SelectedChannel,
    setSelectedChannel: setSelectedChannel,
    DeleteMembercount: DeleteMembercount,
    setDeleteMembercount: setDeleteMembercount,
    LoggedUser: LoggedUser,
    setLoggedUser: setLoggedUser,
    selectedImages: selectedImages,
    setSelectedImages: setSelectedImages,
    selectedFilesArray: selectedFilesArray,
    setSelectedFilesArray: setSelectedFilesArray,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
