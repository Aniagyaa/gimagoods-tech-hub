ALTER TABLE public.profiles ADD COLUMN email text;
UPDATE public.profiles p SET email=lower(u.email) FROM auth.users u WHERE u.id=p.id AND u.email IS NOT NULL;
CREATE UNIQUE INDEX profiles_email_unique ON public.profiles (lower(email)) WHERE email IS NOT NULL;
CREATE OR REPLACE FUNCTION public.handle_new_customer() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
 IF COALESCE(NEW.phone,'')='' AND COALESCE(NEW.raw_user_meta_data->>'customer_registration','') <> 'true' THEN RETURN NEW; END IF;
 INSERT INTO public.profiles(id,full_name,contact,username,username_normalized,email) VALUES(NEW.id,trim(COALESCE(NEW.raw_user_meta_data->>'full_name','')),CASE WHEN COALESCE(NEW.phone,'')<>'' THEN '+'||ltrim(NEW.phone,'+') ELSE NEW.raw_user_meta_data->>'contact' END,trim(COALESCE(NEW.raw_user_meta_data->>'username','')),lower(trim(COALESCE(NEW.raw_user_meta_data->>'username',''))),lower(NEW.email));
 INSERT INTO public.user_roles(user_id,role) VALUES(NEW.id,'CUSTOMER');
 RETURN NEW;
END; $$;
REVOKE ALL ON FUNCTION public.handle_new_customer() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_customer() TO service_role;
COMMENT ON COLUMN public.profiles.email IS 'Private customer auth email; changes are not granted to customers. Legacy phone accounts may have no email.';