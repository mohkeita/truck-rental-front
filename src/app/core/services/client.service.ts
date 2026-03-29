import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PageResponse } from '../models/page-response.model';
import { ClientRequest, ClientResponse } from '../models/client.model';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/clients`;

  getAll(page = 0, size = 10) {
    return this.http.get<PageResponse<ClientResponse>>(`${this.base}?page=${page}&size=${size}`);
  }

  getById(id: number) {
    return this.http.get<ClientResponse>(`${this.base}/${id}`);
  }

  create(client: ClientRequest) {
    return this.http.post<ClientResponse>(this.base, client);
  }

  update(id: number, client: ClientRequest) {
    return this.http.put<ClientResponse>(`${this.base}/${id}`, client);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}