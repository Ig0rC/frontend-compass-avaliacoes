import { IPropose, ProposeList } from "@/entities/ipropose";
import { api } from "@/lib/api";
import { processSchema } from "@/schemas/create-process-schema";
import { updateProposeSchema } from "@/schemas/update-propose-schema";
import QueryString from "qs";
import { z } from "zod";
import { ProposeMapper } from "./mappers/propose-mapper";

export interface IGetProposesResponse {
  proposes: ProposeList[]
  pagination: {
    currentPage: number
    pageSize: number
    totalProposes: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export interface IGetProposesParams {
  page: number;
  searchTerm: string;
  inspectionDateFrom?: Date | null;
  inspectionDateTo?: Date | null;
  proposeDateFrom?: Date | null;
  proposeDateTo?: Date | null;
  userInfoIdUser?: string | null;
  proposeStatus?: string | string[] | null;
  inspectionStatus?: string[] | null,
}

interface IGetExportProposesParams {
  inspectionDateTo?: Date;
  inspectionDateFrom?: Date;
  proposeDateTo?: Date;
  proposeDateFrom?: Date;
  userInfoIdUser?: string;
  proposeStatus?: string | string[]
  searchTerm?: string;
  inspectionStatus?: string | string[];
}




export class ProposeService {
  static async create(body: z.infer<typeof processSchema>) {
    const dataMapper = ProposeMapper.toPersistence(body);

    const response = await api.post(`/proposes`, {
      ...dataMapper
    });

    if (response.data && body.scheduleSchema.files) {
      for (let i = 0; i < body.scheduleSchema.files.length; i++) {
        const formData = new FormData();
        formData.append("files", body.scheduleSchema.files[i]); // Adiciona cada arquivo ao FormData
        formData.append('propose', response.data);
        await api.post('/new-attachment', formData, {
          headers: {
            "Content-Type": 'multipart/form-data'
          }
        });
      }
    }

    return response.data;
  }

  static async update(id: string | number, body: z.infer<typeof processSchema>) {
    const dataMapper = ProposeMapper.toPersistence(body);
    if (body.scheduleSchema.files) {
      for (let i = 0; i < body.scheduleSchema.files.length; i++) {
        const formData = new FormData();
        formData.append("files", body.scheduleSchema.files[i]); // Adiciona cada arquivo ao FormData
        formData.append('propose', `${id}`);
        await api.post('/new-attachment', formData, {
          headers: {
            "Content-Type": 'multipart/form-data'
          }
        });
      }
    }

    await api.put(`/proposes/${id}`, dataMapper);
  }

  static async updateInTable(propose: z.infer<typeof updateProposeSchema>) {
    await api.put(`/proposes/update-in-table/${propose.idProposes}`, {
      ...propose,
    });
  }

  static async getProposes(params: IGetProposesParams) {
    const query = QueryString.stringify({
      ...params,
      proposeStatus: params.proposeStatus,
    });


    const response = await api.get<IGetProposesResponse>(`/proposes?${query}`);

    return response.data;
  }

  static async getExportProposes(params: IGetExportProposesParams) {
    const query = QueryString.stringify({
      ...params,
      proposeStatus: params.proposeStatus,
    });


    const response = await api.get(`/export-proposes?${query}`, {
      responseType: 'blob', // Importante para receber o arquivo
    });

    return response.data;
  }

  static async getExportPropose(id: string | number) {
    const response = await api.get(`/export-propose/${id}`, {
      responseType: 'blob', // Importante para receber o arquivo
    });

    return response.data;
  }

  static async getById(id: string) {
    const response = await api.get<IPropose>(`/proposes/${id}`);

    return response.data;
  }

  static async updateStatus(id: string | number, proposeStatus: string) {
    await api.put(`/proposes/update-status`, {
      idPropose: Number(id),
      proposeStatus,
    });
  }
}


