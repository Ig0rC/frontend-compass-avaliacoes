

interface AdditionalInfo {
  idUserAdditional: number;
  typeUser: 'A' | 'S' | 'F';
  userAdditionalCreaOrCau: string | null;
  userAdditionalPassword: string;
  userAdditionalUrlPicture: string | null;
  userInfoIdUser: number;
}

export interface IUser {
  idUser: number
  username: string
  userEmail: string
  userDoc: string
  userCadDate: string
  additionalInfo: AdditionalInfo;
  userStatus: string
  userPhone: string
  enterpriseIdEnterprise: number
  notifications: {
    idNotification: number;
    notificationDescription: string;
    notificationDate: string;
    notificationStatus: string;
    userId: number;
  }[]
}

