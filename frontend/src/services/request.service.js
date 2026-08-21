import api from './api';
import { createResource, getResource, listResource, updateResource } from './resourceService';

const ENDPOINT = '/requests';

export const listRequests = (params = {}) => listResource(ENDPOINT, params);

export const getRequestById = (id) => getResource(ENDPOINT, id);

// payload can be a plain object or a FormData instance (when a reference file is attached)
export const createRequest = (payload, hasFile = false) => createResource(ENDPOINT, payload, hasFile);

export const updateRequest = (id, payload, hasFile = false) => updateResource(ENDPOINT, id, payload, hasFile);

export const approveRequest = async (id, response) => {
  const { data } = await api.patch(`${ENDPOINT}/${id}/approve`, { response });
  return data.data;
};

export const rejectRequest = async (id, response) => {
  const { data } = await api.patch(`${ENDPOINT}/${id}/reject`, { response });
  return data.data;
};

export const requestRevision = async (id, response) => {
  const { data } = await api.patch(`${ENDPOINT}/${id}/request-revision`, { response });
  return data.data;
};

// Builds a multipart FormData payload when a reference file is attached; otherwise
// returns a plain object so the request goes through as regular JSON.
export const buildRequestPayload = (values, referenceFile) => {
  if (!referenceFile) {
    return { payload: values, hasFile: false };
  }

  const formData = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') {
      return;
    }
    formData.append(key, value);
  });
  formData.append('reference', referenceFile);

  return { payload: formData, hasFile: true };
};
