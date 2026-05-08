import { ClassificationResult } from '../../types';

export interface AIProvider {
  classifyTicket(requestText: string): Promise<ClassificationResult>;
}
