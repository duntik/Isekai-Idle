-- Run once in your Supabase SQL Editor. All requests use the signed-in user.
create table if not exists public.idle_saves (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null check (octet_length(state::text) < 1000000),
  revision bigint not null default 1,
  updated_at timestamptz not null default now()
);
alter table public.idle_saves enable row level security;
drop policy if exists "own saves" on public.idle_saves;
create policy "own saves" on public.idle_saves for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
revoke all on public.idle_saves from anon;
grant select, insert, update on public.idle_saves to authenticated;

create or replace function public.read_idle_save() returns jsonb
language sql security invoker set search_path = '' as $$
  select jsonb_build_object('state', state, 'revision', revision, 'updated_at', updated_at)
  from public.idle_saves where user_id = auth.uid();
$$;
create or replace function public.write_idle_save(p_state jsonb, p_expected bigint) returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare result public.idle_saves;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if p_expected = 0 then
    insert into public.idle_saves(user_id,state) values(auth.uid(),p_state)
      on conflict (user_id) do nothing returning * into result;
  else
    update public.idle_saves set state=p_state, revision=revision+1, updated_at=now()
      where user_id=auth.uid() and revision=p_expected returning * into result;
  end if;
  if result.user_id is null then raise exception 'Save conflict' using errcode='40001'; end if;
  return jsonb_build_object('revision',result.revision,'updated_at',result.updated_at);
end;
$$;
revoke all on function public.read_idle_save() from public, anon;
revoke all on function public.write_idle_save(jsonb,bigint) from public, anon;
grant execute on function public.read_idle_save() to authenticated;
grant execute on function public.write_idle_save(jsonb,bigint) to authenticated;
