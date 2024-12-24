export interface IUpdateProcess {
  proposeTitle: string
  proposeResType: string
  proposeCep: string
  proposeDate: string
  proposeDescription: string
  proposeStatus: string
  userInfoIdUser: number
  proposeAdditionalInfo: {
    proposeAddCity: string
    proposeAddUf: string
    proposeAddNumber: string
    proposeAddNeighborhood: string
    proposesAddPhoneNumber: string
    proposeAddClientName: string
    proposeAddPhoneNumberClient: string
    proposeAddCompanionName: string
    proposeAddPriority: boolean
    proposeAddColor: 'GREEN' | 'BLUE' | 'YELLOW' | 'RED' | 'PURPLE' | 'PINK' | 'PEACH';
    proposeAddKmValue: number
    proposeAddAvaliationValue: number
    proposeAddDisplacementValue: number
    proposeAddGalleryValue: number
    proposeAddCustomerValue: number
    proposeAddEstimatedPropertyValue: number
    proposeAddPreReportValue: number
    proposeAddComplement: string
    proposesAddProposeNumber: string
    proposeAddStreet: string
  },
  userSupplier: {
    userEmail: string
    username: string
    userDoc: string
    userPhoneNumber: string
    userCreaOrCau: string
    userId: number
  }
}