import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import {
  PointOfSale,
  ReceiptLong,
  CheckCircle,
  Search,
} from "@mui/icons-material";

import PageLayout from "../components/common/PageLayout";
import recebimentoService from "../services/recebimentoService";
import showSnackbar from "../utils/snackbar";
import { useAuth } from "../context/AuthContext";

const Caixa = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [loadingDetalhe, setLoadingDetalhe] = useState(false);
  const [loadingReceber, setLoadingReceber] = useState(false);

  const [comandasAbertas, setComandasAbertas] = useState([]);
  const [selecionadas, setSelecionadas] = useState([]);
  const [detalhe, setDetalhe] = useState(null);
  const [comprovante, setComprovante] = useState(null);

  const [buscaComanda, setBuscaComanda] = useState("");
  const [clienteId, setClienteId] = useState("");
  const [desconto, setDesconto] = useState(0);
  const [acrescimo, setAcrescimo] = useState(0);

  const carregarDashboard = async () => {
    try {
      setLoading(true);

      const response = await recebimentoService.dashboard();
      const data = response.data || response;

      setComandasAbertas(data);
    } catch (error) {
      showSnackbar("Erro ao carregar dashboard do caixa", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDashboard();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(value || 0));
  };

  const comandasFiltradas = useMemo(() => {
    if (!buscaComanda) {
      return comandasAbertas;
    }

    return comandasAbertas.filter((item) =>
      String(item.comanda)
        .toLowerCase()
        .includes(buscaComanda.toLowerCase())
    );
  }, [buscaComanda, comandasAbertas]);

  const totalBruto = useMemo(() => {
    if (detalhe?.resumo_valores?.subtotal_geral !== undefined) {
      return Number(detalhe.resumo_valores.subtotal_geral);
    }

    if (detalhe?.subtotal_geral !== undefined) {
      return Number(detalhe.subtotal_geral);
    }

    return selecionadas.reduce((total, comanda) => {
      return total + Number(comanda.total || 0);
    }, 0);
  }, [detalhe, selecionadas]);

  const totalFinal = useMemo(() => {
    return totalBruto - Number(desconto || 0) + Number(acrescimo || 0);
  }, [totalBruto, desconto, acrescimo]);

  const selecionarComanda = async (comanda) => {
    try {
      setComprovante(null);

      const jaSelecionada = selecionadas.some((item) => item.id === comanda.id);

      let novasSelecionadas;

      if (jaSelecionada) {
        novasSelecionadas = selecionadas.filter((item) => item.id !== comanda.id);
      } else {
        novasSelecionadas = [...selecionadas, comanda];
      }

      setSelecionadas(novasSelecionadas);

      if (novasSelecionadas.length === 0) {
        setDetalhe(null);
        return;
      }

      setLoadingDetalhe(true);

      const ids = novasSelecionadas.map((item) => item.id);
      const response = await recebimentoService.detalheComandas(ids);

      setDetalhe(response.data || response);
    } catch (error) {
      showSnackbar("Erro ao detalhar comandas selecionadas", "error");
    } finally {
      setLoadingDetalhe(false);
    }
  };

  const finalizarRecebimento = async () => {
    if (selecionadas.length === 0) {
      showSnackbar("Selecione ao menos uma comanda", "warning");
      return;
    }

    try {
      setLoadingReceber(true);

      const payload = {
        comandas_ids: selecionadas.map((item) => item.id),
        cliente_id: clienteId ? Number(clienteId) : null,
        funcionario_id: user?.id,
        desconto_valor: Number(desconto || 0),
        acrescimo_valor: Number(acrescimo || 0),
      };

      const response = await recebimentoService.receber(payload);
      const data = response.data || response;

      showSnackbar("Recebimento finalizado com sucesso!", "success");

      if (data.recebimento_id) {
        const comprovanteResponse = await recebimentoService.comprovante(
          data.recebimento_id
        );

        setComprovante(comprovanteResponse.data || comprovanteResponse);
      } else {
        setComprovante(data);
      }

      setSelecionadas([]);
      setDetalhe(null);
      setBuscaComanda("");
      setClienteId("");
      setDesconto(0);
      setAcrescimo(0);

      carregarDashboard();
    } catch (error) {
      const mensagem =
        typeof error.apiMessage === "string"
          ? error.apiMessage
          : "Erro ao finalizar recebimento";

      showSnackbar(mensagem, "error");
    } finally {
      setLoadingReceber(false);
    }
  };

  if (loading) {
    return (
      <PageLayout title="Caixa">
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Caixa">
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <PointOfSale />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Comandas Abertas
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Buscar comanda"
            value={buscaComanda}
            onChange={(e) => setBuscaComanda(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1 }} />,
            }}
          />

          {comandasFiltradas.length === 0 ? (
            <Typography color="text.secondary">
              Nenhuma comanda aberta encontrada.
            </Typography>
          ) : (
            comandasFiltradas.map((comanda) => {
              const marcada = selecionadas.some((item) => item.id === comanda.id);

              return (
                <Card
                  key={comanda.id}
                  sx={{
                    mb: 2,
                    border: marcada ? "2px solid" : "1px solid",
                    borderColor: marcada ? "success.main" : "divider",
                    cursor: "pointer",
                  }}
                  onClick={() => selecionarComanda(comanda)}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Comanda {comanda.comanda}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          {comanda.cliente?.nome ||
                            comanda.cliente_id ||
                            "Cliente não identificado"}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          Produtos: {comanda.quantidade_produtos || 0}
                        </Typography>
                      </Box>

                      <Box sx={{ textAlign: "right" }}>
                        <Chip
                          label={marcada ? "Selecionada" : "Aberta"}
                          color={marcada ? "success" : "primary"}
                          size="small"
                          sx={{ mb: 1 }}
                        />

                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {formatCurrency(comanda.total)}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              );
            })
          )}
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <ReceiptLong />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Recebimento
            </Typography>
          </Box>

          {loadingDetalhe ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : selecionadas.length === 0 ? (
            <Typography color="text.secondary">
              Selecione uma comanda para iniciar o recebimento.
            </Typography>
          ) : (
            <>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Comandas selecionadas
              </Typography>

              {selecionadas.map((comanda) => (
                <Box
                  key={comanda.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography>Comanda {comanda.comanda}</Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    {formatCurrency(comanda.total)}
                  </Typography>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              <TextField
                fullWidth
                label="ID do Cliente (opcional)"
                value={clienteId}
                onChange={(e) => setClienteId(e.target.value)}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Desconto"
                type="number"
                value={desconto}
                onChange={(e) => setDesconto(e.target.value)}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Acréscimo"
                type="number"
                value={acrescimo}
                onChange={(e) => setAcrescimo(e.target.value)}
                sx={{ mb: 2 }}
              />

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography>Subtotal</Typography>
                <Typography>{formatCurrency(totalBruto)}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography>Desconto</Typography>
                <Typography>{formatCurrency(desconto)}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography>Acréscimo</Typography>
                <Typography>{formatCurrency(acrescimo)}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Total Final
                </Typography>

                <Typography variant="h6" sx={{ fontWeight: 700, color: "success.main" }}>
                  {formatCurrency(totalFinal)}
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="contained"
                color="success"
                startIcon={<CheckCircle />}
                onClick={finalizarRecebimento}
                disabled={loadingReceber}
                sx={{ mt: 3 }}
              >
                {loadingReceber ? "Finalizando..." : "Finalizar Recebimento"}
              </Button>
            </>
          )}
        </Paper>
      </Box>

      {comprovante && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Comprovante de Recebimento
          </Typography>

          <Typography>
            <strong>Recebimento:</strong>{" "}
            {comprovante.recebimento_id || comprovante.id || "-"}
          </Typography>

          <Typography>
            <strong>Data:</strong>{" "}
            {comprovante.data_emissao
              ? new Date(comprovante.data_emissao).toLocaleString("pt-BR")
              : new Date().toLocaleString("pt-BR")}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Comandas quitadas
          </Typography>

          {(comprovante.comandas || []).map((comanda, index) => (
            <Box key={index} sx={{ mt: 1 }}>
              <Typography>
                Comanda {comanda.comanda || comanda.id} -{" "}
                {formatCurrency(comanda.total)}
              </Typography>
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Total Pago:{" "}
            {formatCurrency(
              comprovante.valor_final ||
                comprovante.total_final ||
                comprovante.resumo_valores?.total_final ||
                totalFinal
            )}
          </Typography>
        </Paper>
      )}
    </PageLayout>
  );
};

export default Caixa;