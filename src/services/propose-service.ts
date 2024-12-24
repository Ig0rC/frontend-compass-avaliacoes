import { IPropose } from "@/entities/ipropose";
import { api } from "@/lib/api";
import { processSchema } from "@/schemas/process-schema";
import QueryString from "qs";
import { z } from "zod";
import { ProposeMapper } from "./mappers/propose-mapper";


interface IGetProposesResponse {
  proposes: IPropose[]
  pagination: {
    currentPage: number
    pageSize: number
    totalProposes: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

interface IGetProposesParams {
  inspectionDateTo?: string;
  inspectionDateFrom?: string;
  proposeDateTo?: string;
  proposeDateFrom?: string;
  userInfoIdUser?: string;
  page?: number | string;
  proposeStatus?: string | string[]
  searchTerm?: string;
}

export class ProposeService {
  static async create(body: z.infer<typeof processSchema>) {
    const dataMapper = ProposeMapper.toPersistence(body);

    const response = await api.post(`/proposes`, {
      ...dataMapper
    });

    return response.data;
  }

  static async update(id: string | number, body: z.infer<typeof processSchema>) {
    const dataMapper = ProposeMapper.toPersistence(body);
    await api.put(`/proposes/${id}`, dataMapper);
  }

  static async getProposes(params: IGetProposesParams) {
    const query = QueryString.stringify({
      ...params,
      proposeStatus: params.proposeStatus,
    });


    const response = await api.get<IGetProposesResponse>(`/proposes?${query}`);

    console.log(response.data, 'aqui')

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
