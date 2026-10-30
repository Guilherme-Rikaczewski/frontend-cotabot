import api from "./api";


/**
 * O backend espera o par completo ("USD-BRL") em `coin_name`: ele faz
 * split('-') para descobrir origem e destino e, a partir da cotação
 * atual, decidir se o alerta espera alta ou queda.
 */
export const createAlert = async (coinCode, targetValue, signal) => {
  try {
    const response = await api.post(
      "/alerts/",
      {
        coin_name: `${coinCode}-BRL`,
        target_value_expected: Number(targetValue)
      },
      { signal }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getAlerts = async (signal) => {
  try {
    const response = await api.get("/alerts/", { signal });

    return response.data;
  } catch (error) {
    throw error;
  }
};


export const deleteAlert = async (alertId, signal) => {
  try {
    await api.delete(`/alerts/${alertId}`, { signal });

    return true;
  } catch (error) {
    throw error;
  }
};


export const getMessages = async (signal) => {
  try {
    const response = await api.get("/alerts/messages", { signal });

    return response.data;
  } catch (error) {
    throw error;
  }
};
