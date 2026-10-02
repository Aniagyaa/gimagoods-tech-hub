CREATE TYPE public.app_role AS ENUM ('SUPER_ADMIN', 'ADMIN');
CREATE TYPE public.admin_status AS ENUM ('active', 'disabled');

CREATE TABLE public.admin_accounts (
  user_id uuid PRIMARY KEY,
  full_name text NOT NULL,
  contact text NOT NULL,
  username text NOT NULL,
  username_normalized text NOT NULL UNIQUE,
  auth_email text NOT NULL UNIQUE,
  status public.admin_status NOT NULL DEFAULT 'active',
  must_change_password boolean NOT NULL DEFAULT true,
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.admin_accounts TO authenticated;
GRANT ALL ON public.admin_accounts TO service_role;
ALTER TABLE public.admin_accounts ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.permissions (
  key text PRIMARY KEY,
  label text NOT NULL,
  module text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.permissions TO authenticated;
GRANT ALL ON public.permissions TO service_role;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.role_permissions (
  role public.app_role NOT NULL,
  permission_key text NOT NULL REFERENCES public.permissions(key) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (role, permission_key)
);
GRANT SELECT ON public.role_permissions TO authenticated;
GRANT ALL ON public.role_permissions TO service_role;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.admin_permission_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  permission_key text NOT NULL REFERENCES public.permissions(key) ON DELETE CASCADE,
  granted boolean NOT NULL,
  granted_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, permission_key)
);
GRANT SELECT ON public.admin_permission_overrides TO authenticated;
GRANT ALL ON public.admin_permission_overrides TO service_role;
ALTER TABLE public.admin_permission_overrides ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  administrator_id uuid,
  username text NOT NULL,
  role public.app_role,
  action text NOT NULL,
  resource text NOT NULL,
  resource_id text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.admin_accounts aa ON aa.user_id = ur.user_id
    WHERE ur.user_id = _user_id
      AND ur.role = _role
      AND aa.status = 'active'
  )
$$;

CREATE OR REPLACE FUNCTION public.has_permission(_user_id uuid, _permission text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_accounts aa
    JOIN public.user_roles ur ON ur.user_id = aa.user_id
    WHERE aa.user_id = _user_id
      AND aa.status = 'active'
      AND (
        ur.role = 'SUPER_ADMIN'
        OR COALESCE(
          (SELECT apo.granted FROM public.admin_permission_overrides apo WHERE apo.user_id = _user_id AND apo.permission_key = _permission),
          EXISTS (SELECT 1 FROM public.role_permissions rp WHERE rp.role = ur.role AND rp.permission_key = _permission)
        )
      )
  )
$$;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.has_permission(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.has_permission(uuid, text) TO authenticated, service_role;

CREATE POLICY "Administrators can view their own account"
ON public.admin_accounts FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'SUPER_ADMIN'));

CREATE POLICY "Administrators can view their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'SUPER_ADMIN'));

CREATE POLICY "Administrators can view the permission catalogue"
ON public.permissions FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'SUPER_ADMIN') OR public.has_role(auth.uid(), 'ADMIN'));

CREATE POLICY "Administrators can view role permissions"
ON public.role_permissions FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'SUPER_ADMIN') OR public.has_role(auth.uid(), 'ADMIN'));

CREATE POLICY "Administrators can view their permission overrides"
ON public.admin_permission_overrides FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'SUPER_ADMIN'));

CREATE POLICY "Super Admin can view audit logs"
ON public.audit_logs FOR SELECT TO authenticated
USING (public.has_permission(auth.uid(), 'audit_logs.view'));

CREATE TRIGGER admin_accounts_set_updated_at
BEFORE UPDATE ON public.admin_accounts
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER admin_permission_overrides_set_updated_at
BEFORE UPDATE ON public.admin_permission_overrides
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.permissions (key, label, module) VALUES
('dashboard.view','View dashboard','dashboard'),
('analytics.view','View analytics','analytics'),
('analytics.export','Export analytics','analytics'),
('products.view','View products','products'),
('products.create','Create products','products'),
('products.edit','Edit products','products'),
('products.delete','Delete products','products'),
('products.publish','Publish products','products'),
('categories.view','View categories','categories'),
('categories.create','Create categories','categories'),
('categories.edit','Edit categories','categories'),
('categories.delete','Delete categories','categories'),
('inventory.view','View inventory','inventory'),
('inventory.create','Create inventory','inventory'),
('inventory.edit','Edit inventory','inventory'),
('inventory.adjust','Adjust inventory','inventory'),
('inventory.delete','Delete inventory','inventory'),
('orders.view','View orders','orders'),
('orders.create','Create orders','orders'),
('orders.edit','Edit orders','orders'),
('orders.update_status','Update order status','orders'),
('orders.cancel','Cancel orders','orders'),
('orders.refund','Refund orders','orders'),
('customers.view','View customers','customers'),
('customers.edit','Edit customers','customers'),
('customers.delete','Delete customers','customers'),
('finance.view','View finance','finance'),
('finance.manage','Manage finance','finance'),
('payments.view','View payments','payments'),
('payments.manage','Manage payments','payments'),
('discounts.view','View discounts','discounts'),
('discounts.create','Create discounts','discounts'),
('discounts.edit','Edit discounts','discounts'),
('discounts.delete','Delete discounts','discounts'),
('reviews.view','View reviews','reviews'),
('reviews.manage','Manage reviews','reviews'),
('website.view','View website content','website'),
('website.edit','Edit website content','website'),
('staff.view','View staff','staff'),
('staff.create','Create staff','staff'),
('staff.edit','Edit staff','staff'),
('staff.delete','Delete staff','staff'),
('staff.permissions','Manage staff permissions','staff'),
('settings.view','View settings','settings'),
('settings.edit','Edit settings','settings'),
('security.view','View security','security'),
('security.manage','Manage security','security'),
('audit_logs.view','View audit logs','audit_logs'),
('audit_logs.delete','Delete audit logs','audit_logs'),
('delivery.view','View delivery settings','delivery'),
('delivery.manage','Manage delivery settings','delivery'),
('whatsapp.view','View WhatsApp support','whatsapp'),
('whatsapp.manage','Manage WhatsApp support','whatsapp');

INSERT INTO public.role_permissions (role, permission_key)
SELECT 'SUPER_ADMIN'::public.app_role, key FROM public.permissions;

INSERT INTO public.role_permissions (role, permission_key) VALUES
('ADMIN','dashboard.view'),
('ADMIN','analytics.view'),
('ADMIN','products.view'),
('ADMIN','products.create'),
('ADMIN','products.edit'),
('ADMIN','categories.view'),
('ADMIN','inventory.view'),
('ADMIN','inventory.edit'),
('ADMIN','inventory.adjust'),
('ADMIN','orders.view'),
('ADMIN','orders.update_status'),
('ADMIN','customers.view'),
('ADMIN','reviews.view'),
('ADMIN','reviews.manage'),
('ADMIN','finance.view'),
('ADMIN','payments.view'),
('ADMIN','discounts.view'),
('ADMIN','website.view'),
('ADMIN','delivery.view'),
('ADMIN','whatsapp.view'),
('ADMIN','whatsapp.manage');