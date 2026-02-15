-- ============================================================
-- Swa-Antarang: Full Supabase Schema
-- Run this in Supabase Dashboard → SQL Editor (single shot)
-- ============================================================

-- 0. Extensions
create extension if not exists "pgcrypto";

-- 1. Enums
create type public.user_role as enum ('merchant', 'driver', 'customer');
create type public.stock_status as enum ('in_stock', 'low_stock', 'out_of_stock');
create type public.broadcast_status as enum ('active', 'closed');
create type public.propagation_response_status as enum ('pending', 'accepted', 'rejected');
create type public.b2b_request_type as enum ('direct', 'broadcast_response', 'negotiation');
create type public.request_status as enum ('pending', 'accepted', 'rejected', 'cancelled');
create type public.order_type as enum ('b2c', 'b2b');
create type public.order_status as enum ('pending', 'confirmed', 'packed', 'out_for_delivery', 'delivered', 'cancelled');
create type public.logistics_type as enum ('own_driver', 'ondc', 'forward');
create type public.delivery_status as enum ('pending', 'picked_up', 'in_transit', 'delivered');
create type public.ondc_status as enum ('open', 'accepted', 'rejected', 'expired');
create type public.forward_status as enum ('draft', 'requested', 'accepted', 'in_transit', 'delivered');

-- ============================================================
-- 2. Core tables
-- ============================================================

-- 2a. Profiles (1:1 with auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null,
  full_name text not null default '',
  email text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2b. Merchant extension
create table public.merchant_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  business_name text not null default '',
  address text,
  lat double precision,
  lng double precision,
  created_at timestamptz not null default now()
);

-- 2c. Driver extension
create table public.driver_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  vehicle_type text,
  is_ondc boolean not null default false,
  is_verified boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 3. Inventory
-- ============================================================

create table public.inventory_raw (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references public.merchant_profiles(id) on delete cascade,
  name text not null,
  sku text,
  stock integer not null default 0,
  unit text not null default 'pcs',
  supplier_name text,
  status public.stock_status not null default 'in_stock',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.inventory_listed (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references public.merchant_profiles(id) on delete cascade,
  name text not null,
  sku text,
  price numeric(12,2) not null default 0,
  stock integer not null default 0,
  unit text not null default 'pcs',
  platform text,
  image_url text,
  category text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- 4. Propagation (broadcast + responses)
-- ============================================================

create table public.propagation_broadcasts (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references public.merchant_profiles(id) on delete cascade,
  item_name text not null,
  radius_km integer not null default 20,
  min_price numeric(12,2),
  max_price numeric(12,2),
  delivery_days_max integer,
  status public.broadcast_status not null default 'active',
  created_at timestamptz not null default now()
);

create table public.propagation_responses (
  id uuid primary key default gen_random_uuid(),
  broadcast_id uuid not null references public.propagation_broadcasts(id) on delete cascade,
  seller_merchant_id uuid not null references public.merchant_profiles(id) on delete cascade,
  item_name text not null,
  price numeric(12,2) not null,
  delivery_days integer,
  distance_km double precision,
  status public.propagation_response_status not null default 'pending',
  created_at timestamptz not null default now()
);

-- ============================================================
-- 5. B2B Requests & Refill Requests
-- ============================================================

create table public.b2b_requests (
  id uuid primary key default gen_random_uuid(),
  buyer_merchant_id uuid not null references public.merchant_profiles(id) on delete cascade,
  seller_merchant_id uuid references public.merchant_profiles(id) on delete set null,
  item_ref text not null,
  quantity integer not null default 1,
  offer_amount numeric(12,2),
  type public.b2b_request_type not null default 'direct',
  status public.request_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.refill_requests (
  id uuid primary key default gen_random_uuid(),
  requester_merchant_id uuid not null references public.merchant_profiles(id) on delete cascade,
  supplier_merchant_id uuid references public.merchant_profiles(id) on delete set null,
  inventory_raw_id uuid references public.inventory_raw(id) on delete set null,
  quantity integer not null default 1,
  status public.request_status not null default 'pending',
  created_at timestamptz not null default now()
);

-- ============================================================
-- 6. Orders & Order Items
-- ============================================================

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references public.merchant_profiles(id) on delete cascade,
  customer_id uuid references public.profiles(id) on delete set null,
  type public.order_type not null default 'b2c',
  status public.order_status not null default 'pending',
  total_amount numeric(12,2) not null default 0,
  shipping_address jsonb,
  logistics_type public.logistics_type,
  assigned_driver_id uuid references public.driver_profiles(id) on delete set null,
  qr_code text unique default encode(gen_random_bytes(16), 'hex'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  inventory_listed_id uuid references public.inventory_listed(id) on delete set null,
  product_name text not null,
  quantity integer not null default 1,
  unit_price numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 7. Deliveries
-- ============================================================

create table public.deliveries (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  driver_id uuid references public.driver_profiles(id) on delete set null,
  status public.delivery_status not null default 'pending',
  pickup_at timestamptz,
  delivered_at timestamptz,
  gps_log jsonb default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- 8. ONDC & Forward Logistics
-- ============================================================

create table public.ondc_requests (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  merchant_id uuid not null references public.merchant_profiles(id) on delete cascade,
  cost_slab numeric(12,2),
  status public.ondc_status not null default 'open',
  driver_id uuid references public.driver_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.forward_logistics (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  merchant_id uuid not null references public.merchant_profiles(id) on delete cascade,
  provider text not null,
  item_type text,
  weight_kg numeric(8,2),
  status public.forward_status not null default 'draft',
  external_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- 9. Indexes
-- ============================================================

create index idx_profiles_role on public.profiles(role);
create index idx_merchant_profiles_user on public.merchant_profiles(user_id);
create index idx_driver_profiles_user on public.driver_profiles(user_id);
create index idx_inventory_raw_merchant on public.inventory_raw(merchant_id);
create index idx_inventory_listed_merchant on public.inventory_listed(merchant_id);
create index idx_broadcasts_merchant on public.propagation_broadcasts(merchant_id);
create index idx_broadcasts_status on public.propagation_broadcasts(status);
create index idx_responses_broadcast on public.propagation_responses(broadcast_id);
create index idx_b2b_buyer on public.b2b_requests(buyer_merchant_id);
create index idx_b2b_seller on public.b2b_requests(seller_merchant_id);
create index idx_orders_merchant on public.orders(merchant_id);
create index idx_orders_customer on public.orders(customer_id);
create index idx_orders_qr on public.orders(qr_code);
create index idx_order_items_order on public.order_items(order_id);
create index idx_deliveries_order on public.deliveries(order_id);
create index idx_deliveries_driver on public.deliveries(driver_id);
create index idx_ondc_order on public.ondc_requests(order_id);
create index idx_forward_order on public.forward_logistics(order_id);

-- ============================================================
-- 10. Auto-create profile on signup (trigger)
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name, email)
  values (
    new.id,
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'customer'),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email
  );

  -- Auto-create merchant or driver profile
  if (new.raw_user_meta_data->>'role') = 'merchant' then
    insert into public.merchant_profiles (user_id, business_name)
    values (
      new.id,
      coalesce(new.raw_user_meta_data->>'business_name', '')
    );
  elsif (new.raw_user_meta_data->>'role') = 'driver' then
    insert into public.driver_profiles (user_id, vehicle_type)
    values (
      new.id,
      coalesce(new.raw_user_meta_data->>'vehicle_type', '')
    );
  end if;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 11. Auto-deduct inventory on order confirm
-- ============================================================

create or replace function public.deduct_inventory_on_confirm()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.status = 'confirmed' and old.status = 'pending' then
    update public.inventory_listed il
    set stock = il.stock - oi.quantity,
        updated_at = now()
    from public.order_items oi
    where oi.order_id = new.id
      and oi.inventory_listed_id = il.id;
  end if;
  return new;
end;
$$;

create trigger on_order_confirmed
  after update on public.orders
  for each row
  when (new.status = 'confirmed' and old.status = 'pending')
  execute function public.deduct_inventory_on_confirm();

-- ============================================================
-- 12. Mark order delivered when delivery completes
-- ============================================================

create or replace function public.mark_order_delivered()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.status = 'delivered' and old.status != 'delivered' then
    update public.orders
    set status = 'delivered', updated_at = now()
    where id = new.order_id;
  end if;
  return new;
end;
$$;

create trigger on_delivery_completed
  after update on public.deliveries
  for each row
  when (new.status = 'delivered' and old.status != 'delivered')
  execute function public.mark_order_delivered();

-- ============================================================
-- 13. Row Level Security
-- ============================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.merchant_profiles enable row level security;
alter table public.driver_profiles enable row level security;
alter table public.inventory_raw enable row level security;
alter table public.inventory_listed enable row level security;
alter table public.propagation_broadcasts enable row level security;
alter table public.propagation_responses enable row level security;
alter table public.b2b_requests enable row level security;
alter table public.refill_requests enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.deliveries enable row level security;
alter table public.ondc_requests enable row level security;
alter table public.forward_logistics enable row level security;

-- ── Profiles ──
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- ── Merchant Profiles ──
create policy "Merchants view own merchant profile"
  on public.merchant_profiles for select using (user_id = auth.uid());
create policy "Merchants update own merchant profile"
  on public.merchant_profiles for update using (user_id = auth.uid());
create policy "Anyone can view merchant profiles for propagation"
  on public.merchant_profiles for select using (true);

-- ── Driver Profiles ──
create policy "Drivers view own driver profile"
  on public.driver_profiles for select using (user_id = auth.uid());
create policy "Drivers update own driver profile"
  on public.driver_profiles for update using (user_id = auth.uid());

-- ── Inventory Raw ──
create policy "Merchant manages own raw inventory"
  on public.inventory_raw for all using (
    merchant_id in (select id from public.merchant_profiles where user_id = auth.uid())
  );

-- ── Inventory Listed ──
create policy "Merchant manages own listed inventory"
  on public.inventory_listed for all using (
    merchant_id in (select id from public.merchant_profiles where user_id = auth.uid())
  );
create policy "Customers can view listed inventory"
  on public.inventory_listed for select using (true);

-- ── Propagation Broadcasts ──
create policy "Merchant manages own broadcasts"
  on public.propagation_broadcasts for all using (
    merchant_id in (select id from public.merchant_profiles where user_id = auth.uid())
  );
create policy "Any merchant can view active broadcasts"
  on public.propagation_broadcasts for select using (status = 'active');

-- ── Propagation Responses ──
create policy "Broadcast owner views responses"
  on public.propagation_responses for select using (
    broadcast_id in (
      select id from public.propagation_broadcasts
      where merchant_id in (select id from public.merchant_profiles where user_id = auth.uid())
    )
  );
create policy "Seller can insert response"
  on public.propagation_responses for insert with check (
    seller_merchant_id in (select id from public.merchant_profiles where user_id = auth.uid())
  );
create policy "Seller views own responses"
  on public.propagation_responses for select using (
    seller_merchant_id in (select id from public.merchant_profiles where user_id = auth.uid())
  );

-- ── B2B Requests ──
create policy "Buyer manages own b2b requests"
  on public.b2b_requests for all using (
    buyer_merchant_id in (select id from public.merchant_profiles where user_id = auth.uid())
  );
create policy "Seller views b2b requests to them"
  on public.b2b_requests for select using (
    seller_merchant_id in (select id from public.merchant_profiles where user_id = auth.uid())
  );

-- ── Refill Requests ──
create policy "Merchant manages own refill requests"
  on public.refill_requests for all using (
    requester_merchant_id in (select id from public.merchant_profiles where user_id = auth.uid())
  );

-- ── Orders ──
create policy "Merchant views own orders"
  on public.orders for select using (
    merchant_id in (select id from public.merchant_profiles where user_id = auth.uid())
  );
create policy "Merchant updates own orders"
  on public.orders for update using (
    merchant_id in (select id from public.merchant_profiles where user_id = auth.uid())
  );
create policy "Customer views own orders"
  on public.orders for select using (customer_id = auth.uid());
create policy "Customer creates orders"
  on public.orders for insert with check (customer_id = auth.uid());

-- ── Order Items ──
create policy "Order owner views items"
  on public.order_items for select using (
    order_id in (select id from public.orders where customer_id = auth.uid()
      union select id from public.orders where merchant_id in (select id from public.merchant_profiles where user_id = auth.uid()))
  );
create policy "Customer inserts order items"
  on public.order_items for insert with check (
    order_id in (select id from public.orders where customer_id = auth.uid())
  );

-- ── Deliveries ──
create policy "Driver views assigned deliveries"
  on public.deliveries for select using (
    driver_id in (select id from public.driver_profiles where user_id = auth.uid())
  );
create policy "Driver updates assigned deliveries"
  on public.deliveries for update using (
    driver_id in (select id from public.driver_profiles where user_id = auth.uid())
  );
create policy "Merchant views delivery for own orders"
  on public.deliveries for select using (
    order_id in (select id from public.orders where merchant_id in (select id from public.merchant_profiles where user_id = auth.uid()))
  );
create policy "Merchant inserts delivery for own orders"
  on public.deliveries for insert with check (
    order_id in (select id from public.orders where merchant_id in (select id from public.merchant_profiles where user_id = auth.uid()))
  );
create policy "Customer views delivery for own orders"
  on public.deliveries for select using (
    order_id in (select id from public.orders where customer_id = auth.uid())
  );

-- ── ONDC Requests ──
create policy "Merchant manages ONDC requests for own orders"
  on public.ondc_requests for all using (
    merchant_id in (select id from public.merchant_profiles where user_id = auth.uid())
  );
create policy "ONDC drivers view open requests"
  on public.ondc_requests for select using (
    status = 'open'
    and exists (select 1 from public.driver_profiles where user_id = auth.uid() and is_ondc = true)
  );
create policy "ONDC driver updates accepted request"
  on public.ondc_requests for update using (
    driver_id in (select id from public.driver_profiles where user_id = auth.uid())
  );

-- ── Forward Logistics ──
create policy "Merchant manages forward logistics"
  on public.forward_logistics for all using (
    merchant_id in (select id from public.merchant_profiles where user_id = auth.uid())
  );

-- ============================================================
-- Done! All tables, triggers, and RLS policies are set.
-- ============================================================
