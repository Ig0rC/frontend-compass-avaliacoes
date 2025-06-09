import { IPropose } from "@/entities/ipropose";
import { processSchema } from "@/schemas/create-process-schema";
import { clearMaskCurrency } from "@/utils/clearMaskCurrency";
import { formatDate } from "@/utils/formatDate";
import { maskCurrency } from "@/utils/maskCurrency";
import { z } from "zod";

interface DomainPropose {
  proposeTitle: string
  proposeResType: string
  proposeCep: string
  proposeAddress: string
  proposeDate: string
  proposeDescription: string
  proposeStatus: string
  proposeFiles: File[],
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
  static toPersistence(data: z.infer<typeof processSchema>): DomainPropose {
    console.log(data.scheduleSchema.date)
    return {
      proposeAdditionalInfo: {
        proposesAddProposeNumber: data.basicInfoSchema.processNumber,
        proposeAddStreet: data.basicInfoSchema.addressSchema.street,
        proposeAddCity: data.basicInfoSchema.addressSchema.city,
        proposeAddComplement: data.basicInfoSchema.addressSchema.complement,
        proposeAddNeighborhood: data.basicInfoSchema.addressSchema.neighborhood,
        proposeAddNumber: data.basicInfoSchema.addressSchema.number,
        proposeAddUf: data.basicInfoSchema.addressSchema.uf,
        proposeAddClientName: data.clientSchema.clientName,
        proposeAddColor: data.clientSchema.color,
        proposeAddCompanionName: data.clientSchema.accompanyingName,
        proposeAddPhoneNumberClient: data.clientSchema.phoneNumberClient,
        proposesAddPhoneNumber: data.clientSchema.phoneNumberClient,
        proposeAddPriority: Boolean(Number(data.clientSchema.priority)),
        proposeAddCustomerValue: clearMaskCurrency(data.valuesSchema.customerValue),
        proposeAddEstimatedPropertyValue: clearMaskCurrency(data.valuesSchema.propertyValue),
        proposeAddKmValue: clearMaskCurrency(data.valuesSchema.kmValue),
        proposeAddDisplacementValue: clearMaskCurrency(data.valuesSchema.displacementValue),
        proposeAddGalleryValue: clearMaskCurrency(data.valuesSchema.galleryValue),
        proposeAddAvaliationValue: clearMaskCurrency(data.valuesSchema.avaliationValue),
        proposeAddPreReportValue: clearMaskCurrency(data.valuesSchema.preReportValue),

      },
      proposeCep: data.basicInfoSchema.addressSchema.cep,
      proposeAddress: `${data.basicInfoSchema.addressSchema.street}, ${data.basicInfoSchema.addressSchema.number}, ${data.basicInfoSchema.addressSchema.neighborhood}, ${data.basicInfoSchema.addressSchema.city} - ${data.basicInfoSchema.addressSchema.uf}, ${data.basicInfoSchema.addressSchema.cep}`,

      proposeDate: `${data.scheduleSchema.date}T${data.scheduleSchema.hour}:00`,
      proposeDescription: data.scheduleSchema.description,
      proposeResType: data.basicInfoSchema.resType,
      proposeStatus: 'A',
      proposeTitle: data.basicInfoSchema.title,
      proposeFiles: [],

      userSupplier: {
        userCreaOrCau: data.valuesSchema.userSupplierSchema.userCreaOrCau,
        username: data.valuesSchema.userSupplierSchema.username,
        userPhoneNumber: data.valuesSchema.userSupplierSchema.userPhoneNumber,
        userEmail: data.valuesSchema.userSupplierSchema.userEmail,
        userDoc: data.valuesSchema.userSupplierSchema.userDoc,
        userId: Number(data.valuesSchema.userSupplierSchema.userId),
      }
    };
  }

  static toDomain(data: Partial<IPropose>): z.infer<typeof processSchema> {
    const proposeDate = formatDate(data?.proposeDate)
    return {
      basicInfoSchema: {
        title: data.proposeTitle ?? '',
        processNumber: data.proposeAdditionalInfo?.proposesAddProposeNumber ?? '',
        resType: data.proposeResType ?? '',
        addressSchema: {
          cep: data.proposeCep ?? '',
          uf: data.proposeAdditionalInfo?.proposeAddUf ?? '',
          city: data.proposeAdditionalInfo?.proposeAddCity ?? '',
          street: data.proposeAdditionalInfo?.proposeAddStreet ?? '',
          neighborhood: data.proposeAdditionalInfo?.proposeAddNeighborhood ?? '',
          number: data.proposeAdditionalInfo?.proposeAddNumber ?? '',
          complement: data.proposeAdditionalInfo?.proposeAddComplement ?? '',
        },
        proposeStatus: data?.proposeStatus ?? '',
      },
      clientSchema: {
        clientName: data.proposeAdditionalInfo?.proposeAddClientName ?? '',
        phoneNumberClient: data.proposeAdditionalInfo?.proposeAddPhoneNumberClient ?? '',
        accompanyingName: data.proposeAdditionalInfo?.proposeAddCompanionName ?? '',
        priority: data.proposeAdditionalInfo?.proposeAddPriority ? '1' : '0',
        color: data.proposeAdditionalInfo?.proposeAddColor ?? '',
      },
      scheduleSchema: {
        description: data.proposeDescription ?? '',
        date: proposeDate?.date ?? '',
        hour: proposeDate?.hour ?? '',
        phoneNumber: data.proposeAdditionalInfo?.proposesAddPhoneNumber ?? '',
        attachments: data.attachments ?? undefined,
      },
      valuesSchema: {
        kmValue: maskCurrency(data.proposeAdditionalInfo?.proposeAddKmValue, true) ?? '',
        displacementValue: maskCurrency(data.proposeAdditionalInfo?.proposeAddDisplacementValue, true) ?? '',
        avaliationValue: maskCurrency(data.proposeAdditionalInfo?.proposeAddAvaliationValue, true) ?? '',
        propertyValue: maskCurrency(data.proposeAdditionalInfo?.proposeAddEstimatedPropertyValue, true) ?? '',
        preReportValue: maskCurrency(data.proposeAdditionalInfo?.proposeAddPreReportValue, true) ?? '',
        galleryValue: maskCurrency(data.proposeAdditionalInfo?.proposeAddGalleryValue, true) ?? '',
        customerValue: maskCurrency(data.proposeAdditionalInfo?.proposeAddCustomerValue, true) ?? '',
        userSupplierSchema: {
          userCreaOrCau: data?.user?.additionalInfo?.userAdditionalCreaOrCau ?? '',
          userDoc: data?.user?.userDoc ?? '',
          userEmail: data?.user?.userEmail ?? '',
          userId: data?.user?.idUser.toString() ?? '',
          username: data?.user?.username ?? '',
          userPhoneNumber: data?.user?.userPhone ?? '',
          notifications: data?.user?.notifications || [],
        }
      },
    };
  }
}