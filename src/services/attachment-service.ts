import { api } from "@/lib/api";

export class AttachmentService {
  static async delete(id: number) {
    await api.delete(`/attachment/${id}`);
  }
}