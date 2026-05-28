import api from "./api";
import { API_ENDPOINTS } from "../config/apiConfig";

const { RECEBIMENTO } = API_ENDPOINTS;

const recebimentoService = {
  // Dashboard do caixa
  dashboard: async () => {
    const response = await api.get(RECEBIMENTO.DASHBOARD);

    return response.data;
  },

  // Detalhar comandas selecionadas
  detalheComandas: async (ids) => {
    const response = await api.get(
      RECEBIMENTO.DETALHE.replace(":ids", ids.join(","))
    );

    return response.data;
  },

  // Finalizar recebimento
  receber: async (payload) => {
    const response = await api.post(
      RECEBIMENTO.RECEBER,
      payload
    );

    return response.data;
  },

  // Buscar comprovante
  comprovante: async (id) => {
    const response = await api.get(
      RECEBIMENTO.COMPROVANTE.replace(":id", id)
    );

    return response.data;
  },
};

export default recebimentoService;