import { SavingsResponse } from 'domain/savings/api/type';
import { http } from 'tosslib';

export default class SavingsApi {
  static async getSavings(): Promise<SavingsResponse[]> {
    return await http.get('/api/savings-products');
  }
}
