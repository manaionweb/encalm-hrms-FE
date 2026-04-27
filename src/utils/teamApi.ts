import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3001/api'
});

export const getTeams = () => API.get('/teams');

export const createTeam = (data: any) =>
  API.post('/teams', data);

export const addMembers = (teamId: number, data: any) =>
  API.post(`/teams/${teamId}/members`, data);

export const removeMember = (teamId: number, memberId: number) =>
  API.delete(`/teams/${teamId}/members/${memberId}`);

export const deleteTeam = (teamId: number) =>
  API.delete(`/teams/${teamId}`);