import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}
interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const incomes = transactions.reduce(
      (acc, curr) => {
        if (curr.type === 'income') {
          acc.value += curr.value;
        }

        return acc;
      },
      { value: 0 },
    );

    const outcomes = transactions.reduce(
      (acc, curr) => {
        if (curr.type === 'outcome') {
          acc.value += curr.value;
        }

        return acc;
      },
      { value: 0 },
    );

    return {
      income: incomes.value,
      outcome: outcomes.value,
      total: incomes.value - outcomes.value,
    };
  }
}

export default TransactionsRepository;
