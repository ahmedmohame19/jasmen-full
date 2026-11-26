import axios from "./axios";
import { IS_MOCK_MODE } from "../utils/constants";
import {
  getMockBuildingDetails,
  getMockBuildings,
} from "../features/buildings/map/mockData";

export async function getBuildings() {
  if (IS_MOCK_MODE) return getMockBuildings();
  const token = localStorage.getItem("WATER_USER_TOKEN");
  try {
    const response = await axios.get("building/v1/GetAllBuildings", {
      headers: {
        access_token: token,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error("Failed to get buildings!");
  }
}

export async function getBuilding(id) {
  const token = localStorage.getItem("WATER_USER_TOKEN");

  try {
    const response = await axios.get(
      `building/v1/GetOneBuilding/${id}`,
      {
        headers: {
          access_token: token,
        },
      },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function createBuilding(buildingData) {
  const token = localStorage.getItem("WATER_USER_TOKEN");

  try {
    const formData = new FormData();
    
    // Append all building data to FormData
    Object.keys(buildingData).forEach(key => {
      if (key === 'buildingLogo' && buildingData[key]) {
        formData.append('buildingLogo', buildingData[key]);
      } else if (key !== 'buildingLogo') {
        formData.append(key, buildingData[key]);
      }
    });

    const response = await axios.post(
      "building/v1/AddBuilding",
      formData,
      {
        headers: {
          access_token: token,
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function editBuilding({ id, data }) {
  const token = localStorage.getItem("WATER_USER_TOKEN");

  try {
    const formData = new FormData();
    
    // Append all building data to FormData
    Object.keys(data).forEach(key => {
      if (key === 'buildingLogo' && data[key]) {
        formData.append('buildingLogo', data[key]);
      } else if (key !== 'buildingLogo') {
        formData.append(key, data[key]);
      }
    });

    const response = await axios.patch(
      `building/v1/UpdateBuilding/${id}`,
      formData,
      {
        headers: {
          access_token: token,
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteBuilding({ id }) {
  const token = localStorage.getItem("WATER_USER_TOKEN");

  try {
    const response = await axios.delete(`building/v1/DeleteBuilding/${id}`, {
      headers: {
        access_token: token,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getBuildingDetails(id) {
  if (IS_MOCK_MODE) return getMockBuildingDetails(id);
  const token = localStorage.getItem("WATER_USER_TOKEN");

  try {
    const response = await axios.get(`building/v1/GetOneBuilding/${id}`, {
      headers: {
        access_token: token,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function assignUserToBuilding({ userId, buildingId }) {
  const token = localStorage.getItem("WATER_USER_TOKEN");

  try {
    const response = await axios.post(
      "building/v1/AssignUserToBuilding",
      { userId, buildingId },
      {
        headers: {
          access_token: token,
        },
      },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function unassignUserFromBuilding({ userId }) {
  const token = localStorage.getItem("WATER_USER_TOKEN");

  try {
    const response = await axios.post(
      "building/v1/UnassignUserFromBuilding",
      { userId },
      {
        headers: {
          access_token: token,
        },
      },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function addUserToBuilding({ buildingId, userData }) {
  const token = localStorage.getItem("WATER_USER_TOKEN");

  try {
    const response = await axios.post(
      `building/v1/AddUserToBuilding/${buildingId}`,
      userData,
      {
        headers: {
          access_token: token,
        },
      },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getUnassignedUsers(page = 1, limit = 10) {
  const token = localStorage.getItem("WATER_USER_TOKEN");

  try {
    const response = await axios.get(
      `building/v1/GetUnassignedUsers?page=${page}&limit=${limit}`,
      {
        headers: {
          access_token: token,
        },
      },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}
