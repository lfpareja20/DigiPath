import apiClient from '@/lib/axios';
import { Question, AnswerPayload, Diagnosis, DiagnosisReport } from '@/types';

export const getQuestions = async (): Promise<Question[]> => {
  const { data } = await apiClient.get<Question[]>('/questions/');
  return data;
};

export const submitDiagnosis = async (respuestas: AnswerPayload[]): Promise<Diagnosis> => {
    const payload = { respuestas };
    const { data } = await apiClient.post<Diagnosis>('/diagnosis/', payload);
    return data;
};

export const getDiagnosisHistory = async (): Promise<Diagnosis[]> => {
    const { data } = await apiClient.get<Diagnosis[]>('/diagnosis/');
    return data;
};

export const getDiagnosisReport = async (diagnosisId: number): Promise<DiagnosisReport> => {
    const { data } = await apiClient.get<DiagnosisReport>(`/diagnosis/${diagnosisId}/report/`);
    return data;
};