import { IUsersSupplier } from "./i-user-supplier"

export interface IPropose {
  idProposes: number
  proposeTitle: string
  proposeResType: string
  proposeCep: string
  proposeAddress: string
  proposeDate: string
  proposeDescription: string
  proposeStatus: string
  userInfoIdUser: number
  enterpriseIdEnterprise: number
  proposeAdditionalInfo: {
    proposeAddStreet: string
    idProposesAdditionalInfo: number
    proposeAddCity: string
    proposeAddUf: string
    proposeAddNumber: string
    proposeAddNeighborhood: string
    proposesAddPhoneNumber: string
    proposeAddClientName: string
    proposeAddPhoneNumberClient: string
    proposeAddCompanionName: string
    proposeAddPriority: boolean
    proposeAddColor: string
    proposeAddKmValue: string | number
    proposeAddAvaliationValue: string | number
    proposeAddDisplacementValue: string | number
    proposeAddGalleryValue: string | number
    proposeAddCustomerValue: string | number
    proposeAddEstimatedPropertyValue: string | number
    proposeAddPreReportValue: string | number
    proposeAddComplement: string
    proposesIdProposes: number
    proposesAddProposeNumber: string
    proposesAddSolicitationDate: string
    proposeAddDisplacementType: string
  }
  inspections: {
    id_inspection: number
    inspectionDate: string
    clientPresent: string
    propertyDescription: string
    inspectionStatus: string
    inspectionUserLocation: string
    proposesIdProposes: number
    userId: number
    enterpriseIdEnterprise: number
    environmentsNumber: number
    genericInfo: {
      generic_info: {
        andares: string
        subsolo: string
        unidades_por_andar: string
        blocos: string
        elevadores: string
      }
    }
  }
  user: IUsersSupplier;
  userSupplier?: IUsersSupplier;
  attachments?: {
    id_attachments: number
    attachments_link: string
    attachments_status: string
    proposes_id_proposes: number
  }[]
}

