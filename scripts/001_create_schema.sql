-- Create tenants table for multi-tenancy
CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create users table to link Supabase auth users to tenants
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create customers table
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(tenant_id, code)
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'scheduled'::text,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on all tables
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Tenants: Users can only see their own tenant
CREATE POLICY "users_can_select_own_tenant" ON public.tenants
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.tenant_id = tenants.id)
  );

-- Users: Each user can only see themselves
CREATE POLICY "users_can_select_own_record" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_can_insert_own_record" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "users_can_update_own_record" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Customers: Users can only see customers from their tenant
CREATE POLICY "customers_select_own_tenant" ON public.customers
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.tenant_id = customers.tenant_id)
  );

CREATE POLICY "customers_insert_own_tenant" ON public.customers
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.tenant_id = customers.tenant_id)
  );

CREATE POLICY "customers_update_own_tenant" ON public.customers
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.tenant_id = customers.tenant_id)
  );

CREATE POLICY "customers_delete_own_tenant" ON public.customers
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.tenant_id = customers.tenant_id)
  );

-- Appointments: Users can only see appointments from their tenant
CREATE POLICY "appointments_select_own_tenant" ON public.appointments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.tenant_id = appointments.tenant_id)
  );

CREATE POLICY "appointments_insert_own_tenant" ON public.appointments
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.tenant_id = appointments.tenant_id)
  );

CREATE POLICY "appointments_update_own_tenant" ON public.appointments
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.tenant_id = appointments.tenant_id)
  );

CREATE POLICY "appointments_delete_own_tenant" ON public.appointments
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.tenant_id = appointments.tenant_id)
  );
