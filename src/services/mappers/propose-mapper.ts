import { IPropose } from "@/entities/ipropose";
import { processSchema } from "@/schemas/process-schema";
import { clearMaskCurrency } from "@/utils/clearMaskCurrency";
import { formatDate } from "@/utils/formatDate";
import { maskCurrency } from "@/utils/maskCurrency";
import { z } from "zod";

interface DomainContact {
  proposeTitle: string
  proposeResType: string
  proposeCep: string
  proposeAddress: string
  proposeDate: string
  proposeDescription: string
  proposeStatus: string
  proposeAdditionalInfo: {
    proposeAddCity: string
    proposeAddUf: string
    proposeAddNumber: string
    proposeAddStreet: string
    proposeAddNeighborhood: string
    proposesAddPhoneNumber: string
    proposeAddClientName: string
    proposeAddPhoneNumberClient: string
    proposeAddCompanionName: string
    proposeAddPriority: boolean
    proposeAddColor: string
    proposeAddKmValue: number
    proposeAddAvaliationValue: number
    proposeAddDisplacementValue: number
    proposeAddDisplacementType: string
    proposeAddGalleryValue: number
    proposeAddCustomerValue: number
    proposeAddEstimatedPropertyValue: number
    proposeAddPreReportValue: number
    proposeAddComplement: string
    proposesAddProposeNumber: string
  }
  userSupplier: {
    userEmail: string
    username: string
    userDoc: string
    userPhoneNumber: string
    userCreaOrCau: string
    userId: number
  }
}


export class ProposeMapper {
  static toPersistence(data: z.infer<typeof processSchema>): DomainContact {
    return {
      proposeAdditionalInfo: {
        proposeAddStreet: data.street,
        proposeAddCity: data.city,
        proposeAddClientName: data.clientName,
        proposeAddColor: data.color,
        proposeAddCompanionName: data.accompanyingName,
        proposeAddComplement: data.complement,
        proposeAddNeighborhood: data.neighborhood,
        proposeAddNumber: data.number,
        proposeAddPhoneNumberClient: data.phoneNumberClient,
        proposeAddUf: data.uf,
        proposesAddPhoneNumber: data.phoneNumber,
        proposesAddProposeNumber: data.processNumber,
        proposeAddPriority: Boolean(Number(data.priority)),
        proposeAddCustomerValue: clearMaskCurrency(data.customerValue),
        proposeAddEstimatedPropertyValue: clearMaskCurrency(data.propertyValue),
        proposeAddKmValue: clearMaskCurrency(data.kmValue),
        proposeAddDisplacementValue: clearMaskCurrency(data.displacementValue),
        proposeAddGalleryValue: clearMaskCurrency(data.galleryValue),
        proposeAddAvaliationValue: clearMaskCurrency(data.avaliationValue),
        proposeAddPreReportValue: clearMaskCurrency(data.preReportValue),
        proposeAddDisplacementType: data.displacementType || 'Carro',
      },
      proposeCep: data.cep,
      proposeDate: `${data.date.split('/').reverse().join('-')}T${data.hour}:00`,
      proposeDescription: data.description,
      proposeResType: data.resType,
      proposeStatus: 'A',
      proposeTitle: data.title,
      proposeAddress: `${data.street}, ${data.number}, ${data.neighborhood}, ${data.city} - ${data.uf}, ${data.cep}`,
      userSupplier: {
        userCreaOrCau: data.userSupplier.userCreaOrCau,
        username: data.userSupplier.username,
        userPhoneNumber: data.userSupplier.userPhoneNumber,
        userEmail: data.userSupplier.userEmail,
        userDoc: data.userSupplier.userDoc,
        userId: Number(data.userSupplier.userId),
      }
    };
  }

  static toDomain(data: IPropose): z.infer<typeof processSchema> {
    const proposeDate = formatDate(data.proposeDate);

    return {
      title: data.proposeTitle,
      processNumber: data.proposeAdditionalInfo.proposesAddProposeNumber,
      resType: data.proposeResType,
      cep: data.proposeCep,
      city: data.proposeAdditionalInfo.proposeAddCity,
      uf: data.proposeAdditionalInfo.proposeAddUf,
      street: data.proposeAdditionalInfo.proposeAddStreet,
      number: data.proposeAdditionalInfo.proposeAddNumber,
      neighborhood: data.proposeAdditionalInfo.proposeAddNeighborhood,
      complement: data.proposeAdditionalInfo.proposeAddComplement,
      date: proposeDate.date,
      proposeStatus: data.proposeStatus,
      hour: proposeDate.hour,
      proposeSolicitationDate: new Date(data.proposeAdditionalInfo.proposesAddSolicitationDate).toLocaleDateString('pt-BR'),
      phoneNumber: data.proposeAdditionalInfo.proposesAddPhoneNumber,
      description: data.proposeDescription,
      clientName: data.proposeAdditionalInfo.proposeAddClientName,
      phoneNumberClient: data.proposeAdditionalInfo.proposeAddPhoneNumberClient,
      priority: data.proposeAdditionalInfo.proposeAddPriority ? '1' : '0',
      color: data.proposeAdditionalInfo.proposeAddColor,
      accompanyingName: data.proposeAdditionalInfo.proposeAddCompanionName,
      kmValue: maskCurrency(data.proposeAdditionalInfo.proposeAddKmValue, true),
      displacementValue: maskCurrency(data.proposeAdditionalInfo.proposeAddDisplacementValue, true),
      avaliationValue: maskCurrency(data.proposeAdditionalInfo.proposeAddAvaliationValue, true),
      propertyValue: maskCurrency(data.proposeAdditionalInfo.proposeAddEstimatedPropertyValue, true),
      preReportValue: maskCurrency(data.proposeAdditionalInfo.proposeAddPreReportValue, true),
      galleryValue: maskCurrency(data.proposeAdditionalInfo.proposeAddGalleryValue, true),
      customerValue: maskCurrency(data.proposeAdditionalInfo.proposeAddCustomerValue, true),
      displacementType: data.proposeAdditionalInfo.proposeAddDisplacementType,
      userSupplier: {
        userCreaOrCau: data.user.additionalInfo?.userAdditionalCreaOrCau ?? '',
        userDoc: data.user.userDoc ?? '',
        userEmail: data.user.userEmail ?? '',
        userId: data.user.idUser.toString() ?? 'others',
        username: data.user.username ?? '',
        userPhoneNumber: data.user.userPhone ?? '',
        notifications: data.user.notifications || [],
      },
    };
  }
}