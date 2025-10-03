-- Function to update worker earnings
CREATE OR REPLACE FUNCTION update_worker_earnings(worker_id UUID, amount DECIMAL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.worker_profiles
  SET total_earnings = total_earnings + amount
  WHERE id = worker_id;
END;
$$;

-- Function to calculate wallet totals
CREATE OR REPLACE FUNCTION calculate_wallet_totals(wallet_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_in DECIMAL;
  total_out DECIMAL;
BEGIN
  -- Calculate total incoming
  SELECT COALESCE(SUM(amount), 0) INTO total_in
  FROM public.transactions
  WHERE wallet_id = wallet_id
  AND type IN ('earning', 'bonus', 'refund')
  AND status = 'completed';
  
  -- Calculate total outgoing
  SELECT COALESCE(SUM(amount), 0) INTO total_out
  FROM public.transactions
  WHERE wallet_id = wallet_id
  AND type IN ('withdrawal', 'fee')
  AND status = 'completed';
  
  -- Update wallet
  UPDATE public.wallets
  SET 
    balance = total_in - total_out,
    total_earned = total_in,
    total_withdrawn = total_out
  WHERE id = wallet_id;
END;
$$;
