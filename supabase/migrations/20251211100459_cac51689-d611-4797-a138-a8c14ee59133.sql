-- Shareholders/stakeholders table
CREATE TABLE public.shareholders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  designation TEXT NOT NULL,
  ownership_percentage NUMERIC NOT NULL DEFAULT 0,
  total_invested NUMERIC NOT NULL DEFAULT 0,
  photo_url TEXT,
  email TEXT,
  phone TEXT,
  can_edit BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Shareholder investments timeline
CREATE TABLE public.shareholder_investments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shareholder_id UUID NOT NULL REFERENCES public.shareholders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  investment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Loans & liabilities table
CREATE TABLE public.loans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  principal_amount NUMERIC NOT NULL,
  interest_rate NUMERIC NOT NULL DEFAULT 0,
  total_emi_count INTEGER NOT NULL DEFAULT 12,
  paid_emi_count INTEGER NOT NULL DEFAULT 0,
  emi_amount NUMERIC NOT NULL DEFAULT 0,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  lender TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shareholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shareholder_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;

-- Shareholders policies (view for all admins, edit for admins only)
CREATE POLICY "Admins can view shareholders"
ON public.shareholders FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert shareholders"
ON public.shareholders FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update shareholders"
ON public.shareholders FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete shareholders"
ON public.shareholders FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Shareholder investments policies
CREATE POLICY "Admins can view investments"
ON public.shareholder_investments FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert investments"
ON public.shareholder_investments FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update investments"
ON public.shareholder_investments FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete investments"
ON public.shareholder_investments FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Loans policies (admins can manage)
CREATE POLICY "Admins can view loans"
ON public.loans FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert loans"
ON public.loans FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update loans"
ON public.loans FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete loans"
ON public.loans FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));