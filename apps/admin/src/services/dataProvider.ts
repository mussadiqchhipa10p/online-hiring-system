import { DataProvider, fetchUtils } from 'react-admin';
import queryString from 'query-string';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const httpClient = (url: string, options: any = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }
  
  const token = localStorage.getItem('token');
  if (token) {
    options.headers.set('Authorization', `Bearer ${token}`);
  }
  
  return fetchUtils.fetchJson(url, options);
};

export const dataProvider: DataProvider = {
  getList: (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: queryString.stringify([field, order]),
      range: queryString.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: queryString.stringify(params.filter),
    };
    const url = `${API_URL}/api/${resource}?${queryString.stringify(query)}`;
    
    return httpClient(url).then(({ json }) => ({
      data: json.data,
      total: json.pagination?.total || json.data.length,
    }));
  },

  getOne: (resource, params) =>
    httpClient(`${API_URL}/api/${resource}/${params.id}`).then(({ json }) => ({
      data: json.data,
    })),

  getMany: (resource, params) => {
    const query = {
      filter: queryString.stringify({ id: params.ids }),
    };
    const url = `${API_URL}/api/${resource}?${queryString.stringify(query)}`;
    return httpClient(url).then(({ json }) => ({ data: json.data }));
  },

  getManyReference: (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: queryString.stringify([field, order]),
      range: queryString.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: queryString.stringify({
        ...params.filter,
        [params.target]: params.id,
      }),
    };
    const url = `${API_URL}/api/${resource}?${queryString.stringify(query)}`;
    
    return httpClient(url).then(({ json }) => ({
      data: json.data,
      total: json.pagination?.total || json.data.length,
    }));
  },

  update: (resource, params) =>
    httpClient(`${API_URL}/api/${resource}/${params.id}`, {
      method: 'PUT',
      body: queryString.stringify(params.data),
    }).then(({ json }) => ({ data: json.data })),

  updateMany: (resource, params) => {
    const query = {
      filter: queryString.stringify({ id: params.ids }),
    };
    return httpClient(`${API_URL}/api/${resource}?${queryString.stringify(query)}`, {
      method: 'PUT',
      body: queryString.stringify(params.data),
    }).then(({ json }) => ({ data: json.data }));
  },

  create: (resource, params) =>
    httpClient(`${API_URL}/api/${resource}`, {
      method: 'POST',
      body: queryString.stringify(params.data),
    }).then(({ json }) => ({
      data: { ...params.data, id: json.data.id },
    })) as any,

  delete: (resource, params) =>
    httpClient(`${API_URL}/api/${resource}/${params.id}`, {
      method: 'DELETE',
    }).then(({ json }) => ({ data: json.data })),

  deleteMany: (resource, params) => {
    const query = {
      filter: queryString.stringify({ id: params.ids }),
    };
    return httpClient(`${API_URL}/api/${resource}?${queryString.stringify(query)}`, {
      method: 'DELETE',
    }).then(({ json }) => ({ data: json.data }));
  },
};
