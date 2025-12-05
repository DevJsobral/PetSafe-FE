// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5179/api';

// Helper function to get auth token from localStorage
function getToken() {
  return localStorage.getItem('petsafe_token');
}

// Helper function to save auth token
function saveToken(token) {
  localStorage.setItem('petsafe_token', token);
}

// Helper function to remove auth token
function removeToken() {
  localStorage.removeItem('petsafe_token');
  localStorage.removeItem('petsafe_user');
}

// Helper function to save user data
function saveUser(user) {
  localStorage.setItem('petsafe_user', JSON.stringify(user));
}

// Helper function to get user data
export function getUser() {
  try {
    const userJson = localStorage.getItem('petsafe_user');
    if (!userJson) return null;
    return JSON.parse(userJson);
  } catch (e) {
    return null;
  }
}

// Upload de imagem para o ImgBB (igual ao Angular)
async function uploadImageToImgbb(file) {
  const apiKey = "a5e6e1da6cf1299d5ec892928bcffe33";
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error("Erro ao enviar imagem para ImgBB");
  }

  return data.data.url; // URL final da imagem hospedada
}


// Helper function to get auth headers
function getAuthHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}

// Helper function to handle API responses
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro na requisição' }));
    throw new Error(error.message || `Erro ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

export const auth = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await handleResponse(response);

    // Salva o token e dados do usuário
    if (data.token) {
      saveToken(data.token);
    }
    if (data.user) {
      saveUser(data.user);
    }

    return {
      token: data.token,
      user: data.user
    };
  },

  register: async (data) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: data.name,
        email: data.email,
        password: data.password,
        emergencyPhone: data.emergencyPhone || null
      })
    });

    const result = await handleResponse(response);

    // Salva o token e dados do usuário
    if (result.token) {
      saveToken(result.token);
    }
    if (result.user) {
      saveUser(result.user);
    }

    return {
      token: result.token,
      user: result.user
    };
  },

  logout: () => {
    removeToken();
    // Limpa também o localStorage antigo se existir
    localStorage.removeItem('petsafe_data_v1');
  }
};

export const pets = {
  list: async () => {
    const response = await fetch(`${API_BASE_URL}/pets`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    return handleResponse(response);
  },

  get: async (id) => {
    const response = await fetch(`${API_BASE_URL}/pets/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    return handleResponse(response);
  },

  create: async (data) => {
    const response = await fetch(`${API_BASE_URL}/pets`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    return handleResponse(response);
  },

  update: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/pets/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/pets/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro ao deletar' }));
      throw new Error(error.message || 'Erro ao deletar pet');
    }

    return true;
  },

  addVaccine: async (id, vaccineData) => {
    const response = await fetch(`${API_BASE_URL}/pets/${id}/vaccines`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        name: vaccineData.name,
        date: vaccineData.date,
        next: vaccineData.next || null,
        vet: vaccineData.vet || null,
        lot: vaccineData.lot || null
      })
    });

    return handleResponse(response);
  },

  addWeight: async (id, weightEntry) => {
    const response = await fetch(`${API_BASE_URL}/pets/${id}/weights`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        date: weightEntry.date,
        weight: Number(weightEntry.weight)
      })
    });

    return handleResponse(response);
  },

  // Vacinas - Update e Delete
  updateVaccine: async (petId, vaccineId, vaccineData) => {
    const response = await fetch(`${API_BASE_URL}/pets/${petId}/vaccines/${vaccineId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        name: vaccineData.name || null,
        date: vaccineData.date || null,
        next: vaccineData.next || null,
        vet: vaccineData.vet || null,
        lot: vaccineData.lot || null
      })
    });

    return handleResponse(response);
  },

  deleteVaccine: async (petId, vaccineId) => {
    const response = await fetch(`${API_BASE_URL}/pets/${petId}/vaccines/${vaccineId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro ao deletar vacina' }));
      throw new Error(error.message || 'Erro ao deletar vacina');
    }

    return true;
  },

  // Pesos - Update e Delete
  updateWeight: async (petId, weightId, weightData) => {
    const response = await fetch(`${API_BASE_URL}/pets/${petId}/weights/${weightId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        date: weightData.date || null,
        weight: weightData.weight ? Number(weightData.weight) : null
      })
    });

    return handleResponse(response);
  },

  deleteWeight: async (petId, weightId) => {
    const response = await fetch(`${API_BASE_URL}/pets/${petId}/weights/${weightId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro ao deletar peso' }));
      throw new Error(error.message || 'Erro ao deletar peso');
    }

    return true;
  },
    updateImage: async (id, file) => {
      const imageUrl = await uploadImageToImgbb(file);

      const response = await fetch(`${API_BASE_URL}/pets/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          photoUrl: imageUrl
        })
      });

      return handleResponse(response);
    }
  };

// Public endpoints (não requerem autenticação)
export const publicApi = {
  getUserProfile: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/public/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return handleResponse(response);
  },

  getPet: async (petId) => {
    const response = await fetch(`${API_BASE_URL}/public/pet/${petId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return handleResponse(response);
  }
};
