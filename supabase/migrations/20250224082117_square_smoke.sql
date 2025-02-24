/*
  # Initial Finance Manager Schema

  1. New Tables
    - transactions
      - Stores all financial transactions
      - Includes amount, type (income/expense), category, description
    - budgets
      - Stores budget settings per category
      - Includes target amount and period (monthly/yearly)
    - savings_goals
      - Tracks savings goals
      - Includes target amount, current progress, and deadline

  2. Security
    - RLS enabled on all tables
    - Policies ensure users can only access their own data
*/

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  amount decimal(12,2) NOT NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  category text NOT NULL,
  description text,
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Create budgets table
CREATE TABLE IF NOT EXISTS budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  category text NOT NULL,
  amount decimal(12,2) NOT NULL,
  period text NOT NULL CHECK (period IN ('monthly', 'yearly')),
  created_at timestamptz DEFAULT now()
);

-- Create savings_goals table
CREATE TABLE IF NOT EXISTS savings_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  name text NOT NULL,
  target_amount decimal(12,2) NOT NULL,
  current_amount decimal(12,2) NOT NULL DEFAULT 0,
  target_date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_goals ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own transactions"
  ON transactions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own budgets"
  ON budgets
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own savings goals"
  ON savings_goals
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);