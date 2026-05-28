import { API_ENDPOINTS } from "../config/apiConfig";
import api from "./api";

// Extrair apenas endpoints utilizados no service
const { CLIENTE } = API_ENDPOINTS;

// Serviços de clientes
export const clienteService = {
  // Listar todos os clientes com filtros e paginação
  list: async (params = {}) => {
    const {
      skip = 0,
      limit = 100,
      id,
      nome,
      cpf,
      telefone,
      email,
    } = params;

    const queryParams = new URLSearchParams();

    // paginação
    queryParams.append("skip", skip);
    queryParams.append("limit", limit);

    // filtros
    if (id !== undefined && id !== null) queryParams.append("id", id);
    if (nome !== undefined && nome !== null && nome !== "")
      queryParams.append("nome", nome);
    if (cpf !== undefined && cpf !== null && cpf !== "")
      queryParams.append("cpf", cpf);
    if (telefone !== undefined && telefone !== null && telefone !== "")
      queryParams.append("telefone", telefone);
    if (email !== undefined && email !== null && email !== "")
      queryParams.append("email", email);

    const response = await api.get(`${CLIENTE.LIST}?${queryParams.toString()}`);

    return response.data;
  },

  // Buscar cliente por ID
  getById: async (id) => {
    const response = await api.get(CLIENTE.GET.replace(":id", id));

    return response.data;
  },

  // Criar novo cliente
  create: async (clienteData) => {
    const response = await api.post(CLIENTE.CREATE, clienteData);

    return response.data;
  },

  // Atualizar cliente existente
  update: async (id, clienteData) => {
    const response = await api.put(
      CLIENTE.UPDATE.replace(":id", id),
      clienteData
    );

    return response.data;
  },

  // Excluir cliente
  delete: async (id) => {
    await api.delete(CLIENTE.DELETE.replace(":id", id));

    return { success: true };
  },

  // Verificar se CPF já existe
  checkCpfExists: async (cpf, excludeId = null) => {
    const params = { cpf };

    if (excludeId) {
      params.exclude_id = excludeId;
    }

    const response = await api.get(
      `${CLIENTE.LIST}?${new URLSearchParams(params).toString()}`
    );

    const clientes = response.data || response;

    return clientes.length > 0 ? clientes[0] : null;
  },
};

export default clienteService;