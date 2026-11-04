ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'CUSTOMER';
ALTER TABLE public.profiles ADD COLUMN account_status text NOT NULL DEFAULT 'active', ADD COLUMN last_login_at timestamptz;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_auth_user_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
CREATE UNIQUE INDEX profiles_contact_key ON public.profiles(contact);
ALTER TABLE public.profiles ADD CONSTRAINT profiles_status_valid CHECK (account_status IN ('active','disabled'));
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE(full_name, username, username_normalized) ON public.profiles TO authenticated;
CREATE TABLE public.customer_auth_attempts (identifier text PRIMARY KEY, started_at timestamptz NOT NULL DEFAULT now(), attempts integer NOT NULL DEFAULT 1);
GRANT ALL ON public.customer_auth_attempts TO service_role;
ALTER TABLE public.customer_auth_attempts ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.customer_auth_slot(_identifier text) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE n integer;
BEGIN
 INSERT INTO public.customer_auth_attempts(identifier) VALUES(md5(_identifier)) ON CONFLICT(identifier) DO UPDATE SET attempts=CASE WHEN customer_auth_attempts.started_at < now()-interval '15 minutes' THEN 1 ELSE customer_auth_attempts.attempts+1 END, started_at=CASE WHEN customer_auth_attempts.started_at < now()-interval '15 minutes' THEN now() ELSE customer_auth_attempts.started_at END RETURNING attempts INTO n;
 RETURN n <= 10;
END; $$;
REVOKE ALL ON FUNCTION public.customer_auth_slot(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.customer_auth_slot(text) TO service_role;
CREATE OR REPLACE FUNCTION public.validate_customer_profile() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$
BEGIN
 NEW.full_name := trim(NEW.full_name); NEW.username := trim(NEW.username); NEW.username_normalized := lower(NEW.username);
 IF length(NEW.full_name)<1 OR length(NEW.full_name)>100 OR length(NEW.username)<3 OR length(NEW.username)>80 THEN RAISE EXCEPTION 'Invalid customer profile'; END IF;
 IF NEW.contact !~ '^\+233[235][0-9]{8}$' THEN RAISE EXCEPTION 'Invalid Ghana contact'; END IF;
 RETURN NEW;
END; $$;
CREATE TRIGGER validate_customer_profile BEFORE INSERT OR UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.validate_customer_profile();
CREATE OR REPLACE FUNCTION public.handle_new_customer() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
 -- Administrator accounts use email identities and remain separate.
 IF COALESCE(NEW.phone,'')='' THEN RETURN NEW; END IF;
 INSERT INTO public.profiles(id,full_name,contact,username,username_normalized) VALUES(NEW.id,trim(COALESCE(NEW.raw_user_meta_data->>'full_name','')), '+'||ltrim(NEW.phone,'+'),trim(COALESCE(NEW.raw_user_meta_data->>'username','')),lower(trim(COALESCE(NEW.raw_user_meta_data->>'username',''))));
 INSERT INTO public.user_roles(user_id,role) VALUES(NEW.id,'CUSTOMER');
 RETURN NEW;
END; $$;
REVOKE ALL ON FUNCTION public.handle_new_customer() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_customer() TO service_role;