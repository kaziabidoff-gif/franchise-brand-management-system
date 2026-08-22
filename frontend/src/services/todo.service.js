import api from './api';

const ENDPOINT = '/todos';

export const listTodos = async () => {
  const { data } = await api.get(ENDPOINT);
  return data;
};

export const createTodo = async (payload) => {
  const { data } = await api.post(ENDPOINT, payload);
  return data.data;
};

export const updateTodo = async (id, payload) => {
  const { data } = await api.patch(`${ENDPOINT}/${id}`, payload);
  return data.data;
};

export const deleteTodo = async (id) => {
  await api.delete(`${ENDPOINT}/${id}`);
};

export const clearCompletedTodos = async () => {
  await api.patch(`${ENDPOINT}/clear-completed`);
};
