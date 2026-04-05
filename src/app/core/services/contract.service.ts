import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PageResponse } from '../models/page-response.model';
import { ContractRequest, ContractResponse } from '../models/contract.model';

@Injectable({ providedIn: 'root' })
export class ContractService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/contracts`;

  getAll(page = 0, size = 10) {
    return this.http.get<PageResponse<ContractResponse>>(`${this.base}?page=${page}&size=${size}`);
  }

  getMy(page = 0, size = 50) {
    return this.http.get<PageResponse<ContractResponse>>(`${this.base}/my?page=${page}&size=${size}&sort=id,desc`);
  }

  getById(id: number) {
    return this.http.get<ContractResponse>(`${this.base}/${id}`);
  }

  create(contract: ContractRequest) {
    return this.http.post<ContractResponse>(this.base, contract);
  }

  complete(id: number) {
    return this.http.put<ContractResponse>(`${this.base}/${id}/complete`, {});
  }

  cancel(id: number) {
    return this.http.put<ContractResponse>(`${this.base}/${id}/cancel`, {});
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  downloadPdf(id: number) {
    return this.http.get(`${this.base}/${id}/pdf`, { responseType: 'blob' });
  }
}